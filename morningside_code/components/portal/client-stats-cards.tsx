import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ClientStatsCardsProps {
  projectStats: {
    total: number
    active: number
    completed: number
    pending: number
  }
  milestoneStats: {
    total: number
    completed: number
    upcoming: number
    overdue: number
  }
}

export function ClientStatsCards({ projectStats, milestoneStats }: ClientStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{projectStats.active}</div>
          <p className="text-xs text-muted-foreground">
            {projectStats.total} total projects ({projectStats.completed} completed)
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{milestoneStats.upcoming}</div>
          <p className="text-xs text-muted-foreground">Due in the next 30 days ({milestoneStats.overdue} overdue)</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">7</div>
          <p className="text-xs text-muted-foreground">Documents and resources available</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {projectStats.total > 0 ? Math.round((projectStats.completed / projectStats.total) * 100) : 0}%
          </div>
          <p className="text-xs text-muted-foreground">Project completion rate</p>
        </CardContent>
      </Card>
    </div>
  )
}
