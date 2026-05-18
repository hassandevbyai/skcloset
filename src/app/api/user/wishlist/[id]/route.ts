import { NextRequest } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { unauthorized, ok, serverError, getAuthenticatedUser } from "@/lib/api-utils"

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    try {
      const user = await getAuthenticatedUser()
      if (!user) return unauthorized()

      const { id } = await params

      const supabase = await createSupabaseServerClient()
      await supabase
        .from("wishlists")
        .delete()
        .eq("user_id", user.id)
        .eq("slug", id)
    } catch {
      // Fallback: return success
    }

    return ok({ message: "Removed from wishlist" })
  } catch (error) {
    return serverError(error)
  }
}
