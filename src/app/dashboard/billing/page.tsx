import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { BillingDashboard } from "@/components/billing-dashboard"

export default async function BillingPage() {
  const session = await getSession()
  
  if (!session) {
    redirect("/login")
  }

  return (
    <DashboardLayout user={session.user}>
      <BillingDashboard user={session.user} />
    </DashboardLayout>
  )
}