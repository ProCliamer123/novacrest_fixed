"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save } from "lucide-react"
import { getClientById, updateClient } from "@/app/actions/client-actions"
import { toast } from "@/components/ui/use-toast"
import type { Client } from "@/lib/db"

export default function ClientEditPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notes, setNotes] = useState("")

  useEffect(() => {
    async function loadClient() {
      try {
        const clientData = await getClientById(params.id)
        if (!clientData) {
          toast({
            title: "Client not found",
            description: "The requested client could not be found.",
            variant: "destructive",
          })
          router.push("/admin/clients")
          return
        }
        setClient(clientData)

        // Extract notes from metadata
        const metadata = clientData.metadata
          ? typeof clientData.metadata === "string"
            ? JSON.parse(clientData.metadata)
            : clientData.metadata
          : {}
        setNotes(metadata.notes || "")
      } catch (error) {
        console.error("Failed to load client:", error)
        toast({
          title: "Error",
          description: "Failed to load client data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadClient()
  }, [params.id, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (!client) return

    setClient({
      ...client,
      [name]: value,
    })
  }

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value)
  }

  const handleSave = async () => {
    if (!client) return

    setSaving(true)
    try {
      // Update metadata with notes
      const metadata = client.metadata
        ? typeof client.metadata === "string"
          ? JSON.parse(client.metadata)
          : client.metadata
        : {}

      const updatedClient = await updateClient(params.id, {
        ...client,
        metadata: {
          ...metadata,
          notes,
        },
      })

      toast({
        title: "Client updated",
        description: `${updatedClient.name} has been successfully updated.`,
      })

      router.push(`/admin/clients/${params.id}`)
    } catch (error) {
      console.error("Failed to update client:", error)
      toast({
        title: "Error",
        description: "Failed to update client. Please try again.",
        variant: "destructive",
      })
      setSaving(false)
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

  if (!client) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="icon" asChild className="mr-4">
            <Link href="/admin/clients">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Client Not Found</h1>
        </div>
        <p>The requested client could not be found.</p>
        <Button asChild className="mt-4">
          <Link href="/admin/clients">Return to Clients</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center">
          <Button variant="outline" size="icon" asChild className="mr-4">
            <Link href={`/admin/clients/${params.id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit Client</h1>
            <p className="text-muted-foreground">Update information for {client.name}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/clients/${params.id}`}>Cancel</Link>
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
            <CardDescription>Basic information about the client</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Contact Name</Label>
                <Input id="name" name="name" value={client.name} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" name="companyName" value={client.companyName} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={client.email} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" value={client.phone || ""} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logoUrl">Logo URL</Label>
                <Input id="logoUrl" name="logoUrl" value={client.logoUrl || ""} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" name="address" value={client.address || ""} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  value={client.status}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="onboarding">Onboarding</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
              <CardDescription>Additional information about this client</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea id="notes" value={notes} onChange={handleNotesChange} className="min-h-[150px]" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
