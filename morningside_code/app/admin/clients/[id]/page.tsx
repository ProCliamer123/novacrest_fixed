import { notFound } from "next/navigation"
import Link from "next/link"
import {
  getClientById,
  getProjectsByClientId,
  getResourcesByClientId,
  getActivitiesByEntityId,
} from "@/lib/data-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Plus, Mail, Phone, Building, Calendar } from "lucide-react"

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  // Fetch client data
  const client = await getClientById(params.id)

  if (!client) {
    notFound()
  }

  // Fetch related data
  const projects = await getProjectsByClientId(client.id)
  const resources = await getResourcesByClientId(client.id)
  const activities = await getActivitiesByEntityId("client", client.id)

  // Get client initials for avatar
  const getInitials = (name: string) => {
    if (!name) return "??"
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  // Get status color for badge
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "onboarding":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Get project status color
  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "in_progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "on_hold":
        return "bg-red-100 text-red-800 border-red-200"
      case "planning":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Format status for display
  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center">
          <Button variant="outline" size="icon" asChild className="mr-4">
            <Link href="/admin/clients">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex items-center">
            <Avatar className="h-12 w-12 mr-4">
              {client.logo_url ? <AvatarImage src={client.logo_url || "/placeholder.svg"} alt={client.name} /> : null}
              <AvatarFallback>{getInitials(client.name)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{client.name}</h1>
              <div className="flex items-center">
                <p className="text-muted-foreground mr-2">{client.company}</p>
                <Badge variant="outline" className={`${getStatusColor(client.status)}`}>
                  {client.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/projects/new?client=${client.id}`}>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/admin/clients/${client.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Client
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
                <CardDescription>Basic information about the client</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-start">
                    <Mail className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{client.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">{client.contact_phone || "Not provided"}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Building className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Industry</p>
                      <p className="text-sm text-muted-foreground">{client.industry || "Not specified"}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Calendar className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Client Since</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(client.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
                <CardDescription>Additional information about this client</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{client.notes || "No notes available."}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Active Projects</CardTitle>
                <CardDescription>Current projects for this client</CardDescription>
              </div>
              <Button asChild size="sm">
                <Link href={`/admin/projects/new?client=${client.id}`}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Project
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.length > 0 ? (
                  projects.slice(0, 3).map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <h3 className="font-medium">{project.name}</h3>
                        <div className="flex items-center mt-1">
                          <Badge variant="outline" className={`mr-2 ${getProjectStatusColor(project.status)}`}>
                            {formatStatus(project.status)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {project.start_date
                              ? `Started ${new Date(project.start_date).toLocaleDateString()}`
                              : "Not started"}
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/projects/${project.id}`}>View Project</Link>
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <p>No active projects for this client.</p>
                    <Button variant="outline" size="sm" className="mt-2" asChild>
                      <Link href={`/admin/projects/new?client=${client.id}`}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Project
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Client Projects</CardTitle>
                <CardDescription>All projects for {client.name}</CardDescription>
              </div>
              <Button asChild>
                <Link href={`/admin/projects/new?client=${client.id}`}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Project
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <h3 className="font-medium">{project.name}</h3>
                        <div className="flex items-center mt-1">
                          <Badge variant="outline" className={`mr-2 ${getProjectStatusColor(project.status)}`}>
                            {formatStatus(project.status)}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-right">
                          {project.start_date && (
                            <p className="text-muted-foreground">
                              {new Date(project.start_date).toLocaleDateString()} -
                              {project.end_date ? new Date(project.end_date).toLocaleDateString() : "Ongoing"}
                            </p>
                          )}
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/projects/${project.id}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <p>No projects found for this client.</p>
                    <Button variant="outline" size="sm" className="mt-2" asChild>
                      <Link href={`/admin/projects/new?client=${client.id}`}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Project
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Recent interactions and updates for this client</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.length > 0 ? (
                  activities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0">
                      <div className="min-w-24 text-sm text-muted-foreground">
                        {new Date(activity.created_at).toLocaleDateString()}
                      </div>
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.details || "No details provided"}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <p>No activity recorded for this client yet.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Client Resources</CardTitle>
                <CardDescription>Resources shared with {client.name}</CardDescription>
              </div>
              <Button asChild>
                <Link href={`/admin/resources/new?client=${client.id}`}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Resource
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {resources.length > 0 ? (
                  resources.map((resource) => (
                    <div
                      key={resource.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <h3 className="font-medium">{resource.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {resource.type} • {resource.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-right">
                          <p className="text-muted-foreground">
                            Added: {new Date(resource.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={resource.url} target="_blank">
                            View
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <p>No resources have been shared with this client yet.</p>
                    <Button variant="outline" size="sm" className="mt-2" asChild>
                      <Link href={`/admin/resources/new?client=${client.id}`}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Resource
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
