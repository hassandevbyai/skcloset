import { NextRequest } from "next/server"
import { sendOrderConfirmation } from "@/lib/email"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { sendOrderConfirmationSchema } from "@/lib/validators"
import { ok, badRequest, serverError } from "@/lib/api-utils"

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return badRequest("Unauthorized")

    const body = await req.json()
    const parsed = sendOrderConfirmationSchema.safeParse(body)
    if (!parsed.success) {
      return badRequest(parsed.error.flatten().fieldErrors.email?.[0] || "Invalid payload")
    }

    const result = await sendOrderConfirmation(parsed.data.email, parsed.data.order)
    if (!result.success) {
      return badRequest(result.error || "Failed to send email")
    }

    return ok({ sent: true })
  } catch (error) {
    return serverError(error)
  }
}
