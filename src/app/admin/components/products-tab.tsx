"use client"

import React from "react"
import { useAdmin, statusColors } from "./admin-context"
import { getProducts, updateVariantStock } from "@/lib/product-store"
import { addInventoryLog, getInventoryLogs } from "@/lib/inventory-store"
import { showToast } from "@/lib/toast-store"

export function ProductsTab() {
  const {
    products, setProducts, showProductForm, setShowProductForm,
    editingProduct, setEditingProduct, productForm, setProductForm,
    handleSaveProduct, handleDeleteProduct, openEditProduct, addVariant, updateVariant, removeVariant,
    showInventoryModal, setShowInventoryModal, inventoryProductSlug, setInventoryProductSlug,
    inventoryAdjustments, setInventoryAdjustments, inventoryReason, setInventoryReason, showInventoryLog, setShowInventoryLog,
    toggleProductStatus,
  } = useAdmin()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">{products.length} products</p>
        <button
          onClick={() => { setEditingProduct(null); setShowProductForm(true); setProductForm({
            name: "", brand: "", description: "", base_price: 0, category: "shirts", is_active: true,
            variants: [{ size: "M", color: "Black", stock_quantity: 10, sku: "" }]
          })}}
          className="bg-accent text-accent-foreground px-4 py-2 text-xs tracking-[0.1em] uppercase hover:bg-accent/90"
        >
          + Add Product
        </button>
      </div>

      <div className="border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-[10px] tracking-[0.15em] uppercase text-muted-foreground">
              <th className="text-left p-4 font-medium">Name</th>
              <th className="text-left p-4 font-medium">Brand</th>
              <th className="text-left p-4 font-medium">Price</th>
              <th className="text-left p-4 font-medium">Stock</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-left p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, i) => {
              const totalStock = product.variants.reduce((s, v) => s + v.stock_quantity, 0)
              return (
                <React.Fragment key={product.slug}>
                  <tr className={`border-b border-border/50 hover:bg-secondary/20 ${i % 2 === 0 ? "bg-background" : "bg-secondary/10"}`}>
                    <td className="p-4 text-foreground font-medium">{product.name}</td>
                    <td className="p-4 text-muted-foreground">{product.brand}</td>
                    <td className="p-4 text-foreground">${product.base_price.toFixed(2)}</td>
                    <td className="p-4">
                      <button
                        onClick={() => setShowInventoryLog(showInventoryLog === product.slug ? null : product.slug)}
                        className="text-muted-foreground hover:text-foreground transition-colors text-left"
                      >
                        <span className={totalStock <= 5 ? "text-red-500 font-medium" : ""}>{totalStock}</span>
                        <span className="text-[10px] text-muted-foreground ml-1">({product.variants.length} var.)</span>
                      </button>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => { toggleProductStatus(product.slug); setProducts(getProducts()) }}
                        className={`text-[10px] tracking-[0.1em] uppercase font-medium px-2 py-1 cursor-pointer ${product.is_active ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}`}
                      >
                        {product.is_active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEditProduct(product)} className="text-xs text-accent hover:underline">Edit</button>
                        <button onClick={() => { setInventoryProductSlug(product.slug); setInventoryAdjustments({}); setInventoryReason(""); setShowInventoryModal(true) }} className="text-xs text-blue-500 hover:underline">Stock</button>
                        <button onClick={() => handleDeleteProduct(product.slug)} className="text-xs text-red-500 hover:underline">Delete</button>
                      </div>
                    </td>
                  </tr>
                  {showInventoryLog === product.slug && (
                    <tr>
                      <td colSpan={6} className="p-0">
                        <div className="bg-secondary/5 border-b border-border p-4">
                          <div className="mb-4">
                            <h4 className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-2">Variant Stock</h4>
                            <div className="flex flex-wrap gap-2">
                              {product.variants.map((v, vi) => (
                                <button
                                  key={vi}
                                  onClick={() => {
                                    setInventoryProductSlug(product.slug)
                                    setInventoryAdjustments({})
                                    setInventoryReason("")
                                    const key = `${v.color}||${v.size}`
                                    setInventoryAdjustments({ [key]: 0 })
                                    setShowInventoryModal(true)
                                  }}
                                  className={`border px-3 py-1.5 text-xs hover:border-accent transition-colors text-left ${v.stock_quantity <= 3 ? "border-red-400 bg-red-50 dark:bg-red-900/20" : "border-border"}`}
                                >
                                  <span className="text-foreground font-medium">{v.color} / {v.size}</span>
                                  <span className="text-muted-foreground ml-2">Stock: <span className={v.stock_quantity <= 3 ? "text-red-500 font-medium" : "text-foreground"}>{v.stock_quantity}</span></span>
                                </button>
                              ))}
                            </div>
                          </div>
                          <h4 className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-2">Recent Adjustments</h4>
                          {(() => {
                            const logs = getInventoryLogs(product.slug).slice(0, 10)
                            if (logs.length === 0) return <p className="text-xs text-muted-foreground italic">No adjustments recorded yet</p>
                            return (
                              <div className="border border-border max-h-48 overflow-y-auto">
                                <table className="w-full text-xs">
                                  <thead>
                                    <tr className="border-b border-border text-[9px] tracking-[0.15em] uppercase text-muted-foreground">
                                      <th className="text-left p-2 font-medium">Variant</th>
                                      <th className="text-left p-2 font-medium">Change</th>
                                      <th className="text-left p-2 font-medium">After</th>
                                      <th className="text-left p-2 font-medium">Reason</th>
                                      <th className="text-left p-2 font-medium">Date</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {logs.map((log) => (
                                      <tr key={log.id} className="border-b border-border/30">
                                        <td className="p-2 text-foreground">{log.variantLabel}</td>
                                        <td className="p-2"><span className={log.change > 0 ? "text-green-600" : "text-red-600"}>{log.change > 0 ? `+${log.change}` : log.change}</span></td>
                                        <td className="p-2 text-foreground">{log.newStock}</td>
                                        <td className="p-2 text-muted-foreground max-w-[200px] truncate">{log.reason || "—"}</td>
                                        <td className="p-2 text-muted-foreground">{new Date(log.timestamp).toLocaleDateString()}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )
                          })()}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Product Form Modal */}
      {showProductForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium mb-4">{editingProduct ? "Edit Product" : "Add New Product"}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs tracking-[0.1em] uppercase text-muted-foreground mb-1">Name *</label>
                <input type="text" value={productForm.name} onChange={(e) => setProductForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full border border-border p-2 text-sm" placeholder="Product name" />
              </div>
              <div>
                <label className="block text-xs tracking-[0.1em] uppercase text-muted-foreground mb-1">Brand *</label>
                <input type="text" value={productForm.brand} onChange={(e) => setProductForm(p => ({ ...p, brand: e.target.value }))}
                  className="w-full border border-border p-2 text-sm" placeholder="Brand name" />
              </div>
              <div>
                <label className="block text-xs tracking-[0.1em] uppercase text-muted-foreground mb-1">Description</label>
                <textarea value={productForm.description} onChange={(e) => setProductForm(p => ({ ...p, description: e.target.value }))}
                  className="w-full border border-border p-2 text-sm" rows={3} placeholder="Product description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs tracking-[0.1em] uppercase text-muted-foreground mb-1">Price ($)</label>
                  <input type="number" value={productForm.base_price} onChange={(e) => setProductForm(p => ({ ...p, base_price: parseFloat(e.target.value) || 0 }))}
                    className="w-full border border-border p-2 text-sm" min={0} step={0.01} />
                </div>
                <div>
                  <label className="block text-xs tracking-[0.1em] uppercase text-muted-foreground mb-1">Category</label>
                  <select value={productForm.category} onChange={(e) => setProductForm(p => ({ ...p, category: e.target.value }))}
                    className="w-full border border-border p-2 text-sm">
                    <option value="shirts">Shirts</option>
                    <option value="jackets">Jackets</option>
                    <option value="bottoms">Bottoms</option>
                    <option value="footwear">Footwear</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs tracking-[0.1em] uppercase text-muted-foreground mb-2">Variants</label>
                {productForm.variants.map((v, idx) => (
                  <div key={idx} className="flex gap-2 mb-2 items-end">
                    <input type="text" value={v.size} onChange={(e) => updateVariant(idx, "size", e.target.value)} placeholder="Size" className="w-20 border border-border p-2 text-sm" />
                    <input type="text" value={v.color} onChange={(e) => updateVariant(idx, "color", e.target.value)} placeholder="Color" className="w-24 border border-border p-2 text-sm" />
                    <input type="number" value={v.stock_quantity} onChange={(e) => updateVariant(idx, "stock_quantity", parseInt(e.target.value) || 0)} placeholder="Stock" className="w-20 border border-border p-2 text-sm" min={0} />
                    <input type="text" value={v.sku} onChange={(e) => updateVariant(idx, "sku", e.target.value)} placeholder="SKU" className="w-24 border border-border p-2 text-sm" />
                    <button onClick={() => removeVariant(idx)} className="text-red-500 text-xs px-2">X</button>
                  </div>
                ))}
                <button onClick={addVariant} className="text-xs text-accent hover:underline">+ Add Variant</button>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSaveProduct} className="flex-1 bg-accent text-accent-foreground py-2 text-xs tracking-[0.1em] uppercase hover:bg-accent/90">
                {editingProduct ? "Update" : "Add"} Product
              </button>
              <button onClick={() => { setShowProductForm(false); setEditingProduct(null) }} className="flex-1 border border-border py-2 text-xs tracking-[0.1em] uppercase hover:bg-secondary/50">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Adjustment Modal */}
      {showInventoryModal && inventoryProductSlug && <InventoryModal />}
    </div>
  )
}

function InventoryModal() {
  const {
    products, inventoryProductSlug, inventoryAdjustments, setInventoryAdjustments,
    inventoryReason, setInventoryReason, setShowInventoryModal, setInventoryProductSlug, setShowInventoryModal: closeModal,
    setProducts: refreshProducts,
  } = useAdmin()

  const invProduct = products.find(p => p.slug === inventoryProductSlug)
  if (!invProduct) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-border p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-medium mb-1">Adjust Stock</h3>
        <p className="text-sm text-muted-foreground mb-4">{invProduct.name}</p>

        <div className="space-y-3 mb-4">
          <h4 className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground">Variants</h4>
          {invProduct.variants.map((v, vi) => {
            const key = `${v.color}||${v.size}`
            const change = inventoryAdjustments[key] ?? 0
            return (
              <div key={vi} className="border border-border p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{v.color} / {v.size}</span>
                  <span className="text-xs text-muted-foreground">Current: <span className="text-foreground font-medium">{v.stock_quantity}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setInventoryAdjustments(prev => ({ ...prev, [key]: Math.max(-v.stock_quantity, (prev[key] ?? 0) - 1) }))}
                    className="w-8 h-8 border border-border hover:bg-secondary/20 text-lg font-medium flex items-center justify-center">−</button>
                  <input type="number" value={change} onChange={(e) => setInventoryAdjustments(prev => ({ ...prev, [key]: parseInt(e.target.value) || 0 }))}
                    className="w-20 text-center border border-border p-2 text-sm" />
                  <button onClick={() => setInventoryAdjustments(prev => ({ ...prev, [key]: (prev[key] ?? 0) + 1 }))}
                    className="w-8 h-8 border border-border hover:bg-secondary/20 text-lg font-medium flex items-center justify-center">+</button>
                  <span className="text-xs text-muted-foreground ml-2">
                    → <span className={`font-medium ${(v.stock_quantity + change) <= 0 ? "text-red-500" : "text-foreground"}`}>{v.stock_quantity + change}</span>
                  </span>
                </div>
                {change !== 0 && <p className="text-xs text-muted-foreground mt-1">{change > 0 ? `Adding ${change} units` : `Removing ${Math.abs(change)} units`}</p>}
              </div>
            )
          })}
        </div>

        <div className="mb-4">
          <label className="block text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-1">Adjustment Reason *</label>
          <input type="text" value={inventoryReason} onChange={(e) => setInventoryReason(e.target.value)}
            placeholder="e.g. Received from supplier, damaged item, inventory count correction..." className="w-full border border-border p-2 text-sm" />
        </div>

        <div className="flex gap-3">
          <button onClick={() => {
            const hasChanges = Object.values(inventoryAdjustments).some(v => v !== 0)
            if (!hasChanges) { closeModal(false); return }
            if (!inventoryReason.trim()) { showToast("Please enter a reason for the adjustment", "error"); return }
            let lowStockAlerts: string[] = []
            for (const [key, change] of Object.entries(inventoryAdjustments)) {
              if (change === 0) continue
              const [color, size] = key.split("||")
              const variant = invProduct.variants.find(v => v.color === color && v.size === size)
              if (!variant) continue
              const prevStock = variant.stock_quantity
              const newStock = prevStock + change
              updateVariantStock(inventoryProductSlug!, color, size, newStock)
              addInventoryLog(inventoryProductSlug!, `${color} / ${size}`, color, size, change, prevStock, inventoryReason.trim())
              if (newStock <= 5 && newStock > 0) {
                lowStockAlerts.push(`${invProduct.name} (${color} / ${size}): ${newStock} left`)
              } else if (newStock <= 0) {
                lowStockAlerts.push(`${invProduct.name} (${color} / ${size}): OUT OF STOCK`)
              }
            }
            if (lowStockAlerts.length > 0) {
              lowStockAlerts.forEach(alert => showToast(`⚠ ${alert}`, "error", 5000))
            }
            refreshProducts(getProducts())
            closeModal(false)
            setInventoryProductSlug(null)
            setInventoryAdjustments({})
            setInventoryReason("")
          }} className="flex-1 bg-accent text-accent-foreground py-2 text-xs tracking-[0.1em] uppercase hover:bg-accent/90">
            Save Adjustments
          </button>
          <button onClick={() => { closeModal(false); setInventoryProductSlug(null); setInventoryAdjustments({}); setInventoryReason("") }}
            className="flex-1 border border-border py-2 text-xs tracking-[0.1em] uppercase hover:bg-secondary/50">Cancel</button>
        </div>
      </div>
    </div>
  )
}