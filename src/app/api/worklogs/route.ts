import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { workloadLogs, users, subjects } from "@/lib/db/schema"
import { eq, desc, and } from "drizzle-orm"
import { WorkloadClassifier } from "@/lib/ai/classifier"
import { WorkloadValidator } from "@/lib/ai/validator"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")
    
    let query
    if (session.role === "admin" && !userId) {
      // Admin can see all logs
      query = db.select({
        id: workloadLogs.id,
        date: workloadLogs.date,
        timeIn: workloadLogs.timeIn,
        timeOut: workloadLogs.timeOut,
        totalHours: workloadLogs.totalHours,
        activity: workloadLogs.activity,
        category: workloadLogs.category,
        description: workloadLogs.description,
        isValidated: workloadLogs.isValidated,
        validationNotes: workloadLogs.validationNotes,
        user: {
          name: users.name,
          email: users.email,
        },
        subject: {
          name: subjects.name,
          code: subjects.code,
        },
      })
      .from(workloadLogs)
      .leftJoin(users, eq(workloadLogs.userId, users.id))
      .leftJoin(subjects, eq(workloadLogs.subjectId, subjects.id))
      .orderBy(desc(workloadLogs.date))
    } else {
      // Faculty can only see their own logs
      const targetUserId = userId ? parseInt(userId) : session.id
      
      if (session.role === "faculty" && targetUserId !== session.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }

      query = db.select({
        id: workloadLogs.id,
        date: workloadLogs.date,
        timeIn: workloadLogs.timeIn,
        timeOut: workloadLogs.timeOut,
        totalHours: workloadLogs.totalHours,
        activity: workloadLogs.activity,
        category: workloadLogs.category,
        description: workloadLogs.description,
        isValidated: workloadLogs.isValidated,
        validationNotes: workloadLogs.validationNotes,
        subject: {
          name: subjects.name,
          code: subjects.code,
        },
      })
      .from(workloadLogs)
      .leftJoin(subjects, eq(workloadLogs.subjectId, subjects.id))
      .where(eq(workloadLogs.userId, targetUserId))
      .orderBy(desc(workloadLogs.date))
    }

    const logs = await query
    return NextResponse.json(logs)
  } catch (error) {
    console.error("Failed to fetch work logs:", error)
    return NextResponse.json(
      { error: "Failed to fetch work logs" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      date,
      timeIn,
      timeOut,
      subjectId,
      activity,
      category,
      description,
      location,
      totalHours,
    } = body

    // Validate required fields
    if (!date || !timeIn || !timeOut || !activity || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // AI Classification and Validation
    const classifier = new WorkloadClassifier()
    const validator = new WorkloadValidator()

    // Auto-classify if not provided or confidence is low
    let finalCategory = category
    const classification = classifier.classify(activity)
    if (classification.confidence > 0.7) {
      finalCategory = classification.category
    }

    // Create worklog entry
    const newLog = await db.insert(workloadLogs).values({
      userId: session.id,
      subjectId: subjectId ? parseInt(subjectId) : null,
      date: new Date(date),
      timeIn,
      timeOut,
      totalHours,
      activity,
      category: finalCategory,
      description,
      location,
    }).returning()

    // Validate the entry
    const existingLogs = await db.select()
      .from(workloadLogs)
      .where(eq(workloadLogs.userId, session.id))

    const validationResult = await validator.validateWorkload(
      {
        id: newLog[0].id,
        date: new Date(date),
        timeIn,
        timeOut,
        totalHours,
        activity,
        userId: session.id,
      },
      existingLogs
    )

    // Update validation status based on AI validation
    if (validationResult.issues.length > 0) {
      await db.update(workloadLogs)
        .set({
          validationNotes: validationResult.issues
            .map((issue) => issue.message)
            .join("; "),
        })
        .where(eq(workloadLogs.id, newLog[0].id))
    }

    return NextResponse.json({
      success: true,
      log: newLog[0],
      validation: validationResult,
    })
  } catch (error) {
    console.error("Failed to create work log:", error)
    return NextResponse.json(
      { error: "Failed to create work log" },
      { status: 500 }
    )
  }
}