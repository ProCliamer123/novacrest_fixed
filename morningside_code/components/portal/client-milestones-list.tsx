"use client"

import { format, isPast } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle2, Clock, AlertTriangle, Calendar } from "lucide-react"
import type { Milestone } from "@/lib/db"

interface ClientMilestonesListProps {
  milestones: (Milestone & { projectName: string })[]
}

export function ClientMilestonesList({ milestones }: ClientMilestonesListProps) {
  if (milestones.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <Calendar className="h-10 w-10 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No Milestones Yet</h3>
        <p className="text-sm text-muted-foreground mt-2">
          You don't have any milestones yet. Project milestones will appear here.
        </p>
      </div>
    )
  }

  // Sort milestones: incomplete and upcoming first, then incomplete and overdue, then completed
  const sortedMilestones = [...milestones].sort((a, b) => {
    // If one is completed and the other isn't, the incomplete one comes first
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }

    // If both are incomplete, sort by due date (overdue last)
    if (!a.completed && !b.completed) {
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    }

    // If both are complete, sort by most recently completed
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Milestone</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedMilestones.map((milestone) => (
            <TableRow key={milestone.id}>
              <TableCell className="font-medium">{milestone.title}</TableCell>
              <TableCell>{milestone.projectName}</TableCell>
              <TableCell>
                {milestone.dueDate ? (
                  format(new Date(milestone.dueDate), "MMM d, yyyy")
                ) : (
                  <span className="text-muted-foreground">No due date</span>
                )}
              </TableCell>
              <TableCell>
                <MilestoneStatusBadge milestone={milestone} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function MilestoneStatusBadge({ milestone }: { milestone: Milestone }) {
  if (milestone.completed) {
    return (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        <CheckCircle2 className="mr-1 h-3 w-3" /> Completed
      </Badge>
    )
  }

  if (!milestone.dueDate) {
    return (
      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
        <Clock className="mr-1 h-3 w-3" /> No deadline
      </Badge>
    )
  }

  const dueDate = new Date(milestone.dueDate)

  if (isPast(dueDate)) {
    return (
      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
        <AlertTriangle className="mr-1 h-3 w-3" /> Overdue
      </Badge>
    )
  }

  // Due in the future
  return (
    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
      <Calendar className="mr-1 h-3 w-3" /> Upcoming
    </Badge>
  )
}
