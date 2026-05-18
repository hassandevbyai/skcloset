// Product categories
export const CATEGORIES = [
  { slug: "shirts", label: "Shirts & Tops" },
  { slug: "jackets", label: "Jackets & Outerwear" },
  { slug: "bottoms", label: "Bottoms" },
  { slug: "footwear", label: "Footwear" },
  { slug: "accessories", label: "Accessories" },
  { slug: "knitwear", label: "Knitwear & Sweaters" },
] as const

// Order statuses
export const ORDER_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
] as const

// Payment statuses
export const PAYMENT_STATUSES = [
  "pending",
  "paid",
  "failed",
  "refunded",
] as const

// User roles
export const USER_ROLES = ["customer", "admin"] as const

// Pagination
export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100

// Currency
export const CURRENCY = "USD"
export const CURRENCY_SYMBOL = "$"

// App
export const APP_NAME = "SKCLOSET"
export const APP_DESCRIPTION = "Premium Men's Fashion Boutique"

// Order number prefix
export const ORDER_PREFIX = "SK"

// Tax rate (example: 8%)
export const TAX_RATE = 0.08

// Free shipping threshold
export const FREE_SHIPPING_THRESHOLD = 200
export const SHIPPING_COST = 10
