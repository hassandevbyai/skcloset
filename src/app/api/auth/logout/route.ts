import { createSupabaseServerClient } from "@/lib/supabase-server"
import { ok, serverError } from "@/lib/api-utils"

export async function POST() {
  try {
    try {
      const supabase = await createSupabaseServerClient()
      const { error } = await supabase.auth.signOut()

      if (error) {
        return Response.json(
          { success: false, error: error.message },
          { status: 400 }
        )
      }
    } catch {
      // Fallback: return success
    }

    return ok({ message: "Logged out" })
  } catch (error) {
    return serverError(error)
  }
}
