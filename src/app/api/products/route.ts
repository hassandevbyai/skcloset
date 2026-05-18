import { z } from "zod"
import { NextRequest } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { ok, badRequest, serverError, getPagination } from "@/lib/api-utils"
import type { ProductRecord } from "@/lib/types"
import { getPrimaryImage } from "@/lib/types"
import { localProducts } from "@/lib/local-data"

const searchParamsSchema = z.object({
  category: z.string().optional(),
  brand: z.string().optional(),
  size: z.string().optional(),
  color: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  search: z.string().optional(),
  sort: z.enum(["newest", "price-asc", "price-desc", "name-asc", "name-desc"]).optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  featured: z.coerce.boolean().optional(),
})

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const parsed = searchParamsSchema.safeParse(
      Object.fromEntries(url.searchParams.entries())
    )

    if (!parsed.success) {
      return badRequest("Invalid query parameters")
    }

    const { category, brand, size, color, minPrice, maxPrice, search, sort, featured } = parsed.data
    const { page, limit, offset } = getPagination(url.searchParams)

    let products: Record<string, unknown>[] | null
    let count: number | null

    try {
      const supabase = await createSupabaseServerClient()

      let query = supabase
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

      if (category) {
        query = query.eq("category", category)
      }

      if (brand) {
        query = query.eq("brand", brand)
      }

      if (featured) {
        query = query.eq("is_featured", true)
      }

      if (minPrice !== undefined) {
        query = query.gte("base_price", minPrice)
      }

      if (maxPrice !== undefined) {
        query = query.lte("base_price", maxPrice)
      }

      if (search) {
        query = query.or(
          `name.ilike.%${search}%,description.ilike.%${search}%,brand.ilike.%${search}%`
        )
      }

      if (size || color) {
        let variantQuery = supabase
          .from("product_variants")
          .select("product_id")

        if (size) {
          variantQuery = variantQuery.eq("size", size)
        }
        if (color) {
          variantQuery = variantQuery.eq("color", color)
        }

        const { data: variantProducts } = await variantQuery
        const productIds = variantProducts?.map((v) => v.product_id) || []
        if (productIds.length === 0) {
          return ok([], { page, limit, total: 0 })
        }
        query = query.in("id", productIds)
      }

      if (sort) {
        switch (sort) {
          case "price-asc":
            query = query.order("base_price", { ascending: true })
            break
          case "price-desc":
            query = query.order("base_price", { ascending: false })
            break
          case "name-asc":
            query = query.order("name", { ascending: true })
            break
          case "name-desc":
            query = query.order("name", { ascending: false })
            break
        }
      }

      query = query.range(offset, offset + limit - 1)

      const { data: dbProducts, error: dbError, count: dbCount } = await query

      if (dbError) {
        throw dbError
      }

      products = dbProducts as Record<string, unknown>[]
      count = dbCount
    } catch {
      let filtered = localProducts.filter((p) => p.is_active)

      if (category) {
        filtered = filtered.filter((p) => p.category === category)
      }

      if (brand) {
        filtered = filtered.filter(
          (p) => p.brand.toLowerCase() === brand.toLowerCase()
        )
      }

      if (featured) {
        filtered = filtered.filter((p) => p.is_featured)
      }

      if (minPrice !== undefined) {
        filtered = filtered.filter((p) => p.base_price >= minPrice)
      }

      if (maxPrice !== undefined) {
        filtered = filtered.filter((p) => p.base_price <= maxPrice)
      }

      if (search) {
        const q = search.toLowerCase()
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q)
        )
      }

      if (size || color) {
        filtered = filtered.filter((p) =>
          p.variants.some((v) => {
            if (size && v.size !== size) return false
            if (color && v.color !== color) return false
            return true
          })
        )
      }

      if (sort) {
        switch (sort) {
          case "price-asc":
            filtered.sort((a, b) => a.base_price - b.base_price)
            break
          case "price-desc":
            filtered.sort((a, b) => b.base_price - a.base_price)
            break
          case "name-asc":
            filtered.sort((a, b) => a.name.localeCompare(b.name))
            break
          case "name-desc":
            filtered.sort((a, b) => b.name.localeCompare(a.name))
            break
        }
      }

      count = filtered.length
      const paginated = filtered.slice(offset, offset + limit)

      products = paginated.map((p) => ({
        ...p,
        primary_image: p.images,
      })) as unknown as Record<string, unknown>[]
    }

    const formatted = (products as ProductRecord[] | undefined)?.map((product) => ({
      ...product,
      primaryImage: getPrimaryImage(product.primary_image),
    }))

    return ok(formatted || [], { page, limit, total: count || 0 })
  } catch (error) {
    return serverError(error)
  }
}
