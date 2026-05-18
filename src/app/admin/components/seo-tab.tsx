"use client"
import { useAdmin } from "./admin-context"
import { getProducts } from "@/lib/product-store"

export function SeoTab() {
  const { settings } = useAdmin()
  const products = getProducts()

  const totalProducts = products.length
  const withDescription = products.filter((p) => p.description).length
  const withImages = products.filter((p) => p.images && p.images.length > 0).length

  return (
    <div className="space-y-8">
      {/* Meta Preview Card */}
      <div className="p-6 border border-border rounded-sm bg-card">
        <h3 className="text-xs tracking-[0.15em] uppercase font-medium text-foreground mb-4">Meta Preview</h3>
        <div className="bg-background border border-border rounded-sm p-4 max-w-lg">
          <p className="text-[#1a0dab] text-sm truncate">
            {settings.storeName} — {settings.storeName}
          </p>
          <p className="text-[#006621] text-xs truncate">
            https://skcloset.vercel.app
          </p>
          <p className="text-[#545454] text-xs line-clamp-2 mt-0.5">
            Premium men's fashion boutique. Curated collections of luxury streetwear...
          </p>
        </div>
      </div>

      {/* SEO Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 border border-border rounded-sm bg-card">
          <p className="text-2xl font-semibold text-foreground">{totalProducts}</p>
          <p className="text-xs text-muted-foreground mt-1">Total Products</p>
        </div>
        <div className="p-6 border border-border rounded-sm bg-card">
          <p className="text-2xl font-semibold text-foreground">{withDescription}/{totalProducts}</p>
          <p className="text-xs text-muted-foreground mt-1">With Descriptions</p>
        </div>
        <div className="p-6 border border-border rounded-sm bg-card">
          <p className="text-2xl font-semibold text-foreground">{withImages}/{totalProducts}</p>
          <p className="text-xs text-muted-foreground mt-1">With Images</p>
        </div>
      </div>

      {/* Sitemap status */}
      <div className="p-6 border border-border rounded-sm bg-card">
        <h3 className="text-xs tracking-[0.15em] uppercase font-medium text-foreground mb-4">Sitemap</h3>
        <p className="text-sm text-muted-foreground">
          ✓ Sitemap auto-generated at <code className="text-accent">/sitemap.xml</code> with {totalProducts} product entries + static pages
        </p>
      </div>

      {/* Products SEO table */}
      <div className="p-6 border border-border rounded-sm bg-card">
        <h3 className="text-xs tracking-[0.15em] uppercase font-medium text-foreground mb-4">Product SEO Check</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground uppercase tracking-wider">
                <th className="pb-3 font-medium">Product</th>
                <th className="pb-3 font-medium">Description</th>
                <th className="pb-3 font-medium">Image</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.slug} className="border-b border-border/50">
                  <td className="py-2.5 text-foreground">{p.name}</td>
                  <td className="py-2.5">{p.description ? "✅" : "❌"}</td>
                  <td className="py-2.5">{p.images?.length ? "✅" : "❌"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
