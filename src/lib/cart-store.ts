export interface CartItem {
  slug: string
  name: string
  brand: string
  price: number
  image: string
  size: string
  color: string
  quantity: number
}

const STORAGE_KEY = "skcloset_cart"

function readCart(): CartItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeCart(items: CartItem[]): CartItem[] {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }
  return items
}

export function getCart(): CartItem[] {
  return readCart()
}

export function addToCart(item: Omit<CartItem, "quantity"> & { quantity?: number }): CartItem[] {
  const cart = readCart()
  const qty = item.quantity ?? 1
  const existing = cart.find(
    (i) => i.slug === item.slug && i.size === item.size && i.color === item.color
  )
  if (existing) {
    existing.quantity += qty
  } else {
    cart.push({ ...item, quantity: qty })
  }
  return writeCart(cart)
}

export function removeFromCart(slug: string, size: string, color: string): CartItem[] {
  const cart = readCart().filter(
    (i) => !(i.slug === slug && i.size === size && i.color === color)
  )
  return writeCart(cart)
}

export function updateQuantity(slug: string, size: string, color: string, qty: number): CartItem[] {
  const cart = readCart()
  const item = cart.find(
    (i) => i.slug === slug && i.size === size && i.color === color
  )
  if (item) {
    item.quantity = Math.max(1, qty)
  }
  return writeCart(cart)
}

export function clearCart(): CartItem[] {
  return writeCart([])
}

export function getCartCount(): number {
  return readCart().reduce((sum, item) => sum + item.quantity, 0)
}

export function getCartTotal(): number {
  return readCart().reduce((sum, item) => sum + item.price * item.quantity, 0)
}
