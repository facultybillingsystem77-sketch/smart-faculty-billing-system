"use client"

import * as React from "react"
import { UserPayload } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, Download, Calendar } from "lucide-react"

interface BillingDashboardProps {
  user: UserPayload
}

export function BillingDashboard({ user }: BillingDashboardProps) {
  const billingData = [
    {
      month: "January 2024",
      hours: 156.5,
      rate: 800,
      amount: 12520,
      status: "Paid",
    },
    {
      month: "December 2023",
      hours: 142.8,
      rate: 800,
      amount: 11424,
      status: "Paid",
    },
    {
      month: "November 2023",
      hours: 138.2,
      rate: 800,
      amount: 11056,
      status: "Paid",
    },
  ]

  const handleDownloadReport = (month: string) => {
    // In real app, this would generate and download PDF
    console.log(`Downloading report for ${month}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing & Payments</h1>
        <p className="text-muted-foreground">
          Track your earnings and download billing reports
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Month Earnings
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,520</div>
            <p className="text-xs text-muted-foreground">
              Based on 156.5 hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Hourly Rate
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$80</div>
            <p className="text-xs text-muted-foreground">
              Per hour rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total This Year
            </CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$35,000</div>
            <p className="text-xs text-muted-foreground">
              Year to date
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>
            Previous billing cycles and payment status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {billingData.map((bill) => (
              <div
                key={bill.month}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{bill.month}</p>
                    <p className="text-sm text-muted-foreground">
                      {bill.hours} hours × ${bill.rate}/hour
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-medium">${bill.amount.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">
                      {bill.status}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownloadReport(bill.month)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}