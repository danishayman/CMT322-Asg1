import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type AdminStatus =
  | 'Pending'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Closed'

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient()

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
  const { status }: { status: AdminStatus } = body

  // Look up numeric complaint ID
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

  const { error } = await supabase
    .from('complaints')
    .update({ status })
    .eq('id', complaint.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await supabase.from('activity_log').insert({
    complaint_id: complaint.id,
    user_id: user.id,
    action_type: 'status_changed',
    action_message: `Status updated to ${status}`,
  })

  return NextResponse.json({ success: true })
}

