import { notFound } from "next/navigation"
import Link from "next/link"
import { getProjectById, getMilestonesByProjectId, getActivitiesByEntityId } from "@/lib/data-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Edit, Calendar, Clock, CheckCircle, AlertCircle, MessageSquare, Plus } from "lucide-react"

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  // Fetch project data
  const project = await getProjectById(params.id)

  if (!project) {
    notFound()
  }

  // Fetch related data
  const milestones = await getMilestonesByProjectId(project.id)
  const activities = await getActivitiesByEntityId("project", project.id)

  // Calculate progress based on milestones
  const progress =
    milestones.length > 0
      ? Math.round((milestones.filter((m) => m.status === "completed").length / milestones.length) * 100)
      : 0

  // Get status icon based on status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "in_progress":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "on_hold":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-blue-500" />
    }
  }

  // Format status text
  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Get status color
  const getStatusColor = (status: string) => {
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

  // Get progress color
  const getProgressColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "in_progress":
        return "bg-yellow-500"
      case "on_hold":
        return "bg-red-500"
      default:
        return "bg-blue-500"
    }
  }

  // Get client initials
  const getClientInitials = (name = "") => {
    if (!name) return "??"
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center">
          <Button variant="outline" size="icon" asChild className="mr-4">
            <Link href="/admin/projects">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
            <div className="flex items-center">
              <p className="text-muted-foreground mr-2">
                Client:{" "}
                <Link href={`/admin/clients/${project.client_id}`} className="hover:underline">
                  {project.client_name || "Unknown Client"}
                </Link>
              </p>
              <Badge variant="outline" className={getStatusColor(project.status)}>
                {formatStatus(project.status)}
              </Badge>
            </div>
          </div>
        </div>
        <Button asChild>
          <Link href={`/admin/projects/${project.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Project
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Client</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{getClientInitials(project.client_name)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{project.client_name || "Unknown Client"}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {project.start_date ? new Date(project.start_date).toLocaleDateString() : "Not started"} -
                  {project.end_date ? new Date(project.end_date).toLocaleDateString() : "Ongoing"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress value={progress} className={getProgressColor(project.status)} />
              <div className="text-xs text-muted-foreground">
                {progress}% complete ({milestones.filter((m) => m.status === "completed").length} of {milestones.length}{" "}
                milestones)
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="updates">Updates</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{project.description || "No description provided."}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Milestones</CardTitle>
                <CardDescription>Key project milestones and deadlines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {milestones.length > 0 ? (
                    milestones.slice(0, 3).map((milestone) => (
                      <div key={milestone.id} className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 h-5 w-5 rounded-full flex items-center justify-center ${
                            milestone.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {milestone.status === "completed" && <CheckCircle className="h-3 w-3" />}
                        </div>
                        <div>
                          <p className="font-medium">{milestone.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {milestone.due_date ? new Date(milestone.due_date).toLocaleDateString() : "No due date"}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <p>No milestones defined yet.</p>
                      <Button variant="outline" size="sm" className="mt-2" asChild>
                        <Link href={`/admin/projects/${project.id}/milestones/new`}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Milestone
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
                {milestones.length > 3 && (
                  <Button variant="link" className="mt-2 p-0" asChild>
                    <Link href={`/admin/projects/${project.id}?tab=milestones`}>View all milestones</Link>
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Updates</CardTitle>
                <CardDescription>Latest project updates and communications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.length > 0 ? (
                    activities.slice(0, 2).map((activity) => (
                      <div key={activity.id} className="border-b pb-4 last:border-0 last:pb-0">
                        <div className="flex justify-between mb-1">
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(activity.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-sm">{activity.details || "No details provided"}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <p>No updates recorded yet.</p>
                    </div>
                  )}
                </div>
                {activities.length > 2 && (
                  <Button variant="link" className="mt-2 p-0" asChild>
                    <Link href={`/admin/projects/${project.id}?tab=updates`}>View all updates</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Project Milestones</CardTitle>
                <CardDescription>Key project milestones and deadlines</CardDescription>
              </div>
              <Button asChild>
                <Link href={`/admin/projects/${project.id}/milestones/new`}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Milestone
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {milestones.length > 0 ? (
                  milestones.map((milestone) => (
                    <div key={milestone.id} className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0">
                      <div
                        className={`mt-0.5 h-6 w-6 rounded-full flex items-center justify-center ${
                          milestone.status === "completed" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {milestone.status === "completed" && <CheckCircle className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <p className="font-medium">{milestone.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {milestone.due_date ? new Date(milestone.due_date).toLocaleDateString() : "No due date"}
                          </p>
                        </div>
                        {milestone.description && (
                          <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                        )}
                        <div className="mt-2 flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/projects/${project.id}/milestones/${milestone.id}/edit`}>Edit</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <p>No milestones defined yet.</p>
                    <Button variant="outline" size="sm" className="mt-2" asChild>
                      <Link href={`/admin/projects/${project.id}/milestones/new`}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Milestone
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="updates" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Project Updates</CardTitle>
                <CardDescription>Latest project updates and communications</CardDescription>
              </div>
              <Button asChild>
                <Link href={`/admin/projects/${project.id}/updates/new`}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Add Update
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {activities.length > 0 ? (
                  activities.map((activity) => (
                    <div key={activity.id} className="border-b pb-6 last:border-0 last:pb-0">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                            {activity.user_name ? activity.user_name.substring(0, 2).toUpperCase() : "SY"}
                          </div>
                          <p className="font-medium">{activity.action}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(activity.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-sm whitespace-pre-line">{activity.details || "No details provided"}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <p>No updates recorded yet.</p>
                    <Button variant="outline" size="sm" className="mt-2" asChild>
                      <Link href={`/admin/projects/${project.id}/updates/new`}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Add Update
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
