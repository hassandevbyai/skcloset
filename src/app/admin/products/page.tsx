"use client"

import { useState } from "react"
import Image from "next/image"
import { localProducts } from "@/lib/local-data"
import { getProductImages } from "@/lib/product-images"
import { showToast } from "@/lib/toast-store"

export default function AdminProductsPage() {
  const [search, setSearch] = useState("")
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>(
    Object.fromEntries(localProducts.map((p) => [p.slug, p.is_active]))
  )

  const filtered = localProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
  )

  function toggleActive(slug: string, current: boolean) {
    const updated = { ...toggleStates, [slug]: !current }
    setToggleStates(updated)
    try {
      const stored = JSON.parse(localStorage.getItem("skcloset_product_status") || "{}")
      stored[slug] = !current
      localStorage.setItem("skcloset_product_status", JSON.stringify(stored))
    } catch {}
    showToast("Product updated", "success")
  }

  const statuses = ["pending", "confirmed", "shipped", "delivered"]

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    confirmed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    shipped: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    delivered: "bg-accent/10 text-accent",
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">{filtered.length} products</p>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="px-4 py-2 bg-transparent border border-border text-sm text-foreground focus:outline-none focus:border-accent"
        />
      </div>
      <div className="border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-[10px] tracking-[0.15em] uppercase text-muted-foreground">
              <th className="text-left p-4 font-medium">Image</th>
              <th className="text-left p-4 font-medium">Name</th>
              <th className="text-left p-4 font-medium">Brand</th>
              <th className="text-left p-4 font-medium">Price</th>
              <th className="text-left p-4 font-medium">Stock</th>
              <th className="text-left p-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product, i) => {
              const totalStock = product.variants.reduce((s, v) => s + v.stock_quantity, 0)
              const isActive = toggleStates[product.slug]
              return (
                <tr key={product.slug} className={`border-b border-border/50 ${i % 2 === 0 ? "bg-background" : "bg-secondary/10"}`}>
                  <td className="p-4">
                    <div className="relative w-10 h-12 bg-secondary">
                      {getProductImages(product.slug)?.[0] && (
                        <Image src={getProductImages(product.slug)[0]} alt={product.name} fill sizes="40px" className="object-cover" />
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-foreground font-medium">{product.name}</td>
                  <td className="p-4 text-muted-foreground">{product.brand}</td>
                  <td className="p-4 text-foreground">${product.base_price.toFixed(2)}</td>
                  <td className="p-4 text-muted-foreground">{totalStock}</td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleActive(product.slug, isActive)}
                      className={`text-[10px] tracking-[0.1em] uppercase font-medium px-2 py-1 transition-colors ${
                        isActive
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}