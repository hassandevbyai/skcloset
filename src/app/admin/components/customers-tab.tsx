"use client"

import { useAdmin, statusColors } from "./admin-context"
import { getSyncCustomers, upsertCustomer, updateCustomerNotes } from "@/lib/customer-store"

export function CustomersTab() {
  const {
    customers, setCustomers, expandedCustomer, setExpandedCustomer,
    editingCustomer, setEditingCustomer, customerNotes, setCustomerNotes, orders,
  } = useAdmin()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">{customers.length} customer{customers.length !== 1 ? "s" : ""} tracked</p>
      </div>
      <div className="space-y-2">
        {customers.length === 0 ? (
          <div className="border border-border p-8 text-center text-muted-foreground text-sm">No customers yet</div>
        ) : (
          customers.map((customer, i) => (
            <div key={customer.email} className="border border-border overflow-hidden">
              <button onClick={() => setExpandedCustomer(expandedCustomer === customer.email ? null : customer.email)}
                className={`w-full flex items-center justify-between p-4 hover:bg-secondary/10 transition-colors text-left ${i % 2 === 0 ? "bg-background" : "bg-secondary/10"} ${expandedCustomer === customer.email ? "bg-secondary/20" : ""}`}>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div><p className="text-foreground font-medium text-sm">{customer.firstName} {customer.lastName}</p></div>
                  <div><p className="text-muted-foreground text-xs truncate">{customer.email}</p></div>
                  <div><p className="text-muted-foreground text-xs">{customer.totalOrders} order{customer.totalOrders !== 1 ? "s" : ""}</p></div>
                  <div className="flex items-center justify-between md:justify-start">
                    <p className="text-foreground text-sm font-medium">${customer.totalSpent.toFixed(2)}</p>
                    <svg className={`w-4 h-4 text-muted-foreground transition-transform ml-4 ${expandedCustomer === customer.email ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </button>

              {expandedCustomer === customer.email && (
                <div className="border-t border-border p-4 bg-secondary/5">
                  {editingCustomer === customer.email ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-1">First Name</label>
                        <input type="text" value={customer.firstName} onChange={(e) => {
                          const updated = [...customers]; const idx = updated.findIndex((c) => c.email === customer.email)
                          if (idx !== -1) { updated[idx] = { ...updated[idx], firstName: e.target.value }; setCustomers(updated) }
                        }} className="w-full px-3 py-2 bg-transparent border border-border text-sm text-foreground focus:outline-none focus:border-accent" />
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-1">Last Name</label>
                        <input type="text" value={customer.lastName} onChange={(e) => {
                          const updated = [...customers]; const idx = updated.findIndex((c) => c.email === customer.email)
                          if (idx !== -1) { updated[idx] = { ...updated[idx], lastName: e.target.value }; setCustomers(updated) }
                        }} className="w-full px-3 py-2 bg-transparent border border-border text-sm text-foreground focus:outline-none focus:border-accent" />
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-1">Email</label>
                        <input type="email" value={customer.email} readOnly className="w-full px-3 py-2 bg-secondary/30 border border-border text-sm text-muted-foreground cursor-not-allowed" />
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-1">Phone</label>
                        <input type="text" value={customer.phone} onChange={(e) => {
                          const updated = [...customers]; const idx = updated.findIndex((c) => c.email === customer.email)
                          if (idx !== -1) { updated[idx] = { ...updated[idx], phone: e.target.value }; setCustomers(updated) }
                        }} className="w-full px-3 py-2 bg-transparent border border-border text-sm text-foreground focus:outline-none focus:border-accent" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-1">Address</label>
                        <input type="text" value={customer.address} onChange={(e) => {
                          const updated = [...customers]; const idx = updated.findIndex((c) => c.email === customer.email)
                          if (idx !== -1) { updated[idx] = { ...updated[idx], address: e.target.value }; setCustomers(updated) }
                        }} className="w-full px-3 py-2 bg-transparent border border-border text-sm text-foreground focus:outline-none focus:border-accent" />
                      </div>
                      <div><label className="block text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-1">City</label>
                        <input type="text" value={customer.city} onChange={(e) => {
                          const updated = [...customers]; const idx = updated.findIndex((c) => c.email === customer.email)
                          if (idx !== -1) { updated[idx] = { ...updated[idx], city: e.target.value }; setCustomers(updated) }
                        }} className="w-full px-3 py-2 bg-transparent border border-border text-sm text-foreground focus:outline-none focus:border-accent" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div><label className="block text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-1">State</label>
                          <input type="text" value={customer.state} onChange={(e) => {
                            const updated = [...customers]; const idx = updated.findIndex((c) => c.email === customer.email)
                            if (idx !== -1) { updated[idx] = { ...updated[idx], state: e.target.value }; setCustomers(updated) }
                          }} className="w-full px-3 py-2 bg-transparent border border-border text-sm text-foreground focus:outline-none focus:border-accent" />
                        </div>
                        <div><label className="block text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-1">Zip</label>
                          <input type="text" value={customer.zip} onChange={(e) => {
                            const updated = [...customers]; const idx = updated.findIndex((c) => c.email === customer.email)
                            if (idx !== -1) { updated[idx] = { ...updated[idx], zip: e.target.value }; setCustomers(updated) }
                          }} className="w-full px-3 py-2 bg-transparent border border-border text-sm text-foreground focus:outline-none focus:border-accent" />
                        </div>
                      </div>
                      <div className="md:col-span-2 flex gap-3 mt-2">
                        <button onClick={() => {
                          const c = customers.find((c) => c.email === customer.email)
                          if (c) { upsertCustomer(c.email, { firstName: c.firstName, lastName: c.lastName, phone: c.phone, address: c.address, city: c.city, state: c.state, zip: c.zip }) }
                          setEditingCustomer(null)
                        }} className="bg-accent text-accent-foreground px-6 py-2 text-xs tracking-[0.2em] uppercase font-medium hover:bg-accent/90 transition-colors">Save Details</button>
                        <button onClick={() => {
                          const saved = getSyncCustomers(orders); const sc = saved.find((c) => c.email === customer.email)
                          if (sc) { const updated = [...customers]; const idx = updated.findIndex((c) => c.email === customer.email); if (idx !== -1) { updated[idx] = { ...updated[idx], ...sc }; setCustomers(updated) } }
                          setEditingCustomer(null)
                        }} className="border border-border text-muted-foreground px-6 py-2 text-xs tracking-[0.2em] uppercase font-medium hover:bg-secondary/20 transition-colors">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div><h4 className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-1">Contact</h4>
                        <p className="text-foreground text-sm">{customer.firstName} {customer.lastName}</p>
                        <p className="text-muted-foreground text-xs">{customer.email}</p>
                        <p className="text-muted-foreground text-xs">{customer.phone || "No phone"}</p>
                      </div>
                      <div><h4 className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-1">Shipping Address</h4>
                        {customer.address ? <><p className="text-foreground text-sm">{customer.address}</p><p className="text-muted-foreground text-xs">{customer.city}, {customer.state} {customer.zip}</p></>
                          : <p className="text-muted-foreground text-xs italic">No address on file</p>}
                      </div>
                      <div><h4 className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-1">Activity</h4>
                        <p className="text-foreground text-sm">{customer.totalOrders} order{customer.totalOrders !== 1 ? "s" : ""}</p>
                        <p className="text-foreground text-sm font-medium">${customer.totalSpent.toFixed(2)} total</p>
                        <p className="text-muted-foreground text-xs">Last order: {customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString() : "N/A"}</p>
                      </div>
                    </div>
                  )}

                  <div className="mb-6">
                    <h4 className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-1">Notes</h4>
                    <div className="flex gap-2">
                      <textarea value={customerNotes[customer.email] || ""} onChange={(e) => setCustomerNotes((prev) => ({ ...prev, [customer.email]: e.target.value }))}
                        placeholder="Add internal notes about this customer..." className="flex-1 px-3 py-2 bg-transparent border border-border text-sm text-foreground focus:outline-none focus:border-accent min-h-[60px] resize-y" />
                      <button onClick={() => { updateCustomerNotes(customer.email, customerNotes[customer.email] || ""); setCustomers(getSyncCustomers(orders)) }}
                        className="self-start bg-accent text-accent-foreground px-4 py-2 text-xs tracking-[0.2em] uppercase font-medium hover:bg-accent/90 transition-colors">Save</button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-3">Order History</h4>
                    {(() => {
                      const customerOrders = orders.filter((o) => (o.userEmail || o.shippingAddress.email)?.toLowerCase() === customer.email.toLowerCase())
                      if (customerOrders.length === 0) return <p className="text-muted-foreground text-xs italic">No orders found</p>
                      return (
                        <div className="border border-border">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="border-b border-border text-[9px] tracking-[0.15em] uppercase text-muted-foreground">
                                <th className="text-left p-2 font-medium">Order #</th>
                                <th className="text-left p-2 font-medium">Date</th>
                                <th className="text-left p-2 font-medium">Status</th>
                                <th className="text-left p-2 font-medium">Items</th>
                                <th className="text-right p-2 font-medium">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {customerOrders.map((o) => (
                                <tr key={o.id} className="border-b border-border/30 hover:bg-secondary/10">
                                  <td className="p-2 text-foreground font-mono text-[10px]">#{o.id.slice(-8)}</td>
                                  <td className="p-2 text-muted-foreground">{new Date(o.createdAt).toLocaleDateString()}</td>
                                  <td className="p-2"><span className={`px-1.5 py-0.5 text-[9px] tracking-wider uppercase font-medium ${statusColors[o.status] || ""}`}>{o.status}</span></td>
                                  <td className="p-2 text-muted-foreground">{o.items.length} item{o.items.length !== 1 ? "s" : ""}</td>
                                  <td className="p-2 text-foreground text-right font-medium">${o.total.toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )
                    })()}
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button onClick={() => setEditingCustomer(customer.email)}
                      className="border border-border text-muted-foreground px-4 py-2 text-xs tracking-[0.2em] uppercase font-medium hover:bg-secondary/20 transition-colors">Edit Details</button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}