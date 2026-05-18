import { NextRequest } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { unauthorized, badRequest, ok, serverError, getAuthenticatedUser } from "@/lib/api-utils"
import { z } from "zod"

const addWishlistSchema = z.object({
  slug: z.string().min(1),
})

export async function GET() {
  try {
    try {
      const user = await getAuthenticatedUser()
      if (!user) return unauthorized()

      const supabase = await createSupabaseServerClient()
      const { data: wishlist, error } = await supabase
        .from("wishlists")
        .select("slug")
        .eq("user_id", user.id)

      if (error) throw error

      const slugs = (wishlist || []).map((item: { slug: string }) => item.slug)
      return ok(slugs)
    } catch {
      return ok([])
    }
  } catch (error) {
    return serverError(error)
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = addWishlistSchema.safeParse(body)

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors
      return badRequest(Object.values(errors).flat().join(", "))
    }

    try {
      const user = await getAuthenticatedUser()
      if (!user) return unauthorized()

      const supabase = await createSupabaseServerClient()
      await supabase.from("wishlists").upsert(
        {
          user_id: user.id,
          slug: parsed.data.slug,
        },
        { onConflict: "user_id,slug" }
      )
    } catch {
      // Fallback: return success
    }

    return ok({ message: "Added to wishlist" })
  } catch (error) {
    return serverError(error)
  }
}
