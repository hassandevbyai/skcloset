import { NextRequest } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { badRequest, ok, serverError } from "@/lib/api-utils"
import { createProductSchema } from "@/lib/validators"
import { generateSlug } from "@/lib/api-utils"

// GET /api/admin/products
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
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10))
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "50", 10)))
    const offset = (page - 1) * limit
    const includeInactive = url.searchParams.get("inactive") === "true"

    let query = supabase
      .from("products")
      .select("*", { count: "exact" })

    if (!includeInactive) {
      query = query.eq("is_active", true)
    }

    query = query.order("created_at", { ascending: false })
    query = query.range(offset, offset + limit - 1)

    // If category filter
    const category = url.searchParams.get("category")
    if (category) query = query.eq("category", category)

    const { data: products, error, count } = await query

    if (error) return serverError(error)

    return ok(products || [], { page, limit, total: count || 0 })
  } catch (error) {
    return serverError(error)
  }
}

// POST /api/admin/products
export async function POST(req: NextRequest) {
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

    const body = await req.json()
    const parsed = createProductSchema.safeParse(body)

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors
      return badRequest(Object.values(errors).flat().join(", "))
    }

    // Generate a unique slug
    let slug = generateSlug(parsed.data.name)

    // Check if slug exists, append number if needed
    const { data: existing } = await supabase
      .from("products")
      .select("slug")
      .eq("slug", slug)
      .maybeSingle()

    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`
    }

    const { data: product, error } = await supabase
      .from("products")
      .insert({
        ...parsed.data,
        slug,
        tags: parsed.data.tags || [],
      })
      .select()
      .single()

    if (error) return serverError(error)

    return Response.json({ success: true, data: product }, { status: 201 })
  } catch (error) {
    return serverError(error)
  }
}
