import { NextRequest } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { serverError } from "@/lib/api-utils"

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const code = url.searchParams.get("code")

    if (!code) {
      return Response.redirect(
        new URL("/login?error=No authorization code", req.url)
      )
    }

    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      return Response.redirect(
        new URL(`/login?error=${encodeURIComponent(error.message)}`, req.url)
      )
    }

    return Response.redirect(new URL("/", req.url))
  } catch (error) {
    return serverError(error)
  }
}
