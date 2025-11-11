"use client"

import * as React from "react"
import { UserPayload } from "@/lib/auth"
import { formatDate, formatTime } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X, AlertTriangle, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface WorklogListProps {
  user: UserPayload
  refreshKey: number
}

interface Worklog {
  id: number
  date: string
  timeIn: string
  timeOut: string
  totalHours: number
  activity: string
  category: string
  subject: {
    name: string
    code: string
  }
  isValidated: boolean
  validationNotes?: string
  aiValidation?: {
    isAnomaly: boolean
    issues: any[]
  }
}

export function WorklogList({ user, refreshKey }: WorklogListProps) {
  const [worklogs, setWorklogs] = React.useState<Worklog[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const { toast } = useToast()

  React.useEffect(() => {
    fetchWorklogs()
  }, [refreshKey])

  const fetchWorklogs = async () => {
    try {
      const response = await fetch(`/api/worklogs?userId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setWorklogs(data)
      }
    } catch (error) {
      console.error("Failed to fetch worklogs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getCategoryBadgeVariant = (category: string) => {
    switch (category) {
      case "lecture":
        return "default"
      case "lab":
        return "secondary"
      case "evaluation":
        return "destructive"
      case "admin_work":
        return "outline"
      case "research_work":
        return "default"
      default:
        return "default"
    }
  }

  const getCategoryLabel = (category: string) => {
    return category.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Clock className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (worklogs.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No work logs found. Start by adding your first work log!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {worklogs.map((log) => (
        <Card key={log.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg">{log.activity}</h3>
                  <Badge variant={getCategoryBadgeVariant(log.category) as any}>
                    {getCategoryLabel(log.category)}
                  </Badge>
                  {log.aiValidation?.isAnomaly && (
                    <Badge variant="destructive">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Anomaly Detected
                    </Badge>
                  )}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-2">
                  <div>
                    <span className="font-medium">Date:</span> {formatDate(new Date(log.date))}
                  </div>
                  <div>
                    <span className="font-medium">Time:</span> {formatTime(log.timeIn)} - {formatTime(log.timeOut)}
                  </div>
                  <div>
                    <span className="font-medium">Duration:</span> {log.totalHours}h
                  </div>
                  <div>
                    <span className="font-medium">Subject:</span> {log.subject.name}
                  </div>
                </div>

                {log.validationNotes && (
                  <div className="text-sm text-muted-foreground mb-2">
                    <span className="font-medium">Notes:</span> {log.validationNotes}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 ml-4">
                {log.isValidated ? (
                  <Badge variant="success" className="bg-green-100 text-green-800">
                    <Check className="h-3 w-3 mr-1" />
                    Validated
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}