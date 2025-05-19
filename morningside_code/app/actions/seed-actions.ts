"use server"

import { sql } from "@/lib/db"
import { hash } from "bcryptjs"

// Seed admin user
export async function seedAdminUser() {
  try {
    // Check if admin user already exists
    const existingUsers = await sql`
      SELECT * FROM "User" WHERE email = 'admin@example.com'
    `

    if (existingUsers && existingUsers.length > 0) {
      return { success: false, message: "Admin user already exists" }
    }

    // Hash password
    const hashedPassword = await hash("admin123", 10)

    // Insert admin user
    await sql`
      INSERT INTO "User" (id, name, email, password, role, "createdAt", "updatedAt")
      VALUES (
        gen_random_uuid(), 'Admin User', 'admin@example.com', ${hashedPassword}, 'admin', NOW(), NOW()
      )
    `

    return { success: true, message: "Admin user created successfully" }
  } catch (error) {
    console.error("Error seeding admin user:", error)
    return { success: false, message: "Failed to create admin user" }
  }
}

// Seed database with sample data
export async function seedDatabase() {
  try {
    // Create client user
    const hashedPassword = await hash("client123", 10)

    const clientResult = await sql`
      INSERT INTO "User" (id, name, email, password, role, "createdAt", "updatedAt")
      VALUES (
        gen_random_uuid(), 'Client User', 'client@example.com', ${hashedPassword}, 'client', NOW(), NOW()
      )
      RETURNING id
    `

    const clientId = clientResult[0].id

    // Create sample clients
    const clientsData = [
      { name: "Acme Corporation", industry: "Technology", contactEmail: "contact@acme.com", status: "active" },
      { name: "Globex Industries", industry: "Manufacturing", contactEmail: "info@globex.com", status: "active" },
      {
        name: "Oceanic Airlines",
        industry: "Transportation",
        contactEmail: "support@oceanic.com",
        status: "onboarding",
      },
    ]

    for (const client of clientsData) {
      const clientResult = await sql`
        INSERT INTO "Client" (id, name, industry, "contactEmail", status, "userId", "createdAt", "updatedAt")
        VALUES (
          gen_random_uuid(), ${client.name}, ${client.industry}, ${client.contactEmail}, ${client.status}, ${clientId}, NOW(), NOW()
        )
        RETURNING id
      `

      const clientDbId = clientResult[0].id

      // Create projects for each client
      const projectsData = [
        {
          name: `${client.name} Website Redesign`,
          description: "Complete website overhaul with modern design",
          status: "in_progress",
        },
        {
          name: `${client.name} Marketing Campaign`,
          description: "Digital marketing strategy and implementation",
          status: "planning",
        },
      ]

      for (const project of projectsData) {
        const projectResult = await sql`
          INSERT INTO "Project" (id, name, description, status, "clientId", "createdAt", "updatedAt")
          VALUES (
            gen_random_uuid(), ${project.name}, ${project.description}, ${project.status}, ${clientDbId}, NOW(), NOW()
          )
          RETURNING id
        `

        const projectId = projectResult[0].id

        // Create milestones for each project
        const milestonesData = [
          {
            title: "Project Kickoff",
            description: "Initial meeting and requirements gathering",
            status: "completed",
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
          {
            title: "Design Phase",
            description: "Create mockups and design assets",
            status: "in_progress",
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          },
          {
            title: "Development",
            description: "Implement the approved designs",
            status: "not_started",
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        ]

        for (const milestone of milestonesData) {
          await sql`
            INSERT INTO "Milestone" (id, title, description, status, "dueDate", "projectId", "createdAt", "updatedAt")
            VALUES (
              gen_random_uuid(), ${milestone.title}, ${milestone.description}, ${milestone.status}, ${milestone.dueDate}, ${projectId}, NOW(), NOW()
            )
          `
        }

        // Create activities for each project
        const activitiesData = [
          { type: "update", description: "Project created", userId: clientId },
          { type: "milestone", description: "Kickoff meeting scheduled", userId: clientId },
        ]

        for (const activity of activitiesData) {
          await sql`
            INSERT INTO "Activity" (id, type, description, "projectId", "userId", "createdAt", "updatedAt")
            VALUES (
              gen_random_uuid(), ${activity.type}, ${activity.description}, ${projectId}, ${activity.userId}, NOW(), NOW()
            )
          `
        }
      }
    }

    // Create resources
    const resourcesData = [
      {
        title: "Getting Started Guide",
        description: "How to get started with our services",
        type: "document",
        url: "https://example.com/guide.pdf",
      },
      {
        title: "Brand Guidelines",
        description: "Official brand guidelines and assets",
        type: "document",
        url: "https://example.com/brand.pdf",
      },
      {
        title: "Tutorial Video",
        description: "Video tutorial for using the dashboard",
        type: "video",
        url: "https://example.com/tutorial.mp4",
      },
    ]

    for (const resource of resourcesData) {
      await sql`
        INSERT INTO "Resource" (id, title, description, type, url, "createdAt", "updatedAt")
        VALUES (
          gen_random_uuid(), ${resource.title}, ${resource.description}, ${resource.type}, ${resource.url}, NOW(), NOW()
        )
      `
    }

    return { success: true, message: "Database seeded successfully with sample data" }
  } catch (error) {
    console.error("Error seeding database:", error)
    return { success: false, message: "Failed to seed database" }
  }
}
