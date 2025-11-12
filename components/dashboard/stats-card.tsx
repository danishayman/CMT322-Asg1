"use client"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react"
import Link from 'next/link'; // Import Link

// Data type structure to be used as prop for this component
interface Stat {
    title: string;
    value: string;
    change: string;
    trend: string;
    icon: typeof TrendingUp;
    href?: string; // NEW: Optional link path for the card
}

interface StatCardProp{
    stats : Stat[]; //accepts an array of Stats data type
}

export function StatsCards({stats}:StatCardProp) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
                // Use Link component to make the card clickable if href is provided
                <Link 
                    key={i} 
                    href={stat.href || '#'} // Fallback to '#' if no href is given
                    className="block" // Make Link act as a block element for the card
                >
                    {/* The Card component itself */}
                    <Card className="hover:shadow-lg hover:border-primary transition-all duration-200 h-full"> 
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
                </Link>
            ))}
        </div>
    )
}
