'use client'
import { StatsCards } from "@/components/dashboard/stats-card"
import { stat } from "fs"
import { TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react"

export default function DashboardPage() {

const stats_data = [
  {
    title: "Total Tickets",
    value: "248",
    change: "+12%",
    trend: "up",
    icon: TrendingUp,
  },
  {
    title: "Open Tickets",
    value: "45",
    change: "-5%",
    trend: "down",
    icon: TrendingUp,
  },
  {
    title: "Resolved Today",
    value: "23",
    change: "+8%",
    trend: "up",
    icon: TrendingUp,
  },
  {
    title: "Avg Response Time",
    value: "2.4h",
    change: "-15%",
    trend: "down",
    icon: TrendingUp,
  },
  {
    title: "Student Feedbacks",
    value: "13",
    change: "+15%",
    trend: "up",
    icon: TrendingUp,
  },
]

return (
    <div className="flex h-screen bg-background">
      
      <div className="flex-1 flex flex-col overflow-hidden">
        
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage and track help-desk tickets</p>
            </div>
            <StatsCards stats={stats_data}/>
          </div>
        </main>
      </div>
    </div>
  )
}
