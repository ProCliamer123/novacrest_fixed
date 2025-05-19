"use client"

import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertCircle, CheckCircle, Clock, ExternalLink, PauseCircle } from "lucide-react"
import type { Project } from "@/lib/db"

interface ClientProjectsListProps {
  projects: Project[]
}

export function ClientProjectsList({ projects }: ClientProjectsListProps) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <Clock className="h-10 w-10 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No Projects Yet</h3>
        <p className="text-sm text-muted-foreground mt-2">
          You don't have any projects yet. New projects will appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium">{project.name}</TableCell>
              <TableCell>
                <ProjectStatusBadge status={project.status} />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress value={getProjectProgress(project)} className="h-2 w-[60px]" />
                  <span className="text-xs text-muted-foreground">{getProjectProgress(project)}%</span>
                </div>
              </TableCell>
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {new Date(project.updatedAt).toLocaleDateString()} at{" "}
                        {new Date(project.updatedAt).toLocaleTimeString()}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/portal/projects/${project.id}`}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function ProjectStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "planning":
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <Clock className="mr-1 h-3 w-3" /> Planning
        </Badge>
      )
    case "in-progress":
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <AlertCircle className="mr-1 h-3 w-3" /> In Progress
        </Badge>
      )
    case "completed":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="mr-1 h-3 w-3" /> Completed
        </Badge>
      )
    case "on-hold":
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
          <PauseCircle className="mr-1 h-3 w-3" /> On Hold
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function getProjectProgress(project: Project): number {
  // In a real app, this would be calculated based on milestones or tasks
  // For now, we'll use a random value between 0-100
  return Math.floor(Math.random() * 100)
}
