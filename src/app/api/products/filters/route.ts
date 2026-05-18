import { NextRequest } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { ok, serverError } from "@/lib/api-utils"

export async function GET(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()

    // Get distinct brands from active products
    const { data, error } = await supabase
      .from("products")
      .select("brand")
      .eq("is_active", true)
      .not("brand", "is", null)
      .order("brand", { ascending: true })

    if (error) {
      return serverError(error)
    }

    const brands = [...new Set(data?.map((p) => p.brand).filter(Boolean))]

    // Get all unique sizes across variants
    const { data: variantData } = await supabase
      .from("product_variants")
      .select("size")
      .order("size", { ascending: true })

    const sizes = variantData
      ? [...new Set(variantData.map((v) => v.size))]
      : []

    return ok({ brands, sizes })
  } catch (error) {
    return serverError(error)
  }
}
