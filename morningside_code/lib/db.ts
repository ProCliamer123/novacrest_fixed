import { neon } from "@neondatabase/serverless"

// Flag to track if we're in fallback mode due to DB connection issues
let inFallbackMode = false

// Initialize the neon SQL client with error handling
export const sql = (() => {
  try {
    const client = neon(process.env.DATABASE_URL!)

    // Create a wrapper function that catches errors
    const wrappedClient = async (strings: TemplateStringsArray, ...values: any[]) => {
      try {
        return await client(strings, ...values)
      } catch (error) {
        console.error("Database query error:", error)
        inFallbackMode = true
        throw error
      }
    }

    // Copy all properties from the original client
    Object.assign(wrappedClient, client)

    return wrappedClient as typeof client
  } catch (error) {
    console.error("Failed to initialize database client:", error)
    inFallbackMode = true

    // Return a dummy function that always throws
    const dummyClient = () => {
      throw new Error("Database connection not available")
    }

    return dummyClient as any
  }
})()

// Export the sql client for use in other files
export default sql

// Check if we're in fallback mode
export function isInFallbackMode() {
  return inFallbackMode
}

// Helper function to execute a query with error handling
export async function query<T>(queryText: string, params: any[] = []): Promise<T> {
  if (inFallbackMode) {
    throw new Error("Database connection not available")
  }

  try {
    const result = await sql.query(queryText, params)
    return result.rows as T
  } catch (error) {
    console.error("Database query error:", error)
    inFallbackMode = true
    throw new Error(`Database query failed: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// Type definitions for our database entities
export type User = {
  id: string
  name: string
  email: string
  role: "admin" | "manager" | "user"
  permissions: string[]
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date | null
  active: boolean
  password?: string
}

export type Client = {
  id: string
  name: string
  companyName: string
  email: string
  phone: string | null
  address: string | null
  logoUrl: string | null
  status: string
  onboardingDate: Date | null
  createdAt: Date
  updatedAt: Date
  metadata: Record<string, any> | null
  userId?: string
}

export type Project = {
  id: string
  name: string
  description: string | null
  status: string
  clientId: string
  startDate: Date | null
  endDate: Date | null
  createdAt: Date
  updatedAt: Date
  budget: number | null
  managerId: string | null
}

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

export type Resource = {
  id: string
  title: string
  description: string | null
  url: string
  type: string
  clientId: string
  createdAt: Date
  updatedAt: Date
}

export type Milestone = {
  id: string
  projectId: string
  title: string
  description: string | null
  dueDate: Date | null
  completed: boolean
  createdAt: Date
  updatedAt: Date
}

export type Notification = {
  id: string
  userId: string
  title: string
  message: string
  type: string
  read: boolean
  link: string | null
  createdAt: Date
  updatedAt: Date
}

// Permission constants
export const Permissions = {
  // Client permissions
  VIEW_CLIENTS: "view_clients",
  CREATE_CLIENT: "create_client",
  EDIT_CLIENT: "edit_client",
  DELETE_CLIENT: "delete_client",

  // Project permissions
  VIEW_PROJECTS: "view_projects",
  CREATE_PROJECT: "create_project",
  EDIT_PROJECT: "edit_project",
  DELETE_PROJECT: "delete_project",

  // Resource permissions
  VIEW_RESOURCES: "view_resources",
  CREATE_RESOURCE: "create_resource",
  EDIT_RESOURCE: "edit_resource",
  DELETE_RESOURCE: "delete_resource",

  // User permissions
  VIEW_USERS: "view_users",
  CREATE_USER: "create_user",
  EDIT_USER: "edit_user",
  DELETE_USER: "delete_user",

  // Analytics permissions
  VIEW_ANALYTICS: "view_analytics",

  // Settings permissions
  MANAGE_SETTINGS: "manage_settings",
}

// Role-based permission sets
export const RolePermissions = {
  admin: Object.values(Permissions),
  manager: [
    Permissions.VIEW_CLIENTS,
    Permissions.CREATE_CLIENT,
    Permissions.EDIT_CLIENT,
    Permissions.VIEW_PROJECTS,
    Permissions.CREATE_PROJECT,
    Permissions.EDIT_PROJECT,
    Permissions.VIEW_RESOURCES,
    Permissions.CREATE_RESOURCE,
    Permissions.EDIT_RESOURCE,
    Permissions.DELETE_RESOURCE,
    Permissions.VIEW_ANALYTICS,
  ],
  user: [
    Permissions.VIEW_CLIENTS,
    Permissions.VIEW_PROJECTS,
    Permissions.VIEW_RESOURCES,
    Permissions.CREATE_RESOURCE,
    Permissions.EDIT_RESOURCE,
  ],
}

// Check if a column exists in a table
async function columnExists(tableName: string, columnName: string): Promise<boolean> {
  try {
    const result = await sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = ${tableName}
      AND column_name = ${columnName}
    `
    return result.length > 0
  } catch (error) {
    console.error(`Error checking if column ${columnName} exists in ${tableName}:`, error)
    return false
  }
}

// Initialize database tables if they don't exist
export async function initializeDatabase() {
  if (inFallbackMode) {
    console.warn("Skipping database initialization - in fallback mode")
    return false
  }

  try {
    // Test database connection
    await sql`SELECT 1`

    // Create User table
    await sql`
      CREATE TABLE IF NOT EXISTS "User" (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'user',
        permissions JSONB DEFAULT '[]',
        active BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      )
    `

    // Add lastLogin column if it doesn't exist
    const lastLoginExists = await columnExists("User", "lastLogin")
    if (!lastLoginExists) {
      try {
        await sql`
          ALTER TABLE "User" 
          ADD COLUMN "lastLogin" TIMESTAMP WITH TIME ZONE
        `
        console.log("Added lastLogin column to User table")
      } catch (error) {
        console.warn("Could not add lastLogin column:", error)
        // Continue anyway - this is not critical
      }
    }

    // Create Client table
    await sql`
      CREATE TABLE IF NOT EXISTS "Client" (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        "companyName" VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50),
        address TEXT,
        "logoUrl" VARCHAR(255),
        status VARCHAR(50) NOT NULL DEFAULT 'active',
        "onboardingDate" TIMESTAMP WITH TIME ZONE,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        metadata JSONB
      )
    `

    // Add userId column to Client if it doesn't exist
    const userIdExists = await columnExists("Client", "userId")
    if (!userIdExists) {
      try {
        await sql`
          ALTER TABLE "Client" 
          ADD COLUMN "userId" UUID REFERENCES "User"(id) ON DELETE SET NULL
        `
        console.log("Added userId column to Client table")
      } catch (error) {
        console.warn("Could not add userId column:", error)
        // Continue anyway - this is not critical
      }
    }

    // Create Project table
    await sql`
      CREATE TABLE IF NOT EXISTS "Project" (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) NOT NULL DEFAULT 'active',
        "clientId" UUID NOT NULL,
        "startDate" TIMESTAMP WITH TIME ZONE,
        "endDate" TIMESTAMP WITH TIME ZONE,
        budget DECIMAL(15, 2),
        "managerId" UUID,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      )
    `

    // Create Milestone table
    await sql`
      CREATE TABLE IF NOT EXISTS "Milestone" (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "projectId" UUID NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        "dueDate" TIMESTAMP WITH TIME ZONE,
        completed BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      )
    `

    // Create Resource table
    await sql`
      CREATE TABLE IF NOT EXISTS "Resource" (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        url TEXT NOT NULL,
        type VARCHAR(50) NOT NULL,
        "clientId" UUID,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      )
    `

    // Create Activity table
    await sql`
      CREATE TABLE IF NOT EXISTS "Activity" (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        action VARCHAR(255) NOT NULL,
        timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "entityId" UUID,
        "entityType" VARCHAR(50),
        "userId" UUID,
        "clientId" UUID,
        "projectId" UUID,
        details JSONB
      )
    `

    // Create Notification table
    await sql`
      CREATE TABLE IF NOT EXISTS "Notification" (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "userId" UUID NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) NOT NULL,
        read BOOLEAN NOT NULL DEFAULT false,
        link TEXT,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      )
    `

    console.log("Database tables initialized successfully")
    return true
  } catch (error) {
    console.error("Error initializing database:", error)
    inFallbackMode = true
    return false
  }
}
