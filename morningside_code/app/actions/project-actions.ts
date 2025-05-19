"use server"

import { sql } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { getCurrentUser } from "./auth-actions"

// Validation schema for project creation
const createProjectSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string().optional(),
  clientId: z.string().uuid({ message: "Valid client ID is required" }),
  status: z.enum(["planning", "active", "on-hold", "completed", "cancelled"]),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  budget: z.number().optional(),
  managerId: z.string().optional(),
})

// Get all projects
export async function getProjects() {
  try {
    const result = await sql`
      SELECT p.*, c.name as client_name
      FROM "Project" p
      LEFT JOIN "Client" c ON p."clientId" = c.id
      ORDER BY p."createdAt" DESC
    `
    return result
  } catch (error) {
    console.error("Failed to fetch projects:", error)
    return []
  }
}

// Get project by ID
export async function getProjectById(id: string) {
  try {
    if (!id) return null

    const result = await sql`
      SELECT p.*, c.name as client_name
      FROM "Project" p
      LEFT JOIN "Client" c ON p."clientId" = c.id
      WHERE p.id = ${id}
    `
    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error(`Failed to fetch project ${id}:`, error)
    return null
  }
}

// Get projects by client ID
export async function getProjectsByClientId(clientId: string) {
  try {
    if (!clientId) return []

    const result = await sql`
      SELECT p.*, c.name as client_name
      FROM "Project" p
      LEFT JOIN "Client" c ON p."clientId" = c.id
      WHERE p."clientId" = ${clientId}
      ORDER BY p."createdAt" DESC
    `
    return result
  } catch (error) {
    console.error(`Failed to fetch projects for client ${clientId}:`, error)
    return []
  }
}

// Create a new project
export async function createProject(data: z.infer<typeof createProjectSchema>) {
  try {
    // Validate input data
    const validatedData = createProjectSchema.parse(data)

    // Get current user
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return { success: false, error: "Not authenticated" }
    }

    // Parse dates
    const startDate = validatedData.startDate ? new Date(validatedData.startDate) : null
    const endDate = validatedData.endDate ? new Date(validatedData.endDate) : null

    // Insert the project
    const result = await sql`
      INSERT INTO "Project" (
        name, description, "clientId", status, "startDate", "endDate", 
        budget, "managerId", "createdAt", "updatedAt"
      )
      VALUES (
        ${validatedData.name}, 
        ${validatedData.description || null}, 
        ${validatedData.clientId}, 
        ${validatedData.status},
        ${startDate},
        ${endDate},
        ${validatedData.budget || null},
        ${validatedData.managerId || null},
        NOW(), 
        NOW()
      )
      RETURNING *
    `

    // Log activity
    await sql`
      INSERT INTO "Activity" (
        action, timestamp, "entityId", "entityType", "userId", "clientId", "projectId", details
      )
      VALUES (
        'create_project', NOW(), ${result[0].id}, 'project', ${currentUser.id}, 
        ${validatedData.clientId}, ${result[0].id},
        ${JSON.stringify({ name: validatedData.name, createdBy: currentUser.name })}
      )
    `

    // Revalidate paths
    revalidatePath("/admin/projects")
    revalidatePath(`/admin/clients/${validatedData.clientId}`)
    revalidatePath("/admin/dashboard")

    return { success: true, project: result[0] }
  } catch (error) {
    console.error("Failed to create project:", error)
    return {
      success: false,
      error:
        error instanceof z.ZodError
          ? error.errors.map((e) => `${e.path}: ${e.message}`).join(", ")
          : "Failed to create project",
    }
  }
}

// Update a project
export async function updateProject(id: string, data: any) {
  try {
    if (!id) {
      return { success: false, error: "Project ID is required" }
    }

    // Get current user
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return { success: false, error: "Not authenticated" }
    }

    // Check if project exists
    const existingProject = await getProjectById(id)
    if (!existingProject) {
      return { success: false, error: "Project not found" }
    }

    // Parse dates
    const startDate = data.startDate ? new Date(data.startDate) : existingProject.startDate
    const endDate = data.endDate ? new Date(data.endDate) : existingProject.endDate

    // Update the project
    const result = await sql`
      UPDATE "Project"
      SET
        name = ${data.name || existingProject.name},
        description = ${data.description !== undefined ? data.description : existingProject.description},
        "clientId" = ${data.clientId || existingProject.clientId},
        status = ${data.status || existingProject.status},
        "startDate" = ${startDate},
        "endDate" = ${endDate},
        budget = ${data.budget !== undefined ? data.budget : existingProject.budget},
        "managerId" = ${data.managerId !== undefined ? data.managerId : existingProject.managerId},
        "updatedAt" = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    // Log activity
    await sql`
      INSERT INTO "Activity" (
        action, timestamp, "entityId", "entityType", "userId", "clientId", "projectId", details
      )
      VALUES (
        'update_project', NOW(), ${id}, 'project', ${currentUser.id}, 
        ${result[0].clientId}, ${id},
        ${JSON.stringify({ name: data.name, updatedBy: currentUser.name })}
      )
    `

    // Revalidate paths
    revalidatePath(`/admin/projects/${id}`)
    revalidatePath("/admin/projects")
    revalidatePath(`/admin/clients/${result[0].clientId}`)
    revalidatePath("/admin/dashboard")

    return { success: true, project: result[0] }
  } catch (error) {
    console.error(`Failed to update project ${id}:`, error)
    return { success: false, error: "Failed to update project" }
  }
}

// Delete a project
export async function deleteProject(id: string) {
  try {
    if (!id) {
      return { success: false, error: "Project ID is required" }
    }

    // Get current user
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return { success: false, error: "Not authenticated" }
    }

    // Check if project exists
    const existingProject = await getProjectById(id)
    if (!existingProject) {
      return { success: false, error: "Project not found" }
    }

    // Delete the project
    await sql`
      DELETE FROM "Project"
      WHERE id = ${id}
    `

    // Log activity
    await sql`
      INSERT INTO "Activity" (
        action, timestamp, "entityId", "entityType", "userId", "clientId", details
      )
      VALUES (
        'delete_project', NOW(), ${id}, 'project', ${currentUser.id}, ${existingProject.clientId},
        ${JSON.stringify({ name: existingProject.name, deletedBy: currentUser.name })}
      )
    `

    // Revalidate paths
    revalidatePath("/admin/projects")
    revalidatePath(`/admin/clients/${existingProject.clientId}`)
    revalidatePath("/admin/dashboard")

    return { success: true }
  } catch (error) {
    console.error(`Failed to delete project ${id}:`, error)
    return { success: false, error: "Failed to delete project" }
  }
}

// Get project statistics
export async function getProjectStatistics() {
  try {
    const totalResult = await sql`SELECT COUNT(*) as count FROM "Project"`
    const planningResult = await sql`SELECT COUNT(*) as count FROM "Project" WHERE status = 'planning'`
    const activeResult = await sql`SELECT COUNT(*) as count FROM "Project" WHERE status = 'active'`
    const onHoldResult = await sql`SELECT COUNT(*) as count FROM "Project" WHERE status = 'on-hold'`
    const completedResult = await sql`SELECT COUNT(*) as count FROM "Project" WHERE status = 'completed'`
    const cancelledResult = await sql`SELECT COUNT(*) as count FROM "Project" WHERE status = 'cancelled'`

    return {
      total: Number.parseInt(totalResult[0].count),
      planning: Number.parseInt(planningResult[0].count),
      active: Number.parseInt(activeResult[0].count),
      onHold: Number.parseInt(onHoldResult[0].count),
      completed: Number.parseInt(completedResult[0].count),
      cancelled: Number.parseInt(cancelledResult[0].count),
    }
  } catch (error) {
    console.error("Failed to get project statistics:", error)
    return { total: 0, planning: 0, active: 0, onHold: 0, completed: 0, cancelled: 0 }
  }
}
