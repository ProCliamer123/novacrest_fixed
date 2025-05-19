import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, Download, Search, BookOpen, Video, FileQuestion, Clock } from "lucide-react"

export default function ResourcesPage() {
  const resources = [
    {
      id: 1,
      title: "Getting Started with AI Automation",
      type: "guide",
      category: "onboarding",
      description: "A comprehensive guide to understanding how AI automation works in your business context.",
      date: "May 10, 2025",
      downloadUrl: "#",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      id: 2,
      title: "Data Integration Best Practices",
      type: "whitepaper",
      category: "technical",
      description: "Learn how to properly prepare and integrate your data for optimal AI performance.",
      date: "April 28, 2025",
      downloadUrl: "#",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      id: 3,
      title: "AI Automation Demo",
      type: "video",
      category: "demo",
      description: "Watch a demonstration of how our AI automation solutions work in real-world scenarios.",
      date: "May 5, 2025",
      downloadUrl: "#",
      icon: <Video className="h-5 w-5" />,
    },
    {
      id: 4,
      title: "Frequently Asked Questions",
      type: "faq",
      category: "support",
      description: "Answers to common questions about AI automation implementation and maintenance.",
      date: "May 15, 2025",
      downloadUrl: "#",
      icon: <FileQuestion className="h-5 w-5" />,
    },
    {
      id: 5,
      title: "Monthly AI Trends Report",
      type: "report",
      category: "insights",
      description: "Stay updated with the latest trends and developments in AI automation technology.",
      date: "May 1, 2025",
      downloadUrl: "#",
      icon: <Clock className="h-5 w-5" />,
    },
    {
      id: 6,
      title: "Implementation Checklist",
      type: "checklist",
      category: "technical",
      description: "A step-by-step checklist to ensure successful implementation of your AI automation solution.",
      date: "April 15, 2025",
      downloadUrl: "#",
      icon: <FileText className="h-5 w-5" />,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Resources</h1>
        <p className="text-muted-foreground">
          Access guides, documentation, and training materials for your AI automation project.
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search resources..." className="w-full bg-background pl-8" />
        </div>
        <Button variant="outline">Filters</Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Resources</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource) => (
              <Card key={resource.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{resource.title}</CardTitle>
                  <div className="rounded-full bg-primary/10 p-1">{resource.icon}</div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)} • {resource.date}
                  </p>
                  <p className="mt-2 text-sm">{resource.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <a href={resource.downloadUrl} className="flex items-center justify-center">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="guides" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {resources
              .filter((resource) => resource.type === "guide" || resource.category === "onboarding")
              .map((resource) => (
                <Card key={resource.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{resource.title}</CardTitle>
                    <div className="rounded-full bg-primary/10 p-1">{resource.icon}</div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)} • {resource.date}
                    </p>
                    <p className="mt-2 text-sm">{resource.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <a href={resource.downloadUrl} className="flex items-center justify-center">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="technical" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {resources
              .filter((resource) => resource.category === "technical")
              .map((resource) => (
                <Card key={resource.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{resource.title}</CardTitle>
                    <div className="rounded-full bg-primary/10 p-1">{resource.icon}</div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)} • {resource.date}
                    </p>
                    <p className="mt-2 text-sm">{resource.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <a href={resource.downloadUrl} className="flex items-center justify-center">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="videos" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {resources
              .filter((resource) => resource.type === "video")
              .map((resource) => (
                <Card key={resource.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{resource.title}</CardTitle>
                    <div className="rounded-full bg-primary/10 p-1">{resource.icon}</div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)} • {resource.date}
                    </p>
                    <p className="mt-2 text-sm">{resource.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <a href={resource.downloadUrl} className="flex items-center justify-center">
                        <Download className="mr-2 h-4 w-4" />
                        Watch Video
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="support" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {resources
              .filter((resource) => resource.category === "support")
              .map((resource) => (
                <Card key={resource.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{resource.title}</CardTitle>
                    <div className="rounded-full bg-primary/10 p-1">{resource.icon}</div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)} • {resource.date}
                    </p>
                    <p className="mt-2 text-sm">{resource.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <a href={resource.downloadUrl} className="flex items-center justify-center">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Request Custom Resources</CardTitle>
          <CardDescription>
            Need specific documentation or training materials? Let us know what you're looking for.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid gap-2">
              <label htmlFor="resource-type" className="text-sm font-medium">
                Resource Type
              </label>
              <select
                id="resource-type"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="guide">Guide</option>
                <option value="whitepaper">Whitepaper</option>
                <option value="video">Video Tutorial</option>
                <option value="training">Training Session</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Please describe what you're looking for..."
              ></textarea>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Submit Request</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
