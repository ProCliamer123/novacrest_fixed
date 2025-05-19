"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { sql, RolePermissions } from "@/lib/db"
import { hash } from "bcryptjs"
import { getCurrentUser } from "./auth-actions"

// Validation schema for user creation
const createUserSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  role: z.enum(["admin", "manager", "user"]),
  active: z.boolean().default(true),
})

// Validation schema for user updates
const updateUserSchema = z.object({
  id: z.string().uuid({ message: "Valid user ID is required" }),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  role: z.enum(["admin", "manager", "user"]),
  active: z.boolean(),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }).optional(),
})

/**
 * Check if the current user has the required permission
 */
export async function checkPermission(permission: string): Promise<boolean> {
  const user = await getCurrentUser()

  if (!user) {
    return false
  }

  return user.permissions.includes(permission)
}

/**
 * Get all users
 */
export async function getUsers() {
  try {
    const result = await sql`
      SELECT id, name, email, role, permissions, active, "createdAt", "updatedAt", "lastLogin"
      FROM "User"
      ORDER BY name ASC
    `
    return result
  } catch (error) {
    console.error("Failed to fetch users:", error)
    return []
  }
}

/**
 * Get a user by ID
 */
export async function getUserById(id: string) {
  try {
    if (!id) return null

    const result = await sql`
      SELECT id, name, email, role, permissions, active, "createdAt", "updatedAt", "lastLogin"
      FROM "User"
      WHERE id = ${id}
    `
    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error(`Failed to fetch user ${id}:`, error)
    return null
  }
}

/**
 * Get a user by email
 */
export async function getUserByEmail(email: string) {
  try {
    if (!email) return null

    const result = await sql`
      SELECT id, name, email, role, permissions, active, "createdAt", "updatedAt", "lastLogin"
      FROM "User"
      WHERE email = ${email}
    `
    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error(`Failed to fetch user with email ${email}:`, error)
    return null
  }
}

/**
 * Create a new user
 */
export async function createUser(data: z.infer<typeof createUserSchema>) {
  try {
    // Validate input data
    const validatedData = createUserSchema.parse(data)

    // Get current user
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return { success: false, error: "Not authenticated" }
    }

    // Check if user with this email already exists
    const existingUser = await getUserByEmail(validatedData.email)
    if (existingUser) {
      return { success: false, error: "A user with this email already exists" }
    }

    // Hash the password
    const hashedPassword = await hash(validatedData.password, 10)

    // Get permissions for the role
    const permissions = RolePermissions[validatedData.role] || []

    // Insert the user
    const result = await sql`
      INSERT INTO "User" (
        name, email, password, role, permissions, active, "createdAt", "updatedAt"
      )
      VALUES (
        ${validatedData.name}, 
        ${validatedData.email}, 
        ${hashedPassword}, 
        ${validatedData.role},
        ${JSON.stringify(permissions)},
        ${validatedData.active},
        NOW(), 
        NOW()
      )
      RETURNING id, name, email, role, permissions, active, "createdAt", "updatedAt"
    `

    // Log activity
    await sql`
      INSERT INTO "Activity" (
        action, timestamp, "entityId", "entityType", "userId", details
      )
      VALUES (
        'create_user', NOW(), ${result[0].id}, 'user', ${currentUser.id},
        ${JSON.stringify({ name: validatedData.name, role: validatedData.role, createdBy: currentUser.name })}
      )
    `

    // Revalidate paths
    revalidatePath("/admin/users")
    revalidatePath("/admin/dashboard")

    return { success: true, user: result[0] }
  } catch (error) {
    console.error("Failed to create user:", error)
    return {
      success: false,
      error:
        error instanceof z.ZodError
          ? error.errors.map((e) => `${e.path}: ${e.message}`).join(", ")
          : "Failed to create user",
    }
  }
}

/**
 * Update an existing user
 */
export async function updateUser(data: z.infer<typeof updateUserSchema>) {
  try {
    // Validate input data
    const validatedData = updateUserSchema.parse(data)

    // Get current user
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return { success: false, error: "Not authenticated" }
    }

    // Check if user exists
    const existingUser = await getUserById(validatedData.id)
    if (!existingUser) {
      return { success: false, error: "User not found" }
    }

    // Check if email is being changed and if it's already in use
    if (validatedData.email !== existingUser.email) {
      const userWithEmail = await getUserByEmail(validatedData.email)
      if (userWithEmail && userWithEmail.id !== validatedData.id) {
        return { success: false, error: "A user with this email already exists" }
      }
    }

    // Get permissions for the role
    const permissions = RolePermissions[validatedData.role] || []

    // Prepare update query
    let updateQuery = `
      UPDATE "User"
      SET
        name = $1,
        email = $2,
        role = $3,
        permissions = $4,
        active = $5,
        "updatedAt" = NOW()
    `

    const queryParams = [
      validatedData.name,
      validatedData.email,
      validatedData.role,
      JSON.stringify(permissions),
      validatedData.active,
    ]

    // Add password update if provided
    if (validatedData.password) {
      const hashedPassword = await hash(validatedData.password, 10)
      updateQuery += `, password = $${queryParams.length + 1}`
      queryParams.push(hashedPassword)
    }

    updateQuery += ` WHERE id = $${queryParams.length + 1} RETURNING id, name, email, role, permissions, active, "createdAt", "updatedAt"`
    queryParams.push(validatedData.id)

    // Execute update
    const result = await sql.query(updateQuery, queryParams)

    // Log activity
    await sql`
      INSERT INTO "Activity" (
        action, timestamp, "entityId", "entityType", "userId", details
      )
      VALUES (
        'update_user', NOW(), ${validatedData.id}, 'user', ${currentUser.id},
        ${JSON.stringify({ name: validatedData.name, role: validatedData.role, updatedBy: currentUser.name })}
      )
    `

    // Revalidate paths
    revalidatePath(`/admin/users/${validatedData.id}`)
    revalidatePath("/admin/users")
    revalidatePath("/admin/dashboard")

    return { success: true, user: result.rows[0] }
  } catch (error) {
    console.error("Failed to update user:", error)
    return {
      success: false,
      error:
        error instanceof z.ZodError
          ? error.errors.map((e) => `${e.path}: ${e.message}`).join(", ")
          : "Failed to update user",
    }
  }
}

/**
 * Delete a user
 */
export async function deleteUser(id: string) {
  try {
    if (!id) {
      return { success: false, error: "User ID is required" }
    }

    // Get current user
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return { success: false, error: "Not authenticated" }
    }

    // Check if user exists
    const existingUser = await getUserById(id)
    if (!existingUser) {
      return { success: false, error: "User not found" }
    }

    // Prevent deleting yourself
    if (id === currentUser.id) {
      return { success: false, error: "You cannot delete your own account" }
    }

    // Delete the user
    await sql`
      DELETE FROM "User"
      WHERE id = ${id}
    `

    // Log activity
    await sql`
      INSERT INTO "Activity" (
        action, timestamp, "entityId", "entityType", "userId", details
      )
      VALUES (
        'delete_user', NOW(), ${id}, 'user', ${currentUser.id},
        ${JSON.stringify({ name: existingUser.name, role: existingUser.role, deletedBy: currentUser.name })}
      )
    `

    // Revalidate paths
    revalidatePath("/admin/users")
    revalidatePath("/admin/dashboard")

    return { success: true }
  } catch (error) {
    console.error(`Failed to delete user ${id}:`, error)
    return { success: false, error: "Failed to delete user" }
  }
}
