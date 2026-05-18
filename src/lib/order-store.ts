import { generateOrderNumber } from "./helpers"

export interface OrderItem {
  slug: string
  name: string
  brand: string
  price: number
  image: string
  size: string
  color: string
  quantity: number
}

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"

export interface Order {
  id: string
  userEmail: string
  items: OrderItem[]
  total: number
  subtotal: number
  shipping: number
  tax: number
  status: OrderStatus
  paymentMethod: "cod" | "stripe"
  shippingAddress: {
    firstName: string
    lastName: string
    email?: string
    address: string
    city: string
    state: string
    zip: string
    phone: string
  }
  trackingNumber?: string
  trackingProvider?: string
  createdAt: string
  notes?: string
  discount?: number
  couponCode?: string
}

const STORAGE_KEY = "skcloset_orders"

function readOrders(): Order[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeOrders(orders: Order[]): Order[] {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
  }
  return orders
}

// Get all orders (admin only)
export function getOrders(): Order[] {
  return readOrders()
}

// Get orders for a specific user
export function getUserOrders(email: string): Order[] {
  if (!email) return []
  return readOrders().filter((o) => o.userEmail?.toLowerCase() === email.toLowerCase())
}

// Get order by ID
export function getOrderById(id: string): Order | undefined {
  return readOrders().find((o) => o.id === id)
}

// Create new order
export function createOrder(input: Omit<Order, "id" | "createdAt" | "status">): Order {
  const orders = readOrders()
  const order: Order = {
    ...input,
    userEmail: (input.userEmail || "").toLowerCase(),
    id: generateOrderNumber(),
    status: "confirmed",
    createdAt: new Date().toISOString(),
  }
  orders.unshift(order)
  writeOrders(orders)
  return order
}

// Update order status (admin)
export function updateOrderStatus(id: string, status: Order["status"], notes?: string): Order | undefined {
  const orders = readOrders()
  const idx = orders.findIndex((o) => o.id === id)
  if (idx === -1) return undefined
  orders[idx] = { ...orders[idx], status, notes: notes || orders[idx].notes }
  writeOrders(orders)
  return orders[idx]
}

// Update tracking info (admin)
export function updateTracking(id: string, trackingNumber: string, trackingProvider: string): Order | undefined {
  const orders = readOrders()
  const idx = orders.findIndex((o) => o.id === id)
  if (idx === -1) return undefined
  orders[idx] = { ...orders[idx], trackingNumber, trackingProvider }
  // Auto-update status to shipped when tracking is added
  if (trackingNumber && orders[idx].status === "confirmed") {
    orders[idx].status = "shipped"
  }
  writeOrders(orders)
  return orders[idx]
}

// Cancel order with reason (admin)
export function cancelOrder(id: string, reason: string): Order | undefined {
  const orders = readOrders()
  const idx = orders.findIndex((o) => o.id === id)
  if (idx === -1) return undefined
  orders[idx] = { ...orders[idx], status: "cancelled", notes: `CANCELLED: ${reason}`, trackingNumber: undefined }
  writeOrders(orders)
  return orders[idx]
}

// Get low stock items (admin)
export function getLowStockProducts(threshold: number = 10): { name: string; sku: string; stock: number }[] {
  const orders = readOrders()
  const stockMap = new Map<string, number>()
  
  // Calculate stock from all orders (simplified - in real app would come from inventory)
  orders.forEach((order) => {
    if (order.status === "cancelled" || order.status === "delivered") return
    order.items.forEach((item) => {
      const key = `${item.slug}-${item.size}-${item.color}`
      stockMap.set(key, (stockMap.get(key) || 0) + item.quantity)
    })
  })
  
  // This is a placeholder - real implementation would check against inventory
  // For now, return empty array (would connect to product variants stock)
  return []
}

// Get order stats (admin)
export function getOrderStats() {
  const orders = readOrders()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const totalOrders = orders.length
  const pendingOrders = orders.filter((o) => o.status === "pending").length
  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0)
  
  const todayOrders = orders.filter((o) => new Date(o.createdAt) >= today)
  const todayRevenue = todayOrders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0)
  
  return { totalOrders, pendingOrders, totalRevenue, todayRevenue, todayOrders: todayOrders.length }
}

// Delete order (admin)
export function deleteOrder(id: string): boolean {
  const orders = readOrders()
  const idx = orders.findIndex((o) => o.id === id)
  if (idx === -1) return false
  orders.splice(idx, 1)
  writeOrders(orders)
  return true
}

// Clear all orders (admin - for testing/reset)
export function clearAllOrders(): void {
  writeOrders([])
}