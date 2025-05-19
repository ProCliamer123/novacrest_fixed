"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getClientData } from "@/lib/client-portal-service"
import { ClientStatsCards } from "@/components/portal/client-stats-cards"
import { ActivityFeed } from "@/components/portal/activity-feed"
import { TimelineCard } from "@/components/portal/timeline-card"
import { ProjectStatusCard } from "@/components/portal/project-status-card"
import { ClientResourcesList } from "@/components/portal/client-resources-list"

export function ClientDashboardContent() {
  const [clientData, setClientData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get client ID from localStorage
        const userJson = localStorage.getItem("user")
        const clientId = userJson ? JSON.parse(userJson).clientId : null

        if (!clientId) {
          setError("Client ID not found")
          setLoading(false)
          return
        }

        const data = await getClientData(clientId)
        setClientData(data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching client data:", err)
        setError("Failed to load client data")
        setLoading(false)
      }
    }

    fetchData()
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

  // If we have data, render the dashboard
  if (clientData) {
    return (
      <>
        <ClientStatsCards projectStats={clientData.projectStats} milestoneStats={clientData.milestoneStats} />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent project updates and activities</CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityFeed activities={clientData.activities} />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Upcoming Milestones</CardTitle>
              <CardDescription>Your project milestones and deadlines</CardDescription>
            </CardHeader>
            <CardContent>
              <TimelineCard milestones={clientData.milestones.slice(0, 5)} />
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
              <div className="space-y-4">
                {clientData.projects.slice(0, 3).map((project: any) => (
                  <ProjectStatusCard key={project.id} project={project} />
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Resources</CardTitle>
              <CardDescription>Recently shared documents and resources</CardDescription>
            </CardHeader>
            <CardContent>
              <ClientResourcesList resources={clientData.resources.slice(0, 5)} />
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  // Fallback if no data
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <p>No client data available</p>
    </div>
  )
}
