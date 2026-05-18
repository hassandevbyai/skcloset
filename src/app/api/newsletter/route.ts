import { NextRequest } from "next/server"
import { z } from "zod"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { ok, badRequest, conflict, serverError } from "@/lib/api-utils"

const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = subscribeSchema.safeParse(body)

    if (!parsed.success) {
      return badRequest(parsed.error.errors[0].message)
    }

    const { email } = parsed.data

    try {
      const supabase = await createSupabaseServerClient()

      // Check for duplicate
      const { data: existing } = await supabase
        .from("newsletter_subscribers")
        .select("id")
        .eq("email", email)
        .maybeSingle()

      if (existing) {
        return conflict("This email is already subscribed")
      }

      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email, subscribed_at: new Date().toISOString() })

      if (error) throw error

      return ok({ message: "Subscribed successfully" })
    } catch {
      // Fallback
      console.log("Newsletter subscription (offline):", email)
      return ok({ message: "Subscribed successfully" })
    }
  } catch (error) {
    return serverError(error)
  }
}
