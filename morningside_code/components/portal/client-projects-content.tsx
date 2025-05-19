"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { getClientProjects } from "@/lib/client-portal-service"
import { ProjectStatusCard } from "@/components/portal/project-status-card"

export function ClientProjectsContent() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Get client ID from localStorage
        const userJson = localStorage.getItem("user")
        const clientId = userJson ? JSON.parse(userJson).clientId : null

        if (!clientId) {
          setError("Client ID not found")
          setLoading(false)
          return
        }

        const data = await getClientProjects(clientId)
        setProjects(data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching client projects:", err)
        setError("Failed to load projects")
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 mb-2">{error}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-primary text-white rounded-md">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">No projects found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <Card key={project.id}>
          <CardContent className="p-6">
            <ProjectStatusCard project={project} />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
