import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"
import { createSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await db.select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (user.length === 0) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    const userData = user[0]

    // Verify password
    const isValidPassword = await bcrypt.compare(password, userData.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    if (!userData.isActive) {
      return NextResponse.json(
        { error: "Account is deactivated" },
        { status: 401 }
      )
    }

    // Create session
    const userPayload = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      departmentId: userData.departmentId || undefined,
    }

    await createSession(userPayload)

    return NextResponse.json({
      success: true,
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        departmentId: userData.departmentId,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}