"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Key, Shield, Clock, FileText, AlertTriangle } from "lucide-react"

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")

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

  // Mock user data
  const user = {
    id: params.id,
    name: "John Smith",
    email: "john@novacrest.com",
    role: "Admin",
    status: "Active",
    lastActive: "Today at 10:30 AM",
    createdAt: "January 15, 2025",
    permissions: ["Dashboard", "Clients", "Projects", "Resources", "Analytics", "Settings", "Users"],
    recentActivity: [
      { action: "Updated client profile", time: "Today at 10:30 AM" },
      { action: "Added new project", time: "Yesterday at 4:15 PM" },
      { action: "Uploaded resource", time: "May 16 at 2:30 PM" },
      { action: "Modified user permissions", time: "May 15 at 11:45 AM" },
      { action: "Generated analytics report", time: "May 14 at 9:20 AM" },
    ],
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading user details...</p>
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
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={`/placeholder.svg?height=64&width=64&query=avatar`} alt={user.name} />
            <AvatarFallback>
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{user.name}</h1>
            <div className="flex items-center gap-2">
              <p className="text-muted-foreground">{user.email}</p>
              <Badge variant={user.role === "Admin" ? "default" : "secondary"}>{user.role}</Badge>
              <Badge variant={user.status === "Active" ? "success" : "destructive"}>{user.status}</Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push("/admin/users")}>
            Back to Users
          </Button>
          <Button variant="destructive">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Suspend User
          </Button>
        </div>
      </div>

      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="permissions">
            <Shield className="mr-2 h-4 w-4" />
            Permissions
          </TabsTrigger>
          <TabsTrigger value="security">
            <Key className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="activity">
            <Clock className="mr-2 h-4 w-4" />
            Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>Update user information</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={user.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue={user.email} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select defaultValue={user.role.toLowerCase()}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select defaultValue={user.status.toLowerCase()}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <textarea
                    id="notes"
                    className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Add notes about this user"
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Permissions</CardTitle>
              <CardDescription>Manage what this user can access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: "Dashboard", description: "View dashboard and analytics" },
                    { name: "Clients", description: "Manage client information" },
                    { name: "Projects", description: "Manage projects and timelines" },
                    { name: "Resources", description: "Upload and manage resources" },
                    { name: "Analytics", description: "Access analytics and reports" },
                    { name: "Settings", description: "Change system settings" },
                    { name: "Users", description: "Manage user accounts" },
                  ].map((permission) => (
                    <div
                      key={permission.name}
                      className="flex items-center justify-between space-x-2 rounded-md border p-4"
                    >
                      <div className="space-y-0.5">
                        <div className="text-sm font-medium">{permission.name}</div>
                        <div className="text-xs text-muted-foreground">{permission.description}</div>
                      </div>
                      <Switch checked={user.permissions.includes(permission.name)} onCheckedChange={() => {}} />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end">
                  <Button type="submit">Save Permissions</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage user security options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Password Reset</h3>
                  <p className="text-sm text-muted-foreground">
                    Send a password reset link to the user's email address.
                  </p>
                  <Button>
                    <Key className="mr-2 h-4 w-4" />
                    Send Reset Link
                  </Button>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground">
                    Enable two-factor authentication for additional security.
                  </p>
                  <div className="flex items-center space-x-2">
                    <Switch id="2fa" />
                    <Label htmlFor="2fa">Require 2FA</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Session Management</h3>
                  <p className="text-sm text-muted-foreground">Manage active sessions for this user.</p>
                  <div className="rounded-md border">
                    <div className="p-4 border-b">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Chrome on Windows</div>
                          <div className="text-xs text-muted-foreground">Active now</div>
                        </div>
                        <Button variant="outline" size="sm">
                          Revoke
                        </Button>
                      </div>
                    </div>
                    <div className="p-4 border-b">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Safari on macOS</div>
                          <div className="text-xs text-muted-foreground">Last active: Yesterday</div>
                        </div>
                        <Button variant="outline" size="sm">
                          Revoke
                        </Button>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Mobile App on iPhone</div>
                          <div className="text-xs text-muted-foreground">Last active: 3 days ago</div>
                        </div>
                        <Button variant="outline" size="sm">
                          Revoke
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="mt-2">
                    Revoke All Sessions
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>Recent actions performed by this user</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {user.recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0">
                    <div className="rounded-full bg-primary/10 p-2 mt-1">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{activity.action}</p>
                        <div className="text-xs text-muted-foreground">{activity.time}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
