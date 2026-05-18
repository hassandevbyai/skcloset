import Stripe from "stripe"

let _stripe: Stripe | null = null

export function getStripe(): Stripe | null {
  if (_stripe) return _stripe
  if (!process.env.STRIPE_SECRET_KEY) return null
  _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-02-24.acacia",
    typescript: true,
  })
  return _stripe
}
