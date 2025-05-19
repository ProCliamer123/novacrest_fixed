"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { ArrowLeft, FileText, LinkIcon, ImageIcon, FileVideo, File } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { createResource } from "@/app/actions/resource-actions"
import { getClients } from "@/app/actions/client-actions"

const resourceSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(5, {
    message: "Description must be at least 5 characters.",
  }),
  url: z.string().url({
    message: "Please enter a valid URL.",
  }),
  type: z.enum(["document", "image", "video", "link", "other"], {
    required_error: "Please select a resource type.",
  }),
  clientId: z.string({
    required_error: "Please select a client.",
  }),
})

type ResourceFormValues = z.infer<typeof resourceSchema>

export default function NewResourcePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Get the client ID from the URL if it exists
  const clientIdFromUrl = searchParams.get("client")

  // Default values for the form
  const defaultValues: Partial<ResourceFormValues> = {
    title: "",
    description: "",
    url: "",
    type: "document",
    clientId: clientIdFromUrl || "",
  }

  const form = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceSchema),
    defaultValues,
  })

  useEffect(() => {
    async function loadClients() {
      try {
        const clientsData = await getClients()
        setClients(clientsData || [])
      } catch (error) {
        console.error("Failed to load clients:", error)
        toast({
          title: "Error",
          description: "Failed to load clients. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadClients()
  }, [])

  async function onSubmit(data: ResourceFormValues) {
    try {
      const result = await createResource(data)

      if (result.success) {
        toast({
          title: "Resource created",
          description: "The resource has been created successfully.",
        })

        // Redirect to the client page if we came from there
        if (clientIdFromUrl) {
          router.push(`/admin/clients/${clientIdFromUrl}?tab=resources`)
        } else {
          router.push("/admin/resources")
        }
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create resource. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to create resource:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-4 w-[250px] bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-[200px] bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center">
        <Button variant="outline" size="icon" asChild className="mr-4">
          <Link href="/admin/resources">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Add New Resource</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resource Details</CardTitle>
          <CardDescription>
            Add a new resource to share with clients. This can be a document, image, video, or link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Resource title" {...field} />
                      </FormControl>
                      <FormDescription>A descriptive title for the resource.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resource Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a resource type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="document">
                            <div className="flex items-center">
                              <FileText className="mr-2 h-4 w-4" />
                              <span>Document</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="image">
                            <div className="flex items-center">
                              <ImageIcon className="mr-2 h-4 w-4" />
                              <span>Image</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="video">
                            <div className="flex items-center">
                              <FileVideo className="mr-2 h-4 w-4" />
                              <span>Video</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="link">
                            <div className="flex items-center">
                              <LinkIcon className="mr-2 h-4 w-4" />
                              <span>Link</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="other">
                            <div className="flex items-center">
                              <File className="mr-2 h-4 w-4" />
                              <span>Other</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>The type of resource you are sharing.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide a brief description of this resource"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Explain what this resource contains or how it should be used.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resource URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/resource" {...field} />
                    </FormControl>
                    <FormDescription>The URL where this resource can be accessed.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a client" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients.length > 0 ? (
                          clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-clients" disabled>
                            No clients available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>The client who will have access to this resource.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4">
                <Button variant="outline" asChild>
                  <Link href="/admin/resources">Cancel</Link>
                </Button>
                <Button type="submit">Create Resource</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
