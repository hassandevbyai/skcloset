import { NextRequest } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { addressSchema } from "@/lib/validators"
import { unauthorized, badRequest, ok, serverError, getAuthenticatedUser } from "@/lib/api-utils"

// GET /api/user/addresses
export async function GET() {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorized()

    const supabase = await createSupabaseServerClient()
    const { data: addresses, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false })

    if (error) return serverError(error)

    return ok(addresses || [])
  } catch (error) {
    return serverError(error)
  }
}

// POST /api/user/addresses
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorized()

    const body = await req.json()
    const parsed = addressSchema.safeParse(body)
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors
      return badRequest(Object.values(errors).flat().join(", "))
    }

    const supabase = await createSupabaseServerClient()

    // If this is set as default, unset other defaults
    if (parsed.data.isDefault) {
      await supabase
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", user.id)
    }

    const { data, error } = await supabase
      .from("addresses")
      .insert({
        ...parsed.data,
        user_id: user.id,
      })
      .select()
      .single()

    if (error) return serverError(error)

    return Response.json({ success: true, data }, { status: 201 })
  } catch (error) {
    return serverError(error)
  }
}
