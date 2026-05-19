import { NextRequest } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { ok, serverError, getPagination, badRequest } from "@/lib/api-utils"

// GET /api/admin/orders
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
    const status = url.searchParams.get("status")

    let query = supabase
      .from("orders")
      .select(
        `
        *,
        items:order_items(*),
        user:user_id(id, email, first_name, last_name)
      `,
        { count: "exact" }
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq("status", status)
    }

    const { data: orders, error, count } = await query

    if (error) return serverError(error)

    return ok(orders || [], { page, limit, total: count || 0 })
  } catch (error) {
    return serverError(error)
  }
}
