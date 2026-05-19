import { Resend } from "resend"

const resendApiKey = process.env.RESEND_API_KEY
let _resend: Resend | null = null

function getResend(): Resend | null {
  if (_resend) return _resend
  if (!resendApiKey) return null
  _resend = new Resend(resendApiKey)
  return _resend
}

const BRAND_NAME = "SKCLOSET"
const SUPPORT_EMAIL = "support@skcloset.com"
const FROM_EMAIL = "SKCLOSET <orders@skcloset.com>"

function wrapHtml(body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background-color: #0a0a0a; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 24px; }
    .header { text-align: center; padding-bottom: 32px; border-bottom: 1px solid #1f1f1f; }
    .header h1 { font-size: 28px; font-weight: 300; letter-spacing: 6px; color: #ffffff; text-transform: uppercase; }
    .content { padding: 32px 0; color: #cccccc; font-size: 15px; line-height: 1.7; }
    .content h2 { color: #ffffff; font-size: 20px; font-weight: 400; margin-bottom: 16px; }
    .content p { margin-bottom: 16px; }
    .btn { display: inline-block; padding: 14px 32px; background-color: #ffffff; color: #0a0a0a; text-decoration: none; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; font-weight: 600; }
    .footer { text-align: center; padding-top: 32px; border-top: 1px solid #1f1f1f; color: #666666; font-size: 12px; }
    .footer a { color: #999999; text-decoration: underline; }
    table.items { width: 100%; border-collapse: collapse; margin: 16px 0 24px; }
    table.items th { text-align: left; color: #888888; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; padding: 8px 0; border-bottom: 1px solid #1f1f1f; }
    table.items td { padding: 12px 0; border-bottom: 1px solid #1a1a1a; font-size: 14px; }
    .price { color: #ffffff; }
    .divider { height: 1px; background: #1f1f1f; margin: 24px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${BRAND_NAME}</h1>
    </div>
    <div class="content">
      ${body}
    </div>
    <div class="footer">
      <p>${BRAND_NAME} &mdash; Luxury Streetwear</p>
      <p style="margin-top: 8px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://skcloset.com"}">Visit Store</a>
        &nbsp;&middot;&nbsp;
        <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>
      </p>
    </div>
  </div>
</body>
</html>`
}

export interface OrderConfirmationData {
  orderNumber: string
  items: { name: string; quantity: number; price: number }[]
  total: number
  shippingAddress?: string
}

export interface CartItemData {
  name: string
  price: number
  image?: string
}

export async function sendOrderConfirmation(
  email: string,
  order: OrderConfirmationData
): Promise<{ success: boolean; error?: string }> {
  const resend = getResend()
  if (!resend) return { success: false, error: "Resend not configured" }

  const itemsHtml = order.items
    .map(
      (item) =>
        `<tr><td>${item.name}</td><td>${item.quantity}</td><td class="price">$${item.price.toFixed(2)}</td></tr>`
    )
    .join("")

  const totalHtml = order.items.reduce((s, i) => s + i.price * i.quantity, 0)

  const body = `
    <h2>Thank you for your order</h2>
    <p>Order <strong>#${order.orderNumber}</strong> has been confirmed and is being processed.</p>
    ${order.shippingAddress ? `<p>Shipping to:<br>${order.shippingAddress.replace(/\n/g, "<br>")}</p>` : ""}
    <div class="divider"></div>
    <table class="items">
      <thead><tr><th>Item</th><th>Qty</th><th>Price</th></tr></thead>
      <tbody>${itemsHtml}</tbody>
    </table>
    <p style="text-align:right;font-size:18px;color:#ffffff;">
      Total: <strong>$${totalHtml.toFixed(2)}</strong>
    </p>
  `

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Order Confirmed — #${order.orderNumber}`,
      html: wrapHtml(body),
    })
    return { success: true }
  } catch (err) {
    console.error("Failed to send order confirmation email:", err)
    return { success: false, error: String(err) }
  }
}

export async function sendPasswordReset(
  email: string,
  resetLink: string
): Promise<{ success: boolean; error?: string }> {
  const resend = getResend()
  if (!resend) return { success: false, error: "Resend not configured" }

  const body = `
    <h2>Reset your password</h2>
    <p>We received a request to reset the password for your ${BRAND_NAME} account.</p>
    <p style="text-align:center;padding:24px 0;">
      <a href="${resetLink}" class="btn">Reset Password</a>
    </p>
    <p>If you did not request this, you can safely ignore this email.</p>
    <p>The link will expire in 1 hour.</p>
  `

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `${BRAND_NAME} — Password Reset`,
      html: wrapHtml(body),
    })
    return { success: true }
  } catch (err) {
    console.error("Failed to send password reset email:", err)
    return { success: false, error: String(err) }
  }
}

export async function sendAbandonedCart(
  email: string,
  items: CartItemData[]
): Promise<{ success: boolean; error?: string }> {
  const resend = getResend()
  if (!resend) return { success: false, error: "Resend not configured" }

  const itemsHtml = items
    .map(
      (item) =>
        `<tr><td>${item.name}</td><td class="price">$${item.price.toFixed(2)}</td></tr>`
    )
    .join("")

  const total = items.reduce((s, i) => s + i.price, 0)

  const body = `
    <h2>You left something behind</h2>
    <p>Your cart at ${BRAND_NAME} is still waiting for you. Complete your purchase before these items sell out.</p>
    <table class="items">
      <thead><tr><th>Item</th><th>Price</th></tr></thead>
      <tbody>${itemsHtml}</tbody>
    </table>
    <p style="text-align:right;font-size:18px;color:#ffffff;">
      Total: <strong>$${total.toFixed(2)}</strong>
    </p>
    <p style="text-align:center;padding:24px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://skcloset.com"}/cart" class="btn">Return to Cart</a>
    </p>
  `

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Complete your ${BRAND_NAME} order`,
      html: wrapHtml(body),
    })
    return { success: true }
  } catch (err) {
    console.error("Failed to send abandoned cart email:", err)
    return { success: false, error: String(err) }
  }
}
