"use server"

import { sql } from "@/lib/db"
import { revalidatePath } from "next/cache"

export type Activity = {
  id: string
  action: string
  timestamp: Date
  entityId: string | null
  entityType: string | null
  userId: string | null
  clientId: string | null
  projectId: string | null
  details: Record<string, any> | null
}

// Get recent activities
export async function getRecentActivities(limit = 10): Promise<Activity[]> {
  try {
    const result = await sql`
      SELECT * FROM "Activity"
      ORDER BY "timestamp" DESC
      LIMIT ${limit}
    `
    return result.rows as Activity[]
  } catch (error) {
    console.error("Failed to get recent activities:", error)
    return []
  }
}

// Get activities for a specific entity
export async function getEntityActivities(entityId: string, entityType: string): Promise<Activity[]> {
  try {
    const result = await sql`
      SELECT * FROM "Activity"
      WHERE "entityId" = ${entityId} AND "entityType" = ${entityType}
      ORDER BY "timestamp" DESC
    `
    return result.rows as Activity[]
  } catch (error) {
    console.error(`Failed to get activities for ${entityType} ${entityId}:`, error)
    return []
  }
}

// Get activities for a specific project
export async function getProjectActivities(projectId: string, limit = 20): Promise<Activity[]> {
  try {
    const result = await sql`
      SELECT * FROM "Activity"
      WHERE "entityId" = ${projectId} AND "entityType" = 'project'
      ORDER BY "timestamp" DESC
      LIMIT ${limit}
    `
    return result.rows as Activity[]
  } catch (error) {
    console.error(`Failed to get activities for project ${projectId}:`, error)
    return []
  }
}

// Get activities for a specific client
export async function getClientActivities(clientId: string, limit = 20): Promise<Activity[]> {
  try {
    const result = await sql`
      SELECT * FROM "Activity"
      WHERE "entityId" = ${clientId} AND "entityType" = 'client'
      ORDER BY "timestamp" DESC
      LIMIT ${limit}
    `
    return result.rows as Activity[]
  } catch (error) {
    console.error(`Failed to get activities for client ${clientId}:`, error)
    return []
  }
}

// Log a new activity
export async function createActivity(data: {
  action: string
  details: string
  entityType: string
  entityId: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    await sql`
      INSERT INTO "Activity" (
        "action",
        "details",
        "entityId",
        "entityType",
        "timestamp"
      )
      VALUES (
        ${data.action},
        ${data.details},
        ${data.entityId},
        ${data.entityType},
        NOW()
      )
    `
    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Failed to create activity:", error)
    return { success: false, error: "Failed to create activity" }
  }
}

// Log project activity
export async function logProjectActivity(
  userId: string,
  projectId: string,
  action: string,
  details: Record<string, any> = {},
): Promise<void> {
  try {
    await sql`
      INSERT INTO "Activity" (
        "action", "timestamp", "entityId", "entityType", "userId", "projectId", "details"
      )
      VALUES (
        ${action}, NOW(), ${projectId}, 'project', ${userId}, ${projectId}, ${details}
      )
    `
  } catch (error) {
    console.error("Failed to log project activity:", error)
  }
}
