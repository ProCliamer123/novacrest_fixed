"use server"

import { sql } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { getCurrentUser } from "./auth-actions"

// Validation schema for resource creation
const createResourceSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters" }),
  description: z.string().optional(),
  url: z.string().url({ message: "Please enter a valid URL" }),
  type: z.enum(["document", "image", "video", "link", "other"]),
  clientId: z.string().uuid({ message: "Valid client ID is required" }),
})

// Create a new resource
export async function createResource(data: z.infer<typeof createResourceSchema>) {
  try {
    // Validate input data
    const validatedData = createResourceSchema.parse(data)

    // Get current user
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return { success: false, error: "Not authenticated" }
    }

    // Insert the resource
    const result = await sql`
      INSERT INTO "Resource" (
        title, description, url, type, "clientId", "createdAt", "updatedAt"
      )
      VALUES (
        ${validatedData.title}, 
        ${validatedData.description || null}, 
        ${validatedData.url}, 
        ${validatedData.type},
        ${validatedData.clientId},
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
        'create_resource', NOW(), ${result[0].id}, 'resource', ${currentUser.id}, 
        ${validatedData.clientId},
        ${JSON.stringify({ title: validatedData.title, createdBy: currentUser.name })}
      )
    `

    // Revalidate paths
    revalidatePath("/admin/resources")
    revalidatePath(`/admin/clients/${validatedData.clientId}`)
    revalidatePath("/portal/resources")

    return { success: true, resource: result[0] }
  } catch (error) {
    console.error("Failed to create resource:", error)
    return {
      success: false,
      error:
        error instanceof z.ZodError
          ? error.errors.map((e) => `${e.path}: ${e.message}`).join(", ")
          : "Failed to create resource",
    }
  }
}

// Update a resource
export async function updateResource(id: string, data: any) {
  try {
    if (!id) {
      return { success: false, error: "Resource ID is required" }
    }

    // Get current user
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return { success: false, error: "Not authenticated" }
    }

    // Check if resource exists
    const existingResource = await getResourceById(id)
    if (!existingResource) {
      return { success: false, error: "Resource not found" }
    }

    // Update the resource
    const result = await sql`
      UPDATE "Resource"
      SET
        title = ${data.title || existingResource.title},
        description = ${data.description !== undefined ? data.description : existingResource.description},
        url = ${data.url || existingResource.url},
        type = ${data.type || existingResource.type},
        "clientId" = ${data.clientId || existingResource.clientId},
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
        'update_resource', NOW(), ${id}, 'resource', ${currentUser.id}, 
        ${result[0].clientId},
        ${JSON.stringify({ title: data.title, updatedBy: currentUser.name })}
      )
    `

    // Revalidate paths
    revalidatePath(`/admin/resources/${id}`)
    revalidatePath("/admin/resources")
    revalidatePath(`/admin/clients/${result[0].clientId}`)
    revalidatePath("/portal/resources")

    return { success: true, resource: result[0] }
  } catch (error) {
    console.error(`Failed to update resource ${id}:`, error)
    return { success: false, error: "Failed to update resource" }
  }
}

// Delete a resource
export async function deleteResource(id: string) {
  try {
    if (!id) {
      return { success: false, error: "Resource ID is required" }
    }

    // Get current user
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return { success: false, error: "Not authenticated" }
    }

    // Check if resource exists
    const existingResource = await getResourceById(id)
    if (!existingResource) {
      return { success: false, error: "Resource not found" }
    }

    // Delete the resource
    await sql`
      DELETE FROM "Resource"
      WHERE id = ${id}
    `

    // Log activity
    await sql`
      INSERT INTO "Activity" (
        action, timestamp, "entityId", "entityType", "userId", "clientId", details
      )
      VALUES (
        'delete_resource', NOW(), ${id}, 'resource', ${currentUser.id}, ${existingResource.clientId},
        ${JSON.stringify({ title: existingResource.title, deletedBy: currentUser.name })}
      )
    `

    // Revalidate paths
    revalidatePath("/admin/resources")
    revalidatePath(`/admin/clients/${existingResource.clientId}`)
    revalidatePath("/portal/resources")

    return { success: true }
  } catch (error) {
    console.error(`Failed to delete resource ${id}:`, error)
    return { success: false, error: "Failed to delete resource" }
  }
}

// Get all resources
export async function getResources() {
  try {
    const result = await sql`
      SELECT r.*, c.name as client_name
      FROM "Resource" r
      LEFT JOIN "Client" c ON r."clientId" = c.id
      ORDER BY r."createdAt" DESC
    `
    return result
  } catch (error) {
    console.error("Failed to fetch resources:", error)
    return []
  }
}

// Get resource by ID
export async function getResourceById(id: string) {
  try {
    if (!id) return null

    const result = await sql`
      SELECT r.*, c.name as client_name
      FROM "Resource" r
      LEFT JOIN "Client" c ON r."clientId" = c.id
      WHERE r.id = ${id}
    `
    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error(`Failed to fetch resource ${id}:`, error)
    return null
  }
}

// Get resources by client ID
export async function getResourcesByClientId(clientId: string) {
  try {
    if (!clientId) return []

    const result = await sql`
      SELECT r.*, c.name as client_name
      FROM "Resource" r
      LEFT JOIN "Client" c ON r."clientId" = c.id
      WHERE r."clientId" = ${clientId}
      ORDER BY r."createdAt" DESC
    `
    return result
  } catch (error) {
    console.error(`Failed to fetch resources for client ${clientId}:`, error)
    return []
  }
}

// Get resources by project ID
export async function getResourcesByProjectId(projectId: string) {
  try {
    if (!projectId) return []

    const result = await sql`
      SELECT r.*, c.name as client_name
      FROM "Resource" r
      LEFT JOIN "Client" c ON r."clientId" = c.id
      WHERE r."projectId" = ${projectId}
      ORDER BY r."createdAt" DESC
    `
    return result
  } catch (error) {
    console.error(`Failed to fetch resources for project ${projectId}:`, error)
    return []
  }
}
