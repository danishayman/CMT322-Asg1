"use client"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react"

// Data type structure to be used as prop for this component
interface Stat {
  title: string;
  value: string;
  change: string;
  trend: string;
  icon: typeof TrendingUp; // Using typeof to reference the imported Lucide icons
}

interface StatCardProp{
  stats : Stat[]; //accepts an array of Stats data type
}

export function StatsCards({stats}:StatCardProp) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <Card key={i} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold text-foreground">{stat.value}</span>
                  <span
                    className={`text-xs font-semibold ${stat.trend === "up" ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400"}`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
