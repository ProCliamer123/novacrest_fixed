"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { getUser } from "@/lib/client-auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/button"

export default function ProjectStatusPage() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Check if user is logged in
    const user = getUser()
    if (!user && isClient) {
      window.location.href = "/client-portal"
    }
  }, [isClient])

  // Don't render anything on the server to prevent hydration issues
  if (!isClient) {
    return null
  }

  // Get user data
  const user = getUser()
  if (!user) {
    return null
  }

  // Sample project data
  const projectPhases = [
    {
      name: "Discovery & Planning",
      progress: 100,
      status: "Completed",
      description: "Initial assessment and project planning",
      startDate: "Jan 15, 2023",
      endDate: "Feb 10, 2023",
      deliverables: ["Project Plan", "Requirements Document", "Timeline"],
    },
    {
      name: "Data Collection & Analysis",
      progress: 85,
      status: "In Progress",
      description: "Gathering and analyzing relevant data",
      startDate: "Feb 11, 2023",
      endDate: "Mar 20, 2023",
      deliverables: ["Data Schema", "Analysis Report", "Data Flow Diagram"],
    },
    {
      name: "AI Model Development",
      progress: 60,
      status: "In Progress",
      description: "Building and training AI models",
      startDate: "Mar 1, 2023",
      endDate: "Apr 15, 2023",
      deliverables: ["Model Architecture", "Training Results", "Performance Metrics"],
    },
    {
      name: "Integration",
      progress: 30,
      status: "In Progress",
      description: "Integrating AI models with existing systems",
      startDate: "Apr 1, 2023",
      endDate: "May 10, 2023",
      deliverables: ["API Documentation", "Integration Tests", "System Diagram"],
    },
    {
      name: "Testing & Optimization",
      progress: 10,
      status: "Upcoming",
      description: "Testing and refining the solution",
      startDate: "May 11, 2023",
      endDate: "Jun 15, 2023",
      deliverables: ["Test Results", "Optimization Report", "Performance Benchmarks"],
    },
    {
      name: "Deployment & Training",
      progress: 0,
      status: "Not Started",
      description: "Deploying the solution and training users",
      startDate: "Jun 16, 2023",
      endDate: "Jul 15, 2023",
      deliverables: ["Deployment Plan", "Training Materials", "User Guides"],
    },
  ]

  const teamMembers = [
    {
      name: "Alex Morgan",
      role: "Project Manager",
      email: "alex@novacrest.ai",
      avatar: "/abstract-am.png",
    },
    {
      name: "Sarah Chen",
      role: "Data Scientist",
      email: "sarah@novacrest.ai",
      avatar: "/stylized-initials-sc.png",
    },
    {
      name: "Michael Rodriguez",
      role: "AI Engineer",
      email: "michael@novacrest.ai",
      avatar: "/medical-resonance-image.png",
    },
    {
      name: "Jessica Kim",
      role: "Integration Specialist",
      email: "jessica@novacrest.ai",
      avatar: "/intertwined-letters.png",
    },
  ]

  const projectDocuments = [
    {
      name: "Project Plan",
      type: "PDF",
      date: "Jan 20, 2023",
      size: "2.4 MB",
    },
    {
      name: "Requirements Document",
      type: "DOCX",
      date: "Feb 5, 2023",
      size: "1.8 MB",
    },
    {
      name: "Data Schema",
      type: "XLSX",
      date: "Feb 28, 2023",
      size: "3.2 MB",
    },
    {
      name: "Analysis Report",
      type: "PDF",
      date: "Mar 15, 2023",
      size: "4.5 MB",
    },
    {
      name: "Model Architecture",
      type: "PDF",
      date: "Apr 2, 2023",
      size: "2.1 MB",
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Project Status</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
            On Track
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Progress</CardTitle>
              <CardDescription>Overall completion: 47%</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {projectPhases.map((phase) => (
                  <div key={phase.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{phase.name}</div>
                      <div className="text-sm text-muted-foreground">{phase.progress}%</div>
                    </div>
                    <Progress value={phase.progress} className="h-2" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <div>{phase.startDate}</div>
                      <div>{phase.status}</div>
                      <div>{phase.endDate}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Next Milestone</CardTitle>
                <CardDescription>Data Analysis Completion</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">March 20, 2023</div>
                <p className="text-sm text-muted-foreground mt-2">
                  Completion of data collection and analysis phase, including delivery of the Analysis Report.
                </p>
                <div className="mt-4">
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200">15 days remaining</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Recent Updates</CardTitle>
                <CardDescription>Latest project activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-2 border-primary pl-4 py-1">
                    <p className="text-sm font-medium">Data schema finalized</p>
                    <p className="text-xs text-muted-foreground">Yesterday at 2:30 PM</p>
                  </div>
                  <div className="border-l-2 border-primary pl-4 py-1">
                    <p className="text-sm font-medium">Initial model training complete</p>
                    <p className="text-xs text-muted-foreground">Mar 5, 2023 at 10:15 AM</p>
                  </div>
                  <div className="border-l-2 border-primary pl-4 py-1">
                    <p className="text-sm font-medium">Integration planning meeting</p>
                    <p className="text-xs text-muted-foreground">Mar 1, 2023 at 3:00 PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Key Metrics</CardTitle>
                <CardDescription>Project performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Budget Utilization</span>
                    <span className="text-sm">42%</span>
                  </div>
                  <Progress value={42} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Timeline Adherence</span>
                    <span className="text-sm">95%</span>
                  </div>
                  <Progress value={95} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Quality Score</span>
                    <span className="text-sm">88%</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
              <CardDescription>Detailed view of project phases and milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-9 top-0 bottom-0 w-px bg-muted"></div>

                {projectPhases.map((phase, index) => (
                  <div key={phase.name} className="mb-8 flex gap-4">
                    <div
                      className={`relative mt-1 flex h-8 w-8 items-center justify-center rounded-full border ${
                        phase.progress === 100
                          ? "bg-green-100 border-green-500 text-green-600"
                          : phase.progress > 0
                            ? "bg-blue-100 border-blue-500 text-blue-600"
                            : "bg-gray-100 border-gray-300 text-gray-500"
                      }`}
                    >
                      {phase.progress === 100 ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      ) : (
                        <span className="text-xs">{index + 1}</span>
                      )}
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{phase.name}</h4>
                        <Badge
                          variant="outline"
                          className={
                            phase.status === "Completed"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : phase.status === "In Progress"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-gray-50 text-gray-700 border-gray-200"
                          }
                        >
                          {phase.status}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mt-1">{phase.description}</p>

                      <div className="flex gap-4 text-sm text-muted-foreground mt-2">
                        <div>
                          {phase.startDate} - {phase.endDate}
                        </div>
                      </div>

                      <div className="mt-3">
                        <h5 className="text-sm font-medium mb-2">Deliverables:</h5>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                          {phase.deliverables.map((deliverable) => (
                            <li key={deliverable}>{deliverable}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Team</CardTitle>
              <CardDescription>Meet the team working on your AI automation project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {teamMembers.map((member) => (
                  <div key={member.name} className="flex items-start space-x-4 rounded-lg border p-4">
                    <Avatar>
                      <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h4 className="font-semibold">{member.name}</h4>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                      <a href={`mailto:${member.email}`} className="text-sm text-blue-600 hover:underline">
                        {member.email}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Meetings</CardTitle>
              <CardDescription>Regular project check-ins and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Project Status Update</h4>
                    <Badge variant="outline">Weekly</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Every Tuesday at 10:00 AM - 11:00 AM EST</p>
                  <div className="mt-3 text-sm">
                    <p>Next meeting: March 14, 2023</p>
                    <p className="mt-2">Agenda:</p>
                    <ul className="list-disc list-inside mt-1 text-muted-foreground">
                      <li>Data analysis progress review</li>
                      <li>Model training results discussion</li>
                      <li>Integration planning update</li>
                    </ul>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Technical Deep Dive</h4>
                    <Badge variant="outline">Bi-weekly</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Every other Thursday at 2:00 PM - 3:30 PM EST</p>
                  <div className="mt-3 text-sm">
                    <p>Next meeting: March 16, 2023</p>
                    <p className="mt-2">Agenda:</p>
                    <ul className="list-disc list-inside mt-1 text-muted-foreground">
                      <li>Model architecture review</li>
                      <li>Performance optimization strategies</li>
                      <li>Integration approach discussion</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Documents</CardTitle>
              <CardDescription>Access and download project documentation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-5 p-4 font-medium border-b">
                  <div className="col-span-2">Document Name</div>
                  <div>Type</div>
                  <div>Date</div>
                  <div>Size</div>
                </div>

                {projectDocuments.map((doc) => (
                  <div key={doc.name} className="grid grid-cols-5 p-4 hover:bg-muted/50 items-center">
                    <div className="col-span-2 flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-blue-500"
                      >
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      <span>{doc.name}</span>
                    </div>
                    <div>{doc.type}</div>
                    <div>{doc.date}</div>
                    <div className="flex items-center justify-between">
                      <span>{doc.size}</span>
                      <button className="p-1 rounded-full hover:bg-muted">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Request Additional Documents</CardTitle>
              <CardDescription>Need something specific? Let us know.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid gap-2">
                  <label htmlFor="document-type" className="text-sm font-medium">
                    Document Type
                  </label>
                  <select id="document-type" className="rounded-md border p-2">
                    <option value="">Select document type</option>
                    <option value="technical">Technical Documentation</option>
                    <option value="report">Project Report</option>
                    <option value="presentation">Presentation</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="grid gap-2">
                  <label htmlFor="document-description" className="text-sm font-medium">
                    Description
                  </label>
                  <textarea
                    id="document-description"
                    className="min-h-[100px] rounded-md border p-2"
                    placeholder="Please describe the document you need..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
                >
                  Submit Request
                </button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
