import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { compare } from "bcryptjs"
import { sql } from "@/lib/db"
import { createToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // For demo purposes, allow admin login without database
    if (email === "admin@example.com" && password === "admin123") {
      // Create a token for the admin user
      const token = await createToken({
        id: "admin-id",
        email: "admin@example.com",
        role: "admin",
      })

      // Set the token in a cookie
      cookies().set({
        name: "auth-token",
        value: token,
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      })

      return NextResponse.json({ success: true })
    }

    // Try to connect to the database
    try {
      // Query the database for the user
      const users = await sql`
        SELECT * FROM "User" WHERE email = ${email}
      `

      // Check if user exists
      if (!users || users.length === 0) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
      }

      const user = users[0]

      // Check if password matches
      const passwordMatch = await compare(password, user.password)
      if (!passwordMatch) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
      }

      // Create and set JWT token
      const token = await createToken({
        id: user.id,
        email: user.email,
        role: user.role,
      })

      // Set the token in a cookie
      cookies().set({
        name: "auth-token",
        value: token,
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      })

      return NextResponse.json({ success: true })
    } catch (dbError) {
      console.error("Database error during login:", dbError)

      // If this is the admin user, allow login even with DB error
      if (email === "admin@example.com" && password === "admin123") {
        return NextResponse.json({ success: true })
      }

      return NextResponse.json({ error: "Database connection error" }, { status: 500 })
    }
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "An error occurred during login" }, { status: 500 })
  }
}
