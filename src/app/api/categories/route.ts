import { NextRequest } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { ok, notFound, serverError, badRequest } from "@/lib/api-utils"

// GET /api/categories — list all active categories
export async function GET() {
  try {
    const supabase = await createSupabaseServerClient()

    const { data: categories, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })

    if (error) {
      return serverError(error)
    }

    return ok(categories || [])
  } catch (error) {
    return serverError(error)
  }
}
