"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { isAdmin } from "@/lib/auth-store"
import { getOrders, getOrderStats, updateOrderStatus as updateOrderStatusFn, cancelOrder, updateTracking, type Order, type OrderStatus } from "@/lib/order-store"
import { getProducts, addProduct, updateProduct, deleteProduct, toggleProductStatus, initProducts, updateVariantStock, type Product, type ProductVariant } from "@/lib/product-store"
import { getSyncCustomers, upsertCustomer, updateCustomerNotes, type CustomerProfile } from "@/lib/customer-store"
import { addInventoryLog, getInventoryLogs, type InventoryLog } from "@/lib/inventory-store"
import { getCoupons, addCoupon, updateCoupon, deleteCoupon, toggleCouponStatus, seedDefaultCoupons, type Coupon } from "@/lib/coupon-store"
import { localProducts as defaultProducts } from "@/lib/local-data"
import { showToast } from "@/lib/toast-store"
import { notifyOrderStatus } from "@/lib/notification-store"

export type Tab = "overview" | "products" | "orders" | "customers" | "coupons" | "settings" | "seo" | "analytics" | "reviews"

export const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  confirmed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  shipped: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  delivered: "bg-accent/10 text-accent",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
}

interface ProductForm {
  name: string; brand: string; description: string; base_price: number; category: string; is_active: boolean
  variants: { size: string; color: string; stock_quantity: number; sku: string }[]
}

interface CouponForm {
  code: string; type: "percentage" | "fixed"; value: number; minOrderAmount: number; maxDiscount: number; usageLimit: number; expiresAt: string; isActive: boolean
}

interface AdminContextType {
  // State
  activeTab: Tab; setActiveTab: (t: Tab) => void
  orders: Order[]; setOrders: (o: Order[]) => void
  products: Product[]; setProducts: (p: Product[]) => void
  customers: CustomerProfile[]; setCustomers: (c: CustomerProfile[]) => void
  coupons: Coupon[]; setCoupons: (c: Coupon[]) => void
  settings: { storeName: string; email: string; currency: string }; setSettings: React.Dispatch<React.SetStateAction<{ storeName: string; email: string; currency: string }>>
  settingsSaved: boolean
  authed: boolean
  totalSales: number; totalCustomers: number; recentOrders: Order[]

  // Product form
  showProductForm: boolean; setShowProductForm: (v: boolean) => void
  editingProduct: Product | null; setEditingProduct: (p: Product | null) => void
  productForm: ProductForm; setProductForm: React.Dispatch<React.SetStateAction<ProductForm>>
  handleSaveProduct: () => void; handleDeleteProduct: (slug: string) => void
  openEditProduct: (product: Product) => void
  addVariant: () => void; updateVariant: (idx: number, field: string, value: string | number) => void; removeVariant: (idx: number) => void

  // Orders
  expandedOrder: string | null; setExpandedOrder: (id: string | null) => void
  trackingInputs: Record<string, { number: string; provider: string }>; setTrackingInputs: React.Dispatch<React.SetStateAction<Record<string, { number: string; provider: string }>>>
  updateOrderStatus: (id: string, status: string) => void
  handleCancelOrder: (id: string) => void
  handleUpdateTracking: (id: string) => void

  // Customers
  expandedCustomer: string | null; setExpandedCustomer: (id: string | null) => void
  editingCustomer: string | null; setEditingCustomer: (id: string | null) => void
  customerNotes: Record<string, string>; setCustomerNotes: React.Dispatch<React.SetStateAction<Record<string, string>>>

  // Inventory
  showInventoryModal: boolean; setShowInventoryModal: (v: boolean) => void
  inventoryProductSlug: string | null; setInventoryProductSlug: (v: string | null) => void
  inventoryAdjustments: Record<string, number>; setInventoryAdjustments: React.Dispatch<React.SetStateAction<Record<string, number>>>
  inventoryReason: string; setInventoryReason: (v: string) => void
  showInventoryLog: string | null; setShowInventoryLog: (v: string | null) => void

  // Coupons
  showCouponForm: boolean; setShowCouponForm: (v: boolean) => void
  editingCouponCode: string | null; setEditingCouponCode: (v: string | null) => void
  couponForm: CouponForm; setCouponForm: React.Dispatch<React.SetStateAction<CouponForm>>

  // Actions
  saveSettings: () => void
  toggleProductStatus: (slug: string) => void
}

const AdminContext = createContext<AdminContextType | null>(null)

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider")
  return ctx
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>("overview")
  const [orders, setOrders] = useState<Order[]>([])
  const [authed, setAuthed] = useState(false)
  const [settings, setSettings] = useState({ storeName: "SKCLOSET", email: "support@skcloset.com", currency: "USD" })
  const [settingsSaved, setSettingsSaved] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [trackingInputs, setTrackingInputs] = useState<Record<string, { number: string; provider: string }>>({})
  const [customers, setCustomers] = useState<CustomerProfile[]>([])
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null)
  const [editingCustomer, setEditingCustomer] = useState<string | null>(null)
  const [customerNotes, setCustomerNotes] = useState<Record<string, string>>({})
  const [showInventoryModal, setShowInventoryModal] = useState(false)
  const [inventoryProductSlug, setInventoryProductSlug] = useState<string | null>(null)
  const [inventoryAdjustments, setInventoryAdjustments] = useState<Record<string, number>>({})
  const [inventoryReason, setInventoryReason] = useState("")
  const [showInventoryLog, setShowInventoryLog] = useState<string | null>(null)
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [showCouponForm, setShowCouponForm] = useState(false)
  const [editingCouponCode, setEditingCouponCode] = useState<string | null>(null)
  const [couponForm, setCouponForm] = useState<CouponForm>({ code: "", type: "percentage", value: 0, minOrderAmount: 0, maxDiscount: 0, usageLimit: 0, expiresAt: "", isActive: true })
  const [productForm, setProductForm] = useState<ProductForm>({
    name: "", brand: "", description: "", base_price: 0, category: "shirts", is_active: true,
    variants: [{ size: "M", color: "Black", stock_quantity: 10, sku: "" }]
  })

  useEffect(() => {
    if (!isAdmin()) { router.push("/auth/login"); return }
    setAuthed(true)
    initProducts(defaultProducts)
    setOrders(getOrders())
    setProducts(getProducts())
    try {
      const saved = localStorage.getItem("skcloset_settings")
      if (saved) setSettings(JSON.parse(saved))
    } catch {}
  }, [router])

  useEffect(() => {
    if (activeTab === "products") setProducts(getProducts())
    if (activeTab === "customers") {
      const synced = getSyncCustomers(orders)
      setCustomers(synced)
      const notes: Record<string, string> = {}
      synced.forEach((c) => { notes[c.email] = c.notes || "" })
      setCustomerNotes(notes)
    }
    if (activeTab === "coupons") {
      const all = getCoupons()
      if (all.length === 0) { seedDefaultCoupons(); setCoupons(getCoupons()) }
      else setCoupons(all)
    }
  }, [activeTab, orders])

  const totalSales = orders.reduce((s, o) => s + o.total, 0)
  const customerSet = new Set(orders.map((o) => o.shippingAddress.email || `${o.shippingAddress.firstName}-${o.shippingAddress.lastName}`))
  const totalCustomers = customerSet.size
  const recentOrders = orders.slice(0, 5)

  function handleSaveProduct() {
    if (!productForm.name || !productForm.brand) { showToast("Name and brand are required", "error"); return }
    if (editingProduct) { updateProduct(editingProduct.slug, productForm); showToast("Product updated", "success") }
    else { addProduct(productForm); showToast("Product added", "success") }
    setProducts(getProducts())
    setShowProductForm(false)
    setEditingProduct(null)
    setProductForm({ name: "", brand: "", description: "", base_price: 0, category: "shirts", is_active: true, variants: [{ size: "M", color: "Black", stock_quantity: 10, sku: "" }] })
  }

  function handleDeleteProduct(slug: string) {
    if (confirm("Delete this product?")) { deleteProduct(slug); setProducts(getProducts()); showToast("Product deleted", "success") }
  }

  function openEditProduct(product: Product) {
    setEditingProduct(product)
    setProductForm({
      name: product.name, brand: product.brand, description: product.description, base_price: product.base_price,
      category: product.category, is_active: product.is_active,
      variants: product.variants.length > 0 ? product.variants : [{ size: "M", color: "Black", stock_quantity: 10, sku: "" }]
    })
    setShowProductForm(true)
  }

  function addVariant() { setProductForm(prev => ({ ...prev, variants: [...prev.variants, { size: "M", color: "Black", stock_quantity: 10, sku: "" }] })) }
  function updateVariant(idx: number, field: string, value: string | number) {
    const newVariants = [...productForm.variants]
    newVariants[idx] = { ...newVariants[idx], [field]: value }
    setProductForm(prev => ({ ...prev, variants: newVariants }))
  }
  function removeVariant(idx: number) { setProductForm(prev => ({ ...prev, variants: prev.variants.filter((_, i) => i !== idx) })) }

  function updateOrderStatus(orderId: string, newStatus: string) {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus as Order["status"] } : o))
    setOrders(updated)
    localStorage.setItem("skcloset_orders", JSON.stringify(updated))
    const order = orders.find((o) => o.id === orderId)
    if (order && order.userEmail) notifyOrderStatus(order.userEmail, orderId, newStatus)
    showToast("Order status changed", "success")
  }

  function handleCancelOrder(id: string) {
    const reason = prompt("Reason for cancellation:")
    if (reason) { cancelOrder(id, reason); setOrders(getOrders())
      const order = getOrders().find((o) => o.id === id)
      if (order && order.userEmail) notifyOrderStatus(order.userEmail, id, "cancelled")
    }
  }

  function handleUpdateTracking(id: string) {
    const input = trackingInputs[id]
    if (input?.number) { updateTracking(id, input.number, input.provider || ""); setOrders(getOrders()); showToast("Tracking updated", "success") }
  }

  function saveSettings() {
    localStorage.setItem("skcloset_settings", JSON.stringify(settings))
    showToast("Settings saved", "success")
    setSettingsSaved(true)
    setTimeout(() => setSettingsSaved(false), 2000)
  }

  function toggleProductStatusFn(slug: string) {
    toggleProductStatus(slug)
    setProducts(getProducts())
  }

  const value: AdminContextType = {
    activeTab, setActiveTab, orders, setOrders, products, setProducts, customers, setCustomers,
    coupons, setCoupons, settings, setSettings, settingsSaved, authed,
    totalSales, totalCustomers, recentOrders,
    showProductForm, setShowProductForm, editingProduct, setEditingProduct, productForm, setProductForm,
    handleSaveProduct, handleDeleteProduct, openEditProduct, addVariant, updateVariant, removeVariant,
    expandedOrder, setExpandedOrder, trackingInputs, setTrackingInputs, updateOrderStatus, handleCancelOrder, handleUpdateTracking,
    expandedCustomer, setExpandedCustomer, editingCustomer, setEditingCustomer, customerNotes, setCustomerNotes,
    showInventoryModal, setShowInventoryModal, inventoryProductSlug, setInventoryProductSlug,
    inventoryAdjustments, setInventoryAdjustments, inventoryReason, setInventoryReason, showInventoryLog, setShowInventoryLog,
    showCouponForm, setShowCouponForm, editingCouponCode, setEditingCouponCode, couponForm, setCouponForm,
    saveSettings,
    toggleProductStatus: toggleProductStatusFn,
  }

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}