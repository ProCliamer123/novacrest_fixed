"use client"

import { useEffect, useState } from "react"
import { clientStore, type Activity } from "@/lib/client-store"

export function RecentActivitiesTable() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (clientStore) {
      // Get activities and sort by timestamp (newest first)
      const allActivities = clientStore.getActivities()
      const sortedActivities = [...allActivities].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )

      // Take only the 10 most recent activities
      setActivities(sortedActivities.slice(0, 10))
    }
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="h-9 w-9 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 w-3/4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (activities.length === 0) {
    return <p className="text-center text-muted-foreground py-4">No activities recorded yet.</p>
  }

  // Helper function to format the timestamp
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Helper function to format the action
  const formatAction = (action: string) => {
    return action
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-4 pb-4 border-b last:border-0 last:pb-0">
          <div className="min-w-24 text-sm text-muted-foreground">{formatDate(activity.timestamp)}</div>
          <div>
            <p className="font-medium">{formatAction(activity.action)}</p>
            <p className="text-sm text-muted-foreground">
              {activity.details ? JSON.stringify(activity.details) : "No details provided"}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
