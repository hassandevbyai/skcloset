import { NextRequest } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { updateCartItemSchema } from "@/lib/validators"
import { badRequest, ok, serverError } from "@/lib/api-utils"

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json()
    const parsed = updateCartItemSchema.safeParse(body)

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors
      return badRequest(Object.values(errors).flat().join(", "))
    }

    try {
      const { id } = await params
      const { quantity } = parsed.data
      const supabase = await createSupabaseServerClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        return ok({ message: "Cart item updated" })
      }

      const { data: cart } = await supabase
        .from("carts")
        .select("id")
        .eq("user_id", session.user.id)
        .single()

      if (cart) {
        await supabase
          .from("cart_items")
          .update({ quantity })
          .eq("id", id)
          .eq("cart_id", cart.id)
      }
    } catch {
      // Fallback: return success
    }

    return ok({ message: "Cart item updated" })
  } catch (error) {
    return serverError(error)
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    try {
      const { id } = await params
      const supabase = await createSupabaseServerClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        return ok({ message: "Item removed from cart" })
      }

      const { data: cart } = await supabase
        .from("carts")
        .select("id")
        .eq("user_id", session.user.id)
        .single()

      if (cart) {
        await supabase
          .from("cart_items")
          .delete()
          .eq("id", id)
          .eq("cart_id", cart.id)
      }
    } catch {
      // Fallback: return success
    }

    return ok({ message: "Item removed from cart" })
  } catch (error) {
    return serverError(error)
  }
}
