"use client"

import { useState, useEffect, type FormEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getCart, clearCart, type CartItem } from "@/lib/cart-store"
import { createOrder } from "@/lib/order-store"
import { getProfile, updateProfile } from "@/lib/profile-store"
import { getAuthState, getUser } from "@/lib/auth-store"
import { showToast } from "@/lib/toast-store"
import { validateCoupon, useCoupon } from "@/lib/coupon-store"
import { notifyOrderPlaced } from "@/lib/notification-store"

const FREE_SHIPPING_THRESHOLD = 200
const SHIPPING_COST = 12
const TAX_RATE = 0.08

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
}

interface FormErrors {
  [key: string]: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const [items, setItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "stripe">("cod")
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})

  const [couponInput, setCouponInput] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState("")
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [couponMessage, setCouponMessage] = useState("")
  const [couponError, setCouponError] = useState("")
  const [applyingCoupon, setApplyingCoupon] = useState(false)

  const [authChecked, setAuthChecked] = useState(false)
  const [authed, setAuthed] = useState(false)
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    const state = getAuthState()
    if (state.isLoggedIn) {
      const user = getUser()
      setAuthed(true)
      setUserEmail(user?.email || "")
      setItems(getCart())
      const profile = getProfile()
      if (profile.firstName) setForm(profile)
    }
    setAuthChecked(true)
    setMounted(true)
  }, [])

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)

  // Re-validate coupon when subtotal changes (cart modified)
  useEffect(() => {
    if (appliedCoupon) {
      const result = validateCoupon(appliedCoupon, subtotal)
      if (!result.valid) {
        setAppliedCoupon("")
        setCouponDiscount(0)
        setCouponMessage("")
        setCouponError("Coupon cleared — cart total changed")
        showToast("Coupon cleared — cart total changed", "error")
      } else {
        setCouponDiscount(result.discount)
        setCouponMessage(result.message)
      }
    }
  }, [subtotal]) // eslint-disable-line react-hooks/exhaustive-deps

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const tax = subtotal * TAX_RATE
  const discount = couponDiscount
  const totalAfterDiscount = subtotal + shipping + tax - discount
  const total = Math.max(0, totalAfterDiscount)

  function validate(): boolean {
    const e: FormErrors = {}

    if (!form.firstName.trim()) e.firstName = "First name is required"
    if (!form.lastName.trim()) e.lastName = "Last name is required"
    if (!form.email.trim()) {
      e.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Invalid email format"
    }
    if (!form.phone.trim()) {
      e.phone = "Phone is required"
    } else if (!/^[\d\s\-+()]{7,20}$/.test(form.phone)) {
      e.phone = "Invalid phone format"
    }
    if (!form.address.trim()) e.address = "Address is required"
    if (!form.city.trim()) e.city = "City is required"
    if (!form.state.trim()) e.state = "State is required"
    if (!form.zip.trim()) e.zip = "ZIP code is required"

    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return

    updateProfile(form)

    if (paymentMethod === "cod") {
      setSubmitting(true)
      const order = createOrder({
        userEmail,
        items,
        total,
        subtotal,
        shipping,
        tax,
        discount,
        couponCode: appliedCoupon || undefined,
        paymentMethod: "cod",
        shippingAddress: {
          firstName: form.firstName,
          lastName: form.lastName,
          address: form.address,
          city: form.city,
          state: form.state,
          zip: form.zip,
          phone: form.phone,
        },
      })
      // Increment coupon usage
      if (appliedCoupon) {
        useCoupon(appliedCoupon)
      }
      // Notify the user
      notifyOrderPlaced(userEmail, order.id)
      clearCart()
      showToast("Order placed successfully!", "success")
      router.push(`/orders/${order.id}`)
    } else {
      alert("Stripe integration coming soon")
    }
  }

  function updateField(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev }
        delete copy[field]
        return copy
      })
    }
  }

  if (!mounted) {
    return <div className="min-h-screen" />
  }

  if (!authChecked) return <div className="min-h-screen" />

  if (!authed) {
    return (
      <div className="min-h-screen">
        <div className="border-b border-border bg-secondary/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <p className="text-xs tracking-[0.3em] uppercase text-accent font-medium mb-2">Checkout</p>
            <h1 className="font-serif text-3xl md:text-5xl text-foreground">Checkout</h1>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center max-w-md mx-auto">
          <p className="text-sm text-muted-foreground mb-2">Sign in to complete your purchase</p>
          <p className="text-xs text-muted-foreground/60 mb-8">Your cart items will be saved for later.</p>
          <Link
            href="/auth/login?redirect=/checkout"
            className="inline-block bg-accent text-accent-foreground px-8 py-3 text-xs tracking-[0.2em] uppercase font-medium hover:bg-accent/90 transition-colors mb-4 w-full max-w-xs"
          >
            Sign In
          </Link>
          <p className="text-xs text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register?redirect=/checkout" className="text-foreground hover:text-accent underline underline-offset-2">Register</Link>
          </p>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="border-b border-border bg-secondary/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <p className="text-xs tracking-[0.3em] uppercase text-accent font-medium mb-2">Checkout</p>
            <h1 className="font-serif text-3xl md:text-5xl text-foreground">Checkout</h1>
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
          <p className="text-xs tracking-[0.3em] uppercase text-accent font-medium mb-2">Checkout</p>
          <h1 className="font-serif text-3xl md:text-5xl text-foreground">Checkout</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="lg:grid lg:grid-cols-[1fr_420px] lg:gap-12">
            <div className="space-y-10">
              <section>
                <h2 className="font-serif text-xl text-foreground mb-6">Shipping Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium mb-1.5">First Name</label>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={(e) => updateField("firstName", e.target.value)}
                      className={`w-full px-4 py-2.5 bg-transparent border text-sm text-foreground focus:outline-none focus:border-accent transition-colors ${errors.firstName ? "border-red-500" : "border-border"}`}
                      required
                    />
                    {errors.firstName && <p className="text-[10px] text-red-500 mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium mb-1.5">Last Name</label>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) => updateField("lastName", e.target.value)}
                      className={`w-full px-4 py-2.5 bg-transparent border text-sm text-foreground focus:outline-none focus:border-accent transition-colors ${errors.lastName ? "border-red-500" : "border-border"}`}
                      required
                    />
                    {errors.lastName && <p className="text-[10px] text-red-500 mt-1">{errors.lastName}</p>}
                  </div>
                  <div>
                    <label className="block text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium mb-1.5">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className={`w-full px-4 py-2.5 bg-transparent border text-sm text-foreground focus:outline-none focus:border-accent transition-colors ${errors.email ? "border-red-500" : "border-border"}`}
                      required
                    />
                    {errors.email && <p className="text-[10px] text-red-500 mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium mb-1.5">Phone</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className={`w-full px-4 py-2.5 bg-transparent border text-sm text-foreground focus:outline-none focus:border-accent transition-colors ${errors.phone ? "border-red-500" : "border-border"}`}
                      required
                    />
                    {errors.phone && <p className="text-[10px] text-red-500 mt-1">{errors.phone}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium mb-1.5">Address</label>
                    <input
                      type="text"
                      value={form.address}
                      onChange={(e) => updateField("address", e.target.value)}
                      className={`w-full px-4 py-2.5 bg-transparent border text-sm text-foreground focus:outline-none focus:border-accent transition-colors ${errors.address ? "border-red-500" : "border-border"}`}
                      required
                    />
                    {errors.address && <p className="text-[10px] text-red-500 mt-1">{errors.address}</p>}
                  </div>
                  <div>
                    <label className="block text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium mb-1.5">City</label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      className={`w-full px-4 py-2.5 bg-transparent border text-sm text-foreground focus:outline-none focus:border-accent transition-colors ${errors.city ? "border-red-500" : "border-border"}`}
                      required
                    />
                    {errors.city && <p className="text-[10px] text-red-500 mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium mb-1.5">State</label>
                    <input
                      type="text"
                      value={form.state}
                      onChange={(e) => updateField("state", e.target.value)}
                      className={`w-full px-4 py-2.5 bg-transparent border text-sm text-foreground focus:outline-none focus:border-accent transition-colors ${errors.state ? "border-red-500" : "border-border"}`}
                      required
                    />
                    {errors.state && <p className="text-[10px] text-red-500 mt-1">{errors.state}</p>}
                  </div>
                  <div>
                    <label className="block text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium mb-1.5">ZIP Code</label>
                    <input
                      type="text"
                      value={form.zip}
                      onChange={(e) => updateField("zip", e.target.value)}
                      className={`w-full px-4 py-2.5 bg-transparent border text-sm text-foreground focus:outline-none focus:border-accent transition-colors ${errors.zip ? "border-red-500" : "border-border"}`}
                      required
                    />
                    {errors.zip && <p className="text-[10px] text-red-500 mt-1">{errors.zip}</p>}
                  </div>
                </div>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-6">Payment Method</h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border border-border cursor-pointer hover:border-accent transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="accent-accent shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">Cash on Delivery</p>
                      <p className="text-xs text-muted-foreground">Pay when your order arrives</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border border-border cursor-pointer hover:border-accent transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="stripe"
                      checked={paymentMethod === "stripe"}
                      onChange={() => setPaymentMethod("stripe")}
                      className="accent-accent shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">Pay Online (Stripe)</p>
                      <p className="text-xs text-muted-foreground">Credit/Debit card via Stripe</p>
                    </div>
                  </label>
                </div>
              </section>
            </div>

            <div className="mt-10 lg:mt-0">
              <div className="border border-border p-6 sticky top-24">
                <h3 className="text-xs tracking-[0.15em] uppercase font-medium text-foreground mb-4">Order Summary</h3>
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={`${item.slug}-${item.size}-${item.color}`} className="flex gap-3">
                      <div className="relative w-16 h-20 bg-secondary shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium truncate">{item.brand}</p>
                        <p className="text-xs text-foreground truncate">{item.name}</p>
                        <p className="text-[11px] text-muted-foreground">{item.color} / {item.size}</p>
                        <div className="flex justify-between mt-1">
                          <span className="text-[11px] text-muted-foreground">Qty: {item.quantity}</span>
                          <span className="text-xs text-foreground font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Coupon */}
                <div className="border-t border-border pt-4 mb-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Coupon code"
                      disabled={!!appliedCoupon}
                      className="flex-1 px-3 py-2 bg-transparent border border-border text-xs text-foreground focus:outline-none focus:border-accent uppercase tracking-wider disabled:opacity-50"
                    />
                    {appliedCoupon ? (
                      <button
                        onClick={() => {
                          setAppliedCoupon("")
                          setCouponDiscount(0)
                          setCouponMessage("")
                          setCouponError("")
                          setCouponInput("")
                        }}
                        className="px-3 py-2 border border-border text-xs text-red-500 hover:bg-secondary/20"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (!couponInput.trim()) return
                          setApplyingCoupon(true)
                          setCouponError("")
                          // Validate against the subtotal (before discount)
                          const result = validateCoupon(couponInput, subtotal)
                          if (result.valid) {
                            setAppliedCoupon(couponInput)
                            setCouponDiscount(result.discount)
                            setCouponMessage(result.message)
                            setCouponError("")
                            showToast(result.message, "success")
                          } else {
                            setAppliedCoupon("")
                            setCouponDiscount(0)
                            setCouponMessage("")
                            setCouponError(result.message)
                            showToast(result.message, "error")
                          }
                          setApplyingCoupon(false)
                        }}
                        disabled={applyingCoupon}
                        className="px-4 py-2 bg-accent text-accent-foreground text-xs tracking-[0.1em] uppercase font-medium hover:bg-accent/90 disabled:opacity-50"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                  {couponMessage && appliedCoupon && (
                    <p className="text-[10px] text-green-600 mt-1">{couponMessage}</p>
                  )}
                  {couponError && !appliedCoupon && (
                    <p className="text-[10px] text-red-500 mt-1">{couponError}</p>
                  )}
                </div>
                <div className="space-y-3 text-sm border-t border-border pt-4">
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
                  {discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-accent text-sm">Discount {appliedCoupon && <span className="text-[9px] tracking-wider">({appliedCoupon})</span>}</span>
                      <span className="text-accent">-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-border pt-3 flex justify-between font-medium">
                    <span className="text-foreground">Total</span>
                    <span className="text-foreground">${total.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-6 w-full bg-primary text-primary-foreground py-3 text-xs tracking-[0.2em] uppercase font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {submitting ? "Processing..." : "Place Order"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
