"use client"

import * as React from "react"
import { UserPayload } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WorkloadChart } from "@/components/workload-chart"
import { AnalyticsStats } from "@/components/analytics-stats"

interface AnalyticsDashboardProps {
  user: UserPayload
}

export function AnalyticsDashboard({ user }: AnalyticsDashboardProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Detailed insights into your workload patterns and performance
        </p>
      </div>

      <AnalyticsStats user={user} />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Workload Distribution</CardTitle>
            <CardDescription>
              Breakdown of work by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WorkloadChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>
              Key performance indicators
            </CardDescription>
          </CardContent>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Average Daily Hours</span>
                <span className="text-sm text-muted-foreground">6.2h</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Validation Rate</span>
                <span className="text-sm text-muted-foreground">94%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">On-time Submission</span>
                <span className="text-sm text-muted-foreground">87%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Productivity Score</span>
                <span className="text-sm text-muted-foreground">8.4/10</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}