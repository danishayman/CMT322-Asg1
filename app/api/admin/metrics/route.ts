import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type DbStatus = 'Pending' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed'

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
    .from('complaints')
    .select('status, assigned_to, date_submitted')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const now = Date.now()
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000

  const byStatus: Record<DbStatus, number> = {
    Pending: 0,
    Assigned: 0,
    'In Progress': 0,
    Resolved: 0,
    Closed: 0,
  }

  const byStaff = new Map<string, number>()

  let total = 0
  let newThisWeek = 0
  let unassigned = 0

  for (const c of data as {
    status: DbStatus
    assigned_to: string | null
    date_submitted: string
  }[]) {
    total += 1
    if (byStatus[c.status] !== undefined) {
      byStatus[c.status] += 1
    }

    if (!c.assigned_to) {
      unassigned += 1
    } else {
      byStaff.set(c.assigned_to, (byStaff.get(c.assigned_to) ?? 0) + 1)
    }

    const submittedAt = new Date(c.date_submitted).getTime()
    if (submittedAt >= sevenDaysAgo) {
      newThisWeek += 1
    }
  }

  const completionRate = total ? Math.round((byStatus.Resolved / total) * 100) : 0

  return NextResponse.json({
    total,
    newThisWeek,
    unassigned,
    byStatus,
    byStaff: Array.from(byStaff.entries()).map(([staffId, count]) => ({
      staffId,
      count,
    })),
    completionRate,
  })
}


