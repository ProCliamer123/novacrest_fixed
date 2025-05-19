import { redirect } from "next/navigation"
import { getCurrentUser } from "@/app/actions/auth-actions"
import { UserForm } from "@/components/admin/user-form"
import { Permissions } from "@/lib/db"

export const metadata = {
  title: "New User",
  description: "Create a new user",
}

export default async function NewUserPage() {
  // Get the current user
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  // Check if user has permission to create users
  if (!user.permissions.includes(Permissions.CREATE_USER)) {
    redirect("/admin/unauthorized")
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">New User</h2>
      <UserForm />
    </div>
  )
}
