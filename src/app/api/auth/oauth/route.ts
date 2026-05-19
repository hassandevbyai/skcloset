import { NextRequest } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { badRequest, serverError } from "@/lib/api-utils"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { provider } = body

    if (!provider || !["google", "apple"].includes(provider)) {
      return badRequest("Provider must be 'google' or 'apple'")
    }

    const supabase = await createSupabaseServerClient()

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as "google" | "apple",
      options: {
        redirectTo:
          process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_URL ||
          `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/callback`,
      },
    })

    if (error) return badRequest(error.message)

    return Response.json({ success: true, data })
  } catch (error) {
    return serverError(error)
  }
}
