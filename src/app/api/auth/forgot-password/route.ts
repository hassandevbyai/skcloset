import { NextRequest } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { forgotPasswordSchema } from "@/lib/validators"
import { badRequest, ok, serverError } from "@/lib/api-utils"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = forgotPasswordSchema.safeParse(body)

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors
      return badRequest(Object.values(errors).flat().join(", "))
    }

    const { email } = parsed.data
    const supabase = await createSupabaseServerClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/reset-password`,
    })

    if (error) {
      return badRequest(error.message)
    }

    // Always return success to prevent email enumeration
    return ok({
      message: "If an account exists with this email, a password reset link has been sent.",
    })
  } catch (error) {
    return serverError(error)
  }
}
