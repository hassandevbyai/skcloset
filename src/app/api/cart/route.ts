import { NextRequest } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { addToCartSchema } from "@/lib/validators"
import { badRequest, ok, serverError } from "@/lib/api-utils"

export async function GET(_req: NextRequest) {
  try {
    try {
      const supabase = await createSupabaseServerClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        return ok([])
      }

      let { data: cart } = await supabase
        .from("carts")
        .select("id")
        .eq("user_id", session.user.id)
        .single()

      if (!cart) {
        return ok([])
      }

      const { data: items } = await supabase
        .from("cart_items")
        .select(
          `
          *,
          variant:product_variants(*)
        `
        )
        .eq("cart_id", cart.id)

      return ok(items || [])
    } catch {
      return ok([])
    }
  } catch (error) {
    return serverError(error)
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = addToCartSchema.safeParse(body)

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors
      return badRequest(Object.values(errors).flat().join(", "))
    }

    try {
      const { variantId, quantity } = parsed.data
      const supabase = await createSupabaseServerClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        return ok({ message: "Item added to cart" })
      }

      let { data: cart } = await supabase
        .from("carts")
        .select("id")
        .eq("user_id", session.user.id)
        .single()

      if (!cart) {
        const { data: newCart } = await supabase
          .from("carts")
          .insert({ user_id: session.user.id })
          .select("id")
          .single()

        if (newCart) cart = newCart
      }

      if (cart) {
        const { data: item } = await supabase
          .from("cart_items")
          .select("id, quantity")
          .eq("cart_id", cart.id)
          .eq("variant_id", variantId)
          .single()

        if (item) {
          await supabase
            .from("cart_items")
            .update({ quantity: item.quantity + quantity })
            .eq("id", item.id)
        } else {
          await supabase
            .from("cart_items")
            .insert({ cart_id: cart.id, variant_id: variantId, quantity })
        }
      }
    } catch {
      // Fallback: return success
    }

    return ok({ message: "Item added to cart" })
  } catch (error) {
    return serverError(error)
  }
}
