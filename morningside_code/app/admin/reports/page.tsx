"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { FileText, Download, Calendar, BarChart, PieChart, LineChart, Table } from "lucide-react"

export default function ReportsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [reportType, setReportType] = useState("client")
  const [dateRange, setDateRange] = useState("30days")
  const [format, setFormat] = useState("pdf")

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
          <p className="mt-4 text-gray-500">Loading reports...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, don't render the page (redirect will happen in useEffect)
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">Generate and download detailed reports.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Report
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="generate" className="space-y-4">
        <TabsList>
          <TabsTrigger value="generate">Generate Report</TabsTrigger>
          <TabsTrigger value="saved">Saved Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report Configuration</CardTitle>
              <CardDescription>Customize your report parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="report-type">Report Type</Label>
                    <Select value={reportType} onValueChange={setReportType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="client">Client Report</SelectItem>
                        <SelectItem value="project">Project Report</SelectItem>
                        <SelectItem value="resource">Resource Usage Report</SelectItem>
                        <SelectItem value="activity">Activity Report</SelectItem>
                        <SelectItem value="financial">Financial Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date-range">Date Range</Label>
                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select date range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7days">Last 7 days</SelectItem>
                        <SelectItem value="30days">Last 30 days</SelectItem>
                        <SelectItem value="90days">Last 90 days</SelectItem>
                        <SelectItem value="year">Last year</SelectItem>
                        <SelectItem value="custom">Custom range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {dateRange === "custom" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="start-date">Start Date</Label>
                        <Input id="start-date" type="date" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="end-date">End Date</Label>
                        <Input id="end-date" type="date" />
                      </div>
                    </>
                  )}
                </div>

                {reportType === "client" && (
                  <div className="space-y-2">
                    <Label>Select Clients</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border rounded-md p-4">
                      {["TechVision Inc.", "GlobalTech", "Acme Corp", "Innovate Solutions", "TechSolutions Inc."].map(
                        (client) => (
                          <div key={client} className="flex items-center space-x-2">
                            <Checkbox id={`client-${client}`} />
                            <Label htmlFor={`client-${client}`}>{client}</Label>
                          </div>
                        ),
                      )}
                      <div className="flex items-center space-x-2 col-span-2 mt-2">
                        <Checkbox id="select-all-clients" />
                        <Label htmlFor="select-all-clients">Select All</Label>
                      </div>
                    </div>
                  </div>
                )}

                {reportType === "project" && (
                  <div className="space-y-2">
                    <Label>Select Projects</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border rounded-md p-4">
                      {[
                        "AI Content Strategy",
                        "Data Analytics Platform",
                        "Automated Marketing",
                        "Customer Insights Engine",
                        "Predictive Sales Tool",
                      ].map((project) => (
                        <div key={project} className="flex items-center space-x-2">
                          <Checkbox id={`project-${project}`} />
                          <Label htmlFor={`project-${project}`}>{project}</Label>
                        </div>
                      ))}
                      <div className="flex items-center space-x-2 col-span-2 mt-2">
                        <Checkbox id="select-all-projects" />
                        <Label htmlFor="select-all-projects">Select All</Label>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Include in Report</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 border rounded-md p-4">
                    {[
                      { id: "summary", label: "Executive Summary", icon: <FileText className="h-4 w-4" /> },
                      { id: "charts", label: "Charts & Graphs", icon: <BarChart className="h-4 w-4" /> },
                      { id: "tables", label: "Data Tables", icon: <Table className="h-4 w-4" /> },
                      { id: "trends", label: "Trend Analysis", icon: <LineChart className="h-4 w-4" /> },
                      { id: "breakdown", label: "Detailed Breakdown", icon: <PieChart className="h-4 w-4" /> },
                      { id: "recommendations", label: "Recommendations", icon: <FileText className="h-4 w-4" /> },
                    ].map((item) => (
                      <div key={item.id} className="flex items-center space-x-2">
                        <Checkbox id={`include-${item.id}`} defaultChecked />
                        <div className="flex items-center space-x-2">
                          {item.icon}
                          <Label htmlFor={`include-${item.id}`}>{item.label}</Label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="format">Export Format</Label>
                  <Select value={format} onValueChange={setFormat}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Document</SelectItem>
                      <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                      <SelectItem value="csv">CSV File</SelectItem>
                      <SelectItem value="json">JSON Data</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline">Preview Report</Button>
                  <Button>Generate Report</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Saved Reports</CardTitle>
              <CardDescription>Previously generated reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: "Q2 Client Activity Report",
                    type: "Client Report",
                    date: "May 15, 2025",
                    format: "PDF",
                    size: "2.4 MB",
                  },
                  {
                    title: "Project Status Summary",
                    type: "Project Report",
                    date: "May 10, 2025",
                    format: "Excel",
                    size: "1.8 MB",
                  },
                  {
                    title: "Resource Usage Analysis",
                    type: "Resource Report",
                    date: "May 5, 2025",
                    format: "PDF",
                    size: "3.2 MB",
                  },
                  {
                    title: "Monthly Activity Summary",
                    type: "Activity Report",
                    date: "May 1, 2025",
                    format: "PDF",
                    size: "1.5 MB",
                  },
                  {
                    title: "Client Engagement Metrics",
                    type: "Client Report",
                    date: "April 25, 2025",
                    format: "Excel",
                    size: "2.1 MB",
                  },
                ].map((report, i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="space-y-1">
                      <p className="font-medium">{report.title}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{report.type}</span>
                        <span>•</span>
                        <span>{report.date}</span>
                        <span>•</span>
                        <span>{report.format}</span>
                        <span>•</span>
                        <span>{report.size}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>Automatically generated reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: "Weekly Client Activity",
                    frequency: "Weekly (Monday)",
                    recipients: "Admin Team",
                    format: "PDF",
                    nextRun: "May 20, 2025",
                  },
                  {
                    title: "Monthly Project Status",
                    frequency: "Monthly (1st)",
                    recipients: "Management Team",
                    format: "Excel",
                    nextRun: "June 1, 2025",
                  },
                  {
                    title: "Quarterly Performance",
                    frequency: "Quarterly",
                    recipients: "Executive Team",
                    format: "PDF",
                    nextRun: "July 1, 2025",
                  },
                ].map((report, i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="space-y-1">
                      <p className="font-medium">{report.title}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{report.frequency}</span>
                        <span>•</span>
                        <span>{report.recipients}</span>
                        <span>•</span>
                        <span>{report.format}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Next run: {report.nextRun}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule New Report
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
