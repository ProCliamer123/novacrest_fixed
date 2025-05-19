"use client"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ExternalLink, FileText, ImageIcon, LinkIcon, FileVideo, File, Download } from "lucide-react"
import type { Resource } from "@/lib/db"

interface ClientResourcesListProps {
  resources: Resource[]
}

export function ClientResourcesList({ resources }: ClientResourcesListProps) {
  if (resources.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <FileText className="h-10 w-10 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No Resources Yet</h3>
        <p className="text-sm text-muted-foreground mt-2">
          You don't have any resources yet. Shared resources will appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Resource</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Added</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resources.map((resource) => (
            <TableRow key={resource.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{resource.title}</span>
                  <span className="text-xs text-muted-foreground line-clamp-1">{resource.description}</span>
                </div>
              </TableCell>
              <TableCell>
                <ResourceTypeBadge type={resource.type} />
              </TableCell>
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(resource.createdAt), { addSuffix: true })}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {new Date(resource.createdAt).toLocaleDateString()} at{" "}
                        {new Date(resource.createdAt).toLocaleTimeString()}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View
                    </a>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={resource.url} download>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </a>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function ResourceTypeBadge({ type }: { type: string }) {
  switch (type) {
    case "document":
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <FileText className="mr-1 h-3 w-3" /> Document
        </Badge>
      )
    case "image":
      return (
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          <ImageIcon className="mr-1 h-3 w-3" /> Image
        </Badge>
      )
    case "video":
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <FileVideo className="mr-1 h-3 w-3" /> Video
        </Badge>
      )
    case "link":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <LinkIcon className="mr-1 h-3 w-3" /> Link
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
          <File className="mr-1 h-3 w-3" /> {type}
        </Badge>
      )
  }
}
