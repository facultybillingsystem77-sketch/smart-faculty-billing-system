"use client"

import * as React from "react"
import { UserPayload } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { WorklogForm } from "@/components/worklog-form"
import { WorklogList } from "@/components/worklog-list"

interface WorkloadLogsProps {
  user: UserPayload
}

export function WorkloadLogs({ user }: WorkloadLogsProps) {
  const [showForm, setShowForm] = React.useState(false)
  const [refreshKey, setRefreshKey] = React.useState(0)

  const handleFormSubmit = () => {
    setShowForm(false)
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workload Logs</h1>
          <p className="text-muted-foreground">
            Track and manage your faculty workload activities
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Work Log
        </Button>
      </div>

      {showForm && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Log New Work Activity</CardTitle>
            <CardDescription>
              Enter details about your work activity. AI will help classify and validate your entry.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WorklogForm 
              user={user} 
              onSubmit={handleFormSubmit}
              onCancel={() => setShowForm(false)}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Work Logs</CardTitle>
          <CardDescription>
            Your logged work activities and their validation status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WorklogList user={user} refreshKey={refreshKey} />
        </CardContent>
      </Card>
    </div>
  )
}