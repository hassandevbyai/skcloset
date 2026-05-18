"use client"

import { useAdmin, statusColors } from "./admin-context"

export function OverviewTab() {
  const { products, orders, totalSales, totalCustomers, recentOrders, setActiveTab } = useAdmin()

  const lowStockProducts = products
    .map(p => ({ ...p, totalStock: p.variants.reduce((s, v) => s + v.stock_quantity, 0) }))
    .filter(p => p.totalStock <= 10)
    .slice(0, 5)
  const pendingOrders = orders.filter(o => o.status === "pending").length

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total Products" value={String(products.length)} />
        <StatCard label="Total Orders" value={String(orders.length)} />
        <StatCard label="Revenue" value={`$${totalSales.toFixed(0)}`} accent />
        <StatCard label="Customers" value={String(totalCustomers)} />
      </div>

      {lowStockProducts.length > 0 && (
        <div className="border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800 rounded-md p-4 mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <h3 className="text-sm font-medium text-red-800 dark:text-red-400">Low Stock Alert</h3>
            <span className="text-xs text-red-600 dark:text-red-500">({lowStockProducts.length} items)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {lowStockProducts.map(p => (
              <div key={p.slug} className="flex items-center justify-between bg-white dark:bg-red-950/20 border border-red-100 dark:border-red-800 p-2 rounded">
                <div>
                  <p className="text-xs font-medium text-foreground truncate max-w-[150px]">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground">{p.brand}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${p.totalStock === 0 ? "bg-red-500 text-white" : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"}`}>
                  {p.totalStock} left
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {pendingOrders > 0 && (
        <div className="border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10 dark:border-yellow-800 rounded-md p-4 mb-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-500 rounded-full" />
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-400">Pending Orders</h3>
            </div>
            <button onClick={() => setActiveTab("orders")} className="text-xs text-yellow-700 dark:text-yellow-300 hover:underline">
              {pendingOrders} orders need attention →
            </button>
          </div>
        </div>
      )}

      <div className="border border-border mb-10">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-medium text-foreground">Recent Orders</h2>
          <button onClick={() => setActiveTab("orders")} className="text-xs text-accent hover:text-accent/80">View All</button>
        </div>
        {orders.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">No orders yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-[10px] tracking-[0.15em] uppercase text-muted-foreground">
                  <th className="text-left p-4 font-medium">Order ID</th>
                  <th className="text-left p-4 font-medium">Customer</th>
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border/50 hover:bg-secondary/20">
                    <td className="p-4 text-foreground font-medium">{order.id}</td>
                    <td className="p-4 text-muted-foreground">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</td>
                    <td className="p-4 text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={`text-[10px] tracking-[0.1em] uppercase font-medium px-2 py-1 ${statusColors[order.status] || ""}`}>{order.status}</span>
                    </td>
                    <td className="p-4 text-foreground">${order.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <button onClick={() => setActiveTab("products")} className="flex-1 border border-border p-6 text-center hover:border-accent transition-colors">
          <p className="font-serif text-3xl text-accent mb-1">{products.length}</p>
          <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground font-medium">Manage Products</p>
        </button>
        <button onClick={() => setActiveTab("orders")} className="flex-1 border border-border p-6 text-center hover:border-accent transition-colors">
          <p className="font-serif text-3xl text-accent mb-1">{orders.length}</p>
          <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground font-medium">Manage Orders</p>
        </button>
      </div>
    </div>
  )
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`border p-5 ${accent ? "bg-accent/5 border-accent/30" : "border-border bg-card"}`}>
      <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-medium">{label}</p>
      <p className={`text-3xl font-serif mt-1 ${accent ? "text-accent" : "text-foreground"}`}>{value}</p>
    </div>
  )
}