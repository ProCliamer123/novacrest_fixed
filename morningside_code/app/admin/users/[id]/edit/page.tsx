import { redirect } from "next/navigation"
import { getCurrentUser } from "@/app/actions/auth-actions"
import { getUserById } from "@/app/actions/user-actions"
import { UserForm } from "@/components/admin/user-form"
import { Permissions } from "@/lib/db"

export const metadata = {
  title: "Edit User",
  description: "Edit user details",
}

export default async function EditUserPage({ params }: { params: { id: string } }) {
  // Get the current user
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/login")
  }

  // Check if user has permission to edit users
  if (!currentUser.permissions.includes(Permissions.EDIT_USER)) {
    redirect("/admin/unauthorized")
  }

  // Get the user to edit
  const user = await getUserById(params.id)

  if (!user) {
    redirect("/admin/users")
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Edit User</h2>
      <UserForm user={user} />
    </div>
  )
}
