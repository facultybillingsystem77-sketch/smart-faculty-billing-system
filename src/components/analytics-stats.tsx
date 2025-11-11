"use client"

import * as React from "react"
import { UserPayload } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Calendar, Award } from "lucide-react"

interface AnalyticsStatsProps {
  user: UserPayload
}

export function AnalyticsStats({ user }: AnalyticsStatsProps) {
  const stats = [
    {
      title: "This Month",
      value: "156.5h",
      change: "+12%",
      trend: "up",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Last Month",
      value: "139.2h",
      change: "+8%",
      trend: "up",
      icon: TrendingUp,
      color: "text-blue-600",
    },
    {
      title: "This Semester",
      value: "445.8h",
      change: "+15%",
      trend: "up",
      icon: Calendar,
      color: "text-purple-600",
    },
    {
      title: "Productivity Score",
      value: "8.4/10",
      change: "+0.3",
      trend: "up",
      icon: Award,
      color: "text-yellow-600",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.trend === "up" ? "↗" : "↘"} {stat.change} from previous
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}