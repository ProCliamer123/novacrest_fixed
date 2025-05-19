"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getClientMilestones } from "@/lib/client-portal-service"
import { TimelineCard } from "@/components/portal/timeline-card"

export function ClientMilestonesContent() {
  const [milestones, setMilestones] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        // Get client ID from localStorage
        const userJson = localStorage.getItem("user")
        const clientId = userJson ? JSON.parse(userJson).clientId : null

        if (!clientId) {
          setError("Client ID not found")
          setLoading(false)
          return
        }

        const data = await getClientMilestones(clientId)
        setMilestones(data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching client milestones:", err)
        setError("Failed to load milestones")
        setLoading(false)
      }
    }

    fetchMilestones()
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

  if (milestones.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">No milestones found</p>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Milestones</CardTitle>
        <CardDescription>Milestones and deadlines for your projects</CardDescription>
      </CardHeader>
      <CardContent>
        <TimelineCard milestones={milestones} />
      </CardContent>
    </Card>
  )
}
