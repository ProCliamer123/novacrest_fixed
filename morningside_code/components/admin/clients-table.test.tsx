import { render, screen, fireEvent, waitFor } from "@/lib/test-utils"
import { ClientsTable } from "@/components/admin/clients-table"
import { mockClient } from "@/lib/test-utils"
import * as clientActions from "@/app/actions/client-actions"

// Mock the client actions
jest.mock("@/app/actions/client-actions", () => ({
  getClients: jest.fn(),
  deleteClient: jest.fn(),
}))

describe("ClientsTable", () => {
  const mockClients = [
    mockClient({ id: "1", name: "Client 1" }),
    mockClient({ id: "2", name: "Client 2" }),
    mockClient({ id: "3", name: "Client 3" }),
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    ;(clientActions.getClients as jest.Mock).mockResolvedValue(mockClients)
    ;(clientActions.deleteClient as jest.Mock).mockResolvedValue(true)
  })

  it("renders the clients table with data", async () => {
    render(<ClientsTable />)

    // Wait for the clients to load
    await waitFor(() => {
      expect(screen.getByText("Client 1")).toBeInTheDocument()
      expect(screen.getByText("Client 2")).toBeInTheDocument()
      expect(screen.getByText("Client 3")).toBeInTheDocument()
    })

    // Check if the table headers are rendered
    expect(screen.getByText("Name")).toBeInTheDocument()
    expect(screen.getByText("Email")).toBeInTheDocument()
    expect(screen.getByText("Status")).toBeInTheDocument()
    expect(screen.getByText("Actions")).toBeInTheDocument()
  })

  it("handles search functionality", async () => {
    render(<ClientsTable />)

    // Wait for the clients to load
    await waitFor(() => {
      expect(screen.getByText("Client 1")).toBeInTheDocument()
    })

    // Type in the search input
    const searchInput = screen.getByPlaceholderText("Search clients...")
    fireEvent.change(searchInput, { target: { value: "Client 1" } })

    // Mock the filtered results
    ;(clientActions.getClients as jest.Mock).mockResolvedValue([mockClients[0]])

    // Wait for the filtered results
    await waitFor(() => {
      expect(screen.getByText("Client 1")).toBeInTheDocument()
      expect(screen.queryByText("Client 2")).not.toBeInTheDocument()
      expect(screen.queryByText("Client 3")).not.toBeInTheDocument()
    })
  })

  it("handles delete client", async () => {
    render(<ClientsTable />)

    // Wait for the clients to load
    await waitFor(() => {
      expect(screen.getByText("Client 1")).toBeInTheDocument()
    })

    // Find and click the delete button for Client 1
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i })
    fireEvent.click(deleteButtons[0])

    // Confirm the deletion
    const confirmButton = screen.getByRole("button", { name: /confirm/i })
    fireEvent.click(confirmButton)

    // Check if the deleteClient action was called
    await waitFor(() => {
      expect(clientActions.deleteClient).toHaveBeenCalledWith("1")
    })
  })
})
