export interface Notification {
  id: string
  type: "order_status" | "order_placed"
  title: string
  message: string
  userEmail: string
  orderId: string
  read: boolean
  createdAt: string
}

const KEY = "skcloset_notifications"

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function read(): Notification[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function write(n: Notification[]): void {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(n))
}

export function addNotification(n: Omit<Notification, "id" | "read" | "createdAt">): Notification {
  const notif: Notification = { ...n, id: genId(), read: false, createdAt: new Date().toISOString() }
  const all = read()
  all.unshift(notif)
  write(all)
  return notif
}

export function getUserNotifications(email: string): Notification[] {
  if (!email) return []
  return read().filter((n) => n.userEmail.toLowerCase() === email.toLowerCase())
}

export function getUnreadCount(email: string): number {
  return getUserNotifications(email).filter((n) => !n.read).length
}

export function markAsRead(id: string): void {
  const all = read()
  const idx = all.findIndex((n) => n.id === id)
  if (idx !== -1) { all[idx].read = true; write(all) }
}

export function markAllAsRead(email: string): void {
  const all = read()
  all.forEach((n) => { if (n.userEmail.toLowerCase() === email.toLowerCase()) n.read = true })
  write(all)
}

export function notifyOrderPlaced(email: string, orderId: string): void {
  addNotification({
    type: "order_placed",
    title: "Order Confirmed",
    message: `Your order #${orderId.slice(-8)} has been placed successfully!`,
    userEmail: email,
    orderId,
  })
}

export function notifyOrderStatus(email: string, orderId: string, status: string): void {
  const labels: Record<string, string> = {
    shipped: "Your order has been shipped!",
    delivered: "Your order has been delivered!",
    cancelled: "Your order has been cancelled",
  }
  const msg = labels[status]
  if (!msg) return
  addNotification({
    type: "order_status",
    title: `Order ${status.charAt(0).toUpperCase() + status.slice(1)}`,
    message: `${msg} Reference: #${orderId.slice(-8)}`,
    userEmail: email,
    orderId,
  })
}