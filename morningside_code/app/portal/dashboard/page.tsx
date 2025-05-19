import { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Placeholder components until we connect to real data
function ClientStatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2</div>
          <p className="text-xs text-muted-foreground">2 projects in progress</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">3</div>
          <p className="text-xs text-muted-foreground">Due in the next 30 days</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">7</div>
          <p className="text-xs text-muted-foreground">Documents and resources available</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">68%</div>
          <p className="text-xs text-muted-foreground">+5% from last month</p>
        </CardContent>
      </Card>
    </div>
  )
}

function ActivityFeed() {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
        <div>
          <p className="font-medium">Project milestone completed</p>
          <p className="text-sm text-muted-foreground">Initial design phase completed for Website Redesign</p>
          <p className="text-xs text-muted-foreground mt-1">2 days ago</p>
        </div>
      </div>
      <div className="flex items-start gap-4">
        <div className="w-2 h-2 mt-2 rounded-full bg-green-500"></div>
        <div>
          <p className="font-medium">New resource added</p>
          <p className="text-sm text-muted-foreground">Brand guidelines document added to resources</p>
          <p className="text-xs text-muted-foreground mt-1">5 days ago</p>
        </div>
      </div>
      <div className="flex items-start gap-4">
        <div className="w-2 h-2 mt-2 rounded-full bg-purple-500"></div>
        <div>
          <p className="font-medium">Project started</p>
          <p className="text-sm text-muted-foreground">Marketing Campaign project has been initiated</p>
          <p className="text-xs text-muted-foreground mt-1">1 week ago</p>
        </div>
      </div>
    </div>
  )
}

function TimelineCard() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <span className="text-sm font-medium">1</span>
          <span className="absolute -bottom-3 w-0.5 bg-gray-200 h-5 left-1/2 -translate-x-1/2"></span>
        </div>
        <div>
          <p className="font-medium">Design Approval</p>
          <p className="text-sm text-muted-foreground">Due in 3 days</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
          <span className="text-sm font-medium">2</span>
          <span className="absolute -bottom-3 w-0.5 bg-gray-200 h-5 left-1/2 -translate-x-1/2"></span>
        </div>
        <div>
          <p className="font-medium">Content Creation</p>
          <p className="text-sm text-muted-foreground">Due in 1 week</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600">
          <span className="text-sm font-medium">3</span>
        </div>
        <div>
          <p className="font-medium">Development Phase</p>
          <p className="text-sm text-muted-foreground">Due in 2 weeks</p>
        </div>
      </div>
    </div>
  )
}

function ProjectStatusCard() {
  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">Website Redesign</h3>
            <p className="text-sm text-muted-foreground">Modernizing your company website</p>
          </div>
          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">In Progress</div>
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium">Progress: 65%</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: "65%" }}></div>
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">Marketing Campaign</h3>
            <p className="text-sm text-muted-foreground">Q2 Product Launch Campaign</p>
          </div>
          <div className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-medium">Planning</div>
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium">Progress: 15%</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div className="bg-amber-500 h-2 rounded-full" style={{ width: "15%" }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ClientResourcesList() {
  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-4 flex items-center justify-between">
        <div>
          <h3 className="font-medium">Brand Guidelines</h3>
          <p className="text-sm text-muted-foreground">PDF Document • 2.4 MB</p>
        </div>
        <Button variant="outline" size="sm">
          Download
        </Button>
      </div>

      <div className="border rounded-lg p-4 flex items-center justify-between">
        <div>
          <h3 className="font-medium">Website Wireframes</h3>
          <p className="text-sm text-muted-foreground">Figma Link • Updated 3 days ago</p>
        </div>
        <Button variant="outline" size="sm">
          View
        </Button>
      </div>

      <div className="border rounded-lg p-4 flex items-center justify-between">
        <div>
          <h3 className="font-medium">Marketing Strategy</h3>
          <p className="text-sm text-muted-foreground">PPTX Presentation • 5.7 MB</p>
        </div>
        <Button variant="outline" size="sm">
          Download
        </Button>
      </div>
    </div>
  )
}

export default function ClientPortalDashboard() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <ClientStatsCards />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your recent project updates and activities</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>Loading activities...</div>}>
                  <ActivityFeed />
                </Suspense>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Upcoming Milestones</CardTitle>
                <CardDescription>Your project milestones and deadlines</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>Loading milestones...</div>}>
                  <TimelineCard />
                </Suspense>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Project Status</CardTitle>
                <CardDescription>Current status of your active projects</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>Loading projects...</div>}>
                  <ProjectStatusCard />
                </Suspense>
              </CardContent>
            </Card>
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Resources</CardTitle>
                <CardDescription>Recently shared documents and resources</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>Loading resources...</div>}>
                  <ClientResourcesList />
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Projects</CardTitle>
              <CardDescription>All projects we're working on together</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading projects...</div>}>
                <ProjectStatusCard />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Resources</CardTitle>
              <CardDescription>Documents and resources shared with you</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading resources...</div>}>
                <ClientResourcesList />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Milestones</CardTitle>
              <CardDescription>Milestones and deadlines for your projects</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading milestones...</div>}>
                <TimelineCard />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
