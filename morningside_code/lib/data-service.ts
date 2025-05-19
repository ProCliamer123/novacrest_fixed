"use server"

import { neon } from "@neondatabase/serverless"
import { revalidatePath } from "next/cache"

// Initialize database connection
const db = neon(process.env.DATABASE_URL!)

// Client types
export type Client = {
  id: string
  name: string
  email: string
  company: string
  status: string
  created_at: Date
  updated_at: Date
  logo_url?: string
  industry?: string
  contact_name?: string
  contact_phone?: string
  notes?: string
}

// Project types
export type Project = {
  id: string
  name: string
  client_id: string
  status: string
  description: string
  start_date: Date
  end_date?: Date
  created_at: Date
  updated_at: Date
  client_name?: string
}

// Milestone types
export type Milestone = {
  id: string
  project_id: string
  title: string
  description: string
  status: string
  due_date: Date
  completed_date?: Date
  created_at: Date
  updated_at: Date
}

// Resource types
export type Resource = {
  id: string
  title: string
  description: string
  url: string
  type: string
  client_id?: string
  created_at: Date
  updated_at: Date
}

// Activity types
export type Activity = {
  id: string
  user_id: string
  action: string
  entity_type: string
  entity_id: string
  details?: string
  created_at: Date
  user_name?: string
}

// Client functions
export async function getClients(): Promise<Client[]> {
  try {
    const result = await db`
      SELECT * FROM clients 
      ORDER BY created_at DESC
    `
    return result as Client[]
  } catch (error) {
    console.error("Error fetching clients:", error)
    throw new Error("Failed to fetch clients")
  }
}

export async function getClientById(id: string): Promise<Client | null> {
  try {
    const result = await db`
      SELECT * FROM clients 
      WHERE id = ${id}
    `
    return result.length > 0 ? (result[0] as Client) : null
  } catch (error) {
    console.error(`Error fetching client ${id}:`, error)
    throw new Error("Failed to fetch client")
  }
}

export async function createClient(client: Omit<Client, "id" | "created_at" | "updated_at">): Promise<Client> {
  try {
    const result = await db`
      INSERT INTO clients (
        name, email, company, status, 
        logo_url, industry, contact_name, contact_phone, notes
      ) 
      VALUES (
        ${client.name}, ${client.email}, ${client.company}, ${client.status}, 
        ${client.logo_url || null}, ${client.industry || null}, 
        ${client.contact_name || null}, ${client.contact_phone || null}, 
        ${client.notes || null}
      )
      RETURNING *
    `
    revalidatePath("/admin/clients")
    return result[0] as Client
  } catch (error) {
    console.error("Error creating client:", error)
    throw new Error("Failed to create client")
  }
}

export async function updateClient(id: string, client: Partial<Client>): Promise<Client> {
  try {
    // Build dynamic SET clause
    const updates = Object.entries(client)
      .filter(([_, value]) => value !== undefined)
      .map(([key, _]) => `${key} = $${key}`)
      .join(", ")

    if (!updates) {
      throw new Error("No fields to update")
    }

    // Add updated_at
    const updateQuery = `
      UPDATE clients 
      SET ${updates}, updated_at = NOW() 
      WHERE id = $id 
      RETURNING *
    `

    // Create params object with $id and all update fields
    const params = { id, ...client }

    const result = await db.query(updateQuery, params)
    revalidatePath(`/admin/clients/${id}`)
    revalidatePath("/admin/clients")

    return result.rows[0] as Client
  } catch (error) {
    console.error(`Error updating client ${id}:`, error)
    throw new Error("Failed to update client")
  }
}

export async function deleteClient(id: string): Promise<boolean> {
  try {
    await db`
      DELETE FROM clients 
      WHERE id = ${id}
    `
    revalidatePath("/admin/clients")
    return true
  } catch (error) {
    console.error(`Error deleting client ${id}:`, error)
    throw new Error("Failed to delete client")
  }
}

// Project functions
export async function getProjects(): Promise<Project[]> {
  try {
    const result = await db`
      SELECT p.*, c.name as client_name 
      FROM projects p
      LEFT JOIN clients c ON p.client_id = c.id
      ORDER BY p.created_at DESC
    `
    return result as Project[]
  } catch (error) {
    console.error("Error fetching projects:", error)
    throw new Error("Failed to fetch projects")
  }
}

export async function getProjectsByClientId(clientId: string): Promise<Project[]> {
  try {
    const result = await db`
      SELECT p.*, c.name as client_name 
      FROM projects p
      LEFT JOIN clients c ON p.client_id = c.id
      WHERE p.client_id = ${clientId}
      ORDER BY p.created_at DESC
    `
    return result as Project[]
  } catch (error) {
    console.error(`Error fetching projects for client ${clientId}:`, error)
    throw new Error("Failed to fetch client projects")
  }
}

export async function getProjectById(id: string): Promise<Project | null> {
  try {
    const result = await db`
      SELECT p.*, c.name as client_name 
      FROM projects p
      LEFT JOIN clients c ON p.client_id = c.id
      WHERE p.id = ${id}
    `
    return result.length > 0 ? (result[0] as Project) : null
  } catch (error) {
    console.error(`Error fetching project ${id}:`, error)
    throw new Error("Failed to fetch project")
  }
}

export async function createProject(
  project: Omit<Project, "id" | "created_at" | "updated_at" | "client_name">,
): Promise<Project> {
  try {
    const result = await db`
      INSERT INTO projects (
        name, client_id, status, description, start_date, end_date
      ) 
      VALUES (
        ${project.name}, ${project.client_id}, ${project.status}, 
        ${project.description}, ${project.start_date}, ${project.end_date || null}
      )
      RETURNING *
    `
    revalidatePath("/admin/projects")
    revalidatePath(`/admin/clients/${project.client_id}`)
    return result[0] as Project
  } catch (error) {
    console.error("Error creating project:", error)
    throw new Error("Failed to create project")
  }
}

export async function updateProject(id: string, project: Partial<Project>): Promise<Project> {
  try {
    // Build dynamic SET clause
    const updates = Object.entries(project)
      .filter(([key, value]) => value !== undefined && key !== "client_name")
      .map(([key, _]) => `${key} = $${key}`)
      .join(", ")

    if (!updates) {
      throw new Error("No fields to update")
    }

    // Add updated_at
    const updateQuery = `
      UPDATE projects 
      SET ${updates}, updated_at = NOW() 
      WHERE id = $id 
      RETURNING *
    `

    // Create params object with $id and all update fields
    const params = { id, ...project }

    const result = await db.query(updateQuery, params)
    revalidatePath(`/admin/projects/${id}`)
    revalidatePath("/admin/projects")

    if (project.client_id) {
      revalidatePath(`/admin/clients/${project.client_id}`)
    }

    return result.rows[0] as Project
  } catch (error) {
    console.error(`Error updating project ${id}:`, error)
    throw new Error("Failed to update project")
  }
}

export async function deleteProject(id: string): Promise<boolean> {
  try {
    // Get the project to find client_id for revalidation
    const project = await getProjectById(id)

    await db`
      DELETE FROM projects 
      WHERE id = ${id}
    `

    revalidatePath("/admin/projects")

    if (project?.client_id) {
      revalidatePath(`/admin/clients/${project.client_id}`)
    }

    return true
  } catch (error) {
    console.error(`Error deleting project ${id}:`, error)
    throw new Error("Failed to delete project")
  }
}

// Milestone functions
export async function getMilestones(): Promise<Milestone[]> {
  try {
    const result = await db`
      SELECT * FROM milestones 
      ORDER BY due_date ASC
    `
    return result as Milestone[]
  } catch (error) {
    console.error("Error fetching milestones:", error)
    throw new Error("Failed to fetch milestones")
  }
}

export async function getMilestonesByProjectId(projectId: string): Promise<Milestone[]> {
  try {
    const result = await db`
      SELECT * FROM milestones 
      WHERE project_id = ${projectId}
      ORDER BY due_date ASC
    `
    return result as Milestone[]
  } catch (error) {
    console.error(`Error fetching milestones for project ${projectId}:`, error)
    throw new Error("Failed to fetch project milestones")
  }
}

export async function getMilestoneById(id: string): Promise<Milestone | null> {
  try {
    const result = await db`
      SELECT * FROM milestones 
      WHERE id = ${id}
    `
    return result.length > 0 ? (result[0] as Milestone) : null
  } catch (error) {
    console.error(`Error fetching milestone ${id}:`, error)
    throw new Error("Failed to fetch milestone")
  }
}

export async function createMilestone(
  milestone: Omit<Milestone, "id" | "created_at" | "updated_at">,
): Promise<Milestone> {
  try {
    const result = await db`
      INSERT INTO milestones (
        project_id, title, description, status, due_date, completed_date
      ) 
      VALUES (
        ${milestone.project_id}, ${milestone.title}, ${milestone.description}, 
        ${milestone.status}, ${milestone.due_date}, ${milestone.completed_date || null}
      )
      RETURNING *
    `
    revalidatePath(`/admin/projects/${milestone.project_id}`)
    return result[0] as Milestone
  } catch (error) {
    console.error("Error creating milestone:", error)
    throw new Error("Failed to create milestone")
  }
}

export async function updateMilestone(id: string, milestone: Partial<Milestone>): Promise<Milestone> {
  try {
    // Build dynamic SET clause
    const updates = Object.entries(milestone)
      .filter(([_, value]) => value !== undefined)
      .map(([key, _]) => `${key} = $${key}`)
      .join(", ")

    if (!updates) {
      throw new Error("No fields to update")
    }

    // Add updated_at
    const updateQuery = `
      UPDATE milestones 
      SET ${updates}, updated_at = NOW() 
      WHERE id = $id 
      RETURNING *
    `

    // Create params object with $id and all update fields
    const params = { id, ...milestone }

    const result = await db.query(updateQuery, params)

    // Get the milestone to find project_id for revalidation
    const updatedMilestone = result.rows[0] as Milestone
    revalidatePath(`/admin/projects/${updatedMilestone.project_id}`)

    return updatedMilestone
  } catch (error) {
    console.error(`Error updating milestone ${id}:`, error)
    throw new Error("Failed to update milestone")
  }
}

export async function deleteMilestone(id: string): Promise<boolean> {
  try {
    // Get the milestone to find project_id for revalidation
    const milestone = await getMilestoneById(id)

    await db`
      DELETE FROM milestones 
      WHERE id = ${id}
    `

    if (milestone?.project_id) {
      revalidatePath(`/admin/projects/${milestone.project_id}`)
    }

    return true
  } catch (error) {
    console.error(`Error deleting milestone ${id}:`, error)
    throw new Error("Failed to delete milestone")
  }
}

// Resource functions
export async function getResources(): Promise<Resource[]> {
  try {
    const result = await db`
      SELECT * FROM resources 
      ORDER BY created_at DESC
    `
    return result as Resource[]
  } catch (error) {
    console.error("Error fetching resources:", error)
    throw new Error("Failed to fetch resources")
  }
}

export async function getResourcesByClientId(clientId: string): Promise<Resource[]> {
  try {
    const result = await db`
      SELECT * FROM resources 
      WHERE client_id = ${clientId} OR client_id IS NULL
      ORDER BY created_at DESC
    `
    return result as Resource[]
  } catch (error) {
    console.error(`Error fetching resources for client ${clientId}:`, error)
    throw new Error("Failed to fetch client resources")
  }
}

export async function getResourceById(id: string): Promise<Resource | null> {
  try {
    const result = await db`
      SELECT * FROM resources 
      WHERE id = ${id}
    `
    return result.length > 0 ? (result[0] as Resource) : null
  } catch (error) {
    console.error(`Error fetching resource ${id}:`, error)
    throw new Error("Failed to fetch resource")
  }
}

export async function createResource(resource: Omit<Resource, "id" | "created_at" | "updated_at">): Promise<Resource> {
  try {
    const result = await db`
      INSERT INTO resources (
        title, description, url, type, client_id
      ) 
      VALUES (
        ${resource.title}, ${resource.description}, ${resource.url}, 
        ${resource.type}, ${resource.client_id || null}
      )
      RETURNING *
    `
    revalidatePath("/admin/resources")

    if (resource.client_id) {
      revalidatePath(`/admin/clients/${resource.client_id}`)
      revalidatePath("/portal/resources")
    }

    return result[0] as Resource
  } catch (error) {
    console.error("Error creating resource:", error)
    throw new Error("Failed to create resource")
  }
}

export async function updateResource(id: string, resource: Partial<Resource>): Promise<Resource> {
  try {
    // Build dynamic SET clause
    const updates = Object.entries(resource)
      .filter(([_, value]) => value !== undefined)
      .map(([key, _]) => `${key} = $${key}`)
      .join(", ")

    if (!updates) {
      throw new Error("No fields to update")
    }

    // Add updated_at
    const updateQuery = `
      UPDATE resources 
      SET ${updates}, updated_at = NOW() 
      WHERE id = $id 
      RETURNING *
    `

    // Create params object with $id and all update fields
    const params = { id, ...resource }

    const result = await db.query(updateQuery, params)
    revalidatePath("/admin/resources")

    if (resource.client_id) {
      revalidatePath(`/admin/clients/${resource.client_id}`)
      revalidatePath("/portal/resources")
    }

    return result.rows[0] as Resource
  } catch (error) {
    console.error(`Error updating resource ${id}:`, error)
    throw new Error("Failed to update resource")
  }
}

export async function deleteResource(id: string): Promise<boolean> {
  try {
    // Get the resource to find client_id for revalidation
    const resource = await getResourceById(id)

    await db`
      DELETE FROM resources 
      WHERE id = ${id}
    `

    revalidatePath("/admin/resources")

    if (resource?.client_id) {
      revalidatePath(`/admin/clients/${resource.client_id}`)
      revalidatePath("/portal/resources")
    }

    return true
  } catch (error) {
    console.error(`Error deleting resource ${id}:`, error)
    throw new Error("Failed to delete resource")
  }
}

// Activity functions
export async function getActivities(limit = 50): Promise<Activity[]> {
  try {
    const result = await db`
      SELECT a.*, u.name as user_name
      FROM activities a
      LEFT JOIN users u ON a.user_id = u.id
      ORDER BY a.created_at DESC
      LIMIT ${limit}
    `
    return result as Activity[]
  } catch (error) {
    console.error("Error fetching activities:", error)
    throw new Error("Failed to fetch activities")
  }
}

export async function getActivitiesByEntityId(entityType: string, entityId: string, limit = 20): Promise<Activity[]> {
  try {
    const result = await db`
      SELECT a.*, u.name as user_name
      FROM activities a
      LEFT JOIN users u ON a.user_id = u.id
      WHERE a.entity_type = ${entityType} AND a.entity_id = ${entityId}
      ORDER BY a.created_at DESC
      LIMIT ${limit}
    `
    return result as Activity[]
  } catch (error) {
    console.error(`Error fetching activities for ${entityType} ${entityId}:`, error)
    throw new Error("Failed to fetch entity activities")
  }
}

export async function createActivity(activity: Omit<Activity, "id" | "created_at" | "user_name">): Promise<Activity> {
  try {
    const result = await db`
      INSERT INTO activities (
        user_id, action, entity_type, entity_id, details
      ) 
      VALUES (
        ${activity.user_id}, ${activity.action}, ${activity.entity_type}, 
        ${activity.entity_id}, ${activity.details || null}
      )
      RETURNING *
    `

    // Revalidate relevant paths
    revalidatePath("/admin/dashboard")

    if (activity.entity_type === "client") {
      revalidatePath(`/admin/clients/${activity.entity_id}`)
    } else if (activity.entity_type === "project") {
      revalidatePath(`/admin/projects/${activity.entity_id}`)
    }

    return result[0] as Activity
  } catch (error) {
    console.error("Error creating activity:", error)
    throw new Error("Failed to create activity")
  }
}

// Dashboard analytics
export async function getDashboardStats() {
  try {
    const clientsCount = await db`SELECT COUNT(*) as count FROM clients`
    const projectsCount = await db`SELECT COUNT(*) as count FROM projects`
    const activeProjectsCount = await db`SELECT COUNT(*) as count FROM projects WHERE status = 'active'`
    const completedProjectsCount = await db`SELECT COUNT(*) as count FROM projects WHERE status = 'completed'`
    const resourcesCount = await db`SELECT COUNT(*) as count FROM resources`

    return {
      clientsCount: Number.parseInt(clientsCount[0].count),
      projectsCount: Number.parseInt(projectsCount[0].count),
      activeProjectsCount: Number.parseInt(activeProjectsCount[0].count),
      completedProjectsCount: Number.parseInt(completedProjectsCount[0].count),
      resourcesCount: Number.parseInt(resourcesCount[0].count),
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    throw new Error("Failed to fetch dashboard statistics")
  }
}

export async function getProjectStatusCounts() {
  try {
    const result = await db`
      SELECT status, COUNT(*) as count 
      FROM projects 
      GROUP BY status
    `

    return result.map((row) => ({
      status: row.status,
      count: Number.parseInt(row.count),
    }))
  } catch (error) {
    console.error("Error fetching project status counts:", error)
    throw new Error("Failed to fetch project status statistics")
  }
}

export async function getClientProjectCounts(limit = 5) {
  try {
    const result = await db`
      SELECT c.name, COUNT(p.id) as project_count
      FROM clients c
      LEFT JOIN projects p ON c.id = p.client_id
      GROUP BY c.name
      ORDER BY project_count DESC
      LIMIT ${limit}
    `

    return result.map((row) => ({
      name: row.name,
      count: Number.parseInt(row.project_count),
    }))
  } catch (error) {
    console.error("Error fetching client project counts:", error)
    throw new Error("Failed to fetch client project statistics")
  }
}

// Client portal specific functions
export async function getClientPortalData(clientId: string) {
  try {
    const client = await getClientById(clientId)
    const projects = await getProjectsByClientId(clientId)
    const resources = await getResourcesByClientId(clientId)

    // Get all milestones for all client projects
    const milestones = await Promise.all(
      projects.map(async (project) => {
        const projectMilestones = await getMilestonesByProjectId(project.id)
        return projectMilestones.map((milestone) => ({
          ...milestone,
          project_name: project.name,
        }))
      }),
    ).then((results) => results.flat())

    // Get recent activities for client and projects
    const clientActivities = await getActivitiesByEntityId("client", clientId)
    const projectActivities = await Promise.all(
      projects.map((project) => getActivitiesByEntityId("project", project.id)),
    ).then((results) => results.flat())

    // Combine and sort activities
    const activities = [...clientActivities, ...projectActivities]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 20)

    return {
      client,
      projects,
      resources,
      milestones,
      activities,
    }
  } catch (error) {
    console.error(`Error fetching client portal data for ${clientId}:`, error)
    throw new Error("Failed to fetch client portal data")
  }
}
