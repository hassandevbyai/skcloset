import { NextRequest } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { badRequest, ok, serverError } from "@/lib/api-utils"

// POST /api/user/restock-notifications — Subscribe to restock alert
export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return badRequest("Unauthorized")

    const body = await req.json()
    const { variantId } = body

    if (!variantId) {
      return badRequest("variantId is required")
    }

    // Get user email
    const { data: profile } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", session.user.id)
      .single()

    const email = profile?.email || session.user.email
    if (!email) return badRequest("User email not found")

    const { data, error } = await supabase
      .from("restock_notifications")
      .upsert(
        {
          user_id: session.user.id,
          variant_id: variantId,
          email,
          notified: false,
        },
        { onConflict: "email, variant_id" }
      )
      .select()
      .single()

    if (error) return serverError(error)

    return Response.json({ success: true, data }, { status: 201 })
  } catch (error) {
    return serverError(error)
  }
}

// GET /api/user/restock-notifications — List user's subscriptions
export async function GET(_req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return badRequest("Unauthorized")

    const { data, error } = await supabase
      .from("restock_notifications")
      .select("*, variant:product_variants(*, product:products(name))")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })

    if (error) return serverError(error)

    return ok(data || [])
  } catch (error) {
    return serverError(error)
  }
}

// DELETE /api/user/restock-notifications — Unsubscribe
export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return badRequest("Unauthorized")

    const url = new URL(req.url)
    const id = url.searchParams.get("id")
    const variantId = url.searchParams.get("variantId")

    if (id) {
      const { error } = await supabase
        .from("restock_notifications")
        .delete()
        .eq("id", id)
        .eq("user_id", session.user.id)

      if (error) return serverError(error)
      return ok({ deleted: true })
    }

    if (variantId) {
      const { error } = await supabase
        .from("restock_notifications")
        .delete()
        .eq("variant_id", variantId)
        .eq("user_id", session.user.id)

      if (error) return serverError(error)
      return ok({ deleted: true })
    }

    return badRequest("Provide either id or variantId to unsubscribe")
  } catch (error) {
    return serverError(error)
  }
}
