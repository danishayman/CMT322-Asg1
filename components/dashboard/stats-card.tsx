"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Clock, CheckCircle, Inbox } from "lucide-react"
import Link from 'next/link'

// Data type structure to be used as prop for this component
interface Stat {
    title: string;
    value: string;
    icon: typeof TrendingUp;
    href?: string; // Optional link path for the card
}

interface StatCardProp {
    stats: Stat[];
}

export function StatsCards({ stats }: StatCardProp) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
                <Link 
                    key={i} 
                    href={stat.href || '#'}
                    className="block"
                >
                    <Card className="hover:shadow-lg hover:border-primary transition-all duration-200 h-full"> 
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                                    <div className="mt-2">
                                        <span className="text-3xl font-bold text-foreground">{stat.value}</span>
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