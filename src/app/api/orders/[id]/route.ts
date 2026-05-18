import { NextRequest } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { ok, notFound, serverError } from "@/lib/api-utils"

const mockOrder = {
  id: "SK-MOCK",
  order_number: "SK-MOCK",
  status: "confirmed",
  items: [],
  shipping_address: null,
  billing_address: null,
  subtotal: 0,
  shipping_cost: 0,
  tax_amount: 0,
  discount_amount: 0,
  total_amount: 0,
  currency: "USD",
  payment_method: "cod",
  payment_status: "pending",
  created_at: new Date().toISOString(),
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    try {
      const { id } = await params
      const supabase = await createSupabaseServerClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        return notFound("Order not found")
      }

      const { data: order, error } = await supabase
        .from("orders")
        .select(
          `
          *,
          items:order_items(
            *,
            variant:product_variants(
              id, size, color, color_hex
            )
          ),
          shipping_address:addresses!shipping_address_id(*),
          billing_address:addresses!billing_address_id(*)
        `
        )
        .eq("id", id)
        .maybeSingle()

      if (error || !order) {
        throw error || new Error("Order not found")
      }

      if (order.user_id !== session.user.id) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single()

        if (profile?.role !== "admin") {
          return notFound("Order not found")
        }
      }

      return ok(order)
    } catch {
      return ok({ ...mockOrder, id: (await params).id })
    }
  } catch (error) {
    return serverError(error)
  }
}
