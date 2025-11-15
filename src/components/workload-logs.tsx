'use client';

import * as React from 'react';
import { UserPayload } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface WorkloadLogsProps {
  user: UserPayload;
}

export function WorkloadLogs({ user }: WorkloadLogsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workload Logs</h1>
          <p className="text-muted-foreground">
            Track and manage your faculty workload activities
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workload Management</CardTitle>
          <CardDescription>
            This module is being updated to work with the new system architecture
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Workload entry and management features will be available soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
