"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import type { Activity } from "@/lib/db"

interface RecentActivitiesProps {
  limit?: number
  fallbackMode?: boolean
}

export function RecentActivities({ limit = 5, fallbackMode = false }: RecentActivitiesProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchActivities() {
      if (fallbackMode) {
        // Use mock data in fallback mode
        setActivities([
          {
            id: "1",
            action: "Created new client",
            timestamp: new Date(),
            entityId: "client-1",
            entityType: "client",
            userId: "user-1",
            clientId: "client-1",
            projectId: null,
            details: { clientName: "Acme Corp" },
          },
          {
            id: "2",
            action: "Updated project status",
            timestamp: new Date(Date.now() - 3600000),
            entityId: "project-1",
            entityType: "project",
            userId: "user-1",
            clientId: "client-1",
            projectId: "project-1",
            details: { projectName: "Website Redesign", status: "In Progress" },
          },
          {
            id: "3",
            action: "Added new resource",
            timestamp: new Date(Date.now() - 7200000),
            entityId: "resource-1",
            entityType: "resource",
            userId: "user-1",
            clientId: "client-2",
            projectId: null,
            details: { resourceName: "Project Brief", type: "document" },
          },
        ])
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/activities?limit=${limit}`)

        if (!response.ok) {
          throw new Error("Failed to fetch activities")
        }

        const data = await response.json()
        setActivities(data)
      } catch (err) {
        console.error("Error fetching activities:", err)
        setError("Failed to load recent activities")

        // Use mock data as fallback
        setActivities([
          {
            id: "1",
            action: "Created new client",
            timestamp: new Date(),
            entityId: "client-1",
            entityType: "client",
            userId: "user-1",
            clientId: "client-1",
            projectId: null,
            details: { clientName: "Acme Corp" },
          },
          {
            id: "2",
            action: "Updated project status",
            timestamp: new Date(Date.now() - 3600000),
            entityId: "project-1",
            entityType: "project",
            userId: "user-1",
            clientId: "client-1",
            projectId: "project-1",
            details: { projectName: "Website Redesign", status: "In Progress" },
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchActivities()
  }, [limit, fallbackMode])

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-100 rounded animate-pulse w-1/2"></div>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="p-4 border border-red-200 rounded-md bg-red-50 text-red-700">{error}</div>
  }

  return (
    <div className="space-y-4">
      {activities.length === 0 ? (
        <p className="text-center text-gray-500 py-4">No recent activities</p>
      ) : (
        activities.map((activity) => (
          <Card key={activity.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start">
                <div className="mr-4 mt-1">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 text-xs">{activity.entityType?.charAt(0).toUpperCase() || "A"}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-500">{new Date(activity.timestamp).toLocaleString()}</p>
                  {activity.details && (
                    <div className="mt-2 text-sm text-gray-700">
                      {Object.entries(activity.details).map(([key, value]) => (
                        <p key={key}>
                          <span className="font-medium">{key}: </span>
                          {String(value)}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
