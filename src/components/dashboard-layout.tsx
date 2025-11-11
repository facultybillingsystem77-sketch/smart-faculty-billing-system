"use client"

import * as React from "react"
import { Sidebar } from "@/components/sidebar"
import { UserPayload } from "@/lib/auth"

interface DashboardLayoutProps {
  children: React.ReactNode
  user: UserPayload
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar user={user} />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  )
}