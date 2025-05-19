"use client"

import { CalendarClock, FileText, MessageSquare, Users } from "lucide-react"

// Helper function to determine icon based on activity type
const getActivityIcon = (activity) => {
  const actionType = activity.action?.toLowerCase() || ""

  if (actionType.includes("comment") || actionType.includes("message")) {
    return MessageSquare
  } else if (actionType.includes("document") || actionType.includes("file")) {
    return FileText
  } else if (actionType.includes("meeting") || actionType.includes("schedule")) {
    return CalendarClock
  } else if (actionType.includes("team") || actionType.includes("assign")) {
    return Users
  } else {
    return FileText // Default icon
  }
}

// Helper function to format timestamp
const formatTimestamp = (timestamp) => {
  if (!timestamp) return ""

  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.round(diffMs / 60000)
  const diffHours = Math.round(diffMs / 3600000)
  const diffDays = Math.round(diffMs / 86400000)

  if (diffMins < 60) {
    return `${diffMins} ${diffMins === 1 ? "minute" : "minutes"} ago`
  } else if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`
  } else if (diffDays < 7) {
    return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`
  } else {
    return date.toLocaleDateString()
  }
}

export function ActivityFeed({ activities = [] }) {
  // If no activities provided, show sample data
  if (!activities || activities.length === 0) {
    const sampleActivities = [
      {
        id: 1,
        action: "John left a comment on your project requirements",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        id: 2,
        action: "Project proposal document was updated",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      },
      {
        id: 3,
        action: "Weekly progress meeting scheduled for Friday, 10:00 AM",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        id: 4,
        action: "Sarah was assigned as your new data scientist",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
      {
        id: 5,
        action: "Initial data analysis report is ready for review",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      },
    ]

    return renderActivityFeed(sampleActivities)
  }

  return renderActivityFeed(activities)
}

// Helper function to render the activity feed
function renderActivityFeed(activities) {
  return (
    <div className="space-y-5">
      {activities.map((activity) => {
        const Icon = getActivityIcon(activity)

        return (
          <div key={activity.id} className="flex items-start">
            <div className="mr-3 rounded-full bg-muted p-2">
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm">{activity.action}</p>
              <p className="text-xs text-muted-foreground mt-1">{formatTimestamp(activity.timestamp)}</p>
            </div>
          </div>
        )
      })}

      {activities.length > 0 && (
        <button className="text-sm text-primary hover:underline w-full text-center mt-2">View all activity</button>
      )}
    </div>
  )
}
