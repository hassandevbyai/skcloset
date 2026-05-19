import { sendAbandonedCart } from "./email"
import type { CartItemData } from "./email"

const ABANDONED_THRESHOLD_MS = 60 * 60 * 1000 // 1 hour

export interface CartRecoveryItem {
  name: string
  price: number
  image?: string
}

export interface CartRecoveryResult {
  recovered: boolean
  reason?: string
}

/**
 * Check if a cart is abandoned based on its last modified timestamp.
 * Returns true if the cart has been idle longer than the threshold.
 */
export function isCartAbandoned(lastModifiedAt: string | Date | number): boolean {
  const lastModified =
    typeof lastModifiedAt === "string"
      ? new Date(lastModifiedAt).getTime()
      : lastModifiedAt instanceof Date
        ? lastModifiedAt.getTime()
        : lastModifiedAt

  return Date.now() - lastModified > ABANDONED_THRESHOLD_MS
}

/**
 * Send a recovery email for an abandoned cart.
 * This is the main function to call from API routes or cron jobs.
 */
export async function recoverAbandonedCart(
  email: string,
  items: CartRecoveryItem[]
): Promise<CartRecoveryResult> {
  if (!email) {
    return { recovered: false, reason: "No email provided" }
  }

  if (!items || items.length === 0) {
    return { recovered: false, reason: "Cart is empty" }
  }

  const cartItems: CartItemData[] = items.map((item) => ({
    name: item.name,
    price: item.price,
    image: item.image,
  }))

  const result = await sendAbandonedCart(email, cartItems)

  if (!result.success) {
    return { recovered: false, reason: result.error || "Failed to send recovery email" }
  }

  return { recovered: true }
}

export { ABANDONED_THRESHOLD_MS }
