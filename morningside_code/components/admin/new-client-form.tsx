"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { clientStore } from "@/lib/client-store"

// Define the form schema with Zod
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().optional(),
  address: z.string().optional(),
  status: z.enum(["active", "inactive", "onboarding"], {
    required_error: "Please select a status.",
  }),
  createAccount: z.boolean().default(false),
  password: z.string().optional(),
})

// Add conditional validation for password
const formSchemaWithValidation = formSchema.refine(
  (data) => {
    // If createAccount is true, password is required
    if (data.createAccount) {
      return data.password && data.password.length >= 6
    }
    return true
  },
  {
    message: "Password must be at least 6 characters when creating an account",
    path: ["password"],
  },
)

export function NewClientForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize the form
  const form = useForm<z.infer<typeof formSchemaWithValidation>>({
    resolver: zodResolver(formSchemaWithValidation),
    defaultValues: {
      name: "",
      companyName: "",
      email: "",
      phone: "",
      address: "",
      status: "active",
      createAccount: false,
      password: "",
    },
  })

  // Watch the createAccount field to conditionally show password field
  const createAccount = form.watch("createAccount")

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchemaWithValidation>) {
    setIsSubmitting(true)

    try {
      // Create client in client store
      const newClient = clientStore?.createClient({
        name: values.name,
        companyName: values.companyName,
        email: values.email,
        phone: values.phone || null,
        address: values.address || null,
        status: values.status,
        userId: null,
      })

      // If createAccount is true, create a user account for the client
      if (values.createAccount && values.password && newClient) {
        const newUser = clientStore?.createUser({
          name: values.name,
          email: values.email,
          password: values.password,
          role: "client",
          permissions: ["view_projects", "view_resources"],
          active: true,
        })

        if (newUser) {
          // Update client with user ID
          clientStore?.updateClient(newClient.id, { userId: newUser.id })
        }
      }

      toast({
        title: "Client created",
        description: "The client has been created successfully.",
      })

      router.push("/admin/clients")
      router.refresh()
    } catch (error) {
      console.error("Failed to create client:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create client. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormDescription>The primary contact person for this client.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Acme Inc." {...field} />
                </FormControl>
                <FormDescription>The name of the client's company.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john@example.com" {...field} />
                </FormControl>
                <FormDescription>The primary contact email for this client.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+1 (555) 123-4567" {...field} />
                </FormControl>
                <FormDescription>The primary contact phone number.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="onboarding">Onboarding</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>The current status of this client.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea placeholder="123 Main St, City, State, ZIP" {...field} />
              </FormControl>
              <FormDescription>The client's business address.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="createAccount"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Create Portal Account</FormLabel>
                <FormDescription>
                  Create a client portal account for this client to access their projects and resources.
                </FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        {createAccount && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormDescription>
                  The initial password for the client's portal account. Must be at least 6 characters.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button" onClick={() => router.back()} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Client
          </Button>
        </div>
      </form>
    </Form>
  )
}
