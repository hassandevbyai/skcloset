import { NextRequest } from "next/server"
import { sendAbandonedCart } from "@/lib/email"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { sendAbandonedCartSchema } from "@/lib/validators"
import { ok, badRequest, serverError } from "@/lib/api-utils"

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return badRequest("Unauthorized")

    const body = await req.json()
    const parsed = sendAbandonedCartSchema.safeParse(body)
    if (!parsed.success) {
      return badRequest(parsed.error.flatten().fieldErrors.email?.[0] || "Invalid payload")
    }

    const result = await sendAbandonedCart(parsed.data.email, parsed.data.items)
    if (!result.success) {
      return badRequest(result.error || "Failed to send email")
    }

    return ok({ sent: true })
  } catch (error) {
    return serverError(error)
  }
}
