"use client"

import { useState, useEffect } from "react"
import { getOrders } from "@/lib/order-store"

interface Customer {
  name: string
  email: string
  orderCount: number
  total: number
}

export default function AdminUsersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])

  useEffect(() => {
    const orders = getOrders()
    const map = new Map<string, Customer>()
    for (const o of orders) {
      const key = o.shippingAddress.email || `${o.shippingAddress.firstName}-${o.shippingAddress.lastName}`
      const existing = map.get(key)
      if (existing) {
        existing.orderCount++
        existing.total += o.total
      } else {
        map.set(key, {
          name: `${o.shippingAddress.firstName} ${o.shippingAddress.lastName}`,
          email: o.shippingAddress.email || "N/A",
          orderCount: 1,
          total: o.total,
        })
      }
    }
    setCustomers(Array.from(map.values()))
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">{customers.length} customers</p>
      </div>
      <div className="border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-[10px] tracking-[0.15em] uppercase text-muted-foreground">
              <th className="text-left p-4 font-medium">Name</th>
              <th className="text-left p-4 font-medium">Email</th>
              <th className="text-left p-4 font-medium">Orders</th>
              <th className="text-left p-4 font-medium">Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No customers yet</td></tr>
            ) : (
              customers.map((c, i) => (
                <tr key={i} className={`border-b border-border/50 ${i % 2 === 0 ? "bg-background" : "bg-secondary/10"}`}>
                  <td className="p-4 text-foreground font-medium">{c.name}</td>
                  <td className="p-4 text-muted-foreground">{c.email}</td>
                  <td className="p-4 text-muted-foreground">{c.orderCount}</td>
                  <td className="p-4 text-foreground">${c.total.toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}