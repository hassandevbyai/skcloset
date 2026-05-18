"use client"

import { useState, useEffect } from "react"
import { getOrders, type Order } from "@/lib/order-store"
import { showToast } from "@/lib/toast-store"

const statuses = ["pending", "confirmed", "shipped", "delivered"]

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  confirmed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  shipped: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  delivered: "bg-accent/10 text-accent",
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => { setOrders(getOrders()) }, [])

  const filtered = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.shippingAddress.firstName.toLowerCase().includes(search.toLowerCase())
  )

  function updateStatus(orderId: string, newStatus: string) {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus as Order["status"] } : o))
    setOrders(updated)
    localStorage.setItem("skcloset_orders", JSON.stringify(updated))
    showToast("Order status changed", "success")
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">{filtered.length} orders</p>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search orders..."
          className="px-4 py-2 bg-transparent border border-border text-sm text-foreground focus:outline-none focus:border-accent"
        />
      </div>
      <div className="border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-[10px] tracking-[0.15em] uppercase text-muted-foreground">
              <th className="text-left p-4 font-medium">Order ID</th>
              <th className="text-left p-4 font-medium">Customer</th>
              <th className="text-left p-4 font-medium">Items</th>
              <th className="text-left p-4 font-medium">Total</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-left p-4 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No orders yet</td></tr>
            ) : (
              filtered.map((order, i) => (
                <tr key={order.id} className={`border-b border-border/50 ${i % 2 === 0 ? "bg-background" : "bg-secondary/10"}`}>
                  <td className="p-4 text-foreground font-medium">{order.id}</td>
                  <td className="p-4 text-muted-foreground">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</td>
                  <td className="p-4 text-muted-foreground">{order.items.length}</td>
                  <td className="p-4 text-foreground">${order.total.toFixed(2)}</td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className={`text-[10px] tracking-[0.1em] uppercase font-medium px-2 py-1 border-none cursor-pointer ${statusColors[order.status] || ""}`}
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4 text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}