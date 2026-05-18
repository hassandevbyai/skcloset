import { NextRequest } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { unauthorized, badRequest, ok, serverError, getAuthenticatedUser } from "@/lib/api-utils"
import { addressSchema } from "@/lib/validators"

// GET /api/user/addresses/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorized()

    const { id } = await params
    const supabase = await createSupabaseServerClient()
    const { data: address, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (error || !address) {
      return Response.json(
        { success: false, error: "Address not found" },
        { status: 404 }
      )
    }

    return ok(address)
  } catch (error) {
    return serverError(error)
  }
}

// PUT /api/user/addresses/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorized()

    const { id } = await params
    const body = await req.json()
    const parsed = addressSchema.partial().safeParse(body)

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors
      return badRequest(Object.values(errors).flat().join(", "))
    }

    const supabase = await createSupabaseServerClient()

    if (parsed.data.isDefault) {
      await supabase
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", user.id)
    }

    const { data, error } = await supabase
      .from("addresses")
      .update(parsed.data)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) return serverError(error)
    if (!data) {
      return Response.json(
        { success: false, error: "Address not found" },
        { status: 404 }
      )
    }

    return ok(data)
  } catch (error) {
    return serverError(error)
  }
}

// DELETE /api/user/addresses/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorized()

    const { id } = await params
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase
      .from("addresses")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id)

    if (error) return serverError(error)

    return ok({ message: "Address deleted" })
  } catch (error) {
    return serverError(error)
  }
}
