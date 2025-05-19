"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { FileText, LinkIcon, ImageIcon, FileVideo, File, Plus, Search, Filter, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getResources, getResourcesByType, searchResources, deleteResource } from "@/app/actions/resource-actions"
import { getClients } from "@/app/actions/client-actions"
import { toast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

export default function ResourcesPageClient() {
  const [resources, setResources] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      const [resourcesData, clientsData] = await Promise.all([getResources(), getClients()])

      setResources(resourcesData || [])
      setClients(clientsData || [])
    } catch (error) {
      console.error("Failed to load resources:", error)
      toast({
        title: "Error",
        description: "Failed to load resources. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!searchQuery.trim()) {
      loadData()
      return
    }

    setIsSearching(true)
    try {
      const results = await searchResources(searchQuery)
      setResources(results || [])
      setActiveTab("all") // Reset to all tab when searching
    } catch (error) {
      console.error("Search failed:", error)
      toast({
        title: "Search failed",
        description: "Failed to search resources. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  async function handleTabChange(value: string) {
    setActiveTab(value)
    setLoading(true)

    try {
      let results
      if (value === "all") {
        results = await getResources()
      } else {
        results = await getResourcesByType(value)
      }
      setResources(results || [])
    } catch (error) {
      console.error("Failed to filter resources:", error)
      toast({
        title: "Error",
        description: "Failed to filter resources. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteResource(id: string) {
    if (confirm("Are you sure you want to delete this resource? This action cannot be undone.")) {
      try {
        const result = await deleteResource(id)
        if (result.success) {
          setResources(resources.filter((resource) => resource.id !== id))
          toast({
            title: "Resource deleted",
            description: "The resource has been successfully deleted.",
          })
        } else {
          throw new Error(result.error || "Failed to delete resource")
        }
      } catch (error) {
        console.error("Failed to delete resource:", error)
        toast({
          title: "Error",
          description: "Failed to delete resource. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  // Get client name by ID
  function getClientName(clientId: string) {
    const client = clients.find((c) => c.id === clientId)
    return client ? client.name : "Unknown Client"
  }

  // Get client company name by ID
  function getClientCompanyName(clientId: string) {
    const client = clients.find((c) => c.id === clientId)
    return client ? client.companyName : ""
  }

  // Get icon based on resource type
  function getResourceIcon(type: string) {
    switch (type) {
      case "document":
        return <FileText className="h-6 w-6" />
      case "image":
        return <ImageIcon className="h-6 w-6" />
      case "video":
        return <FileVideo className="h-6 w-6" />
      case "link":
        return <LinkIcon className="h-6 w-6" />
      default:
        return <File className="h-6 w-6" />
    }
  }

  // Get color based on resource type
  function getResourceColor(type: string) {
    switch (type) {
      case "document":
        return "text-blue-500"
      case "image":
        return "text-green-500"
      case "video":
        return "text-purple-500"
      case "link":
        return "text-amber-500"
      default:
        return "text-gray-500"
    }
  }

  // Get client initials
  function getClientInitials(name: string) {
    if (!name) return "??"
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[220px] rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Resources</h1>
        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search resources..."
              className="w-full md:w-[200px] pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isSearching}
            />
          </form>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Filter by Client</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup className="max-h-[200px] overflow-y-auto">
                {clients.map((client) => (
                  <DropdownMenuItem
                    key={client.id}
                    onClick={() => {
                      setSearchQuery(client.name)
                      handleSearch({ preventDefault: () => {} } as React.FormEvent)
                    }}
                  >
                    {client.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" onClick={loadData}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button asChild>
            <Link href="/admin/resources/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Resource
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="document">Documents</TabsTrigger>
          <TabsTrigger value="image">Images</TabsTrigger>
          <TabsTrigger value="video">Videos</TabsTrigger>
          <TabsTrigger value="link">Links</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.length > 0 ? (
              resources.map((resource) => (
                <Card key={resource.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <div className={getResourceColor(resource.type)}>{getResourceIcon(resource.type)}</div>
                      <div>
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                        <CardDescription>
                          {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">{resource.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center pt-3 border-t">
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarFallback>
                          {getClientInitials(resource.clientName || getClientName(resource.clientId))}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-xs text-muted-foreground">
                        {resource.clientName || getClientName(resource.clientId)}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <span className="sr-only">Open menu</span>
                          <svg
                            width="15"
                            height="3"
                            viewBox="0 0 15 3"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                          >
                            <path
                              d="M1.5 1.5C1.5 1.89782 1.65804 2.27936 1.93934 2.56066C2.22064 2.84196 2.60218 3 3 3C3.39782 3 3.77936 2.84196 4.06066 2.56066C4.34196 2.27936 4.5 1.5C4.5 1.10218 4.34196 0.720644 4.06066 0.43934C3.77936 0.158035 3.39782 0 3 0C2.60218 0 2.22064 0.158035 1.93934 0.43934C1.65804 0.720644 1.5 1.10218 1.5 1.5ZM6 1.5C6 1.89782 6.15804 2.27936 6.43934 2.56066C6.72064 2.84196 7.10218 3 7.5 3C7.89782 3 8.27936 2.84196 8.56066 2.56066C8.84196 2.27936 9 1.89782 9 1.5C9 1.10218 8.84196 0.720644 8.56066 0.43934C8.27936 0.158035 7.89782 0 7.5 0C7.10218 0 6.72064 0.158035 6.43934 0.43934C6.15804 0.720644 6 1.10218 6 1.5ZM10.5 1.5C10.5 1.89782 10.658 2.27936 10.9393 2.56066C11.2206 2.84196 11.6022 3 12 3C12.3978 3 12.7794 2.84196 13.0607 2.56066C13.342 2.27936 13.5 1.89782 13.5 1.5C13.5 1.10218 13.342 0.720644 13.0607 0.43934C12.7794 0.158035 12.3978 0 12 0C11.6022 0 11.2206 0.158035 10.9393 0.43934C10.658 0.720644 10.5 1.10218 10.5 1.5Z"
                              fill="currentColor"
                            />
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={resource.url} target="_blank">
                            View Resource
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/resources/${resource.id}/edit`}>Edit</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/clients/${resource.clientId}`}>View Client</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteResource(resource.id)}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <File className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No resources found</h3>
                <p className="text-muted-foreground mt-1 mb-4">
                  {searchQuery
                    ? "No resources match your search criteria."
                    : "Get started by adding your first resource."}
                </p>
                <Button asChild>
                  <Link href="/admin/resources/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Resource
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="document" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Content will be loaded when tab is selected */}
          </div>
        </TabsContent>
        <TabsContent value="image" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Content will be loaded when tab is selected */}
          </div>
        </TabsContent>
        <TabsContent value="video" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Content will be loaded when tab is selected */}
          </div>
        </TabsContent>
        <TabsContent value="link" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Content will be loaded when tab is selected */}
          </div>
        </TabsContent>
        <TabsContent value="other" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Content will be loaded when tab is selected */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
