"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react"

// Sample project data (same as in the detail page)
const projectsData = [
  {
    id: "1",
    name: "AI Content Strategy",
    client: "TechVision Inc.",
    clientId: "1",
    description:
      "Develop a comprehensive AI-driven content strategy to improve engagement and conversion rates across digital platforms.",
    status: "In Progress",
    completion: 65,
    startDate: "2025-01-20", // Format for input type="date"
    deadline: "2025-06-30", // Format for input type="date"
    team: [
      { id: 1, name: "Alex Morgan", role: "Project Manager", email: "alex@morningside.ai" },
      { id: 2, name: "Jamie Chen", role: "AI Specialist", email: "jamie@morningside.ai" },
      { id: 3, name: "Taylor Kim", role: "Content Strategist", email: "taylor@morningside.ai" },
    ],
    milestones: [
      { id: 1, title: "Project Kickoff", date: "2025-01-25", completed: true },
      { id: 2, title: "Content Audit", date: "2025-02-15", completed: true },
      { id: 3, title: "AI Model Selection", date: "2025-03-10", completed: true },
      { id: 4, title: "Strategy Development", date: "2025-04-20", completed: false },
      { id: 5, title: "Implementation", date: "2025-05-30", completed: false },
      { id: 6, title: "Final Review", date: "2025-06-25", completed: false },
    ],
    updates: [
      {
        id: 1,
        date: "2025-05-15",
        author: "Alex Morgan",
        content: "Completed the AI model training with 92% accuracy. Moving to implementation phase next week.",
      },
      {
        id: 2,
        date: "2025-05-01",
        author: "Jamie Chen",
        content:
          "Content categorization algorithm is now working properly. Starting to integrate with the main system.",
      },
      {
        id: 3,
        date: "2025-04-20",
        author: "Taylor Kim",
        content: "Finished content audit and identified key areas for improvement. Shared findings with the client.",
      },
    ],
    resources: [
      { id: 1, name: "Content Strategy Document", type: "PDF", size: "2.4 MB", date: "2025-04-25" },
      { id: 2, name: "AI Model Specifications", type: "DOCX", size: "1.8 MB", date: "2025-03-15" },
      { id: 3, name: "Implementation Timeline", type: "XLSX", size: "0.5 MB", date: "2025-05-05" },
    ],
  },
  {
    id: "2",
    name: "Data Analytics Platform",
    client: "GlobalTech",
    clientId: "2",
    description:
      "Build a custom data analytics platform that integrates with existing systems to provide real-time insights and predictive analytics.",
    status: "On Track",
    completion: 80,
    startDate: "2025-02-15", // Format for input type="date"
    deadline: "2025-07-15", // Format for input type="date"
    team: [
      { id: 1, name: "Jordan Smith", role: "Project Manager", email: "jordan@morningside.ai" },
      { id: 2, name: "Casey Wong", role: "Data Scientist", email: "casey@morningside.ai" },
      { id: 3, name: "Riley Johnson", role: "Backend Developer", email: "riley@morningside.ai" },
      { id: 4, name: "Quinn Lee", role: "Frontend Developer", email: "quinn@morningside.ai" },
    ],
    milestones: [
      { id: 1, title: "Project Kickoff", date: "2025-02-20", completed: true },
      { id: 2, title: "Requirements Gathering", date: "2025-03-10", completed: true },
      { id: 3, title: "Data Model Design", date: "2025-04-05", completed: true },
      { id: 4, title: "Backend Development", date: "2025-05-15", completed: true },
      { id: 5, title: "Frontend Development", date: "2025-06-20", completed: false },
      { id: 6, title: "Testing & Deployment", date: "2025-07-10", completed: false },
    ],
    updates: [
      {
        id: 1,
        date: "2025-05-20",
        author: "Jordan Smith",
        content: "Backend API is now complete and fully documented. Frontend team has started integration.",
      },
      {
        id: 2,
        date: "2025-05-10",
        author: "Casey Wong",
        content: "Predictive analytics models are performing with 88% accuracy on test data.",
      },
      {
        id: 3,
        date: "2025-04-30",
        author: "Riley Johnson",
        content: "Completed data pipeline architecture. System can now process 10,000 records per second.",
      },
    ],
    resources: [
      { id: 1, name: "Platform Architecture", type: "PDF", size: "3.2 MB", date: "2025-03-25" },
      { id: 2, name: "API Documentation", type: "HTML", size: "1.1 MB", date: "2025-05-18" },
      { id: 3, name: "Data Model Diagram", type: "PNG", size: "0.8 MB", date: "2025-04-10" },
    ],
  },
]

// Sample clients for dropdown
const clients = [
  { id: "1", name: "TechVision Inc." },
  { id: "2", name: "GlobalTech" },
  { id: "3", name: "Acme Corp" },
  { id: "4", name: "Innovate Solutions" },
  { id: "5", name: "TechSolutions Inc." },
]

export default function ProjectEditPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("details")

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem("adminAuthenticated") === "true"
    if (!isAuthenticated) {
      router.push("/admin/login")
      return
    }

    // In a real app, you would fetch the project data from an API
    // For this example, we'll use the sample data
    const foundProject = projectsData.find((p) => p.id === params.id)
    if (foundProject) {
      setProject({ ...foundProject })
    } else {
      // Project not found, redirect to projects list
      router.push("/admin/projects")
    }
    setLoading(false)
  }, [params.id, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProject((prev: any) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProject((prev: any) => ({
      ...prev,
      [name]: Number.parseInt(value, 10),
    }))
  }

  const handleMilestoneChange = (index: number, field: string, value: any) => {
    setProject((prev: any) => {
      const updatedMilestones = [...prev.milestones]
      updatedMilestones[index] = {
        ...updatedMilestones[index],
        [field]: value,
      }
      return {
        ...prev,
        milestones: updatedMilestones,
      }
    })
  }

  const handleAddMilestone = () => {
    setProject((prev: any) => ({
      ...prev,
      milestones: [
        ...prev.milestones,
        {
          id: Math.max(0, ...prev.milestones.map((m: any) => m.id)) + 1,
          title: "",
          date: new Date().toISOString().split("T")[0],
          completed: false,
        },
      ],
    }))
  }

  const handleRemoveMilestone = (index: number) => {
    setProject((prev: any) => ({
      ...prev,
      milestones: prev.milestones.filter((_: any, i: number) => i !== index),
    }))
  }

  const handleTeamMemberChange = (index: number, field: string, value: any) => {
    setProject((prev: any) => {
      const updatedTeam = [...prev.team]
      updatedTeam[index] = {
        ...updatedTeam[index],
        [field]: value,
      }
      return {
        ...prev,
        team: updatedTeam,
      }
    })
  }

  const handleAddTeamMember = () => {
    setProject((prev: any) => ({
      ...prev,
      team: [
        ...prev.team,
        {
          id: Math.max(0, ...prev.team.map((m: any) => m.id)) + 1,
          name: "",
          role: "",
          email: "",
        },
      ],
    }))
  }

  const handleRemoveTeamMember = (index: number) => {
    setProject((prev: any) => ({
      ...prev,
      team: prev.team.filter((_: any, i: number) => i !== index),
    }))
  }

  const handleSave = () => {
    setSaving(true)
    // In a real app, you would send the updated project data to your API
    // For this example, we'll just simulate a delay and redirect
    setTimeout(() => {
      setSaving(false)
      router.push(`/admin/projects/${params.id}`)
    }, 1000)
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-4 w-[250px] bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-[200px] bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="icon" asChild className="mr-4">
            <Link href="/admin/projects">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Project Not Found</h1>
        </div>
        <p>The requested project could not be found.</p>
        <Button asChild className="mt-4">
          <Link href="/admin/projects">Return to Projects</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center">
          <Button variant="outline" size="icon" asChild className="mr-4">
            <Link href={`/admin/projects/${params.id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit Project</h1>
            <p className="text-muted-foreground">Update information for {project.name}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/projects/${params.id}`}>Cancel</Link>
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Project Details</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Edit the basic details of this project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Project Name</Label>
                  <Input id="name" name="name" value={project.name} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientId">Client</Label>
                  <select
                    id="clientId"
                    name="clientId"
                    value={project.clientId}
                    onChange={handleChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    name="status"
                    value={project.status}
                    onChange={handleChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="On Track">On Track</option>
                    <option value="In Progress">In Progress</option>
                    <option value="At Risk">At Risk</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="completion">Completion (%)</Label>
                  <Input
                    id="completion"
                    name="completion"
                    type="number"
                    min="0"
                    max="100"
                    value={project.completion}
                    onChange={handleNumberChange}
                  />
                  <div className="h-2 w-full bg-gray-100 rounded-full">
                    <div
                      className={`h-full rounded-full ${
                        project.status === "On Track"
                          ? "bg-green-500"
                          : project.status === "At Risk"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                      }`}
                      style={{ width: `${project.completion}%` }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={project.startDate}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input id="deadline" name="deadline" type="date" value={project.deadline} onChange={handleChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Project Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={project.description}
                  onChange={handleChange}
                  rows={5}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Project Team</CardTitle>
                <CardDescription>Manage team members assigned to this project</CardDescription>
              </div>
              <Button onClick={handleAddTeamMember}>
                <Plus className="mr-2 h-4 w-4" />
                Add Team Member
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.team.map((member: any, index: number) => (
                  <div
                    key={member.id}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="space-y-2">
                      <Label htmlFor={`team-${index}-name`}>Name</Label>
                      <Input
                        id={`team-${index}-name`}
                        value={member.name}
                        onChange={(e) => handleTeamMemberChange(index, "name", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`team-${index}-role`}>Role</Label>
                      <Input
                        id={`team-${index}-role`}
                        value={member.role}
                        onChange={(e) => handleTeamMemberChange(index, "role", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`team-${index}-email`}>Email</Label>
                      <Input
                        id={`team-${index}-email`}
                        type="email"
                        value={member.email}
                        onChange={(e) => handleTeamMemberChange(index, "email", e.target.value)}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-600"
                        onClick={() => handleRemoveTeamMember(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Project Milestones</CardTitle>
                <CardDescription>Manage key milestones for this project</CardDescription>
              </div>
              <Button onClick={handleAddMilestone}>
                <Plus className="mr-2 h-4 w-4" />
                Add Milestone
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.milestones.map((milestone: any, index: number) => (
                  <div
                    key={milestone.id}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="space-y-2">
                      <Label htmlFor={`milestone-${index}-title`}>Title</Label>
                      <Input
                        id={`milestone-${index}-title`}
                        value={milestone.title}
                        onChange={(e) => handleMilestoneChange(index, "title", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`milestone-${index}-date`}>Date</Label>
                      <Input
                        id={`milestone-${index}-date`}
                        type="date"
                        value={milestone.date}
                        onChange={(e) => handleMilestoneChange(index, "date", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`milestone-${index}-completed`}>Status</Label>
                      <div className="flex items-center h-10">
                        <input
                          id={`milestone-${index}-completed`}
                          type="checkbox"
                          checked={milestone.completed}
                          onChange={(e) => handleMilestoneChange(index, "completed", e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor={`milestone-${index}-completed`} className="ml-2 text-sm">
                          Completed
                        </label>
                      </div>
                    </div>
                    <div className="flex items-end">
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-600"
                        onClick={() => handleRemoveMilestone(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
