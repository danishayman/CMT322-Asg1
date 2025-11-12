'use client'
import { StatsCards } from "@/components/dashboard/stats-card"
import { TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react"

export default function DashboardPage() {

    const stats_data = [
        {
            title: "Total Tickets",
            value: "248",
            change: "+12%",
            trend: "up",
            icon: TrendingUp, 
            href: "/staff/tickets/all", // 👈 UPDATED PATH
        },
        {
            title: "Open Tickets",
            value: "45",
            change: "-5%",
            trend: "down",
            icon: AlertCircle, 
            href: "/staff/tickets/active", 
        },
        {
            title: "Pending Tickets", 
            value: "23",
            change: "+8%",
            trend: "up",
            icon: Clock, 
            href: "/staff/tickets/pending", 
        },
        {
            title: "Resolved Tickets", 
            value: "230",
            change: "-15%",
            trend: "down",
            icon: CheckCircle, 
            href: "/staff/tickets/resolved", 
        },
    ]

    return (
        // ... (rest of the component remains the same)
        <div className="flex flex-col">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground mt-1">Manage and track help-desk tickets</p>
            </div>
            <div className="mt-6">
                 <StatsCards stats={stats_data}/>
            </div>
        </div>
    )
}
