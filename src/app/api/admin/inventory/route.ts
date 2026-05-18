import { NextRequest } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { requireAdmin } from "@/lib/api-utils"
import { badRequest, ok, serverError, getPagination } from "@/lib/api-utils"

// GET /api/admin/inventory
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
    const lowStockOnly = url.searchParams.get("lowStock") === "true"

    const supabase = await createSupabaseServerClient()
    let query = supabase
      .from("product_variants")
      .select(
        `
        *,
        product:products(name, brand, category, is_active)
      `,
        { count: "exact" }
      )
      .order("stock_quantity", { ascending: true })
      .range(offset, offset + limit - 1)

    if (lowStockOnly) {
      query = query.lte("stock_quantity", supabase.rpc("get_low_stock", {}))
    }

    const { data: variants, error, count } = await query

    if (error) return serverError(error)

    return ok(variants || [], { page, limit, total: count || 0 })
  } catch (error) {
    return serverError(error)
  }
}

// PUT /api/admin/inventory - Update variant stock
export async function PUT(req: NextRequest) {
  try {
    const user = await requireAdmin()
    if (!user) {
      return Response.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { variantId, stockQuantity, lowStockThreshold } = body

    if (!variantId || stockQuantity === undefined) {
      return badRequest("variantId and stockQuantity are required")
    }

    const supabase = await createSupabaseServerClient()
    const updateData: Record<string, number> = {
      stock_quantity: stockQuantity,
    }

    if (lowStockThreshold !== undefined) {
      updateData.low_stock_threshold = lowStockThreshold
    }

    const { data, error } = await supabase
      .from("product_variants")
      .update(updateData)
      .eq("id", variantId)
      .select()
      .single()

    if (error) return serverError(error)

    return ok(data)
  } catch (error) {
    return serverError(error)
  }
}
