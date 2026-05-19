import { NextRequest } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { serverError, corsHeaders } from "@/lib/api-utils"

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get("stripe-signature")

    if (!signature) {
      return Response.json(
        { success: false, error: "Missing stripe-signature header" },
        { status: 400 }
      )
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!webhookSecret) {
      return Response.json(
        { success: false, error: "Webhook secret not configured" },
        { status: 500 }
      )
    }

    const { getStripe } = await import("@/lib/stripe")
    const stripe = getStripe()
    if (!stripe) {
      return Response.json(
        { success: false, error: "Stripe not configured" },
        { status: 500 }
      )
    }

    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return Response.json(
        { success: false, error: "Invalid signature" },
        { status: 400 }
      )
    }

    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object
        const orderId = paymentIntent.metadata.orderId

        if (orderId) {
          await supabaseAdmin
            .from("orders")
            .update({
              payment_status: "paid",
              status: "processing",
              updated_at: new Date().toISOString(),
            })
            .eq("id", orderId)

          // Send order confirmation email
          const { data: order } = await supabaseAdmin
            .from("orders")
            .select("*, items:order_items(*), user:user_id(email)")
            .eq("id", orderId)
            .single()

          if (order) {
            const userEmail = order.user?.email || paymentIntent.receipt_email
            if (userEmail) {
              const { sendOrderConfirmation } = await import("@/lib/email")
              await sendOrderConfirmation(userEmail, {
                orderNumber: order.order_number,
                items: (order.items || []).map((i: { product_name: string; quantity: number; unit_price: number }) => ({
                  name: i.product_name,
                  quantity: i.quantity,
                  price: i.unit_price,
                })),
                total: order.total_amount,
                shippingAddress: order.shipping_address
                  ? `${order.shipping_address.firstName || ""} ${order.shipping_address.lastName || ""}\n${order.shipping_address.address || ""}\n${order.shipping_address.city || ""}, ${order.shipping_address.state || ""} ${order.shipping_address.zip || ""}`
                  : undefined,
              })
            }
          }
        }
        break
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object
        const orderId = paymentIntent.metadata.orderId

        if (orderId) {
          await supabaseAdmin
            .from("orders")
            .update({
              payment_status: "failed",
              status: "cancelled",
              updated_at: new Date().toISOString(),
            })
            .eq("id", orderId)
        }
        break
      }

      case "charge.refunded": {
        const charge = event.data.object
        const paymentIntentId = charge.payment_intent as string

        if (paymentIntentId) {
          const { data: order } = await supabaseAdmin
            .from("orders")
            .select("id")
            .eq("stripe_payment_intent_id", paymentIntentId)
            .single()

          if (order) {
            await supabaseAdmin
              .from("orders")
              .update({
                payment_status: "refunded",
                status: "refunded",
                updated_at: new Date().toISOString(),
              })
              .eq("id", order.id)
          }
        }
        break
      }
    }

    return Response.json({ received: true }, { status: 200 })
  } catch (error) {
    return serverError(error)
  }
}

// Handle CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  })
}
