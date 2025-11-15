import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardContent } from "@/components/dashboard-content"

export default async function Dashboard() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <DashboardLayout user={session.user}>
      <DashboardContent user={session.user} />
    </DashboardLayout>
  )
}