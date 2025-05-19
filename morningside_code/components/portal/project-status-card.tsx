import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Define project status phases in order
const phases = ["planning", "in_progress", "review", "completed", "on_hold"]

// Map status to display name
const statusDisplayNames = {
  planning: "Planning",
  in_progress: "In Progress",
  review: "Review",
  completed: "Completed",
  on_hold: "On Hold",
}

// Calculate completion percentage based on status
const getCompletionPercentage = (status) => {
  switch (status) {
    case "planning":
      return 20
    case "in_progress":
      return 50
    case "review":
      return 80
    case "completed":
      return 100
    case "on_hold":
      return 30
    default:
      return 0
  }
}

export function ProjectStatusCard({ projects = [] }) {
  // If no projects, show sample data
  if (!projects || projects.length === 0) {
    const sampleData = [
      { name: "Data Collection", completed: 100, remaining: 0 },
      { name: "Analysis", completed: 85, remaining: 15 },
      { name: "Model Training", completed: 75, remaining: 25 },
      { name: "Integration", completed: 60, remaining: 40 },
      { name: "Testing", completed: 45, remaining: 55 },
      { name: "Deployment", completed: 20, remaining: 80 },
      { name: "Monitoring", completed: 0, remaining: 100 },
    ]

    return (
      <div className="w-full">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={sampleData}
            layout="vertical"
            stackOffset="expand"
            margin={{
              top: 20,
              right: 30,
              left: 70,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" tickFormatter={(value) => `${value}%`} />
            <YAxis type="category" dataKey="name" />
            <Tooltip formatter={(value) => [`${value}%`, "Completion"]} labelFormatter={(value) => `Phase: ${value}`} />
            <Bar dataKey="completed" stackId="a" fill="#10b981" name="Completed" />
            <Bar dataKey="remaining" stackId="a" fill="#e5e7eb" name="Remaining" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  // Process real project data
  const projectData = projects.map((project) => {
    const completion = getCompletionPercentage(project.status)
    return {
      name: project.name,
      completed: completion,
      remaining: 100 - completion,
      status: statusDisplayNames[project.status] || project.status,
    }
  })

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={projectData}
          layout="vertical"
          stackOffset="expand"
          margin={{
            top: 20,
            right: 30,
            left: 70,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" tickFormatter={(value) => `${value}%`} />
          <YAxis type="category" dataKey="name" />
          <Tooltip
            formatter={(value) => [`${value}%`, "Completion"]}
            labelFormatter={(value) => `Project: ${value}`}
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const project = projectData.find((p) => p.name === label)
                return (
                  <div className="bg-background p-2 border rounded shadow-sm">
                    <p className="font-medium">{label}</p>
                    <p className="text-sm">Status: {project?.status}</p>
                    <p className="text-sm">Completion: {project?.completed}%</p>
                  </div>
                )
              }
              return null
            }}
          />
          <Bar dataKey="completed" stackId="a" fill="#10b981" name="Completed" />
          <Bar dataKey="remaining" stackId="a" fill="#e5e7eb" name="Remaining" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
