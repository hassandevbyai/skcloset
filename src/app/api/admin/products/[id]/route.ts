import { NextRequest } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { requireAdmin } from "@/lib/api-utils"
import { badRequest, ok, serverError } from "@/lib/api-utils"
import { updateProductSchema, updateOrderStatusSchema, updateInventorySchema } from "@/lib/validators"

// PUT /api/admin/products/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAdmin()
    if (!user) {
      return Response.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      )
    }

    const { id } = await params
    const body = await req.json()
    const parsed = updateProductSchema.safeParse(body)

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors
      return badRequest(Object.values(errors).flat().join(", "))
    }

    const supabase = await createSupabaseServerClient()
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
    const user = await requireAdmin()
    if (!user) {
      return Response.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      )
    }

    const { id } = await params
    const supabase = await createSupabaseServerClient()

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
