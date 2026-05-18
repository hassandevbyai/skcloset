import { NextRequest } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { resetPasswordSchema } from "@/lib/validators"
import { badRequest, ok, serverError } from "@/lib/api-utils"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = resetPasswordSchema.safeParse(body)

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors
      return badRequest(Object.values(errors).flat().join(", "))
    }

    const { password } = parsed.data
    const supabase = await createSupabaseServerClient()

    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      return badRequest(error.message)
    }

    return ok({
      message: "Password updated successfully. Please sign in with your new password.",
    })
  } catch (error) {
    return serverError(error)
  }
}
