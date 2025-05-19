import { CalendarDays, CheckCircle2, Circle } from "lucide-react"

// Helper function to determine status based on project status
const getTimelineStatus = (projectStatus) => {
  switch (projectStatus) {
    case "completed":
      return "completed"
    case "in_progress":
      return "in-progress"
    case "review":
      return "in-progress"
    default:
      return "upcoming"
  }
}

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return "TBD"
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function TimelineCard({ projects = [] }) {
  // If no projects, show sample data
  if (!projects || projects.length === 0) {
    const timelineItems = [
      {
        title: "Data Collection Complete",
        date: "March 15, 2025",
        status: "completed",
        description: "All required data has been collected and processed.",
      },
      {
        title: "Initial Model Training",
        date: "March 28, 2025",
        status: "completed",
        description: "First version of the AI model has been trained.",
      },
      {
        title: "Integration Phase",
        date: "April 10, 2025",
        status: "in-progress",
        description: "Integrating the AI model with your existing systems.",
      },
      {
        title: "Testing & Validation",
        date: "April 25, 2025",
        status: "upcoming",
        description: "Comprehensive testing of the integrated solution.",
      },
      {
        title: "Deployment",
        date: "May 5, 2025",
        status: "upcoming",
        description: "Full deployment of the AI automation solution.",
      },
    ]

    return renderTimeline(timelineItems)
  }

  // Process real project data into timeline items
  const timelineItems = projects.map((project) => ({
    title: project.name,
    date: formatDate(project.endDate || project.startDate),
    status: getTimelineStatus(project.status),
    description: project.description || `Project ${project.status.replace("_", " ")}.`,
  }))

  return renderTimeline(timelineItems)
}

// Helper function to render the timeline
function renderTimeline(timelineItems) {
  return (
    <div className="space-y-8">
      {timelineItems.map((item, index) => (
        <div key={index} className="flex">
          <div className="flex flex-col items-center mr-4">
            <div>
              {item.status === "completed" ? (
                <CheckCircle2 className="h-5 w-5 text-primary" />
              ) : item.status === "in-progress" ? (
                <Circle className="h-5 w-5 text-primary" fill="currentColor" fillOpacity={0.2} />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            {index < timelineItems.length - 1 && <div className="w-px h-full bg-border mt-1" />}
          </div>
          <div className="pb-8">
            <div className="text-sm font-medium">{item.title}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <CalendarDays className="mr-1 h-3 w-3" />
              {item.date}
            </div>
            <div className="text-sm mt-2">{item.description}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
