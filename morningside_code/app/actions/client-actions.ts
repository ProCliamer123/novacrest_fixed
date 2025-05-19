"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { sql } from "@/lib/db"
import { hash } from "bcryptjs"
import { getCurrentUser } from "./auth-actions"
import { handleActionError, createValidationError } from "@/lib/error-handler"
import type { Client } from "@/lib/db"

// Validation schema for client creation
const createClientSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  companyName: z.string().min(2, { message: "Company name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().optional(),
  address: z.string().optional(),
  status: z.enum(["active", "inactive", "onboarding"]),
  createAccount: z.boolean().optional(),
  password: z.string().optional(),
})

// Validation schema for client updates
const updateClientSchema = createClientSchema.extend({
  id: z.string().uuid(),
})

/**
 * Get all clients
 */
export async function getClients(): Promise<Client[]> {
  try {
    const result = await sql`
      SELECT * FROM "Client"
      ORDER BY "createdAt" DESC
    `
    return result.rows as Client[]
  } catch (error) {
    console.error("Failed to fetch clients:", error)
    return []
  }
}

/**
 * Get a client by ID
 */
export async function getClientById(id: string): Promise<Client | null> {
  try {
    if (!id) return null

    const result = await sql`
      SELECT * FROM "Client"
      WHERE id = ${id}
    `
    return result.rows.length > 0 ? result.rows[0] : null
  } catch (error) {
    console.error(`Failed to fetch client ${id}:`, error)
    return null
  }
}

/**
 * Get a client by email
 */
export async function getClientByEmail(email: string): Promise<Client | null> {
  return handleActionError(async () => {
    if (!email) {
      throw createValidationError("Email is required")
    }

    const result = await sql<Client[]>(
      `
      SELECT * FROM "Client"
      WHERE email = $1
    `,
      [email],
    )

    return result.rows.length > 0 ? result.rows[0] : null
  }, "Failed to fetch client by email").then((result) => result.data)
}

/**
 * Create a new client
 */
export async function createClient(
  data: z.infer<typeof createClientSchema>,
): Promise<{ success: boolean; client?: Client; error?: string }> {
  try {
    // Validate input data
    const validatedData = createClientSchema.parse(data)

    // Get current user
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return { success: false, error: "Not authenticated" }
    }

    let userId = null

    // If createAccount is true, create a user account for the client
    if (validatedData.createAccount && validatedData.password) {
      // Hash the password
      const hashedPassword = await hash(validatedData.password, 10)

      // Create user account
      const userResult = await sql`
        INSERT INTO "User" (
          name, email, password, role, permissions, active, "createdAt", "updatedAt"
        )
        VALUES (
          ${validatedData.name}, ${validatedData.email}, ${hashedPassword}, 'client', 
          ${JSON.stringify(["view_clients", "view_projects", "view_resources"])}, 
          true, NOW(), NOW()
        )
        RETURNING id
      `

      if (userResult && userResult.rows.length > 0) {
        userId = userResult.rows[0].id
      }
    }

    // Insert the client
    const result = await sql`
      INSERT INTO "Client" (
        name, "companyName", email, phone, address, status, "userId", "createdAt", "updatedAt"
      )
      VALUES (
        ${validatedData.name}, 
        ${validatedData.companyName}, 
        ${validatedData.email}, 
        ${validatedData.phone || null}, 
        ${validatedData.address || null}, 
        ${validatedData.status},
        ${userId},
        NOW(), 
        NOW()
      )
      RETURNING *
    `

    // Log activity
    await sql`
      INSERT INTO "Activity" (
        action, timestamp, "entityId", "entityType", "userId", "clientId", details
      )
      VALUES (
        'create_client', NOW(), ${result.rows[0].id}, 'client', ${currentUser.id}, ${result.rows[0].id},
        ${JSON.stringify({ name: validatedData.name, createdBy: currentUser.name })}
      )
    `

    // Revalidate paths
    revalidatePath("/admin/clients")
    revalidatePath("/admin/dashboard")

    return { success: true, client: result.rows[0] }
  } catch (error) {
    console.error("Failed to create client:", error)
    return {
      success: false,
      error:
        error instanceof z.ZodError
          ? error.errors.map((e) => `${e.path}: ${e.message}`).join(", ")
          : "Failed to create client",
    }
  }
}

/**
 * Update an existing client
 */
export async function updateClient(
  id: string,
  data: any,
): Promise<{ success: boolean; client?: Client; error?: string }> {
  try {
    if (!id) {
      return { success: false, error: "Client ID is required" }
    }

    // Get current user
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return { success: false, error: "Not authenticated" }
    }

    // Check if client exists
    const existingClient = await getClientById(id)
    if (!existingClient) {
      return { success: false, error: "Client not found" }
    }

    // Update the client
    const result = await sql`
      UPDATE "Client"
      SET
        name = ${data.name || existingClient.name},
        "companyName" = ${data.companyName || existingClient.companyName},
        email = ${data.email || existingClient.email},
        phone = ${data.phone || existingClient.phone},
        address = ${data.address || existingClient.address},
        status = ${data.status || existingClient.status},
        "updatedAt" = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    // Log activity
    await sql`
      INSERT INTO "Activity" (
        action, timestamp, "entityId", "entityType", "userId", "clientId", details
      )
      VALUES (
        'update_client', NOW(), ${id}, 'client', ${currentUser.id}, ${id},
        ${JSON.stringify({ name: data.name, updatedBy: currentUser.name })}
      )
    `

    // Revalidate paths
    revalidatePath(`/admin/clients/${id}`)
    revalidatePath("/admin/clients")
    revalidatePath("/admin/dashboard")

    return { success: true, client: result.rows[0] }
  } catch (error) {
    console.error(`Failed to update client ${id}:`, error)
    return { success: false, error: "Failed to update client" }
  }
}

/**
 * Delete a client
 */
export async function deleteClient(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!id) {
      return { success: false, error: "Client ID is required" }
    }

    // Get current user
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return { success: false, error: "Not authenticated" }
    }

    // Check if client exists
    const existingClient = await getClientById(id)
    if (!existingClient) {
      return { success: false, error: "Client not found" }
    }

    // Delete the client
    await sql`
      DELETE FROM "Client"
      WHERE id = ${id}
    `

    // Log activity
    await sql`
      INSERT INTO "Activity" (
        action, timestamp, "entityId", "entityType", "userId", details
      )
      VALUES (
        'delete_client', NOW(), ${id}, 'client', ${currentUser.id},
        ${JSON.stringify({ name: existingClient.name, deletedBy: currentUser.name })}
      )
    `

    // Revalidate paths
    revalidatePath("/admin/clients")
    revalidatePath("/admin/dashboard")

    return { success: true }
  } catch (error) {
    console.error(`Failed to delete client ${id}:`, error)
    return { success: false, error: "Failed to delete client" }
  }
}

// Search clients
export async function searchClients(query: string): Promise<Client[]> {
  try {
    const result = await sql`
      SELECT * FROM "Client"
      WHERE 
        "name" ILIKE ${`%${query}%`} OR
        "companyName" ILIKE ${`%${query}%`} OR
        "email" ILIKE ${`%${query}%`}
      ORDER BY "name" ASC
    `
    return result.rows as Client[]
  } catch (error) {
    console.error("Failed to search clients:", error)
    return []
  }
}

// Get clients by status
export async function getClientsByStatus(status: string): Promise<Client[]> {
  try {
    const result = await sql`
      SELECT * FROM "Client"
      WHERE "status" = ${status}
      ORDER BY "name" ASC
    `
    return result.rows as Client[]
  } catch (error) {
    console.error(`Failed to get clients with status ${status}:`, error)
    return []
  }
}

// Get client statistics
export async function getClientStatistics(): Promise<{
  total: number
  active: number
  inactive: number
  onboarding: number
}> {
  try {
    const totalResult = await sql`SELECT COUNT(*) as count FROM "Client"`
    const activeResult = await sql`SELECT COUNT(*) as count FROM "Client" WHERE status = 'active'`
    const inactiveResult = await sql`SELECT COUNT(*) as count FROM "Client" WHERE status = 'inactive'`
    const onboardingResult = await sql`SELECT COUNT(*) as count FROM "Client" WHERE status = 'onboarding'`

    return {
      total: Number.parseInt(totalResult.rows[0].count),
      active: Number.parseInt(activeResult.rows[0].count),
      inactive: Number.parseInt(inactiveResult.rows[0].count),
      onboarding: Number.parseInt(onboardingResult.rows[0].count),
    }
  } catch (error) {
    console.error("Failed to get client statistics:", error)
    return { total: 0, active: 0, inactive: 0, onboarding: 0 }
  }
}

// Get client by user ID
export async function getClientByUserId(userId: string): Promise<Client | null> {
  try {
    if (!userId) return null

    const result = await sql`
      SELECT * FROM "Client"
      WHERE "userId" = ${userId}
    `
    return result.rows.length > 0 ? result.rows[0] : null
  } catch (error) {
    console.error(`Failed to fetch client for user ${userId}:`, error)
    return null
  }
}
