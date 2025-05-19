"use server"

import { sql } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { createNotification } from "./notification-actions"

// Create a new milestone
export async function createMilestone(formData: FormData) {
  try {
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const projectId = formData.get("projectId") as string
    const status = formData.get("status") as string
    const dueDate = formData.get("dueDate") as string

    // Get client ID for the project
    const projectResult = await sql`
      SELECT client_id FROM projects WHERE id = ${projectId}
    `
    const clientId = projectResult[0]?.client_id

    const result = await sql`
      INSERT INTO milestones (
        title, description, project_id, status, due_date, created_at, updated_at
      ) VALUES (
        ${title}, ${description}, ${projectId}, ${status}, ${dueDate}, NOW(), NOW()
      )
      RETURNING *
    `

    // Create a notification for the client
    if (clientId) {
      await createNotification({
        clientId,
        title: "New Milestone Created",
        message: `A new milestone "${title}" has been created for your project.`,
        type: "milestone_created",
        relatedId: result[0].id,
        relatedType: "milestone",
      })
    }

    // Create an activity record
    await sql`
      INSERT INTO activities (
        action, description, user_id, project_id, created_at
      ) VALUES (
        'milestone_created', ${`Milestone "${title}" created`}, ${formData.get("userId") as string}, ${projectId}, NOW()
      )
    `

    revalidatePath(`/admin/projects/${projectId}`)
    return { success: true, milestone: result[0] }
  } catch (error) {
    console.error("Error creating milestone:", error)
    return { success: false, error: "Failed to create milestone" }
  }
}

// Update a milestone
export async function updateMilestone(formData: FormData) {
  try {
    const id = formData.get("id") as string
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const projectId = formData.get("projectId") as string
    const status = formData.get("status") as string
    const dueDate = formData.get("dueDate") as string
    const previousStatus = formData.get("previousStatus") as string

    // Get client ID for the project
    const projectResult = await sql`
      SELECT client_id FROM projects WHERE id = ${projectId}
    `
    const clientId = projectResult[0]?.client_id

    const result = await sql`
      UPDATE milestones
      SET title = ${title},
          description = ${description},
          status = ${status},
          due_date = ${dueDate},
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    // Create a notification for the client if status changed to completed
    if (clientId && previousStatus !== "completed" && status === "completed") {
      await createNotification({
        clientId,
        title: "Milestone Completed",
        message: `The milestone "${title}" has been marked as completed.`,
        type: "milestone_completed",
        relatedId: id,
        relatedType: "milestone",
      })
    } else if (clientId) {
      await createNotification({
        clientId,
        title: "Milestone Updated",
        message: `The milestone "${title}" has been updated.`,
        type: "milestone_updated",
        relatedId: id,
        relatedType: "milestone",
      })
    }

    // Create an activity record
    await sql`
      INSERT INTO activities (
        action, description, user_id, project_id, created_at
      ) VALUES (
        'milestone_updated', ${`Milestone "${title}" updated`}, ${formData.get("userId") as string}, ${projectId}, NOW()
      )
    `

    revalidatePath(`/admin/projects/${projectId}`)
    return { success: true, milestone: result[0] }
  } catch (error) {
    console.error("Error updating milestone:", error)
    return { success: false, error: "Failed to update milestone" }
  }
}

// Delete a milestone
export async function deleteMilestone(formData: FormData) {
  try {
    const id = formData.get("id") as string
    const projectId = formData.get("projectId") as string
    const milestoneName = formData.get("milestoneName") as string

    // Get client ID for the project
    const projectResult = await sql`
      SELECT client_id FROM projects WHERE id = ${projectId}
    `
    const clientId = projectResult[0]?.client_id

    // Delete the milestone
    await sql`DELETE FROM milestones WHERE id = ${id}`

    // Create a notification for the client
    if (clientId) {
      await createNotification({
        clientId,
        title: "Milestone Deleted",
        message: `The milestone "${milestoneName}" has been deleted.`,
        type: "milestone_deleted",
        relatedType: "milestone",
      })
    }

    // Create an activity record
    await sql`
      INSERT INTO activities (
        action, description, user_id, project_id, created_at
      ) VALUES (
        'milestone_deleted', ${`Milestone "${milestoneName}" deleted`}, ${formData.get("userId") as string}, ${projectId}, NOW()
      )
    `

    revalidatePath(`/admin/projects/${projectId}`)
    return { success: true }
  } catch (error) {
    console.error("Error deleting milestone:", error)
    return { success: false, error: "Failed to delete milestone" }
  }
}

// Get milestones by project ID
export async function getMilestonesByProjectId(projectId: string) {
  try {
    const milestones = await sql`
      SELECT * FROM milestones
      WHERE project_id = ${projectId}
      ORDER BY due_date ASC
    `
    return milestones
  } catch (error) {
    console.error("Error fetching milestones:", error)
    throw error
  }
}

// Get a milestone by ID
export async function getMilestoneById(id: string) {
  try {
    const milestone = await sql`
      SELECT * FROM milestones
      WHERE id = ${id}
    `
    return milestone[0]
  } catch (error) {
    console.error("Error fetching milestone:", error)
    throw error
  }
}
