import { Suspense } from "react"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/app/actions/auth-actions"
import { getUserNotifications, markAllNotificationsAsRead } from "@/app/actions/notification-actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { NotificationList } from "@/components/portal/notification-list"
import { CheckCheck } from "lucide-react"

export default async function NotificationsPage() {
  // Get the current user
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  // Get notifications
  const notifications = await getUserNotifications(user.id, 50)

  // Function to mark all as read
  async function handleMarkAllAsRead() {
    "use server"
    if (!user) return
    await markAllNotificationsAsRead(user.id)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
        <form action={handleMarkAllAsRead}>
          <Button type="submit" variant="outline" size="sm">
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        </form>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Notifications</CardTitle>
          <CardDescription>Stay updated with project milestones, resources, and messages</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading notifications...</div>}>
            <NotificationList notifications={notifications} className="max-h-[600px] overflow-y-auto" />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
