import { NextRequest } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { badRequest, ok, serverError } from "@/lib/api-utils"
import { updateProductSchema } from "@/lib/validators"

// PUT /api/admin/products/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params
    const body = await req.json()
    const parsed = updateProductSchema.safeParse(body)

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors
      return badRequest(Object.values(errors).flat().join(", "))
    }

    const { data, error } = await supabase
      .from("products")
      .update(parsed.data)
      .eq("id", id)
      .select()
      .single()

    if (error) return serverError(error)

    return ok(data)
  } catch (error) {
    return serverError(error)
  }
}

// DELETE /api/admin/products/[id] (soft delete)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params

    // Soft delete
    const { error } = await supabase
      .from("products")
      .update({
        is_active: false,
        deleted_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (error) return serverError(error)

    return ok({ message: "Product deleted" })
  } catch (error) {
    return serverError(error)
  }
}
