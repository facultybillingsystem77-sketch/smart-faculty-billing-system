import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { subjects, departments } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const departmentId = searchParams.get("departmentId")
    
    let query = db.select({
      id: subjects.id,
      name: subjects.name,
      code: subjects.code,
      credits: subjects.credits,
      type: subjects.type,
      department: {
        id: departments.id,
        name: departments.name,
        code: departments.code,
      },
    })
    .from(subjects)
    .leftJoin(departments, eq(subjects.departmentId, departments.id))

    if (departmentId) {
      query = query.where(eq(subjects.departmentId, parseInt(departmentId)))
    }

    const subjectsList = await query.orderBy(subjects.name)
    
    return NextResponse.json(subjectsList)
  } catch (error) {
    console.error("Failed to fetch subjects:", error)
    return NextResponse.json(
      { error: "Failed to fetch subjects" },
      { status: 500 }
    )
  }
}