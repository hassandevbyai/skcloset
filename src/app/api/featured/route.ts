import { NextRequest } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { ok, serverError } from "@/lib/api-utils"
import type { ProductRecord } from "@/lib/types"
import { getPrimaryImage } from "@/lib/types"

// GET /api/featured — get all featured products
export async function GET() {
  try {
    const supabase = await createSupabaseServerClient()

    const { data: products, error } = await supabase
      .from("products")
      .select(
        `
        *,
        variants:product_variants(*),
        primary_image:product_images(*)
      `
      )
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(8)

    if (error) {
      return serverError(error)
    }

    return ok(
      (products as ProductRecord[] | undefined)?.map((p) => ({
        ...p,
        primaryImage: getPrimaryImage(p.primary_image),
      })) || []
    )
  } catch (error) {
    return serverError(error)
  }
}
