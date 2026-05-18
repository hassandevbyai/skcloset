import { NextRequest } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { ok, notFound, serverError } from "@/lib/api-utils"
import type { ProductRecord } from "@/lib/types"
import { getPrimaryImage } from "@/lib/types"

// GET /api/categories/[slug] — get a single category with products
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const supabase = await createSupabaseServerClient()

    // Get the category
    const { data: category, error: catError } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single()

    if (catError || !category) {
      return notFound("Category not found")
    }

    // Get products in this category
    const { data: products, error: prodError } = await supabase
      .from("products")
      .select(
        `
        *,
        variants:product_variants(*),
        primary_image:product_images(*)
      `
      )
      .eq("category", slug)
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    if (prodError) {
      return serverError(prodError)
    }

    return ok({
      category,
      products: (products as ProductRecord[] | undefined)?.map((p) => ({
        ...p,
        primaryImage: getPrimaryImage(p.primary_image),
      })) || [],
    })
  } catch (error) {
    return serverError(error)
  }
}
