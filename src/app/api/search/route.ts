import { NextRequest } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { ok, serverError } from "@/lib/api-utils"
import type { ProductRecord } from "@/lib/types"
import { getPrimaryImage } from "@/lib/types"
import { localProducts } from "@/lib/local-data"

// GET /api/search?q=keyword
export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get("q")?.toLowerCase().trim() || ""
    if (!q) return ok([])

    let products: Record<string, unknown>[]
    let count: number

    try {
      const supabase = await createSupabaseServerClient()

      const { data, error, count: dbCount } = await supabase
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
        .or(
          `name.ilike.%${q}%,description.ilike.%${q}%,brand.ilike.%${q}%`
        )
        .order("created_at", { ascending: false })
        .limit(20)

      if (error) throw error

      products = (data as Record<string, unknown>[]) || []
      count = dbCount || 0
    } catch {
      // Local fallback search
      const results = localProducts
        .filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
        )
        .slice(0, 20)

      products = results.map((p) => ({
        ...p,
        primary_image: p.images,
      })) as unknown as Record<string, unknown>[]
      count = results.length
    }

    return ok(
      (products as ProductRecord[] | undefined)?.map((p) => ({
        ...p,
        primaryImage: getPrimaryImage(p.primary_image),
      })) || [],
      { page: 1, limit: 20, total: count }
    )
  } catch (error) {
    return serverError(error)
  }
}
