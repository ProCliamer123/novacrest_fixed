import { getClients, getClientById } from "./client-actions"
import { sql } from "@/lib/db"
import { mockClient } from "@/lib/test-utils"

// Mock the database
jest.mock("@/lib/db", () => ({
  sql: jest.fn(),
  query: jest.fn(),
}))

// Mock the next/cache
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}))

describe("Client Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("getClients", () => {
    it("returns all clients", async () => {
      const mockClients = [mockClient(), mockClient()]
      ;(sql as jest.Mock).mockResolvedValue({ rows: mockClients })

      const result = await getClients()

      expect(result).toEqual(mockClients)
      expect(sql).toHaveBeenCalledWith(expect.stringContaining('SELECT * FROM "Client"'))
    })

    it("handles errors", async () => {
      ;(sql as jest.Mock).mockRejectedValue(new Error("Database error"))

      const result = await getClients()

      expect(result).toEqual([])
      expect(sql).toHaveBeenCalledWith(expect.stringContaining('SELECT * FROM "Client"'))
    })
  })

  describe("getClientById", () => {
    it("returns a client by ID", async () => {
      const mockClientData = mockClient()
      ;(sql as jest.Mock).mockResolvedValue({ rows: [mockClientData] })

      const result = await getClientById("client-1")

      expect(result).toEqual(mockClientData)
      expect(sql).toHaveBeenCalledWith(expect.stringContaining("WHERE id ="), expect.anything())
    })

    it("returns null if client not found", async () => {
      ;(sql as jest.Mock).mockResolvedValue({ rows: [] })

      const result = await getClientById("non-existent")

      expect(result).toBeNull()
      expect(sql).toHaveBeenCalledWith(expect.stringContaining("WHERE id ="), expect.anything())
    })

    it("handles errors", async () => {
      ;(sql as jest.Mock).mockRejectedValue(new Error("Database error"))

      const result = await getClientById("client-1")

      expect(result).toBeNull()
      expect(sql).toHaveBeenCalledWith(expect.stringContaining("WHERE id ="), expect.anything())
    })
  })

  // Add more tests for createClient, updateClient, deleteClient, etc.
})
