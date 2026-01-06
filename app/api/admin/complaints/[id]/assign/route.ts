import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient()

  // 1. Require authenticated user (RLS will enforce admin-only writes on complaints)
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Next.js 15: params is a Promise
  const { id } = await context.params
  const complaintCode = id // e.g. "CMP-0003"

  const body = await req.json()
  const { assigned_staff_id }: { assigned_staff_id: string | null } = body

  // Look up the numeric complaint ID for logging / safety
  const {
    data: complaint,
    error: fetchError,
  } = await supabase
    .from('complaints')
    .select('id')
    .eq('complaint_id', complaintCode)
    .single()

  if (fetchError || !complaint) {
    return NextResponse.json({ error: 'Complaint not found' }, { status: 404 })
  }

  const newStatus = assigned_staff_id ? 'Assigned' : 'Pending'

  const { error: updateError } = await supabase
    .from('complaints')
    .update({
      assigned_to: assigned_staff_id,
      status: newStatus,
    })
    .eq('id', complaint.id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  const logMessage = assigned_staff_id
    ? `Assigned to staff ID ${assigned_staff_id}`
    : 'Unassigned staff'

  await supabase.from('activity_log').insert({
    complaint_id: complaint.id,
    user_id: user.id,
    action_type: 'assigned',
    action_message: logMessage,
  })

  return NextResponse.json({ success: true, status: newStatus })
}


