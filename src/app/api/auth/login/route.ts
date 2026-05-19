import { NextRequest } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { loginSchema } from "@/lib/validators"
import { badRequest, ok, serverError } from "@/lib/api-utils"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = loginSchema.safeParse(body)

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors
      return badRequest(Object.values(errors).flat().join(", "))
    }

    const { email, password } = parsed.data

    try {
      const supabase = await createSupabaseServerClient()

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          return badRequest("Invalid email or password")
        }
        return badRequest(error.message)
      }

      return ok({
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || "",
          role: "user",
        },
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at,
        },
      })
    } catch {
      // Fallback credentials removed for security.
      // In local development without Supabase, use the client-side auth-store
      // which reads from localStorage.
      return badRequest("Invalid email or password")
    }
  } catch (error) {
    return serverError(error)
  }
}
