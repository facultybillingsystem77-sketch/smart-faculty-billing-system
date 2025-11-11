"use client"

import * as React from "react"
import { UserPayload } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, Clock, DollarSign, Activity } from "lucide-react"
import { WorkloadChart } from "@/components/workload-chart"
import { RecentActivity } from "@/components/recent-activity"

interface DashboardContentProps {
  user: UserPayload
}

export function DashboardContent({ user }: DashboardContentProps) {
  const stats = [
    {
      title: "Total Hours This Month",
      value: "156.5",
      icon: Clock,
      description: "+12% from last month",
      color: "text-blue-600",
    },
    {
      title: "Pending Logs",
      value: "8",
      icon: Activity,
      description: "Awaiting validation",
      color: "text-orange-600",
    },
    {
      title: "Total Earnings",
      value: "$12,520",
      icon: DollarSign,
      description: "This month",
      color: "text-green-600",
    },
    {
      title: "Upcoming Deadlines",
      value: "3",
      icon: CalendarDays,
      description: "Next 7 days",
      color: "text-red-600",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user.name}!
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your workload today.
        </p>
      </div>

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
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Workload Overview</CardTitle>
            <CardDescription>
              Your workload hours over the past 6 months
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <WorkloadChart />
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest workload entries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}