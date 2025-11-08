"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

// Sample data - replace with real data from your API
const ratingData = [
  { date: "Jan 1", rating: 3.8 },
  { date: "Jan 8", rating: 4.1 },
  { date: "Jan 15", rating: 3.9 },
  { date: "Jan 22", rating: 4.3 },
  { date: "Jan 29", rating: 4.5 },
  { date: "Feb 5", rating: 4.2 },
  { date: "Feb 12", rating: 4.6 },
  { date: "Feb 19", rating: 4.8 },
  { date: "Feb 26", rating: 4.7 },
  { date: "Mar 5", rating: 4.9 },
]

interface xvy{
    x_label: string 
    y_label: string
    x_value : string | number
    y_value : number
}

interface xvyProp{
    data: xvy[];
}

const chartConfig = {
  rating: {
    label: "Average Rating",
    color: "hsl(var(--chart-1))",
  },
}

export function RatingsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ratings Over Time</CardTitle>
        <CardDescription>Average help-desk satisfaction ratings</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ratingData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 5]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="rating"
                stroke="var(--color-rating)"
                strokeWidth={2}
                dot={{ fill: "var(--color-rating)", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
