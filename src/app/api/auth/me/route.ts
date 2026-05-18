import { NextRequest } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { unauthorized, ok, serverError } from "@/lib/api-utils"

export async function GET(req: NextRequest) {
  try {
    try {
      const supabase = await createSupabaseServerClient()
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error || !user) {
        throw new Error("Not authenticated")
      }

      // Fetch full profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      return ok({
        id: user.id,
        email: user.email,
        name: profile?.name || user.user_metadata?.name || "",
        role: profile?.role || "user",
        phone: profile?.phone || "",
        createdAt: user.created_at,
      })
    } catch {
      // Fallback: check authorization header for mock user
      const auth = req.headers.get("authorization") || ""
      if (auth.startsWith("Bearer mock-")) {
        const role = auth.includes("admin") ? "admin" : "user"
        return ok({
          id: "mock-user-id",
          email: role === "admin" ? "admin@skcloset.com" : "user@skcloset.com",
          name: role === "admin" ? "Admin" : "Test User",
          role,
        })
      }
      return unauthorized("Not authenticated")
    }
  } catch (error) {
    return serverError(error)
  }
}
