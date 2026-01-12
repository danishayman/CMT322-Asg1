import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Try to use the complaint_details view first (richer data for admin dashboard)
  const { data, error } = await supabase
    .from('complaint_details')
    .select('*')
    .order('created_at', { ascending: false })

  if (!error && data) {
    return NextResponse.json(data)
  }

  // Fallback: base complaints table with minimal join
  console.error('complaint_details view error, falling back:', error)

  const { data: rawData, error: rawError } = await supabase
    .from('complaints')
    .select(
      `
      *,
      student:users!complaints_student_id_fkey (id, full_name, email),
      assigned_staff:users!complaints_assigned_to_fkey (id, full_name, email)
    `,
    )
    .order('date_submitted', { ascending: false })

  if (rawError) {
    return NextResponse.json({ error: rawError.message }, { status: 500 })
  }

  return NextResponse.json(rawData)
}


