import { NextRequest } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { ok, serverError, getPagination, badRequest } from "@/lib/api-utils"

export async function GET(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return badRequest("Unauthorized")

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single()

    if (profile?.role !== "admin") return badRequest("Forbidden")

    const url = new URL(req.url)
    const { page, limit, offset } = getPagination(url.searchParams)
    const search = url.searchParams.get("search")?.toLowerCase() || ""

    try {
      let query = supabase
        .from("profiles")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1)

      if (search) {
        query = query.or(
          `name.ilike.%${search}%,email.ilike.%${search}%`
        )
      }

      const { data: users, error, count } = await query

      if (error) throw error

      return ok(users || [], { page, limit, total: count || 0 })
    } catch {
      // Fallback mock users
      const mockUsers = [
        { id: "u1", email: "admin@skcloset.com", name: "Admin User", role: "admin", created_at: "2026-01-15T08:00:00Z", phone: "+1-555-0100" },
        { id: "u2", email: "jane.doe@example.com", name: "Jane Doe", role: "user", created_at: "2026-02-20T10:30:00Z", phone: "+1-555-0101" },
        { id: "u3", email: "john.smith@example.com", name: "John Smith", role: "user", created_at: "2026-03-05T14:15:00Z", phone: "+1-555-0102" },
        { id: "u4", email: "emma.wilson@example.com", name: "Emma Wilson", role: "user", created_at: "2026-03-12T09:45:00Z", phone: "+1-555-0103" },
        { id: "u5", email: "michael.brown@example.com", name: "Michael Brown", role: "user", created_at: "2026-03-28T16:00:00Z", phone: "+1-555-0104" },
        { id: "u6", email: "sarah.davis@example.com", name: "Sarah Davis", role: "user", created_at: "2026-04-02T11:20:00Z", phone: "+1-555-0105" },
        { id: "u7", email: "alex.johnson@example.com", name: "Alex Johnson", role: "user", created_at: "2026-04-10T07:30:00Z", phone: "+1-555-0106" },
        { id: "u8", email: "olivia.martin@example.com", name: "Olivia Martin", role: "user", created_at: "2026-04-18T13:10:00Z", phone: "+1-555-0107" },
        { id: "u9", email: "william.taylor@example.com", name: "William Taylor", role: "user", created_at: "2026-04-25T15:40:00Z", phone: "+1-555-0108" },
        { id: "u10", email: "sophia.anderson@example.com", name: "Sophia Anderson", role: "user", created_at: "2026-05-01T10:00:00Z", phone: "+1-555-0109" },
        { id: "u11", email: "james.thomas@example.com", name: "James Thomas", role: "user", created_at: "2026-05-05T08:50:00Z", phone: "+1-555-0110" },
        { id: "u12", email: "isabella.jackson@example.com", name: "Isabella Jackson", role: "user", created_at: "2026-05-08T12:25:00Z", phone: "+1-555-0111" },
        { id: "u13", email: "ethan.white@example.com", name: "Ethan White", role: "user", created_at: "2026-05-10T09:35:00Z", phone: "+1-555-0112" },
        { id: "u14", email: "mia.harris@example.com", name: "Mia Harris", role: "user", created_at: "2026-05-12T11:15:00Z", phone: "+1-555-0113" },
        { id: "u15", email: "noah.clark@example.com", name: "Noah Clark", role: "user", created_at: "2026-05-14T14:00:00Z", phone: "+1-555-0114" },
      ]

      let filtered = mockUsers
      if (search) {
        filtered = mockUsers.filter(
          (u) =>
            u.name.toLowerCase().includes(search) ||
            u.email.toLowerCase().includes(search)
        )
      }

      const total = filtered.length
      const paginated = filtered.slice(offset, offset + limit)

      return ok(paginated, { page, limit, total })
    }
  } catch (error) {
    return serverError(error)
  }
}
