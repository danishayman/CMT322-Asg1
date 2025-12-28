'use server'

import { createClient } from '@/lib/supabase/server'
import { requireStudent } from '@/lib/actions/auth'
import { 
  Feedback, 
  FeedbackWithDetails,
  CreateFeedbackInput 
} from '@/lib/types/database'

export interface FeedbackResult {
  success: boolean
  error?: string
  data?: Feedback
}

export interface FeedbackListResult {
  success: boolean
  error?: string
  data?: FeedbackWithDetails[]
}

/**
 * Submit feedback for a resolved complaint
 */
export async function submitFeedback(input: CreateFeedbackInput): Promise<FeedbackResult> {
  const user = await requireStudent()
  const supabase = await createClient()

  // Verify the complaint belongs to this student and is resolved
  const { data: complaint, error: complaintError } = await supabase
    .from('complaints')
    .select('id, status, student_id')
    .eq('id', input.complaint_id)
    .single()

  if (complaintError || !complaint) {
    return { success: false, error: 'Complaint not found' }
  }

  if (complaint.student_id !== user.id) {
    return { success: false, error: 'You can only submit feedback for your own complaints' }
  }

  if (complaint.status !== 'Resolved') {
    return { success: false, error: 'You can only submit feedback for resolved complaints' }
  }

  // Check if feedback already exists
  const { data: existingFeedback } = await supabase
    .from('feedback')
    .select('id')
    .eq('complaint_id', input.complaint_id)
    .single()

  if (existingFeedback) {
    return { success: false, error: 'Feedback has already been submitted for this complaint' }
  }

  // Insert the feedback (sentiment will be auto-calculated by trigger)
  const { data, error } = await supabase
    .from('feedback')
    .insert({
      complaint_id: input.complaint_id,
      student_id: user.id,
      overall_rating: input.overall_rating,
      comment: input.comment || null,
      repair_quality: input.repair_quality || null,
      response_speed: input.response_speed || null,
    })
    .select()
    .single()

  if (error) {
    console.error('Submit feedback error:', error)
    return { success: false, error: error.message }
  }

  // Log the activity
  await supabase
    .from('activity_log')
    .insert({
      complaint_id: input.complaint_id,
      user_id: user.id,
      action_type: 'followed_up',
      action_message: `Feedback submitted with rating ${input.overall_rating}/5`,
    })

  return { success: true, data }
}

/**
 * Get feedback for a specific complaint
 */
export async function getFeedbackByComplaintId(
  complaintId: number
): Promise<FeedbackResult> {
  const user = await requireStudent()
  const supabase = await createClient()

  // Verify the complaint belongs to this student
  const { data: complaint } = await supabase
    .from('complaints')
    .select('student_id')
    .eq('id', complaintId)
    .single()

  if (!complaint || complaint.student_id !== user.id) {
    return { success: false, error: 'Complaint not found' }
  }

  const { data, error } = await supabase
    .from('feedback')
    .select('*')
    .eq('complaint_id', complaintId)
    .single()

  if (error) {
    // No feedback found is not an error
    if (error.code === 'PGRST116') {
      return { success: true, data: undefined }
    }
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

/**
 * Get all feedback submitted by the current student
 */
export async function getMyFeedback(): Promise<FeedbackListResult> {
  const user = await requireStudent()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('feedback')
    .select(`
      *,
      complaint:complaints(id, complaint_id, title, category, date_resolved)
    `)
    .eq('student_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Get my feedback error:', error)
    return { success: false, error: error.message }
  }

  return { success: true, data: data as unknown as FeedbackWithDetails[] }
}

/**
 * Check if feedback exists for a complaint
 */
export async function checkFeedbackExists(
  complaintId: number
): Promise<{ exists: boolean; error?: string }> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('feedback')
    .select('id')
    .eq('complaint_id', complaintId)
    .single()

  if (error && error.code !== 'PGRST116') {
    return { exists: false, error: error.message }
  }

  return { exists: !!data }
}

/**
 * Update existing feedback (within time limit)
 */
export async function updateFeedback(
  feedbackId: number,
  input: Partial<CreateFeedbackInput>
): Promise<FeedbackResult> {
  const user = await requireStudent()
  const supabase = await createClient()

  // Verify the feedback belongs to this student
  const { data: existingFeedback } = await supabase
    .from('feedback')
    .select('student_id, created_at')
    .eq('id', feedbackId)
    .single()

  if (!existingFeedback || existingFeedback.student_id !== user.id) {
    return { success: false, error: 'Feedback not found' }
  }

  // Check if within 24 hours of creation
  const createdAt = new Date(existingFeedback.created_at)
  const now = new Date()
  const hoursSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60)

  if (hoursSinceCreation > 24) {
    return { success: false, error: 'Feedback can only be edited within 24 hours of submission' }
  }

  const { data, error } = await supabase
    .from('feedback')
    .update({
      overall_rating: input.overall_rating,
      comment: input.comment,
      repair_quality: input.repair_quality,
      response_speed: input.response_speed,
    })
    .eq('id', feedbackId)
    .select()
    .single()

  if (error) {
    console.error('Update feedback error:', error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}
