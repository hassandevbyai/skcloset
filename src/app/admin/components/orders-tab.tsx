"use client"

import React from "react"
import { useAdmin, statusColors } from "./admin-context"
import { updateTracking, getOrders } from "@/lib/order-store"

export function OrdersTab() {
  const {
    orders, setOrders, expandedOrder, setExpandedOrder,
    trackingInputs, setTrackingInputs, updateOrderStatus, handleCancelOrder,
  } = useAdmin()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">{orders.length} orders | {orders.filter(o => o.status !== "cancelled").length} active</p>
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
              <th className="text-left p-4 font-medium">Tracking</th>
              <th className="text-left p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No orders yet</td></tr>
            ) : (
              orders.map((order, i) => (
                <React.Fragment key={order.id}>
                  <tr className={`border-b border-border/50 hover:bg-secondary/20 ${i % 2 === 0 ? "bg-background" : "bg-secondary/10"}`}>
                    <td className="p-4">
                      <button onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                        className="text-foreground font-medium hover:text-accent transition-colors text-left font-mono text-xs">
                        #{order.id.slice(-8)}
                      </button>
                    </td>
                    <td className="p-4 text-muted-foreground">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</td>
                    <td className="p-4 text-foreground">{order.items.length}</td>
                    <td className="p-4 text-foreground font-medium">${order.total.toFixed(2)}</td>
                    <td className="p-4">
                      {order.status === "cancelled" ? (
                        <span className="text-[10px] tracking-[0.1em] uppercase font-medium px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">{order.status}</span>
                      ) : (
                        <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="text-[10px] bg-transparent uppercase font-medium px-2 py-1 border-border cursor-pointer">
                          {["pending", "confirmed", "shipped", "delivered"].map((s) => (
                            <option key={s} value={s} className="text-foreground">{s}</option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="p-4 text-muted-foreground text-[11px]">
                      {order.trackingNumber ? (
                        <span className="text-accent font-medium">{order.trackingNumber}</span>
                      ) : order.status === "cancelled" ? (
                        <span className="text-red-400">—</span>
                      ) : (<span className="text-muted-foreground">Not set</span>)}
                      {order.trackingProvider && <span> ({order.trackingProvider})</span>}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {order.status !== "cancelled" && (
                          <button onClick={() => handleCancelOrder(order.id)} className="text-[10px] text-red-500 hover:underline">Cancel</button>
                        )}
                      </div>
                    </td>
                  </tr>
                  {expandedOrder === order.id && (
                    <tr key={`${order.id}-detail`}>
                      <td colSpan={7} className="p-0">
                        <div className="bg-secondary/10 p-4 border-b border-border">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-xs font-medium text-foreground mb-2 uppercase tracking-wider">Items ({order.items.length})</h4>
                              <div className="space-y-2">
                                {order.items.map((item, idx) => (
                                  <div key={idx} className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">{item.name} — {item.color} / {item.size} × {item.quantity}</span>
                                    <span className="text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="border-t border-border mt-2 pt-2 space-y-1 text-xs">
                                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{order.shipping === 0 ? "Free" : `$${order.shipping.toFixed(2)}`}</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>${order.tax.toFixed(2)}</span></div>
                                {order.discount && order.discount > 0 && (
                                  <div className="flex justify-between"><span className="text-accent">Discount {order.couponCode && <span className="text-[9px] tracking-wider">({order.couponCode})</span>}</span><span className="text-accent">-${order.discount.toFixed(2)}</span></div>
                                )}
                                <div className="flex justify-between font-medium"><span className="text-foreground">Total</span><span className="text-foreground">${order.total.toFixed(2)}</span></div>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-xs font-medium text-foreground mb-2 uppercase tracking-wider">Shipping</h4>
                              <div className="text-xs text-muted-foreground space-y-1">
                                <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                                <p>{order.shippingAddress.address}</p>
                                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                                <p>{order.shippingAddress.phone}</p>
                                <p>{order.shippingAddress.email}</p>
                              </div>
                              <h4 className="text-xs font-medium text-foreground mt-4 mb-2 uppercase tracking-wider">Payment</h4>
                              <p className="text-xs text-muted-foreground capitalize">{order.paymentMethod === "cod" ? "Cash on Delivery" : "Card"}</p>
                              {order.status !== "cancelled" && (
                                <div className="mt-4">
                                  <h4 className="text-xs font-medium text-foreground mb-2 uppercase tracking-wider">Tracking</h4>
                                  <div className="flex gap-2">
                                    <input type="text" placeholder="Tracking number" value={trackingInputs[order.id]?.number || order.trackingNumber || ""}
                                      onChange={(e) => setTrackingInputs(prev => ({ ...prev, [order.id]: { ...prev[order.id], number: e.target.value } }))}
                                      className="flex-1 px-2 py-1.5 bg-transparent border border-border text-xs text-foreground focus:outline-none focus:border-accent" />
                                    <input type="text" placeholder="Provider" value={trackingInputs[order.id]?.provider || order.trackingProvider || ""}
                                      onChange={(e) => setTrackingInputs(prev => ({ ...prev, [order.id]: { ...prev[order.id], provider: e.target.value } }))}
                                      className="w-20 px-2 py-1.5 bg-transparent border border-border text-xs text-foreground focus:outline-none focus:border-accent" />
                                    <button onClick={() => {
                                      const input = trackingInputs[order.id]
                                      if (input?.number) { updateTracking(order.id, input.number, input.provider || ""); setOrders(getOrders()) }
                                    }} className="bg-accent text-accent-foreground px-3 text-xs tracking-[0.1em] uppercase hover:bg-accent/90">Save</button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}