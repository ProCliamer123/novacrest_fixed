"use server"

import { sql } from "@/lib/db"

type AnalyticsData = {
  totalClients: number
  activeProjects: number
  completedProjects: number
  projectsAtRisk: number
  recentClients: Array<{
    id: string
    name: string
    companyName: string
    createdAt: Date
  }>
  recentProjects: Array<{
    id: string
    name: string
    status: string
    clientName: string
    createdAt: Date
  }>
  projectsByStatus: Array<{
    status: string
    count: number
  }>
}

export async function getAnalytics(): Promise<AnalyticsData> {
  try {
    // Get total clients
    const clientsResult = await sql`
      SELECT COUNT(*) as count FROM "Client"
    `
    const totalClients = Number.parseInt(clientsResult.rows[0]?.count || "0", 10)

    // Get active projects (status = 'in_progress')
    const activeProjectsResult = await sql`
      SELECT COUNT(*) as count FROM "Project"
      WHERE status = 'in_progress'
    `
    const activeProjects = Number.parseInt(activeProjectsResult.rows[0]?.count || "0", 10)

    // Get completed projects
    const completedProjectsResult = await sql`
      SELECT COUNT(*) as count FROM "Project"
      WHERE status = 'completed'
    `
    const completedProjects = Number.parseInt(completedProjectsResult.rows[0]?.count || "0", 10)

    // Get projects at risk (status = 'on_hold' or past due date)
    const projectsAtRiskResult = await sql`
      SELECT COUNT(*) as count FROM "Project"
      WHERE status = 'on_hold' 
      OR (CAST("endDate" AS DATE) < CURRENT_DATE AND status != 'completed')
    `
    const projectsAtRisk = Number.parseInt(projectsAtRiskResult.rows[0]?.count || "0", 10)

    // Get recent clients
    const recentClientsResult = await sql`
      SELECT id, name, "companyName", "createdAt"
      FROM "Client"
      ORDER BY "createdAt" DESC
      LIMIT 5
    `
    const recentClients = recentClientsResult.rows

    // Get recent projects with client names
    const recentProjectsResult = await sql`
      SELECT p.id, p.name, p.status, c.name as "clientName", p."createdAt"
      FROM "Project" p
      JOIN "Client" c ON p."clientId" = c.id
      ORDER BY p."createdAt" DESC
      LIMIT 5
    `
    const recentProjects = recentProjectsResult.rows

    // Get projects by status
    const projectsByStatusResult = await sql`
      SELECT status, COUNT(*) as count
      FROM "Project"
      GROUP BY status
      ORDER BY count DESC
    `
    const projectsByStatus = projectsByStatusResult.rows

    return {
      totalClients,
      activeProjects,
      completedProjects,
      projectsAtRisk,
      recentClients,
      recentProjects,
      projectsByStatus,
    }
  } catch (error) {
    console.error("Failed to get analytics:", error)
    // Return default values instead of throwing an error
    return {
      totalClients: 0,
      activeProjects: 0,
      completedProjects: 0,
      projectsAtRisk: 0,
      recentClients: [],
      recentProjects: [],
      projectsByStatus: [],
    }
  }
}
