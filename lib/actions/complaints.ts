'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { requireStudent } from '@/lib/actions/auth'
import {
  Complaint,
  ComplaintWithDetails,
  CreateComplaintInput,
  StudentStats,
  ComplaintStatus
} from '@/lib/types/database'

export interface ComplaintResult {
  success: boolean
  error?: string
  data?: Complaint | ComplaintWithDetails
}

export interface ComplaintsListResult {
  success: boolean
  error?: string
  data?: ComplaintWithDetails[]
}

export interface StatsResult {
  success: boolean
  error?: string
  data?: StudentStats
}

/**
 * Create a new complaint (Student only)
 */
export async function createComplaint(input: CreateComplaintInput): Promise<ComplaintResult> {
  const user = await requireStudent()
  const supabase = await createClient()

  // Generate a temporary complaint_id (will be updated by trigger)
  const { data, error } = await supabase
    .from('complaints')
    .insert({
      student_id: user.id,
      title: input.title,
      description: input.description,
      category: input.category,
      priority: input.priority || 'Medium',
      photo_url: input.photo_url || null,
      status: 'Pending',
      complaint_id: 'CMP-TEMP', // Will be replaced by trigger
    })
    .select()
    .single()

  if (error) {
    console.error('Create complaint error:', error)
    return { success: false, error: error.message }
  }

  // Log the activity
  await supabase
    .from('activity_log')
    .insert({
      complaint_id: data.id,
      user_id: user.id,
      action_type: 'created',
      action_message: `Complaint "${input.title}" submitted by ${user.full_name}`,
    })

  return { success: true, data }
}

/**
 * Get all complaints for the current student
 */
export async function getMyComplaints(
  status?: ComplaintStatus | 'all'
): Promise<ComplaintsListResult> {
  const user = await requireStudent()
  const supabase = await createClient()

  let query = supabase
    .from('complaints')
    .select(`
      *,
      assigned_staff:users!complaints_assigned_to_fkey(id, full_name, email),
      feedback(*)
    `)
    .eq('student_id', user.id)
    .order('date_submitted', { ascending: false })

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    console.error('Get complaints error:', error)
    return { success: false, error: error.message }
  }

  return { success: true, data: data as unknown as ComplaintWithDetails[] }
}

/**
 * Get a single complaint by ID (for the current student)
 */
export async function getComplaintById(
  complaintId: number | string
): Promise<ComplaintResult> {
  const user = await requireStudent()
  const supabase = await createClient()

  // Handle both numeric ID and string complaint_id (CMP-xxxx)
  const isNumeric = typeof complaintId === 'number' || /^\d+$/.test(complaintId)

  let query = supabase
    .from('complaints')
    .select(`
      *,
      student:users!complaints_student_id_fkey(id, full_name, email),
      assigned_staff:users!complaints_assigned_to_fkey(id, full_name, email),
      feedback(*),
      responses:complaint_responses(
        *,
        staff:users!complaint_responses_staff_id_fkey(id, full_name)
      )
    `)
    .eq('student_id', user.id)

  if (isNumeric) {
    query = query.eq('id', Number(complaintId))
  } else {
    query = query.eq('complaint_id', complaintId)
  }

  const { data, error } = await query.single()

  if (error) {
    console.error('Get complaint error:', error)
    return { success: false, error: 'Complaint not found' }
  }

  return { success: true, data: data as unknown as ComplaintWithDetails }
}

/**
 * Get student dashboard statistics
 */
export async function getStudentStats(): Promise<StatsResult> {
  const user = await requireStudent()
  // Use admin client since user is already validated
  const supabase = createAdminClient()

  // Get complaint counts by status
  const { data, error } = await supabase
    .from('complaints')
    .select('status')
    .eq('student_id', user.id)

  if (error) {
    console.error('Get stats error:', error)
    return { success: false, error: error.message }
  }

  const stats: StudentStats = {
    total_complaints: data.length,
    pending_count: data.filter(c => c.status === 'Pending').length,
    in_progress_count: data.filter(c => c.status === 'In Progress' || c.status === 'Assigned').length,
    resolved_count: data.filter(c => c.status === 'Resolved').length,
    closed_count: data.filter(c => c.status === 'Closed').length,
  }

  return { success: true, data: stats }
}

/**
 * Get recent complaints for dashboard (limited)
 */
export async function getRecentComplaints(limit: number = 5): Promise<ComplaintsListResult> {
  const user = await requireStudent()
  // Use admin client since user is already validated
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('complaints')
    .select(`
      *,
      assigned_staff:users!complaints_assigned_to_fkey(id, full_name)
    `)
    .eq('student_id', user.id)
    .order('date_submitted', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Get recent complaints error:', error)
    return { success: false, error: error.message }
  }

  return { success: true, data: data as unknown as ComplaintWithDetails[] }
}

/**
 * Upload photo for complaint and return URL
 */
export async function uploadComplaintPhoto(
  file: File
): Promise<{ success: boolean; url?: string; error?: string }> {
  const user = await requireStudent()
  const supabase = await createClient()

  // Generate unique filename
  const fileExt = file.name.split('.').pop()
  const fileName = `${user.id}/${Date.now()}.${fileExt}`

  const { data, error } = await supabase.storage
    .from('complaint-photos')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    console.error('Upload error:', error)
    return { success: false, error: error.message }
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('complaint-photos')
    .getPublicUrl(data.path)

  return { success: true, url: publicUrl }
}

/**
 * Get complaints that are resolved but don't have feedback yet
 */
export async function getComplaintsNeedingFeedback(): Promise<ComplaintsListResult> {
  const user = await requireStudent()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('complaints')
    .select(`
      *,
      feedback(id)
    `)
    .eq('student_id', user.id)
    .eq('status', 'Resolved')
    .is('feedback', null)
    .order('date_resolved', { ascending: false })

  if (error) {
    console.error('Get complaints needing feedback error:', error)
    return { success: false, error: error.message }
  }

  // Filter out complaints that have feedback
  const complaintsWithoutFeedback = (data || []).filter(c => !c.feedback || c.feedback.length === 0)

  return { success: true, data: complaintsWithoutFeedback as unknown as ComplaintWithDetails[] }
}
