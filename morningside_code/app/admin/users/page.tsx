import Link from "next/link"
import { redirect } from "next/navigation"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentUser } from "@/app/actions/auth-actions"
import { getUsers } from "@/app/actions/user-actions"
import { UsersTable } from "@/components/admin/users-table"
import { Permissions } from "@/lib/db"

export const metadata = {
  title: "User Management",
  description: "Manage users and their permissions",
}

export default async function UsersPage() {
  // Get the current user
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  // Check if user has permission to view users
  if (!user.permissions.includes(Permissions.VIEW_USERS)) {
    redirect("/admin/unauthorized")
  }

  // Get all users
  const users = await getUsers()

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
        {user.permissions.includes(Permissions.CREATE_USER) && (
          <Link href="/admin/users/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New User
            </Button>
          </Link>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage users and their roles</CardDescription>
        </CardHeader>
        <CardContent>
          <UsersTable users={users} currentUser={user} />
        </CardContent>
      </Card>
    </div>
  )
}
