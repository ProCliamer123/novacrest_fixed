import { Suspense } from "react"
import { redirect } from "next/navigation"
import { getUserFromRequest } from "@/lib/auth"
import { cookies } from "next/headers"
import { getResourcesForClient } from "@/app/actions/client-portal-actions"
import { FileText, FileImage, FileVideo, LinkIcon, File } from "lucide-react"

export default async function ResourcesPage() {
  const user = await getUserFromRequest(cookies())

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "client") {
    redirect("/unauthorized")
  }

  const resources = await getResourcesForClient()

  // Helper function to get icon based on resource type
  const getResourceIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "document":
        return FileText
      case "image":
        return FileImage
      case "video":
        return FileVideo
      case "link":
        return LinkIcon
      default:
        return File
    }
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Resources</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={<div>Loading resources...</div>}>
          {resources.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No resources available yet.</p>
            </div>
          ) : (
            resources.map((resource) => {
              const Icon = getResourceIcon(resource.type)

              return (
                <div key={resource.id} className="rounded-xl border bg-card text-card-foreground shadow">
                  <div className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="rounded-full bg-primary/10 p-3">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{resource.title}</h3>
                        <p className="text-sm text-muted-foreground">{resource.description}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        View Resource
                      </a>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </Suspense>
      </div>
    </div>
  )
}
