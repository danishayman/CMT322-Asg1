"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, User, Clock } from "lucide-react"

const feedbackData = [
  {
    id: "FB-001",
    title: "Library opening hours too limited",
    description:
      "Students need extended library hours, especially during exam season. Current closing time at 8 PM is too early for evening study sessions.",
    student: "Danish Aiman",
    category: "Facilities",
    sentiment: "negative",
    created: "2 hours ago",
    replies: 3,
  },
  {
    id: "FB-002",
    title: "Excellent campus WiFi upgrade!",
    description:
      "Great job on upgrading the WiFi infrastructure. Connection is much faster and more reliable now. Really appreciate the effort!",
    student: "Maria Takeuchi",
    category: "IT Infrastructure",
    sentiment: "positive",
    created: "1 hour ago",
    replies: 1,
  },
  {
    id: "FB-003",
    title: "Cafeteria food quality concerns",
    description:
      "The quality of food in the cafeteria has declined recently. Menu options are limited and prices have increased significantly.",
    student: "James Bond",
    category: "Dining",
    sentiment: "negative",
    created: "30 mins ago",
    replies: 5,
  },
  {
    id: "FB-004",
    title: "Parking availability issue",
    description:
      "Finding parking on campus has become increasingly difficult. Would appreciate more parking spaces near the main buildings.",
    student: "Emma Watson",
    category: "Campus",
    sentiment: "neutral",
    created: "1 day ago",
    replies: 2,
  },
  {
    id: "FB-005",
    title: "Great academic advisor support",
    description:
      "My academic advisor was extremely helpful in planning my course schedule. Very professional and knowledgeable!",
    student: "Muhammad Aqif",
    category: "Academic",
    sentiment: "positive",
    created: "45 mins ago",
    replies: 0,
  },
]

const getSentimentBadgeVariant = (sentiment: string) => {
  switch (sentiment) {
    case "positive":
      return "default"
    case "negative":
      return "destructive"
    case "neutral":
      return "secondary"
    default:
      return "outline"
  }
}

export function FeedbackCards() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Complaints & Feedback</CardTitle>
            <CardDescription>Student feedback and complaints log</CardDescription>
          </div>
          <Button>View All</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {feedbackData.map((feedback) => (
            <div key={feedback.id} className="border rounded-lg p-4 hover:bg-accent transition-colors">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-muted-foreground">{feedback.id}</span>
                    <Badge variant={getSentimentBadgeVariant(feedback.sentiment) as any}>
                      {feedback.sentiment.charAt(0).toUpperCase() + feedback.sentiment.slice(1)}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-base line-clamp-2">{feedback.title}</h3>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{feedback.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5" />
                  {feedback.student}
                </div>
                <Badge variant="outline" className="text-xs">
                  {feedback.category}
                </Badge>
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {feedback.created}
                </div>
                <div className="flex items-center gap-1 ml-auto">
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>{feedback.replies} replies</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
