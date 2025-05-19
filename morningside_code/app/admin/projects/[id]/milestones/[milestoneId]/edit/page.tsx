"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Calendar } from "lucide-react"
import { getMilestoneById, updateMilestone, deleteMilestone } from "@/app/actions/milestone-actions"
import { toast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function EditMilestonePage({ params }: { params: { id: string; milestoneId: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    completed: false,
  })

  useEffect(() => {
    async function loadMilestone() {
      try {
        const milestone = await getMilestoneById(params.milestoneId)
        if (milestone) {
          setFormData({
            title: milestone.title,
            description: milestone.description || "",
            dueDate: milestone.dueDate ? new Date(milestone.dueDate).toISOString().split("T")[0] : "",
            completed: milestone.completed,
          })
        } else {
          toast({
            title: "Error",
            description: "Milestone not found",
            variant: "destructive",
          })
          router.push(`/admin/projects/${params.id}`)
        }
      } catch (error) {
        console.error("Failed to load milestone:", error)
        toast({
          title: "Error",
          description: "Failed to load milestone data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadMilestone()
  }, [params.id, params.milestoneId, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, completed: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const result = await updateMilestone(params.milestoneId, {
        title: formData.title,
        description: formData.description || null,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
        completed: formData.completed,
      })

      if (result.success) {
        toast({
          title: "Milestone updated",
          description: "The milestone has been updated successfully.",
        })
        router.push(`/admin/projects/${params.id}?tab=milestones`)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update milestone. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to update milestone:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)

    try {
      const result = await deleteMilestone(params.milestoneId)

      if (result.success) {
        toast({
          title: "Milestone deleted",
          description: "The milestone has been deleted successfully.",
        })
        router.push(`/admin/projects/${params.id}?tab=milestones`)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete milestone. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to delete milestone:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
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
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" asChild className="mr-4">
          <Link href={`/admin/projects/${params.id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Edit Milestone</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Milestone Details</CardTitle>
            <CardDescription>Update milestone information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter milestone title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter milestone description (optional)"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="completed" checked={formData.completed} onCheckedChange={handleCheckboxChange} />
              <Label htmlFor="completed">Mark as completed</Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" type="button" disabled={deleting}>
                  {deleting ? "Deleting..." : "Delete Milestone"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete this milestone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href={`/admin/projects/${params.id}`}>Cancel</Link>
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
