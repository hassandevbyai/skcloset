import { NextRequest } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { badRequest, ok, serverError } from "@/lib/api-utils"
import { recoverAbandonedCart } from "@/lib/cart-recovery"

// POST /api/cart/recover — Trigger recovery email for current user's cart
export async function POST(_req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return badRequest("Unauthorized")

    // Get user email
    const { data: profile } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", session.user.id)
      .single()

    const email = profile?.email || session.user.email
    if (!email) return badRequest("User email not found")

    // Get user's cart with items
    const { data: cart } = await supabase
      .from("carts")
      .select("id, updated_at")
      .eq("user_id", session.user.id)
      .single()

    if (!cart) return badRequest("No cart found")

    const { data: cartItems } = await supabase
      .from("cart_items")
      .select("variant_id, quantity, variant:product_variants(price, product:products(name))")
      .eq("cart_id", cart.id)

    if (!cartItems || cartItems.length === 0) {
      return badRequest("Cart is empty")
    }

    const items = cartItems.map((ci) => ({
      name: (ci.variant as unknown as { product: { name: string } })?.product?.name || "Product",
      price: (ci.variant as unknown as { price: number })?.price || 0,
    }))

    const result = await recoverAbandonedCart(email, items)
    if (!result.recovered) {
      return badRequest(result.reason || "Failed to send recovery email")
    }

    return ok({ sent: true })
  } catch (error) {
    return serverError(error)
  }
}
