import { NextRequest } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { ok, notFound, serverError } from "@/lib/api-utils"
import type { ProductRecord, ProductImage } from "@/lib/types"
import { getPrimaryImage } from "@/lib/types"
import { getProductBySlug, getRelatedProducts } from "@/lib/local-data"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    let product: Record<string, unknown>
    let related: Record<string, unknown>[]

    try {
      const supabase = await createSupabaseServerClient()

      const { data: dbProduct, error } = await supabase
        .from("products")
        .select(
          `
          *,
          variants:product_variants(*),
          images:product_images(*)
        `
        )
        .eq("slug", slug)
        .maybeSingle()

      if (error || !dbProduct) {
        return notFound("Product not found")
      }

      const { data: dbRelated } = await supabase
        .from("products")
        .select(
          `
          *,
          primary_image:product_images(*)
        `
        )
        .eq("category", dbProduct.category)
        .eq("is_active", true)
        .neq("id", dbProduct.id)
        .limit(4)

      product = dbProduct as Record<string, unknown>
      related = (dbRelated || []) as Record<string, unknown>[]
    } catch {
      const localProduct = getProductBySlug(slug)
      if (!localProduct) {
        return notFound("Product not found")
      }
      const localRelated = getRelatedProducts(localProduct.category, slug)
      product = {
        ...localProduct,
        images: localProduct.images.map((img) => ({
          ...img,
          is_primary: img.display_order === 1,
        })),
      } as unknown as Record<string, unknown>
      related = localRelated.map((rp) => ({
        ...rp,
        primaryImage: rp.images?.[0] ?? null,
      })) as unknown as Record<string, unknown>[]
    }

    const images = ((product.images ?? []) as { display_order: number }[]).sort(
      (a, b) => a.display_order - b.display_order
    )

    return ok({
      ...product,
      images,
      relatedProducts: related.map((rp) => ({
        ...rp,
        primaryImage: rp.primary_image
          ? (Array.isArray(rp.primary_image)
              ? (rp.primary_image as unknown[])[0]
              : rp.primary_image)
          : (rp.images as unknown[])?.[0] ?? null,
      })),
    })
  } catch (error) {
    return serverError(error)
  }
}
