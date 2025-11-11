"use client"

import * as React from "react"
import { formatDate, formatTime } from "@/lib/utils"
import { Clock, BookOpen, CheckCircle, AlertCircle } from "lucide-react"

interface RecentActivity {
  id: number
  activity: string
  date: string
  timeIn: string
  timeOut: string
  category: string
  isValidated: boolean
  subject: {
    name: string
    code: string
  }
}

export function RecentActivity() {
  const [activities, setActivities] = React.useState<RecentActivity[]>([])

  React.useEffect(() => {
    // Mock data - in real app, this would come from API
    const mockActivities: RecentActivity[] = [
      {
        id: 1,
        activity: "Machine Learning Lecture - Neural Networks",
        date: "2024-01-15",
        timeIn: "09:00",
        timeOut: "10:30",
        category: "lecture",
        isValidated: true,
        subject: { name: "Machine Learning", code: "AIDS101" }
      },
      {
        id: 2,
        activity: "Deep Learning Lab Session",
        date: "2024-01-14",
        timeIn: "14:00",
        timeOut: "16:00",
        category: "lab",
        isValidated: true,
        subject: { name: "Deep Learning", code: "AIDS102" }
      },
      {
        id: 3,
        activity: "Mid-term Exam Evaluation",
        date: "2024-01-13",
        timeIn: "10:00",
        timeOut: "12:00",
        category: "evaluation",
        isValidated: false,
        subject: { name: "Data Science", code: "AIDS103" }
      },
      {
        id: 4,
        activity: "Faculty Meeting - Curriculum Review",
        date: "2024-01-12",
        timeIn: "15:00",
        timeOut: "16:30",
        category: "admin_work",
        isValidated: true,
        subject: { name: "Department", code: "DEPT" }
      },
    ]

    setActivities(mockActivities)
  }, [])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "lecture":
        return <BookOpen className="h-4 w-4 text-blue-600" />
      case "lab":
        return <Clock className="h-4 w-4 text-green-600" />
      case "evaluation":
        return <AlertCircle className="h-4 w-4 text-orange-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
          <div className="mt-1">
            {getCategoryIcon(activity.category)}
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              {activity.activity}
            </p>
            <p className="text-sm text-muted-foreground">
              {activity.subject.name} ({activity.subject.code})
            </p>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <span>{formatDate(new Date(activity.date))}</span>
              <span>
                {formatTime(activity.timeIn)} - {formatTime(activity.timeOut)}
              </span>
              <span className="flex items-center">
                {activity.isValidated ? (
                  <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                ) : (
                  <AlertCircle className="h-3 w-3 mr-1 text-orange-600" />
                )}
                {activity.isValidated ? "Validated" : "Pending"}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}