"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  CalendarDays,
  FileText,
  Users,
  Settings,
  LogOut,
  BookOpen,
  BarChart3,
  DollarSign,
  Activity,
} from "lucide-react"
import { deleteSession } from "@/lib/auth"
import { useRouter } from "next/navigation"

interface SidebarProps {
  user: {
    id: number
    name: string
    email: string
    role: "admin" | "faculty"
  }
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await deleteSession()
    router.push("/login")
  }

  const facultyMenuItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Workload Logs",
      href: "/dashboard/logs",
      icon: CalendarDays,
    },
    {
      title: "Timesheet",
      href: "/dashboard/timesheet",
      icon: FileText,
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
    },
    {
      title: "Billing",
      href: "/dashboard/billing",
      icon: DollarSign,
    },
  ]

  const adminMenuItems = [
    ...facultyMenuItems,
    {
      title: "Faculty Management",
      href: "/dashboard/faculty",
      icon: Users,
    },
    {
      title: "Department Analytics",
      href: "/dashboard/department-analytics",
      icon: Activity,
    },
    {
      title: "System Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  const menuItems = user.role === "admin" ? adminMenuItems : facultyMenuItems

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-lg font-bold">Smart Faculty</h2>
            <p className="text-xs text-muted-foreground">Billing System</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "sidebar-item",
                  isActive && "active"
                )}
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.title}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="border-t p-4">
        <div className="mb-4 rounded-lg bg-muted p-3">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground">
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </p>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}