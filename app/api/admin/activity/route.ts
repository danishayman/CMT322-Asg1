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

  const { data, error } = await supabase
    .from('activity_log')
    .select(
      `
      id,
      complaint_id,
      action_type,
      action_message,
      created_at
    `,
    )
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const items =
    data?.map((row) => ({
      id: String(row.id),
      message: row.action_message as string,
      timestamp: new Date(row.created_at as string).toLocaleString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        day: 'numeric',
        month: 'short',
      }),
    })) ?? []

  return NextResponse.json(items)
}


