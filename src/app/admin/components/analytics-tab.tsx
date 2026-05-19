"use client"

import { useAdmin, statusColors } from "./admin-context"
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts"
import { DollarSign, ShoppingBag, Clock, TrendingUp } from "lucide-react"

const mockOrders = [
  { id: "1", userEmail: "", total: 299, subtotal: 299, shipping: 0, tax: 0, status: "delivered" as const, paymentMethod: "cod" as const, shippingAddress: { firstName: "John", lastName: "Doe", address: "123 St", city: "NYC", state: "NY", zip: "10001", phone: "123" }, createdAt: new Date(Date.now() - 6 * 86400000).toISOString(), items: [{ slug: "polo", name: "Polo Shirt", brand: "SK", price: 89, image: "", size: "M", color: "Black", quantity: 2 }] },
  { id: "2", userEmail: "", total: 459, subtotal: 459, shipping: 0, tax: 0, status: "delivered" as const, paymentMethod: "cod" as const, shippingAddress: { firstName: "Jane", lastName: "Doe", address: "456 St", city: "LA", state: "CA", zip: "90001", phone: "456" }, createdAt: new Date(Date.now() - 5 * 86400000).toISOString(), items: [{ slug: "jacket", name: "Leather Jacket", brand: "SK", price: 459, image: "", size: "L", color: "Brown", quantity: 1 }] },
  { id: "3", userEmail: "", total: 179, subtotal: 179, shipping: 0, tax: 0, status: "shipped" as const, paymentMethod: "cod" as const, shippingAddress: { firstName: "Bob", lastName: "Smith", address: "789 St", city: "SF", state: "CA", zip: "94101", phone: "789" }, createdAt: new Date(Date.now() - 4 * 86400000).toISOString(), items: [{ slug: "sneakers", name: "Sneakers", brand: "SK", price: 179, image: "", size: "42", color: "White", quantity: 1 }] },
  { id: "4", userEmail: "", total: 89, subtotal: 89, shipping: 0, tax: 0, status: "pending" as const, paymentMethod: "cod" as const, shippingAddress: { firstName: "Alice", lastName: "W", address: "321 St", city: "Chi", state: "IL", zip: "60601", phone: "321" }, createdAt: new Date(Date.now() - 3 * 86400000).toISOString(), items: [{ slug: "cap", name: "Cap", brand: "SK", price: 89, image: "", size: "One", color: "Red", quantity: 1 }] },
  { id: "5", userEmail: "", total: 520, subtotal: 520, shipping: 0, tax: 0, status: "confirmed" as const, paymentMethod: "cod" as const, shippingAddress: { firstName: "Charlie", lastName: "K", address: "654 St", city: "Mia", state: "FL", zip: "33101", phone: "654" }, createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), items: [{ slug: "suit", name: "Suit", brand: "SK", price: 520, image: "", size: "M", color: "Navy", quantity: 1 }] },
  { id: "6", userEmail: "", total: 135, subtotal: 135, shipping: 0, tax: 0, status: "cancelled" as const, paymentMethod: "cod" as const, shippingAddress: { firstName: "Diana", lastName: "R", address: "987 St", city: "Den", state: "CO", zip: "80201", phone: "987" }, createdAt: new Date(Date.now() - 1 * 86400000).toISOString(), items: [{ slug: "tshirt", name: "T-Shirt", brand: "SK", price: 45, image: "", size: "M", color: "White", quantity: 3 }] },
  { id: "7", userEmail: "", total: 750, subtotal: 750, shipping: 0, tax: 0, status: "delivered" as const, paymentMethod: "cod" as const, shippingAddress: { firstName: "Eve", lastName: "M", address: "111 St", city: "Sea", state: "WA", zip: "98101", phone: "111" }, createdAt: new Date(Date.now()).toISOString(), items: [{ slug: "watch", name: "Watch", brand: "SK", price: 750, image: "", size: "One", color: "Gold", quantity: 1 }] },
]

export function AnalyticsTab() {
  const { orders } = useAdmin()

  const data = orders.length > 0 ? orders : (mockOrders as typeof orders)

  const totalRevenue = data.reduce((s, o) => s + o.total, 0)
  const totalOrders = data.length
  const pendingOrders = data.filter((o) => o.status === "pending").length
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86400000)
    return d.toISOString().slice(0, 10)
  })

  const revenueTrend = last7Days.map((day) => {
    const dayRevenue = data
      .filter((o) => o.createdAt.slice(0, 10) === day && o.status !== "cancelled")
      .reduce((s, o) => s + o.total, 0)
    return { date: new Date(day).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }), revenue: dayRevenue }
  })

  const productSales: Record<string, number> = {}
  data.forEach((o) => {
    o.items.forEach((item) => {
      productSales[item.name] = (productSales[item.name] || 0) + item.quantity
    })
  })
  const topProducts = Object.entries(productSales)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, quantity]) => ({ name, quantity }))

  const statusLabels: Record<string, string> = { pending: "Pending", confirmed: "Confirmed", shipped: "Shipped", delivered: "Delivered", cancelled: "Cancelled" }
  const statusData = ["pending", "confirmed", "shipped", "delivered", "cancelled"].map((s) => ({
    name: statusLabels[s],
    value: data.filter((o) => o.status === s).length,
    color: (() => {
      const colors: Record<string, string> = { pending: "#ca8a04", confirmed: "#16a34a", shipped: "#2563eb", delivered: "#c9a84c", cancelled: "#dc2626" }
      return colors[s]
    })(),
  }))

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<DollarSign size={16} />} label="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} />
        <StatCard icon={<ShoppingBag size={16} />} label="Total Orders" value={String(totalOrders)} />
        <StatCard icon={<Clock size={16} />} label="Pending Orders" value={String(pendingOrders)} />
        <StatCard icon={<TrendingUp size={16} />} label="Avg Order Value" value={`$${avgOrderValue.toFixed(2)}`} />
      </div>

      <div className="space-y-6">
        <div className="p-6 border border-border rounded-sm bg-card">
          <h3 className="text-xs tracking-[0.15em] uppercase font-medium text-foreground mb-4">Revenue Trend (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueTrend}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c9a84c" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#c9a84c" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "4px", fontSize: "12px" }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Line type="monotone" dataKey="revenue" stroke="#c9a84c" strokeWidth={2} dot={{ fill: "#c9a84c", r: 4 }} activeDot={{ r: 6 }} fillOpacity={1} fill="url(#revenueGradient)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border border-border rounded-sm bg-card">
            <h3 className="text-xs tracking-[0.15em] uppercase font-medium text-foreground mb-4">Top Products</h3>
            {topProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No data</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={topProducts} layout="vertical" margin={{ left: 0, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" width={80} />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "4px", fontSize: "12px" }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Bar dataKey="quantity" fill="#c9a84c" radius={[0, 3, 3, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="p-6 border border-border rounded-sm bg-card">
            <h3 className="text-xs tracking-[0.15em] uppercase font-medium text-foreground mb-4">Order Status Distribution</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" paddingAngle={3}>
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "4px", fontSize: "12px" }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "11px" }}
                  formatter={(value) => <span style={{ color: "hsl(var(--foreground))" }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="p-6 border border-border rounded-sm bg-card">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-accent">{icon}</span>
        <p className="text-xs tracking-[0.15em] uppercase font-medium text-foreground">{label}</p>
      </div>
      <p className="text-2xl font-serif text-foreground">{value}</p>
    </div>
  )
}
