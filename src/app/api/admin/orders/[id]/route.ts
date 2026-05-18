import { NextRequest } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { requireAdmin } from "@/lib/api-utils"
import { badRequest, ok, serverError } from "@/lib/api-utils"
import { updateOrderStatusSchema } from "@/lib/validators"

// GET /api/admin/orders/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAdmin()
    if (!user) {
      return Response.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      )
    }

    const { id } = await params
    const supabase = await createSupabaseServerClient()
    const { data: order, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        items:order_items(*),
        user:user_id(id, email, first_name, last_name, phone),
        shipping_address:addresses!shipping_address_id(*),
        billing_address:addresses!billing_address_id(*)
      `
      )
      .eq("id", id)
      .single()

    if (error || !order) {
      return Response.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      )
    }

    return ok(order)
  } catch (error) {
    return serverError(error)
  }
}

// PUT /api/admin/orders/[id] - Update order status
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAdmin()
    if (!user) {
      return Response.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      )
    }

    const { id } = await params
    const body = await req.json()
    const parsed = updateOrderStatusSchema.safeParse(body)

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors
      return badRequest(Object.values(errors).flat().join(", "))
    }

    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
      .from("orders")
      .update({
        status: parsed.data.status,
        tracking_number: parsed.data.trackingNumber || null,
        tracking_url: parsed.data.trackingUrl || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) return serverError(error)

    return ok(data)
  } catch (error) {
    return serverError(error)
  }
}
