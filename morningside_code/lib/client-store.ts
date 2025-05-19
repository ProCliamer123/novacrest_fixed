// Types for our data models
export type User = {
  id: string
  name: string
  email: string
  password: string
  role: "admin" | "manager" | "user" | "client"
  permissions: string[]
  active: boolean
  createdAt: string
  updatedAt: string
}

export type Client = {
  id: string
  name: string
  companyName: string
  email: string
  phone: string | null
  address: string | null
  logoUrl: string | null
  status: "active" | "inactive" | "onboarding"
  userId: string | null
  createdAt: string
  updatedAt: string
}

export type Project = {
  id: string
  name: string
  description: string | null
  status: "planning" | "active" | "on-hold" | "completed" | "cancelled"
  clientId: string
  startDate: string | null
  endDate: string | null
  budget: number | null
  managerId: string | null
  createdAt: string
  updatedAt: string
}

export type Resource = {
  id: string
  title: string
  description: string | null
  url: string
  type: "document" | "image" | "video" | "link" | "other"
  clientId: string
  createdAt: string
  updatedAt: string
}

export type Activity = {
  id: string
  action: string
  timestamp: string
  entityId: string | null
  entityType: string | null
  userId: string | null
  clientId: string | null
  projectId: string | null
  details: Record<string, any> | null
}

export type Notification = {
  id: string
  userId: string
  title: string
  message: string
  type: string
  read: boolean
  link: string | null
  createdAt: string
  updatedAt: string
}

// Store class to manage data in localStorage
class ClientStore {
  private prefix = "morningside_"

  constructor() {
    this.initializeStore()
  }

  // Initialize the store with default data if empty
  private initializeStore() {
    if (typeof window === "undefined") return

    // Check if store is already initialized
    if (localStorage.getItem(`${this.prefix}initialized`) === "true") return

    // Create default admin user
    const adminUser: User = {
      id: "admin-1",
      name: "Admin User",
      email: "admin@example.com",
      password: "admin123", // In a real app, this would be hashed
      role: "admin",
      permissions: ["*"],
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Save admin user
    this.setItem("users", [adminUser])

    // Create empty collections for other data
    this.setItem("clients", [])
    this.setItem("projects", [])
    this.setItem("resources", [])
    this.setItem("activities", [])
    this.setItem("notifications", [])

    // Mark store as initialized
    localStorage.setItem(`${this.prefix}initialized`, "true")
  }

  // Generic method to get items from localStorage
  private getItem<T>(key: string): T[] {
    if (typeof window === "undefined") return []

    const data = localStorage.getItem(`${this.prefix}${key}`)
    return data ? JSON.parse(data) : []
  }

  // Generic method to set items in localStorage
  private setItem<T>(key: string, value: T[]): void {
    if (typeof window === "undefined") return

    localStorage.setItem(`${this.prefix}${key}`, JSON.stringify(value))
  }

  // Generate a unique ID
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  // User methods
  getUsers(): User[] {
    return this.getItem<User>("users")
  }

  getUserById(id: string): User | null {
    const users = this.getUsers()
    return users.find((user) => user.id === id) || null
  }

  getUserByEmail(email: string): User | null {
    const users = this.getUsers()
    return users.find((user) => user.email === email) || null
  }

  createUser(userData: Omit<User, "id" | "createdAt" | "updatedAt">): User {
    const users = this.getUsers()

    // Check if email already exists
    if (users.some((user) => user.email === userData.email)) {
      throw new Error("A user with this email already exists")
    }

    const now = new Date().toISOString()
    const newUser: User = {
      ...userData,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now,
    }

    users.push(newUser)
    this.setItem("users", users)

    // Log activity
    this.createActivity({
      action: "create_user",
      entityId: newUser.id,
      entityType: "user",
      userId: "admin-1", // Assuming admin is creating the user
      details: { name: newUser.name, role: newUser.role },
    })

    return newUser
  }

  updateUser(id: string, userData: Partial<User>): User | null {
    const users = this.getUsers()
    const index = users.findIndex((user) => user.id === id)

    if (index === -1) return null

    // Check if email is being changed and already exists
    if (userData.email && userData.email !== users[index].email) {
      if (users.some((user) => user.email === userData.email && user.id !== id)) {
        throw new Error("A user with this email already exists")
      }
    }

    const updatedUser = {
      ...users[index],
      ...userData,
      updatedAt: new Date().toISOString(),
    }

    users[index] = updatedUser
    this.setItem("users", users)

    // Log activity
    this.createActivity({
      action: "update_user",
      entityId: updatedUser.id,
      entityType: "user",
      userId: "admin-1", // Assuming admin is updating the user
      details: { name: updatedUser.name, role: updatedUser.role },
    })

    return updatedUser
  }

  deleteUser(id: string): boolean {
    const users = this.getUsers()
    const filteredUsers = users.filter((user) => user.id !== id)

    if (filteredUsers.length === users.length) return false

    this.setItem("users", filteredUsers)

    // Log activity
    this.createActivity({
      action: "delete_user",
      entityId: id,
      entityType: "user",
      userId: "admin-1", // Assuming admin is deleting the user
      details: { id },
    })

    return true
  }

  // Client methods
  getClients(): Client[] {
    return this.getItem<Client>("clients")
  }

  getClientById(id: string): Client | null {
    const clients = this.getClients()
    return clients.find((client) => client.id === id) || null
  }

  getClientByEmail(email: string): Client | null {
    const clients = this.getClients()
    return clients.find((client) => client.email === email) || null
  }

  createClient(clientData: Omit<Client, "id" | "createdAt" | "updatedAt">): Client {
    const clients = this.getClients()

    // Check if email already exists
    if (clients.some((client) => client.email === clientData.email)) {
      throw new Error("A client with this email already exists")
    }

    const now = new Date().toISOString()
    const newClient: Client = {
      ...clientData,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now,
    }

    clients.push(newClient)
    this.setItem("clients", clients)

    // Log activity
    this.createActivity({
      action: "create_client",
      entityId: newClient.id,
      entityType: "client",
      userId: "admin-1", // Assuming admin is creating the client
      clientId: newClient.id,
      details: { name: newClient.name, companyName: newClient.companyName },
    })

    return newClient
  }

  updateClient(id: string, clientData: Partial<Client>): Client | null {
    const clients = this.getClients()
    const index = clients.findIndex((client) => client.id === id)

    if (index === -1) return null

    // Check if email is being changed and already exists
    if (clientData.email && clientData.email !== clients[index].email) {
      if (clients.some((client) => client.email === clientData.email && client.id !== id)) {
        throw new Error("A client with this email already exists")
      }
    }

    const updatedClient = {
      ...clients[index],
      ...clientData,
      updatedAt: new Date().toISOString(),
    }

    clients[index] = updatedClient
    this.setItem("clients", clients)

    // Log activity
    this.createActivity({
      action: "update_client",
      entityId: updatedClient.id,
      entityType: "client",
      userId: "admin-1", // Assuming admin is updating the client
      clientId: updatedClient.id,
      details: { name: updatedClient.name, companyName: updatedClient.companyName },
    })

    return updatedClient
  }

  deleteClient(id: string): boolean {
    const clients = this.getClients()
    const filteredClients = clients.filter((client) => client.id !== id)

    if (filteredClients.length === clients.length) return false

    this.setItem("clients", filteredClients)

    // Log activity
    this.createActivity({
      action: "delete_client",
      entityId: id,
      entityType: "client",
      userId: "admin-1", // Assuming admin is deleting the client
      details: { id },
    })

    return true
  }

  // Project methods
  getProjects(): Project[] {
    return this.getItem<Project>("projects")
  }

  getProjectById(id: string): Project | null {
    const projects = this.getProjects()
    return projects.find((project) => project.id === id) || null
  }

  getProjectsByClientId(clientId: string): Project[] {
    const projects = this.getProjects()
    return projects.filter((project) => project.clientId === clientId)
  }

  createProject(projectData: Omit<Project, "id" | "createdAt" | "updatedAt">): Project {
    const projects = this.getProjects()

    const now = new Date().toISOString()
    const newProject: Project = {
      ...projectData,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now,
    }

    projects.push(newProject)
    this.setItem("projects", projects)

    // Log activity
    this.createActivity({
      action: "create_project",
      entityId: newProject.id,
      entityType: "project",
      userId: "admin-1", // Assuming admin is creating the project
      clientId: newProject.clientId,
      projectId: newProject.id,
      details: { name: newProject.name, status: newProject.status },
    })

    return newProject
  }

  updateProject(id: string, projectData: Partial<Project>): Project | null {
    const projects = this.getProjects()
    const index = projects.findIndex((project) => project.id === id)

    if (index === -1) return null

    const updatedProject = {
      ...projects[index],
      ...projectData,
      updatedAt: new Date().toISOString(),
    }

    projects[index] = updatedProject
    this.setItem("projects", projects)

    // Log activity
    this.createActivity({
      action: "update_project",
      entityId: updatedProject.id,
      entityType: "project",
      userId: "admin-1", // Assuming admin is updating the project
      clientId: updatedProject.clientId,
      projectId: updatedProject.id,
      details: { name: updatedProject.name, status: updatedProject.status },
    })

    return updatedProject
  }

  deleteProject(id: string): boolean {
    const projects = this.getProjects()
    const projectToDelete = projects.find((project) => project.id === id)

    if (!projectToDelete) return false

    const filteredProjects = projects.filter((project) => project.id !== id)
    this.setItem("projects", filteredProjects)

    // Log activity
    this.createActivity({
      action: "delete_project",
      entityId: id,
      entityType: "project",
      userId: "admin-1", // Assuming admin is deleting the project
      clientId: projectToDelete.clientId,
      details: { id },
    })

    return true
  }

  // Resource methods
  getResources(): Resource[] {
    return this.getItem<Resource>("resources")
  }

  getResourceById(id: string): Resource | null {
    const resources = this.getResources()
    return resources.find((resource) => resource.id === id) || null
  }

  getResourcesByClientId(clientId: string): Resource[] {
    const resources = this.getResources()
    return resources.filter((resource) => resource.clientId === clientId)
  }

  createResource(resourceData: Omit<Resource, "id" | "createdAt" | "updatedAt">): Resource {
    const resources = this.getResources()

    const now = new Date().toISOString()
    const newResource: Resource = {
      ...resourceData,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now,
    }

    resources.push(newResource)
    this.setItem("resources", resources)

    // Log activity
    this.createActivity({
      action: "create_resource",
      entityId: newResource.id,
      entityType: "resource",
      userId: "admin-1", // Assuming admin is creating the resource
      clientId: newResource.clientId,
      details: { title: newResource.title, type: newResource.type },
    })

    return newResource
  }

  updateResource(id: string, resourceData: Partial<Resource>): Resource | null {
    const resources = this.getResources()
    const index = resources.findIndex((resource) => resource.id === id)

    if (index === -1) return null

    const updatedResource = {
      ...resources[index],
      ...resourceData,
      updatedAt: new Date().toISOString(),
    }

    resources[index] = updatedResource
    this.setItem("resources", resources)

    // Log activity
    this.createActivity({
      action: "update_resource",
      entityId: updatedResource.id,
      entityType: "resource",
      userId: "admin-1", // Assuming admin is updating the resource
      clientId: updatedResource.clientId,
      details: { title: updatedResource.title, type: updatedResource.type },
    })

    return updatedResource
  }

  deleteResource(id: string): boolean {
    const resources = this.getResources()
    const resourceToDelete = resources.find((resource) => resource.id === id)

    if (!resourceToDelete) return false

    const filteredResources = resources.filter((resource) => resource.id !== id)
    this.setItem("resources", filteredResources)

    // Log activity
    this.createActivity({
      action: "delete_resource",
      entityId: id,
      entityType: "resource",
      userId: "admin-1", // Assuming admin is deleting the resource
      clientId: resourceToDelete.clientId,
      details: { id },
    })

    return true
  }

  // Activity methods
  getActivities(): Activity[] {
    return this.getItem<Activity>("activities")
  }

  getActivitiesByEntityId(entityType: string, entityId: string): Activity[] {
    const activities = this.getActivities()
    return activities.filter((activity) => activity.entityType === entityType && activity.entityId === entityId)
  }

  getActivitiesByClientId(clientId: string): Activity[] {
    const activities = this.getActivities()
    return activities.filter((activity) => activity.clientId === clientId)
  }

  createActivity(activityData: Omit<Activity, "id" | "timestamp">): Activity {
    const activities = this.getActivities()

    const newActivity: Activity = {
      ...activityData,
      id: this.generateId(),
      timestamp: new Date().toISOString(),
    }

    activities.push(newActivity)
    this.setItem("activities", activities)

    return newActivity
  }

  // Notification methods
  getNotifications(): Notification[] {
    return this.getItem<Notification>("notifications")
  }

  getNotificationsByUserId(userId: string): Notification[] {
    const notifications = this.getNotifications()
    return notifications.filter((notification) => notification.userId === userId)
  }

  createNotification(notificationData: Omit<Notification, "id" | "createdAt" | "updatedAt">): Notification {
    const notifications = this.getNotifications()

    const now = new Date().toISOString()
    const newNotification: Notification = {
      ...notificationData,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now,
    }

    notifications.push(newNotification)
    this.setItem("notifications", notifications)

    return newNotification
  }

  markNotificationAsRead(id: string): Notification | null {
    const notifications = this.getNotifications()
    const index = notifications.findIndex((notification) => notification.id === id)

    if (index === -1) return null

    const updatedNotification = {
      ...notifications[index],
      read: true,
      updatedAt: new Date().toISOString(),
    }

    notifications[index] = updatedNotification
    this.setItem("notifications", notifications)

    return updatedNotification
  }

  // Authentication methods
  authenticateUser(email: string, password: string): User | null {
    const users = this.getUsers()
    const user = users.find((user) => user.email === email && user.password === password)

    if (!user) return null

    // Update last login time
    this.updateUser(user.id, { updatedAt: new Date().toISOString() })

    return user
  }

  // Statistics methods
  getClientStatistics() {
    const clients = this.getClients()

    return {
      total: clients.length,
      active: clients.filter((client) => client.status === "active").length,
      inactive: clients.filter((client) => client.status === "inactive").length,
      onboarding: clients.filter((client) => client.status === "onboarding").length,
    }
  }

  getProjectStatistics() {
    const projects = this.getProjects()

    return {
      total: projects.length,
      planning: projects.filter((project) => project.status === "planning").length,
      active: projects.filter((project) => project.status === "active").length,
      onHold: projects.filter((project) => project.status === "on-hold").length,
      completed: projects.filter((project) => project.status === "completed").length,
      cancelled: projects.filter((project) => project.status === "cancelled").length,
    }
  }

  getResourceStatistics() {
    const resources = this.getResources()

    return {
      total: resources.length,
      byType: {
        document: resources.filter((resource) => resource.type === "document").length,
        image: resources.filter((resource) => resource.type === "image").length,
        video: resources.filter((resource) => resource.type === "video").length,
        link: resources.filter((resource) => resource.type === "link").length,
        other: resources.filter((resource) => resource.type === "other").length,
      },
    }
  }

  // Helper methods for client portal
  getClientWithProjects(clientId: string) {
    const client = this.getClientById(clientId)
    if (!client) return null

    const projects = this.getProjectsByClientId(clientId)
    const resources = this.getResourcesByClientId(clientId)
    const activities = this.getActivitiesByClientId(clientId)

    return {
      client,
      projects,
      resources,
      activities,
    }
  }

  // Clear all data (for testing)
  clearAllData() {
    if (typeof window === "undefined") return

    localStorage.removeItem(`${this.prefix}users`)
    localStorage.removeItem(`${this.prefix}clients`)
    localStorage.removeItem(`${this.prefix}projects`)
    localStorage.removeItem(`${this.prefix}resources`)
    localStorage.removeItem(`${this.prefix}activities`)
    localStorage.removeItem(`${this.prefix}notifications`)
    localStorage.removeItem(`${this.prefix}initialized`)

    // Re-initialize with default data
    this.initializeStore()
  }
}

// Create a singleton instance
export const clientStore = typeof window !== "undefined" ? new ClientStore() : null

// Export a function to get the store (for server components)
export function getClientStore() {
  if (typeof window === "undefined") {
    return null
  }
  return clientStore
}
