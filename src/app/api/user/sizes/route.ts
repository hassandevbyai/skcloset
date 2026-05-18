import { NextRequest } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { unauthorized, badRequest, ok, serverError, getAuthenticatedUser } from "@/lib/api-utils"
import { z } from "zod"

const sizePreferenceSchema = z.object({
  category: z.enum(["tops", "bottoms", "footwear"]),
  size: z.string().min(1),
  brand: z.string().optional(),
})

// GET /api/user/sizes
export async function GET() {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorized()

    const supabase = await createSupabaseServerClient()
    const { data: sizes, error } = await supabase
      .from("user_size_preferences")
      .select("*")
      .eq("user_id", user.id)

    if (error) return serverError(error)

    return ok(sizes || [])
  } catch (error) {
    return serverError(error)
  }
}

// POST /api/user/sizes
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorized()

    const body = await req.json()
    const parsed = sizePreferenceSchema.safeParse(body)

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors
      return badRequest(Object.values(errors).flat().join(", "))
    }

    const supabase = await createSupabaseServerClient()

    // Upsert: if same category+brand exists, update it
    const { data: existing } = await supabase
      .from("user_size_preferences")
      .select("id")
      .eq("user_id", user.id)
      .eq("category", parsed.data.category)
      .eq("brand", parsed.data.brand || null)
      .maybeSingle()

    if (existing) {
      const { error } = await supabase
        .from("user_size_preferences")
        .update({ size: parsed.data.size })
        .eq("id", existing.id)

      if (error) return serverError(error)
      return ok({ message: "Size preference updated" })
    }

    const { error } = await supabase
      .from("user_size_preferences")
      .insert({
        user_id: user.id,
        ...parsed.data,
      })

    if (error) return serverError(error)

    return Response.json(
      { success: true, data: { message: "Size preference saved" } },
      { status: 201 }
    )
  } catch (error) {
    return serverError(error)
  }
}
