"use server"

import { revalidatePath } from "next/cache"
import { query } from "@/lib/db"
import { getUserFromRequest } from "@/lib/auth"
import { cookies } from "next/headers"

// Get client information for the logged-in user
export async function getClientForUser() {
  const user = await getUserFromRequest(cookies())
  if (!user || user.role !== "client") {
    return null
  }

  // Get the client associated with this user
  const clients = await query(
    `
    SELECT c.* 
    FROM "Client" c
    JOIN "ClientUser" cu ON c.id = cu."clientId"
    WHERE cu."userId" = $1
    LIMIT 1
  `,
    [user.id],
  )

  return clients.length > 0 ? clients[0] : null
}

// Get projects for the client of the logged-in user
export async function getProjectsForClient() {
  const user = await getUserFromRequest(cookies())
  if (!user || user.role !== "client") {
    return []
  }

  // Get the client ID for this user
  const clients = await query(
    `
    SELECT c.id 
    FROM "Client" c
    JOIN "ClientUser" cu ON c.id = cu."clientId"
    WHERE cu."userId" = $1
    LIMIT 1
  `,
    [user.id],
  )

  if (clients.length === 0) {
    return []
  }

  const clientId = clients[0].id

  // Get projects for this client
  const projects = await query(
    `
    SELECT * 
    FROM "Project"
    WHERE "clientId" = $1
    ORDER BY "updatedAt" DESC
  `,
    [clientId],
  )

  return projects
}

// Get resources for the client of the logged-in user
export async function getResourcesForClient() {
  const user = await getUserFromRequest(cookies())
  if (!user || user.role !== "client") {
    return []
  }

  // Get the client ID for this user
  const clients = await query(
    `
    SELECT c.id 
    FROM "Client" c
    JOIN "ClientUser" cu ON c.id = cu."clientId"
    WHERE cu."userId" = $1
    LIMIT 1
  `,
    [user.id],
  )

  if (clients.length === 0) {
    return []
  }

  const clientId = clients[0].id

  // Get resources for this client
  const resources = await query(
    `
    SELECT r.* 
    FROM "Resource" r
    JOIN "ClientResource" cr ON r.id = cr."resourceId"
    WHERE cr."clientId" = $1
    ORDER BY r."createdAt" DESC
  `,
    [clientId],
  )

  return resources
}

// Get recent activities for the client of the logged-in user
export async function getActivitiesForClient(limit = 5) {
  const user = await getUserFromRequest(cookies())
  if (!user || user.role !== "client") {
    return []
  }

  // Get the client ID for this user
  const clients = await query(
    `
    SELECT c.id 
    FROM "Client" c
    JOIN "ClientUser" cu ON c.id = cu."clientId"
    WHERE cu."userId" = $1
    LIMIT 1
  `,
    [user.id],
  )

  if (clients.length === 0) {
    return []
  }

  const clientId = clients[0].id

  // Get activities for this client
  const activities = await query(
    `
    SELECT * 
    FROM "Activity"
    WHERE "entityId" = $1 OR "details"->>'clientId' = $1
    ORDER BY "timestamp" DESC
    LIMIT $2
  `,
    [clientId, limit],
  )

  return activities
}

// Submit feedback from client
export async function submitClientFeedback(formData: FormData) {
  const user = await getUserFromRequest(cookies())
  if (!user || user.role !== "client") {
    throw new Error("Unauthorized")
  }

  const feedback = formData.get("feedback") as string
  const category = formData.get("category") as string

  if (!feedback || !category) {
    throw new Error("Feedback and category are required")
  }

  // Get the client ID for this user
  const clients = await query(
    `
    SELECT c.id 
    FROM "Client" c
    JOIN "ClientUser" cu ON c.id = cu."clientId"
    WHERE cu."userId" = $1
    LIMIT 1
  `,
    [user.id],
  )

  if (clients.length === 0) {
    throw new Error("Client not found")
  }

  const clientId = clients[0].id

  // Insert feedback as an activity
  await query(
    `
    INSERT INTO "Activity" (
      "id", "action", "timestamp", "entityId", "entityType", "userId", "details"
    )
    VALUES (
      gen_random_uuid(), $1, $2, $3, $4, $5, $6
    )
  `,
    ["Submitted Feedback", new Date(), clientId, "client", user.id, { feedback, category, clientId }],
  )

  revalidatePath("/portal/feedback")
  return { success: true }
}
