"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { XIcon } from "@/components/layout/Icons"
import { getCart, removeFromCart, updateQuantity, getCartTotal, clearCart, type CartItem } from "@/lib/cart-store"

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setItems(getCart())
    setMounted(true)
  }, [])

  function refresh() {
    setItems([...getCart()])
  }

  function handleRemove(slug: string, size: string, color: string) {
    removeFromCart(slug, size, color)
    refresh()
  }

  function handleQty(slug: string, size: string, color: string, qty: number) {
    if (qty < 1) return
    updateQuantity(slug, size, color, qty)
    refresh()
  }

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const shipping = subtotal >= 200 ? 0 : 12
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  if (!mounted) {
    return <div className="min-h-screen" />
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="border-b border-border bg-secondary/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <p className="text-xs tracking-[0.3em] uppercase text-accent font-medium mb-2">Cart</p>
            <h1 className="font-serif text-3xl md:text-5xl text-foreground">Shopping Cart</h1>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="text-muted-foreground mb-6">Your cart is empty</p>
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

  return (
    <div className="min-h-screen">
      <div className="border-b border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <p className="text-xs tracking-[0.3em] uppercase text-accent font-medium mb-2">Cart</p>
          <h1 className="font-serif text-3xl md:text-5xl text-foreground">Shopping Cart</h1>
          <p className="text-sm text-muted-foreground mt-2">{items.length} {items.length === 1 ? "item" : "items"}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-12">
          <div className="space-y-6">
            {items.map((item, i) => (
              <div key={`${item.slug}-${item.size}-${item.color}`} className="flex gap-4 pb-6 border-b border-border">
                <div className="relative w-20 h-28 sm:w-24 sm:h-32 md:w-28 md:h-36 bg-secondary shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium">{item.brand}</p>
                      <h3 className="text-sm font-medium text-foreground">{item.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.color} / {item.size}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-foreground whitespace-nowrap">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-border">
                      <button
                        onClick={() => handleQty(item.slug, item.size, item.color, item.quantity - 1)}
                        className="px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        −
                      </button>
                      <span className="px-3 py-1.5 text-xs text-foreground min-w-[2rem] text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleQty(item.slug, item.size, item.color, item.quantity + 1)}
                        className="px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemove(item.slug, item.size, item.color)}
                      className="text-muted-foreground hover:text-foreground transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-between pt-2">
              <button
                onClick={() => { if (window.confirm("Clear all items from your cart?")) { clearCart(); refresh() } }}
                className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
              >
                Clear Cart
              </button>
              <Link
                href="/shop"
                className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

          <div className="mt-8 lg:mt-0">
            <div className="border border-border p-6 sticky top-24">
              <h3 className="text-xs tracking-[0.15em] uppercase font-medium text-foreground mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">
                    {shipping === 0 ? <span className="text-accent">Free</span> : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span className="text-foreground">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-medium">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">${total.toFixed(2)}</span>
                </div>
              </div>
              <Link
                href="/checkout"
                className="mt-6 block w-full bg-primary text-primary-foreground text-center py-3 text-xs tracking-[0.2em] uppercase font-medium hover:bg-primary/90 transition-colors"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
