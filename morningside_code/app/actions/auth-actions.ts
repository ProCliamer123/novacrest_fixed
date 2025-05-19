"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { sql } from "@/lib/db"
import { compare, hash } from "bcryptjs"
import { createToken, setTokenCookie, deleteTokenCookie, verifyJWT } from "@/lib/auth"
import { initializeDatabase } from "@/lib/db"

// Initialize database tables if needed
export async function ensureDatabaseInitialized() {
  return await initializeDatabase()
}

// Login function
export async function login(formData: FormData) {
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
      return { success: false, error: "Email and password are required" }
    }

    // Query the database for the user
    const users = await sql`
      SELECT * FROM "User" WHERE email = ${email}
    `

    // Check if user exists
    if (!users || users.length === 0) {
      return { success: false, error: "Invalid email or password" }
    }

    const user = users[0]

    // Check if password matches
    const passwordMatch = await compare(password, user.password)
    if (!passwordMatch) {
      return { success: false, error: "Invalid email or password" }
    }

    // Create and set JWT token
    const token = await createToken({
      id: user.id,
      email: user.email,
      role: user.role,
    })

    await setTokenCookie(token)

    // Don't try to update lastLogin as it might not exist
    // Just update the updatedAt timestamp
    try {
      await sql`
        UPDATE "User" 
        SET "updatedAt" = NOW()
        WHERE id = ${user.id}
      `
    } catch (updateError) {
      console.warn("Could not update user timestamps:", updateError)
      // Continue anyway - this is not critical
    }

    // Return success
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "An error occurred during login" }
  }
}

// Register function
export async function register(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const role = (formData.get("role") as string) || "client" // Default role for new registrations

    if (!name || !email || !password) {
      return { success: false, error: "All fields are required" }
    }

    // Check if user already exists
    const existingUsers = await sql`
      SELECT * FROM "User" WHERE email = ${email}
    `

    if (existingUsers && existingUsers.length > 0) {
      return { success: false, error: "Email already in use" }
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Insert new user
    const result = await sql`
      INSERT INTO "User" (name, email, password, role, "createdAt", "updatedAt")
      VALUES (${name}, ${email}, ${hashedPassword}, ${role}, NOW(), NOW())
      RETURNING id, name, email, role
    `

    const newUser = result[0]

    // Create and set JWT token
    const token = await createToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    })

    await setTokenCookie(token)

    // Return success
    return {
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
    }
  } catch (error) {
    console.error("Registration error:", error)
    return { success: false, error: "An error occurred during registration" }
  }
}

// Logout function
export async function logout() {
  await deleteTokenCookie()
  redirect("/login")
}

// Get current session
export async function getSession() {
  try {
    const user = await getCurrentUser()
    return { user }
  } catch (error) {
    return { user: null }
  }
}

// Get current user from token
export async function getCurrentUser() {
  const cookieStore = cookies()
  const token = cookieStore.get("auth-token")?.value

  if (!token) {
    return null
  }

  try {
    const payload = await verifyJWT(token)
    if (!payload) {
      return null
    }

    // Get user from database
    const users = await sql`
      SELECT id, name, email, role, permissions, active
      FROM "User"
      WHERE id = ${payload.id}
    `

    if (!users || users.length === 0) {
      return null
    }

    const user = users[0]

    // Check if user is active
    if (!user.active) {
      return null
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions || [],
    }
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

// Create admin user if none exists
export async function createAdminUserIfNeeded() {
  try {
    // Check if any admin user exists
    const admins = await sql`
      SELECT * FROM "User" WHERE role = 'admin' LIMIT 1
    `

    if (admins && admins.length > 0) {
      return { success: true, message: "Admin user already exists" }
    }

    // Create default admin user
    const hashedPassword = await hash("admin123", 10)

    await sql`
      INSERT INTO "User" (
        name, email, password, role, permissions, active, "createdAt", "updatedAt"
      )
      VALUES (
        'Admin User', 'admin@example.com', ${hashedPassword}, 'admin', 
        ${JSON.stringify(["admin"])}, true, NOW(), NOW()
      )
    `

    return { success: true, message: "Default admin user created" }
  } catch (error) {
    console.error("Error creating admin user:", error)
    return { success: false, error: "Failed to create admin user" }
  }
}
