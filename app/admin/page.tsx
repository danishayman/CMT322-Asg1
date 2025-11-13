"use client"

import { useMemo, useState } from "react"
import { StatsCards } from "@/components/dashboard/stats-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  UserCheck,
  Users,
} from "lucide-react"

type ComplaintStatus = "New" | "Assigned" | "In Progress" | "Resolved"
type ComplaintPriority = "Low" | "Medium" | "High"

interface Complaint {
  id: string
  student: string
  title: string
  category: string
  priority: ComplaintPriority
  submittedAt: string
  status: ComplaintStatus
  assignedTo?: string
}

interface ActivityItem {
  id: string
  message: string
  timestamp: string
}

const staffMembers = [
  "Alicia Tan",
  "Ahmad Rahman",
  "Grace Lim",
  "Nurul Huda",
  "Vinod Kumar",
]

const initialComplaints: Complaint[] = [
  {
    id: "CMP-1045",
    student: "Siti Aisyah",
    title: "Internet outage at Block B",
    category: "Network",
    priority: "High",
    submittedAt: "2025-11-12T08:30:00Z",
    status: "New",
  },
  {
    id: "CMP-1044",
    student: "Michael Lee",
    title: "Broken desk in room 3A",
    category: "Furniture",
    priority: "Medium",
    submittedAt: "2025-11-11T10:05:00Z",
    status: "Assigned",
    assignedTo: "Grace Lim",
  },
  {
    id: "CMP-1043",
    student: "Nur Izzati",
    title: "Air conditioner leaking",
    category: "Facilities",
    priority: "High",
    submittedAt: "2025-11-09T20:45:00Z",
    status: "In Progress",
    assignedTo: "Ahmad Rahman",
  },
  {
    id: "CMP-1042",
    student: "Daniel Chong",
    title: "Request for room repainting",
    category: "Facilities",
    priority: "Low",
    submittedAt: "2025-11-08T09:12:00Z",
    status: "New",
  },
  {
    id: "CMP-1041",
    student: "Fatimah Zahra",
    title: "Noise complaint level 5",
    category: "Discipline",
    priority: "Medium",
    submittedAt: "2025-11-05T22:16:00Z",
    status: "Resolved",
    assignedTo: "Vinod Kumar",
  },
  {
    id: "CMP-1040",
    student: "Alex Wong",
    title: "Lost key replacement",
    category: "Security",
    priority: "Low",
    submittedAt: "2025-11-03T14:20:00Z",
    status: "Assigned",
    assignedTo: "Alicia Tan",
  },
]

const statusStyles: Record<ComplaintStatus, string> = {
  New: "bg-sky-100 text-sky-700",
  Assigned: "bg-purple-100 text-purple-700",
  "In Progress": "bg-amber-100 text-amber-700",
  Resolved: "bg-emerald-100 text-emerald-700",
}

const priorityStyles: Record<ComplaintPriority, string> = {
  Low: "bg-slate-100 text-slate-700",
  Medium: "bg-yellow-100 text-yellow-700",
  High: "bg-rose-100 text-rose-700",
}

function formatDateLabel(isoDate: string) {
  return new Date(isoDate).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  })
}

function buildActivityItem(message: string): ActivityItem {
  const timestamp = new Date().toLocaleString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    day: "numeric",
    month: "short",
  })

  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    message,
    timestamp,
  }
}

export default function AdminDashboardPage() {
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints)
  const [pendingAssignments, setPendingAssignments] = useState<
    Record<string, string>
  >({})
  const [activityFeed, setActivityFeed] = useState<ActivityItem[]>([
    buildActivityItem("Resolved complaint #CMP-1041 (Noise complaint level 5)"),
    buildActivityItem("Followed up with staff on complaint #CMP-1043"),
  ])

  const [referenceNow] = useState(() => Date.now())

  const totals = useMemo(() => {
    const sevenDaysAgo = referenceNow - 7 * 24 * 60 * 60 * 1000

    const counter = complaints.reduce(
      (acc, complaint) => {
        acc.total += 1
        acc.byStatus[complaint.status] += 1

        if (!complaint.assignedTo) {
          acc.unassigned += 1
        }

        const submittedAt = new Date(complaint.submittedAt).getTime()
        if (submittedAt >= sevenDaysAgo) {
          acc.newThisWeek += 1
        }

        if (complaint.assignedTo) {
          acc.byStaff.set(
            complaint.assignedTo,
            (acc.byStaff.get(complaint.assignedTo) ?? 0) + 1,
          )
        }

        return acc
      },
      {
        total: 0,
        newThisWeek: 0,
        unassigned: 0,
        byStatus: {
          New: 0,
          Assigned: 0,
          "In Progress": 0,
          Resolved: 0,
        } as Record<ComplaintStatus, number>,
        byStaff: new Map<string, number>(),
      },
    )

    return counter
  }, [complaints, referenceNow])

  const statsData = useMemo(() => {
    const completionRate = totals.total
      ? Math.round((totals.byStatus.Resolved / totals.total) * 100)
      : 0

    return [
      {
        title: "Total Complaints",
        value: `${totals.total}`,
        change: `${totals.newThisWeek} in last 7 days`,
        trend: "up" as const,
        icon: ClipboardList,
        href: "#complaints",
      },
      {
        title: "Awaiting Assignment",
        value: `${totals.byStatus.New}`,
        change: `${totals.unassigned} unassigned`,
        trend: totals.unassigned > 0 ? ("down" as const) : ("up" as const),
        icon: AlertCircle,
        href: "#complaints",
      },
      {
        title: "In Progress",
        value: `${totals.byStatus["In Progress"]}`,
        change: "Actively handled",
        trend: "up" as const,
        icon: Activity,
        href: "#complaints",
      },
      {
        title: "Resolution Rate",
        value: `${completionRate}%`,
        change: `${totals.byStatus.Resolved} resolved`,
        trend: completionRate >= 60 ? ("up" as const) : ("down" as const),
        icon: CheckCircle2,
        href: "#overview",
      },
    ]
  }, [totals])


  const statusBreakdown = useMemo(() => {
    return (Object.keys(statusStyles) as ComplaintStatus[]).map((status) => {
      const value = totals.byStatus[status]
      return {
        status,
        value,
        percentage: totals.total ? Math.round((value / totals.total) * 100) : 0,
      }
    })
  }, [totals])

  const staffBreakdown = useMemo(() => {
    return staffMembers.map((staff) => ({
      staff,
      count: totals.byStaff.get(staff) ?? 0,
    }))
  }, [totals])

  const handleAssignmentChange = (complaintId: string, staff: string) => {
    setPendingAssignments((prev) => ({
      ...prev,
      [complaintId]: staff,
    }))
  }

  const handleAssign = (complaintId: string) => {
    const staff = pendingAssignments[complaintId]
    if (!staff) return

    setComplaints((prev) =>
      prev.map((complaint) => {
        if (complaint.id !== complaintId) {
          return complaint
        }

        const isResolved = complaint.status === "Resolved"

        if (staff === "Unassigned") {
          return {
            ...complaint,
            assignedTo: undefined,
            status: isResolved ? "Resolved" : "New",
          }
        }

        const nextStatus: ComplaintStatus = isResolved ? "Resolved" : "Assigned"

        return {
          ...complaint,
          assignedTo: staff,
          status: nextStatus,
        }
      }),
    )

    setActivityFeed((prev) => [
      buildActivityItem(
        staff === "Unassigned"
          ? `Marked complaint #${complaintId} as unassigned`
          : `Assigned complaint #${complaintId} to ${staff}`,
      ),
      ...prev,
    ])

    setPendingAssignments((prev) => {
      const updated = { ...prev }
      delete updated[complaintId]
      return updated
    })
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor all student complaints, assign work to staff, and track
          progress at a glance.
        </p>
      </header>

      <StatsCards stats={statsData} />

      <section
        id="overview"
        className="grid grid-cols-1 gap-6 scroll-mt-24 xl:grid-cols-3"
      >
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Complaints by Status</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {statusBreakdown.map((item) => (
              <div
                key={item.status}
                className="flex items-center justify-between"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{item.status}</span>
                  <span className="text-sm text-muted-foreground">
                    {item.value} complaints
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-2 w-32 rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary transition-all"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground">
                    {item.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Staff Workload</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {staffBreakdown.map((item) => (
              <div
                key={item.staff}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">
                    <Users className="h-3 w-3" />
                    {item.staff}
                  </Badge>
                </div>
                <span className="text-sm text-muted-foreground">
                  {item.count} complaints
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section
        id="complaints"
        className="grid grid-cols-1 gap-6 scroll-mt-24 xl:grid-cols-3"
      >
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle>All Complaints</CardTitle>
              <p className="text-sm text-muted-foreground">
                Assign complaints to staff and track their current progress.
              </p>
            </div>
            <Badge variant="outline" className="gap-2">
              <ClipboardList className="h-3.5 w-3.5" />
              {complaints.length} total
            </Badge>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead className="bg-muted/60">
                <tr className="text-left text-xs font-semibold uppercase text-muted-foreground">
                  <th className="py-3 pr-4">Complaint</th>
                  <th className="py-3 pr-4">Category</th>
                  <th className="py-3 pr-4">Priority</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 pr-4">Assigned Staff</th>
                  <th className="py-3 pr-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {complaints.map((complaint) => {
                  const currentValue = complaint.assignedTo ?? "Unassigned"
                  const pendingValue = pendingAssignments[complaint.id]
                  const selectedStaff = pendingValue ?? currentValue
                  const canAssign =
                    pendingValue !== undefined && pendingValue !== currentValue

                  return (
                    <tr key={complaint.id} className="align-top">
                      <td className="py-4 pr-4">
                        <div className="font-medium text-foreground">
                          {complaint.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          #{complaint.id} • Submitted{" "}
                          {formatDateLabel(complaint.submittedAt)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          by {complaint.student}
                        </div>
                      </td>
                      <td className="py-4 pr-4">
                        <Badge variant="secondary">{complaint.category}</Badge>
                      </td>
                      <td className="py-4 pr-4">
                        <Badge className={priorityStyles[complaint.priority]}>
                          {complaint.priority}
                        </Badge>
                      </td>
                      <td className="py-4 pr-4">
                        <Badge className={statusStyles[complaint.status]}>
                          {complaint.status}
                        </Badge>
                      </td>
                      <td className="py-4 pr-4">
                        <Select
                          value={selectedStaff}
                          onValueChange={(value) =>
                            handleAssignmentChange(complaint.id, value)
                          }
                        >
                          <SelectTrigger className="w-[200px]">
                            <SelectValue
                              placeholder="Assign staff member"
                              aria-label="Select staff"
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {staffMembers.map((staff) => (
                              <SelectItem key={staff} value={staff}>
                                {staff}
                              </SelectItem>
                            ))}
                            <SelectItem value="Unassigned">
                              Unassigned
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-4 pr-0 text-right">
                        <Button
                          size="sm"
                          variant="default"
                          disabled={!canAssign}
                          onClick={() => handleAssign(complaint.id)}
                        >
                          Assign
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activityFeed.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No recent actions recorded. Assign a complaint to log activity.
              </p>
            ) : (
              activityFeed.slice(0, 8).map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-border/60 bg-muted/40 p-3"
                >
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <UserCheck className="h-4 w-4 text-primary" />
                    {item.message}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.timestamp}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
