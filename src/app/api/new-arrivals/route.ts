import { NextRequest } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { ok, serverError, getPagination } from "@/lib/api-utils"
import type { ProductRecord } from "@/lib/types"
import { getPrimaryImage } from "@/lib/types"

// GET /api/new-arrivals — get most recently added products
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const { page, limit, offset } = getPagination(url.searchParams)
    const supabase = await createSupabaseServerClient()

    const { data: products, error, count } = await supabase
      .from("products")
      .select(
        `
        *,
        variants:product_variants(*),
        primary_image:product_images(*)
      `,
        { count: "exact" }
      )
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      return serverError(error)
    }

    return ok(
      (products as ProductRecord[] | undefined)?.map((p) => ({
        ...p,
        primaryImage: getPrimaryImage(p.primary_image),
      })) || [],
      { page, limit, total: count || 0 }
    )
  } catch (error) {
    return serverError(error)
  }
}
