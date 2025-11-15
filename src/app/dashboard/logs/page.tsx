import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { WorkloadLogs } from "@/components/workload-logs"

export default async function LogsPage() {
  const session = await getSession()
  
  if (!session) {
    redirect("/login")
  }

  return (
    <DashboardLayout user={session.user}>
      <WorkloadLogs user={session.user} />
    </DashboardLayout>
  )
}