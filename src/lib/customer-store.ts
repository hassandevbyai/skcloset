export interface CustomerProfile {
  email: string
  firstName: string
  lastName: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
  notes: string
  totalOrders: number
  totalSpent: number
  lastOrderDate: string
}

const STORAGE_KEY = "skcloset_customers"

function readCustomers(): CustomerProfile[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeCustomers(customers: CustomerProfile[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customers))
  }
}

export function getCustomers(): CustomerProfile[] {
  return readCustomers()
}

export function getCustomerByEmail(email: string): CustomerProfile | undefined {
  if (!email) return undefined
  return readCustomers().find((c) => c.email.toLowerCase() === email.toLowerCase())
}

export function upsertCustomer(email: string, data: Partial<CustomerProfile>): CustomerProfile | undefined {
  const customers = readCustomers()
  const idx = customers.findIndex((c) => c.email.toLowerCase() === (data.email || email).toLowerCase())
  const normalizedEmail = (data.email || email).toLowerCase()

  if (idx === -1) {
    const newCustomer: CustomerProfile = {
      email: normalizedEmail,
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      phone: data.phone || "",
      address: data.address || "",
      city: data.city || "",
      state: data.state || "",
      zip: data.zip || "",
      notes: data.notes || "",
      totalOrders: data.totalOrders || 0,
      totalSpent: data.totalSpent || 0,
      lastOrderDate: data.lastOrderDate || new Date().toISOString(),
    }
    customers.push(newCustomer)
  } else {
    customers[idx] = { ...customers[idx], ...data, email: normalizedEmail }
  }

  writeCustomers(customers)
  return customers.find((c) => c.email.toLowerCase() === normalizedEmail)
}

export function updateCustomerNotes(email: string, notes: string): CustomerProfile | undefined {
  const customers = readCustomers()
  const idx = customers.findIndex((c) => c.email.toLowerCase() === email.toLowerCase())
  if (idx === -1) return undefined
  customers[idx].notes = notes
  writeCustomers(customers)
  return customers[idx]
}

// Build customer list from order data, merging with stored profiles
export function syncCustomersFromOrders(orders: { userEmail: string; shippingAddress: { firstName: string; lastName: string; email?: string; phone: string; address: string; city: string; state: string; zip: string }; total: number; createdAt: string }[]): CustomerProfile[] {
  const existing = readCustomers()

  for (const order of orders) {
    const email = order.userEmail || order.shippingAddress.email
    if (!email) continue

    const normalizedEmail = email.toLowerCase()
    const existingIdx = existing.findIndex((c) => c.email === normalizedEmail)

    const customerOrders = orders.filter((o) => (o.userEmail || o.shippingAddress.email)?.toLowerCase() === normalizedEmail)
    const totalOrders = customerOrders.length
    const totalSpent = customerOrders.reduce((sum, o) => sum + o.total, 0)
    const lastOrderDate = customerOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]?.createdAt || ""

    const customerData = {
      email: normalizedEmail,
      firstName: order.shippingAddress.firstName,
      lastName: order.shippingAddress.lastName,
      phone: order.shippingAddress.phone,
      address: order.shippingAddress.address,
      city: order.shippingAddress.city,
      state: order.shippingAddress.state,
      zip: order.shippingAddress.zip,
      totalOrders,
      totalSpent,
      lastOrderDate,
    }

    if (existingIdx === -1) {
      existing.push({
        ...customerData,
        notes: "",
      })
    } else {
      existing[existingIdx] = {
        ...existing[existingIdx],
        ...customerData,
        notes: existing[existingIdx].notes || "",
      }
    }
  }

  writeCustomers(existing)
  return existing
}

// Sync and return customers
export function getSyncCustomers(orders: { userEmail: string; shippingAddress: { firstName: string; lastName: string; email?: string; phone: string; address: string; city: string; state: string; zip: string }; total: number; createdAt: string }[]): CustomerProfile[] {
  return syncCustomersFromOrders(orders)
}