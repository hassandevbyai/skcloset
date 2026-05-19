import { NextRequest } from "next/server"
import { sendPasswordReset } from "@/lib/email"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { sendPasswordResetSchema } from "@/lib/validators"
import { ok, badRequest, serverError } from "@/lib/api-utils"

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return badRequest("Unauthorized")

    const body = await req.json()
    const parsed = sendPasswordResetSchema.safeParse(body)
    if (!parsed.success) {
      return badRequest(parsed.error.flatten().fieldErrors.email?.[0] || "Invalid payload")
    }

    const result = await sendPasswordReset(parsed.data.email, parsed.data.resetLink)
    if (!result.success) {
      return badRequest(result.error || "Failed to send email")
    }

    return ok({ sent: true })
  } catch (error) {
    return serverError(error)
  }
}
