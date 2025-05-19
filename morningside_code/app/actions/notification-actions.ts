"use server"

import { sql } from "@/lib/db"
import { revalidatePath } from "next/cache"

// Create a new notification
export async function createNotification({
  userId,
  clientId,
  title,
  message,
  type,
  relatedId,
  relatedType,
}: {
  userId?: string
  clientId?: string
  title: string
  message: string
  type: string
  relatedId?: string
  relatedType?: string
}) {
  try {
    const result = await sql`
      INSERT INTO notifications (
        user_id, client_id, title, message, type, related_id, related_type, is_read, created_at
      ) VALUES (
        ${userId || null}, ${clientId || null}, ${title}, ${message}, ${type}, 
        ${relatedId || null}, ${relatedType || null}, false, NOW()
      )
      RETURNING *
    `

    // Revalidate the notifications page
    revalidatePath("/portal/notifications")
    revalidatePath("/admin/notifications")

    return result[0]
  } catch (error) {
    console.error("Error creating notification:", error)
    throw error
  }
}

// Get notifications for a user
export async function getUserNotifications(userId: string, limit = 10) {
  try {
    const notifications = await sql`
      SELECT * FROM notifications 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `
    return notifications
  } catch (error) {
    console.error("Error fetching user notifications:", error)
    throw error
  }
}

// Get notifications for a client
export async function getClientNotifications(clientId: string, limit = 10) {
  try {
    const notifications = await sql`
      SELECT * FROM notifications 
      WHERE client_id = ${clientId}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `
    return notifications
  } catch (error) {
    console.error("Error fetching client notifications:", error)
    throw error
  }
}

// Mark a notification as read
export async function markNotificationAsRead(notificationId: string) {
  try {
    await sql`
      UPDATE notifications
      SET is_read = true
      WHERE id = ${notificationId}
    `

    // Revalidate the notifications page
    revalidatePath("/portal/notifications")
    revalidatePath("/admin/notifications")

    return { success: true }
  } catch (error) {
    console.error("Error marking notification as read:", error)
    throw error
  }
}

// Mark all notifications as read for a user
export async function markAllNotificationsAsRead(userId: string) {
  try {
    await sql`
      UPDATE notifications
      SET is_read = true
      WHERE user_id = ${userId}
    `

    // Revalidate the notifications page
    revalidatePath("/portal/notifications")
    revalidatePath("/admin/notifications")

    return { success: true }
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
    throw error
  }
}

// Mark all notifications as read for a client
export async function markAllClientNotificationsAsRead(clientId: string) {
  try {
    await sql`
      UPDATE notifications
      SET is_read = true
      WHERE client_id = ${clientId}
    `

    // Revalidate the notifications page
    revalidatePath("/portal/notifications")
    revalidatePath("/admin/notifications")

    return { success: true }
  } catch (error) {
    console.error("Error marking all client notifications as read:", error)
    throw error
  }
}
