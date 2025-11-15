import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"

export default async function AnalyticsPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <DashboardLayout user={session.user}>
      <AnalyticsDashboard user={session.user} />
    </DashboardLayout>
  )
}