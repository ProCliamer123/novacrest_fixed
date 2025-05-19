"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, LineChart, PieChart, DonutChart } from "@/components/admin/charts"

export default function AnalyticsDashboard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [timeRange, setTimeRange] = useState("30days")

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem("adminAuthenticated") === "true"
      setIsAuthenticated(authStatus)
      setIsLoading(false)

      if (!authStatus) {
        router.push("/admin/login")
      }
    }

    checkAuth()
    const timer = setTimeout(checkAuth, 500)
    return () => clearTimeout(timer)
  }, [router])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading analytics...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, don't render the dashboard (redirect will happen in useEffect)
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive insights into your client portal performance.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => console.log("Export report")}>
            Export Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="clients">Client Analytics</TabsTrigger>
          <TabsTrigger value="projects">Project Analytics</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Portal Visits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,248</div>
                <p className="text-xs text-muted-foreground">+18% from last period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resource Downloads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">342</div>
                <p className="text-xs text-muted-foreground">+5% from last period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Assistant Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">876</div>
                <p className="text-xs text-muted-foreground">+32% from last period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Session Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12m 24s</div>
                <p className="text-xs text-muted-foreground">+3m from last period</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Portal Traffic</CardTitle>
                <CardDescription>Daily visits over time</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={[
                    { date: "May 1", visits: 45 },
                    { date: "May 2", visits: 52 },
                    { date: "May 3", visits: 49 },
                    { date: "May 4", visits: 62 },
                    { date: "May 5", visits: 58 },
                    { date: "May 6", visits: 42 },
                    { date: "May 7", visits: 40 },
                    { date: "May 8", visits: 53 },
                    { date: "May 9", visits: 59 },
                    { date: "May 10", visits: 64 },
                    { date: "May 11", visits: 61 },
                    { date: "May 12", visits: 58 },
                    { date: "May 13", visits: 43 },
                    { date: "May 14", visits: 45 },
                  ]}
                  xKey="date"
                  yKey="visits"
                  height={300}
                />
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Feature Usage</CardTitle>
                <CardDescription>Most used portal features</CardDescription>
              </CardHeader>
              <CardContent>
                <DonutChart
                  data={[
                    { name: "AI Assistant", value: 35 },
                    { name: "Resources", value: 25 },
                    { name: "Project Status", value: 20 },
                    { name: "Timeline", value: 15 },
                    { name: "Support", value: 5 },
                  ]}
                  height={300}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Client Engagement</CardTitle>
                <CardDescription>Portal usage by client</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={[
                    { client: "TechVision Inc.", visits: 245 },
                    { client: "GlobalTech", visits: 186 },
                    { client: "Acme Corp", visits: 142 },
                    { client: "Innovate Solutions", visits: 98 },
                    { client: "TechSolutions Inc.", visits: 76 },
                  ]}
                  xKey="client"
                  yKey="visits"
                  height={300}
                />
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Client Satisfaction</CardTitle>
                <CardDescription>Based on feedback submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={[
                    { name: "Very Satisfied", value: 45 },
                    { name: "Satisfied", value: 35 },
                    { name: "Neutral", value: 15 },
                    { name: "Dissatisfied", value: 5 },
                  ]}
                  height={300}
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Client Activity Timeline</CardTitle>
              <CardDescription>Recent client interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { client: "TechVision Inc.", action: "Downloaded AI Strategy Guide", time: "Today at 10:30 AM" },
                  {
                    client: "GlobalTech",
                    action: "Submitted feedback on project milestone",
                    time: "Yesterday at 4:15 PM",
                  },
                  { client: "Acme Corp", action: "Viewed project timeline", time: "Yesterday at 2:30 PM" },
                  {
                    client: "TechSolutions Inc.",
                    action: "Used AI Assistant for 25 minutes",
                    time: "May 17 at 11:45 AM",
                  },
                  { client: "Innovate Solutions", action: "Accessed resource library", time: "May 17 at 9:20 AM" },
                ].map((activity, i) => (
                  <div key={i} className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0">
                    <div className="rounded-full bg-primary/10 p-2 mt-1">
                      <div className="h-4 w-4 text-primary"></div>
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{activity.client}</p>
                        <div className="text-xs text-muted-foreground">{activity.time}</div>
                      </div>
                      <p className="text-sm text-muted-foreground">{activity.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Project Status Distribution</CardTitle>
                <CardDescription>Current status of all projects</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={[
                    { status: "On Track", count: 8 },
                    { status: "In Progress", count: 12 },
                    { status: "At Risk", count: 3 },
                    { status: "Completed", count: 5 },
                    { status: "Not Started", count: 2 },
                  ]}
                  xKey="status"
                  yKey="count"
                  height={300}
                />
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Project Phase Distribution</CardTitle>
                <CardDescription>Current phase of all projects</CardDescription>
              </CardHeader>
              <CardContent>
                <DonutChart
                  data={[
                    { name: "Data Collection", value: 8 },
                    { name: "AI Model Training", value: 6 },
                    { name: "Integration", value: 4 },
                    { name: "Testing", value: 3 },
                    { name: "Deployment", value: 2 },
                    { name: "Maintenance", value: 7 },
                  ]}
                  height={300}
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Project Milestone Completion</CardTitle>
              <CardDescription>Timeline of milestone completions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    project: "AI Content Strategy",
                    milestone: "Data Collection",
                    date: "May 15, 2025",
                    status: "Completed",
                  },
                  {
                    project: "Data Analytics Platform",
                    milestone: "Model Training",
                    date: "May 20, 2025",
                    status: "In Progress",
                  },
                  { project: "Automated Marketing", milestone: "Integration", date: "May 25, 2025", status: "At Risk" },
                  {
                    project: "Customer Insights Engine",
                    milestone: "Testing",
                    date: "June 1, 2025",
                    status: "On Track",
                  },
                  {
                    project: "Predictive Sales Tool",
                    milestone: "Deployment",
                    date: "June 5, 2025",
                    status: "On Track",
                  },
                ].map((milestone, i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="space-y-1">
                      <p className="font-medium">{milestone.project}</p>
                      <p className="text-sm text-muted-foreground">{milestone.milestone}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-muted-foreground">{milestone.date}</div>
                      <div
                        className={`text-xs px-2 py-1 rounded-full ${
                          milestone.status === "Completed"
                            ? "bg-green-50 text-green-700"
                            : milestone.status === "At Risk"
                              ? "bg-red-50 text-red-700"
                              : milestone.status === "In Progress"
                                ? "bg-yellow-50 text-yellow-700"
                                : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {milestone.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Resource Engagement</CardTitle>
                <CardDescription>Most downloaded resources</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={[
                    { resource: "AI Strategy Guide", downloads: 87 },
                    { resource: "Data Privacy Whitepaper", downloads: 64 },
                    { resource: "Implementation Roadmap", downloads: 52 },
                    { resource: "Case Study: TechVision", downloads: 45 },
                    { resource: "AI Ethics Framework", downloads: 38 },
                  ]}
                  xKey="resource"
                  yKey="downloads"
                  height={300}
                />
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>AI Assistant Topics</CardTitle>
                <CardDescription>Most common AI assistant queries</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={[
                    { name: "Project Status", value: 30 },
                    { name: "Technical Questions", value: 25 },
                    { name: "Timeline Inquiries", value: 20 },
                    { name: "Resource Requests", value: 15 },
                    { name: "Other", value: 10 },
                  ]}
                  height={300}
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Engagement Metrics</CardTitle>
              <CardDescription>Key engagement indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">Average Session Duration</div>
                    <div className="text-muted-foreground">12m 24s</div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100">
                    <div className="h-full w-[75%] rounded-full bg-primary"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">Pages Per Session</div>
                    <div className="text-muted-foreground">4.8</div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100">
                    <div className="h-full w-[60%] rounded-full bg-primary"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">Return Rate</div>
                    <div className="text-muted-foreground">68%</div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100">
                    <div className="h-full w-[68%] rounded-full bg-primary"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">Resource Engagement</div>
                    <div className="text-muted-foreground">42%</div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100">
                    <div className="h-full w-[42%] rounded-full bg-primary"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">Feedback Submission Rate</div>
                    <div className="text-muted-foreground">28%</div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100">
                    <div className="h-full w-[28%] rounded-full bg-primary"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
