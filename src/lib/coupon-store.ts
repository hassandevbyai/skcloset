export interface Coupon {
  code: string
  type: "percentage" | "fixed"
  value: number
  minOrderAmount: number
  maxDiscount: number        // For percentage: max $ discount cap
  usageLimit: number         // Max number of times code can be used
  usedCount: number
  expiresAt: string          // ISO date string, empty = never
  isActive: boolean
  createdAt: string
}

const STORAGE_KEY = "skcloset_coupons"

function readCoupons(): Coupon[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeCoupons(coupons: Coupon[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(coupons))
  }
}

export function getCoupons(): Coupon[] {
  return readCoupons()
}

export function getActiveCoupons(): Coupon[] {
  return readCoupons().filter((c) => c.isActive)
}

export function addCoupon(coupon: Omit<Coupon, "createdAt" | "usedCount">): Coupon {
  const coupons = readCoupons()
  const newCoupon: Coupon = {
    ...coupon,
    code: coupon.code.toUpperCase().replace(/\s+/g, ""),
    usedCount: 0,
    createdAt: new Date().toISOString(),
  }
  // Check duplicate
  if (coupons.find((c) => c.code === newCoupon.code)) {
    throw new Error(`Coupon code "${newCoupon.code}" already exists`)
  }
  coupons.push(newCoupon)
  writeCoupons(coupons)
  return newCoupon
}

export function updateCoupon(code: string, updates: Partial<Coupon>): Coupon | undefined {
  const coupons = readCoupons()
  const idx = coupons.findIndex((c) => c.code === code)
  if (idx === -1) return undefined
  coupons[idx] = { ...coupons[idx], ...updates }
  writeCoupons(coupons)
  return coupons[idx]
}

export function deleteCoupon(code: string): boolean {
  const coupons = readCoupons()
  const idx = coupons.findIndex((c) => c.code === code)
  if (idx === -1) return false
  coupons.splice(idx, 1)
  writeCoupons(coupons)
  return true
}

export function toggleCouponStatus(code: string): Coupon | undefined {
  const coupons = readCoupons()
  const idx = coupons.findIndex((c) => c.code === code)
  if (idx === -1) return undefined
  coupons[idx].isActive = !coupons[idx].isActive
  writeCoupons(coupons)
  return coupons[idx]
}

export interface CouponValidationResult {
  valid: boolean
  discount: number
  message: string
}

/**
 * Validate and calculate discount for a coupon code.
 * Returns { valid, discount, message }
 */
export function validateCoupon(code: string, orderTotal: number): CouponValidationResult {
  const normalizedCode = code.toUpperCase().replace(/\s+/g, "")
  const coupon = readCoupons().find((c) => c.code === normalizedCode)

  if (!coupon) {
    return { valid: false, discount: 0, message: "Invalid coupon code" }
  }

  if (!coupon.isActive) {
    return { valid: false, discount: 0, message: "This coupon is no longer active" }
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return { valid: false, discount: 0, message: "This coupon has expired" }
  }

  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
    return { valid: false, discount: 0, message: "This coupon has reached its usage limit" }
  }

  if (orderTotal < coupon.minOrderAmount) {
    return { valid: false, discount: 0, message: `Minimum order amount is $${coupon.minOrderAmount.toFixed(2)} for this coupon` }
  }

  let discount = 0
  if (coupon.type === "fixed") {
    discount = Math.min(coupon.value, orderTotal)
  } else {
    // percentage
    discount = (orderTotal * coupon.value) / 100
    if (coupon.maxDiscount > 0) {
      discount = Math.min(discount, coupon.maxDiscount)
    }
  }

  return { valid: true, discount, message: `Coupon applied! You saved $${discount.toFixed(2)}` }
}

/**
 * Mark coupon as used (increment usedCount)
 */
export function useCoupon(code: string): void {
  const coupons = readCoupons()
  const idx = coupons.findIndex((c) => c.code === code.toUpperCase().replace(/\s+/g, ""))
  if (idx !== -1) {
    coupons[idx].usedCount += 1
    writeCoupons(coupons)
  }
}

/**
 * Seed some default coupons for testing
 */
export function seedDefaultCoupons(): void {
  const existing = readCoupons()
  if (existing.length > 0) return

  const defaults: Omit<Coupon, "createdAt" | "usedCount">[] = [
    {
      code: "WELCOME10",
      type: "percentage",
      value: 10,
      minOrderAmount: 0,
      maxDiscount: 50,
      usageLimit: 100,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
      isActive: true,
    },
    {
      code: "SAVE20",
      type: "fixed",
      value: 20,
      minOrderAmount: 100,
      maxDiscount: 0,
      usageLimit: 50,
      expiresAt: "",
      isActive: true,
    },
    {
      code: "FREESHIP",
      type: "fixed",
      value: 15,
      minOrderAmount: 50,
      maxDiscount: 0,
      usageLimit: 200,
      expiresAt: "",
      isActive: true,
    },
  ]

  for (const c of defaults) {
    addCoupon(c)
  }
}