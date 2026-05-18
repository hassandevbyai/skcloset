"use client"

import { useAdmin } from "./admin-context"
import { getCoupons, addCoupon, updateCoupon, deleteCoupon, toggleCouponStatus } from "@/lib/coupon-store"
import { showToast } from "@/lib/toast-store"

export function CouponsTab() {
  const {
    coupons, setCoupons, showCouponForm, setShowCouponForm,
    editingCouponCode, setEditingCouponCode, couponForm, setCouponForm,
  } = useAdmin()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">{coupons.length} coupon{coupons.length !== 1 ? "s" : ""}</p>
        <button onClick={() => {
          setEditingCouponCode(null)
          setCouponForm({ code: "", type: "percentage", value: 0, minOrderAmount: 0, maxDiscount: 0, usageLimit: 0, expiresAt: "", isActive: true })
          setShowCouponForm(true)
        }} className="bg-accent text-accent-foreground px-4 py-2 text-xs tracking-[0.1em] uppercase hover:bg-accent/90">+ Add Coupon</button>
      </div>

      <div className="border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-[10px] tracking-[0.15em] uppercase text-muted-foreground">
              <th className="text-left p-4 font-medium">Code</th>
              <th className="text-left p-4 font-medium">Type</th>
              <th className="text-left p-4 font-medium">Value</th>
              <th className="text-left p-4 font-medium">Min Order</th>
              <th className="text-left p-4 font-medium">Usage</th>
              <th className="text-left p-4 font-medium">Expires</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-left p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 ? (
              <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">No coupons yet</td></tr>
            ) : (
              coupons.map((coupon, i) => (
                <tr key={coupon.code} className={`border-b border-border/50 hover:bg-secondary/20 ${i % 2 === 0 ? "bg-background" : "bg-secondary/10"}`}>
                  <td className="p-4 text-foreground font-mono text-sm font-bold">{coupon.code}</td>
                  <td className="p-4 text-muted-foreground capitalize">{coupon.type}</td>
                  <td className="p-4 text-foreground">
                    {coupon.type === "percentage" ? `${coupon.value}%` : `$${coupon.value.toFixed(2)}`}
                    {coupon.type === "percentage" && coupon.maxDiscount > 0 && <span className="text-muted-foreground text-[10px] ml-1">(cap ${coupon.maxDiscount.toFixed(2)})</span>}
                  </td>
                  <td className="p-4 text-muted-foreground">${coupon.minOrderAmount.toFixed(2)}</td>
                  <td className="p-4 text-muted-foreground">{coupon.usageLimit > 0 ? `${coupon.usedCount}/${coupon.usageLimit}` : `${coupon.usedCount}/∞`}</td>
                  <td className="p-4 text-muted-foreground text-xs">{coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : "Never"}</td>
                  <td className="p-4">
                    <button onClick={() => { toggleCouponStatus(coupon.code); setCoupons(getCoupons()) }}
                      className={`text-[10px] tracking-[0.1em] uppercase font-medium px-2 py-1 cursor-pointer ${coupon.isActive ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}`}>
                      {coupon.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => {
                        setEditingCouponCode(coupon.code)
                        setCouponForm({ code: coupon.code, type: coupon.type, value: coupon.value, minOrderAmount: coupon.minOrderAmount, maxDiscount: coupon.maxDiscount, usageLimit: coupon.usageLimit, expiresAt: coupon.expiresAt ? coupon.expiresAt.split("T")[0] : "", isActive: coupon.isActive })
                        setShowCouponForm(true)
                      }} className="text-xs text-accent hover:underline">Edit</button>
                      <button onClick={() => { deleteCoupon(coupon.code); setCoupons(getCoupons()) }} className="text-xs text-red-500 hover:underline">Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Coupon Form Modal */}
      {showCouponForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium mb-4">{editingCouponCode ? "Edit Coupon" : "Add New Coupon"}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs tracking-[0.1em] uppercase text-muted-foreground mb-1">Coupon Code *</label>
                <input type="text" value={couponForm.code} onChange={(e) => setCouponForm(p => ({ ...p, code: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "") }))}
                  className="w-full border border-border p-2 text-sm font-mono" placeholder="e.g. SUMMER20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs tracking-[0.1em] uppercase text-muted-foreground mb-1">Type</label>
                  <select value={couponForm.type} onChange={(e) => setCouponForm(p => ({ ...p, type: e.target.value as "percentage" | "fixed" }))}
                    className="w-full border border-border p-2 text-sm">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs tracking-[0.1em] uppercase text-muted-foreground mb-1">Value *</label>
                  <div className="relative">
                    <input type="number" value={couponForm.value} onChange={(e) => setCouponForm(p => ({ ...p, value: parseFloat(e.target.value) || 0 }))}
                      className="w-full border border-border p-2 text-sm" min={0} step={0.01} />
                    <span className="absolute right-3 top-2 text-muted-foreground text-sm">{couponForm.type === "percentage" ? "%" : "$"}</span>
                  </div>
                </div>
              </div>
              {couponForm.type === "percentage" && (
                <div>
                  <label className="block text-xs tracking-[0.1em] uppercase text-muted-foreground mb-1">Max Discount Cap ($)</label>
                  <input type="number" value={couponForm.maxDiscount} onChange={(e) => setCouponForm(p => ({ ...p, maxDiscount: parseFloat(e.target.value) || 0 }))}
                    className="w-full border border-border p-2 text-sm" min={0} step={0.01} placeholder="0 = no cap" />
                </div>
              )}
              <div>
                <label className="block text-xs tracking-[0.1em] uppercase text-muted-foreground mb-1">Min Order Amount ($)</label>
                <input type="number" value={couponForm.minOrderAmount} onChange={(e) => setCouponForm(p => ({ ...p, minOrderAmount: parseFloat(e.target.value) || 0 }))}
                  className="w-full border border-border p-2 text-sm" min={0} step={0.01} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs tracking-[0.1em] uppercase text-muted-foreground mb-1">Usage Limit</label>
                  <input type="number" value={couponForm.usageLimit} onChange={(e) => setCouponForm(p => ({ ...p, usageLimit: parseInt(e.target.value) || 0 }))}
                    className="w-full border border-border p-2 text-sm" min={0} placeholder="0 = unlimited" />
                </div>
                <div>
                  <label className="block text-xs tracking-[0.1em] uppercase text-muted-foreground mb-1">Expires</label>
                  <input type="date" value={couponForm.expiresAt} onChange={(e) => setCouponForm(p => ({ ...p, expiresAt: e.target.value }))}
                    className="w-full border border-border p-2 text-sm" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => {
                if (!couponForm.code) { showToast("Coupon code is required", "error"); return }
                if (couponForm.value <= 0) { showToast("Discount value must be greater than 0", "error"); return }
                try {
                  if (editingCouponCode) { updateCoupon(editingCouponCode, { ...couponForm, expiresAt: couponForm.expiresAt || "" }) }
                  else { addCoupon({ ...couponForm, expiresAt: couponForm.expiresAt || "" }) }
                  setCoupons(getCoupons()); setShowCouponForm(false); setEditingCouponCode(null)
                } catch (e: unknown) { showToast(e instanceof Error ? e.message : "Failed to save coupon", "error") }
              }} className="flex-1 bg-accent text-accent-foreground py-2 text-xs tracking-[0.1em] uppercase hover:bg-accent/90">
                {editingCouponCode ? "Update" : "Add"} Coupon
              </button>
              <button onClick={() => { setShowCouponForm(false); setEditingCouponCode(null) }}
                className="flex-1 border border-border py-2 text-xs tracking-[0.1em] uppercase hover:bg-secondary/50">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}