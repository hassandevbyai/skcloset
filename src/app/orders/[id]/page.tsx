"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import dynamic from "next/dynamic"
import { useParams, useRouter } from "next/navigation"
import { getUser } from "@/lib/auth-store"
import { ChevronRight } from "@/components/layout/Icons"
import { getOrderById, type Order } from "@/lib/order-store"

const InvoiceDownloadButton = dynamic(
  () => import("@/components/invoice/InvoiceDownloadButton"),
  { ssr: false }
)

const statusSteps = ["pending", "confirmed", "shipped", "delivered"]

const statusLabels: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
}

export default function OrderConfirmationPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [order, setOrder] = useState<Order | null>(null)
  const [mounted, setMounted] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    if (!getUser()) {
      router.push("/auth/login?redirect=" + encodeURIComponent("/orders/" + id))
      return
    }
    setAuthChecked(true)
  }, [router, id])

  useEffect(() => {
    if (!authChecked) return
    const found = getOrderById(id)
    // Security: Check if order belongs to current user
    if (found) {
      const user = getUser()
      if (user && found.userEmail && found.userEmail.toLowerCase() !== user.email.toLowerCase()) {
        // Order doesn't belong to this user - redirect to account
        router.push("/account")
        return
      }
    }
    setOrder(found || null)
    setMounted(true)
  }, [id, authChecked, router])

  if (!mounted || !authChecked) {
    return <div className="min-h-screen" />
  }

  if (!order) {
    return (
      <div className="min-h-screen">
        <div className="border-b border-border bg-secondary/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <p className="text-xs tracking-[0.3em] uppercase text-accent font-medium mb-2">Order</p>
            <h1 className="font-serif text-3xl md:text-5xl text-foreground">Order Not Found</h1>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="text-muted-foreground mb-6">This order doesn&apos;t exist.</p>
          <Link
            href="/shop"
            className="inline-block bg-primary text-primary-foreground px-8 py-3 text-xs tracking-[0.2em] uppercase font-medium hover:bg-primary/90 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  const currentStep = statusSteps.indexOf(order.status)

  return (
    <div className="min-h-screen">
      <div className="border-b border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <p className="text-xs tracking-[0.3em] uppercase text-accent font-medium mb-2">Order Confirmed</p>
          <h1 className="font-serif text-3xl md:text-5xl text-foreground">Thank You</h1>
          <p className="text-sm text-muted-foreground mt-2">Order {order.id}</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Status timeline */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {statusSteps.map((step, i) => (
              <div key={step} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                      i <= currentStep
                        ? "bg-accent text-accent-foreground"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {i <= currentStep ? "✓" : i + 1}
                  </div>
                  <span
                    className={`text-[10px] tracking-[0.15em] uppercase mt-2 ${
                      i <= currentStep ? "text-foreground font-medium" : "text-muted-foreground"
                    }`}
                  >
                    {statusLabels[step]}
                  </span>
                </div>
                {i < statusSteps.length - 1 && (
                  <div
                    className={`w-12 sm:w-20 md:w-32 h-px mx-2 ${
                      i < currentStep ? "bg-accent" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Items */}
        <section className="mb-10">
          <h2 className="font-serif text-xl text-foreground mb-4">Items Ordered</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={`${item.slug}-${item.size}-${item.color}`} className="flex gap-4 pb-4 border-b border-border">
                <div className="relative w-20 h-24 bg-secondary shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium">{item.brand}</p>
                  <h3 className="text-sm font-medium text-foreground">{item.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{item.color} / {item.size}</p>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
                    <span className="text-sm font-medium text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Shipping address */}
          <section>
            <h2 className="font-serif text-xl text-foreground mb-4">Shipping Address</h2>
            <div className="text-sm text-muted-foreground space-y-1">
              <p className="text-foreground font-medium">
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
              </p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
              </p>
              <p>{order.shippingAddress.phone}</p>
            </div>
          </section>

          {/* Total breakdown */}
          <section>
            <h2 className="font-serif text-xl text-foreground mb-4">Order Total</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-foreground">
                  {order.shipping === 0 ? <span className="text-accent">Free</span> : `$${order.shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span className="text-foreground">${order.tax.toFixed(2)}</span>
              </div>
              {order.discount && order.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-accent">Discount {order.couponCode && <span className="text-[9px] tracking-wider">({order.couponCode})</span>}</span>
                  <span className="text-accent">-${order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-border pt-2 font-medium">
                <span className="text-foreground">Total</span>
                <span className="text-foreground">${order.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-muted-foreground">Payment</span>
                <span className="text-foreground capitalize">{order.paymentMethod === "cod" ? "Cash on Delivery" : "Stripe"}</span>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-border">
              <InvoiceDownloadButton order={order} />
              <p className="text-[10px] text-muted-foreground mt-2">
                PDF invoice will be generated with your order details and store information.
              </p>
            </div>
          </section>
        </div>

        <div className="text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 text-xs tracking-[0.2em] uppercase font-medium hover:bg-primary/90 transition-colors"
          >
            Continue Shopping
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
