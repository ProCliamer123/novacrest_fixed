"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Bell, AlertTriangle, CheckCircle, Info, Clock, Settings } from "lucide-react"

export default function NotificationsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem("adminAuthenticated") === "true"
      setIsAuthenticated(authStatus)
      setIsLoading(false)

      if (!authStatus) {
        router.push("/admin/login")
      }
    }

    checkAuth()
    const timer = setTimeout(checkAuth, 500)
    return () => clearTimeout(timer)
  }, [router])

  // Mock notification data
  const notifications = [
    {
      id: 1,
      title: "New client registration",
      message: "TechSolutions Inc. has registered on the portal",
      time: "10 minutes ago",
      type: "info",
      read: false,
    },
    {
      id: 2,
      title: "Project milestone reached",
      message: "AI Content Strategy project has completed the data collection phase",
      time: "1 hour ago",
      type: "success",
      read: false,
    },
    {
      id: 3,
      title: "Resource upload failed",
      message: "The AI Strategy Guide upload failed due to file size limitations",
      time: "3 hours ago",
      type: "error",
      read: true,
    },
    {
      id: 4,
      title: "Project deadline approaching",
      message: "Data Analytics Platform project deadline is in 2 days",
      time: "Yesterday",
      type: "warning",
      read: true,
    },
    {
      id: 5,
      title: "New feedback submitted",
      message: "GlobalTech has submitted feedback on their project",
      time: "Yesterday",
      type: "info",
      read: true,
    },
    {
      id: 6,
      title: "System update scheduled",
      message: "System maintenance scheduled for May 20, 2025 at 2:00 AM",
      time: "2 days ago",
      type: "warning",
      read: true,
    },
    {
      id: 7,
      title: "New support request",
      message: "Acme Corp has submitted a new support request",
      time: "3 days ago",
      type: "info",
      read: true,
    },
  ]

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading notifications...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, don't render the page (redirect will happen in useEffect)
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">Manage your notifications and preferences.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => console.log("Mark all as read")}>
            Mark All as Read
          </Button>
          <Button onClick={() => router.push("/admin/notifications/settings")}>
            <Settings className="mr-2 h-4 w-4" />
            Notification Settings
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            All
            <Badge className="ml-2 bg-primary/10 text-primary" variant="outline">
              {notifications.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread
            <Badge className="ml-2 bg-primary/10 text-primary" variant="outline">
              {notifications.filter((n) => !n.read).length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="info">Info</TabsTrigger>
          <TabsTrigger value="success">Success</TabsTrigger>
          <TabsTrigger value="warning">Warnings</TabsTrigger>
          <TabsTrigger value="error">Errors</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 flex items-start gap-4 ${notification.read ? "" : "bg-muted/50"}`}
                  >
                    <div
                      className={`rounded-full p-2 mt-1 ${
                        notification.type === "info"
                          ? "bg-blue-50 text-blue-500"
                          : notification.type === "success"
                            ? "bg-green-50 text-green-500"
                            : notification.type === "warning"
                              ? "bg-yellow-50 text-yellow-500"
                              : "bg-red-50 text-red-500"
                      }`}
                    >
                      {notification.type === "info" ? (
                        <Info className="h-4 w-4" />
                      ) : notification.type === "success" ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : notification.type === "warning" ? (
                        <AlertTriangle className="h-4 w-4" />
                      ) : (
                        <AlertTriangle className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className={`font-medium ${notification.read ? "" : "font-semibold"}`}>
                            {notification.title}
                          </p>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-xs text-muted-foreground flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            {notification.time}
                          </div>
                          {!notification.read && <div className="h-2 w-2 rounded-full bg-primary"></div>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unread" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {notifications
                  .filter((n) => !n.read)
                  .map((notification) => (
                    <div key={notification.id} className="p-4 flex items-start gap-4 bg-muted/50">
                      <div
                        className={`rounded-full p-2 mt-1 ${
                          notification.type === "info"
                            ? "bg-blue-50 text-blue-500"
                            : notification.type === "success"
                              ? "bg-green-50 text-green-500"
                              : notification.type === "warning"
                                ? "bg-yellow-50 text-yellow-500"
                                : "bg-red-50 text-red-500"
                        }`}
                      >
                        {notification.type === "info" ? (
                          <Info className="h-4 w-4" />
                        ) : notification.type === "success" ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : notification.type === "warning" ? (
                          <AlertTriangle className="h-4 w-4" />
                        ) : (
                          <AlertTriangle className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold">{notification.title}</p>
                            <p className="text-sm text-muted-foreground">{notification.message}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-xs text-muted-foreground flex items-center">
                              <Clock className="mr-1 h-3 w-3" />
                              {notification.time}
                            </div>
                            <div className="h-2 w-2 rounded-full bg-primary"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {["info", "success", "warning", "error"].map((type) => (
          <TabsContent key={type} value={type} className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {notifications
                    .filter((n) => n.type === type)
                    .map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 flex items-start gap-4 ${notification.read ? "" : "bg-muted/50"}`}
                      >
                        <div
                          className={`rounded-full p-2 mt-1 ${
                            type === "info"
                              ? "bg-blue-50 text-blue-500"
                              : type === "success"
                                ? "bg-green-50 text-green-500"
                                : type === "warning"
                                  ? "bg-yellow-50 text-yellow-500"
                                  : "bg-red-50 text-red-500"
                          }`}
                        >
                          {type === "info" ? (
                            <Info className="h-4 w-4" />
                          ) : type === "success" ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : type === "warning" ? (
                            <AlertTriangle className="h-4 w-4" />
                          ) : (
                            <AlertTriangle className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className={`font-medium ${notification.read ? "" : "font-semibold"}`}>
                                {notification.title}
                              </p>
                              <p className="text-sm text-muted-foreground">{notification.message}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-xs text-muted-foreground flex items-center">
                                <Clock className="mr-1 h-3 w-3" />
                                {notification.time}
                              </div>
                              {!notification.read && <div className="h-2 w-2 rounded-full bg-primary"></div>}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Configure how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Email Notifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: "email-client", label: "New Client Registration", icon: <Bell className="h-4 w-4" /> },
                  { id: "email-project", label: "Project Updates", icon: <Bell className="h-4 w-4" /> },
                  { id: "email-milestone", label: "Milestone Completion", icon: <Bell className="h-4 w-4" /> },
                  { id: "email-resource", label: "Resource Uploads", icon: <Bell className="h-4 w-4" /> },
                  { id: "email-feedback", label: "Client Feedback", icon: <Bell className="h-4 w-4" /> },
                  { id: "email-support", label: "Support Requests", icon: <Bell className="h-4 w-4" /> },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between space-x-2 rounded-md border p-4">
                    <div className="flex items-center space-x-2">
                      {item.icon}
                      <Label htmlFor={item.id}>{item.label}</Label>
                    </div>
                    <Switch id={item.id} defaultChecked />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">In-App Notifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: "app-client", label: "New Client Registration", icon: <Bell className="h-4 w-4" /> },
                  { id: "app-project", label: "Project Updates", icon: <Bell className="h-4 w-4" /> },
                  { id: "app-milestone", label: "Milestone Completion", icon: <Bell className="h-4 w-4" /> },
                  { id: "app-resource", label: "Resource Uploads", icon: <Bell className="h-4 w-4" /> },
                  { id: "app-feedback", label: "Client Feedback", icon: <Bell className="h-4 w-4" /> },
                  { id: "app-support", label: "Support Requests", icon: <Bell className="h-4 w-4" /> },
                  { id: "app-system", label: "System Alerts", icon: <Bell className="h-4 w-4" /> },
                  { id: "app-security", label: "Security Alerts", icon: <Bell className="h-4 w-4" /> },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between space-x-2 rounded-md border p-4">
                    <div className="flex items-center space-x-2">
                      {item.icon}
                      <Label htmlFor={item.id}>{item.label}</Label>
                    </div>
                    <Switch id={item.id} defaultChecked />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit">Save Preferences</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
