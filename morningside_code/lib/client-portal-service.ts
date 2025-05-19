import { db } from "@/lib/db"
import { cache } from "@/lib/cache"

// Get all data for a client
export async function getClientData(clientId: string) {
  // Try to get from cache first
  const cacheKey = `client-data-${clientId}`
  const cachedData = cache.get(cacheKey)

  if (cachedData) {
    return cachedData
  }

  try {
    // Get client details
    const client = await db.query(
      `
      SELECT * FROM clients WHERE id = $1
    `,
      [clientId],
    )

    if (!client.rows.length) {
      throw new Error("Client not found")
    }

    // Get client projects
    const projects = await db.query(
      `
      SELECT * FROM projects WHERE client_id = $1 ORDER BY created_at DESC
    `,
      [clientId],
    )

    // Get client milestones
    const milestones = await db.query(
      `
      SELECT m.* FROM milestones m
      JOIN projects p ON m.project_id = p.id
      WHERE p.client_id = $1
      ORDER BY m.due_date ASC
    `,
      [clientId],
    )

    // Get client resources
    const resources = await db.query(
      `
      SELECT r.* FROM resources r
      JOIN projects p ON r.project_id = p.id
      WHERE p.client_id = $1
      ORDER BY r.created_at DESC
    `,
      [clientId],
    )

    // Get client activities
    const activities = await db.query(
      `
      SELECT a.* FROM activities a
      JOIN projects p ON a.project_id = p.id
      WHERE p.client_id = $1
      ORDER BY a.created_at DESC
      LIMIT 10
    `,
      [clientId],
    )

    // Calculate project stats
    const projectStats = {
      total: projects.rows.length,
      active: projects.rows.filter((p) => p.status === "in_progress").length,
      completed: projects.rows.filter((p) => p.status === "completed").length,
      pending: projects.rows.filter((p) => p.status === "pending").length,
    }

    // Calculate milestone stats
    const milestoneStats = {
      total: milestones.rows.length,
      upcoming: milestones.rows.filter((m) => new Date(m.due_date) > new Date()).length,
      completed: milestones.rows.filter((m) => m.status === "completed").length,
      overdue: milestones.rows.filter((m) => new Date(m.due_date) < new Date() && m.status !== "completed").length,
    }

    const clientData = {
      client: client.rows[0],
      projects: projects.rows,
      milestones: milestones.rows,
      resources: resources.rows,
      activities: activities.rows,
      projectStats,
      milestoneStats,
    }

    // Cache the data for 5 minutes
    cache.set(cacheKey, clientData, 5 * 60)

    return clientData
  } catch (error) {
    console.error("Error fetching client data:", error)
    throw error
  }
}

// Get client projects
export async function getClientProjects(clientId: string) {
  const cacheKey = `client-projects-${clientId}`
  const cachedData = cache.get(cacheKey)

  if (cachedData) {
    return cachedData
  }

  try {
    const result = await db.query(
      `
      SELECT * FROM projects WHERE client_id = $1 ORDER BY created_at DESC
    `,
      [clientId],
    )

    // Cache the data for 5 minutes
    cache.set(cacheKey, result.rows, 5 * 60)

    return result.rows
  } catch (error) {
    console.error("Error fetching client projects:", error)
    throw error
  }
}

// Get client resources
export async function getClientResources(clientId: string) {
  const cacheKey = `client-resources-${clientId}`
  const cachedData = cache.get(cacheKey)

  if (cachedData) {
    return cachedData
  }

  try {
    const result = await db.query(
      `
      SELECT r.* FROM resources r
      JOIN projects p ON r.project_id = p.id
      WHERE p.client_id = $1
      ORDER BY r.created_at DESC
    `,
      [clientId],
    )

    // Cache the data for 5 minutes
    cache.set(cacheKey, result.rows, 5 * 60)

    return result.rows
  } catch (error) {
    console.error("Error fetching client resources:", error)
    throw error
  }
}

// Get client milestones
export async function getClientMilestones(clientId: string) {
  const cacheKey = `client-milestones-${clientId}`
  const cachedData = cache.get(cacheKey)

  if (cachedData) {
    return cachedData
  }

  try {
    const result = await db.query(
      `
      SELECT m.*, p.name as project_name FROM milestones m
      JOIN projects p ON m.project_id = p.id
      WHERE p.client_id = $1
      ORDER BY m.due_date ASC
    `,
      [clientId],
    )

    // Cache the data for 5 minutes
    cache.set(cacheKey, result.rows, 5 * 60)

    return result.rows
  } catch (error) {
    console.error("Error fetching client milestones:", error)
    throw error
  }
}

// Get client notifications
export async function getClientNotifications(clientId: string) {
  const cacheKey = `client-notifications-${clientId}`
  const cachedData = cache.get(cacheKey)

  if (cachedData) {
    return cachedData
  }

  try {
    const result = await db.query(
      `
      SELECT n.* FROM notifications n
      WHERE n.recipient_id = $1
      ORDER BY n.created_at DESC
      LIMIT 20
    `,
      [clientId],
    )

    // Cache the data for 1 minute (shorter time for notifications)
    cache.set(cacheKey, result.rows, 1 * 60)

    return result.rows
  } catch (error) {
    console.error("Error fetching client notifications:", error)
    throw error
  }
}

// Mark notification as read
export async function markNotificationAsRead(notificationId: string) {
  try {
    await db.query(
      `
      UPDATE notifications SET read = true WHERE id = $1
    `,
      [notificationId],
    )

    return { success: true }
  } catch (error) {
    console.error("Error marking notification as read:", error)
    throw error
  }
}
