import { NextRequest } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { requireAdmin } from "@/lib/api-utils"
import { ok, serverError, getPagination } from "@/lib/api-utils"

// GET /api/admin/orders
export async function GET(req: NextRequest) {
  try {
    const user = await requireAdmin()
    if (!user) {
      return Response.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      )
    }

    const url = new URL(req.url)
    const { page, limit, offset } = getPagination(url.searchParams)
    const status = url.searchParams.get("status")

    const supabase = await createSupabaseServerClient()
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
