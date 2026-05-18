"use client"

import React from "react"
import Link from "next/link"
import { AdminProvider, useAdmin, type Tab } from "./components/admin-context"
import { OverviewTab } from "./components/overview-tab"
import { ProductsTab } from "./components/products-tab"
import { OrdersTab } from "./components/orders-tab"
import { CustomersTab } from "./components/customers-tab"
import { CouponsTab } from "./components/coupons-tab"
import { SettingsTab } from "./components/settings-tab"
import { SeoTab } from "./components/seo-tab"
import { AnalyticsTab } from "./components/analytics-tab"
import { ReviewsTab } from "./components/reviews-tab"

export default function AdminDashboard() {
  return (
    <AdminProvider>
      <AdminDashboardInner />
    </AdminProvider>
  )
}

function AdminDashboardInner() {
  const { activeTab, setActiveTab, authed } = useAdmin()

  if (!authed) return null

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "products", label: "Products" },
    { key: "orders", label: "Orders" },
    { key: "customers", label: "Customers" },
    { key: "coupons", label: "Coupons" },
    { key: "seo", label: "SEO" },
    { key: "settings", label: "Settings" },
    { key: "analytics", label: "Analytics" },
  ]

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-60 border-r border-border bg-secondary/20 shrink-0 hidden lg:block">
        <div className="p-6 border-b border-border">
          <Link href="/admin" className="font-serif text-lg tracking-[0.15em] uppercase text-foreground">SKCLOSET</Link>
          <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mt-1">Admin Panel</p>
        </div>
        <nav className="p-3 space-y-0.5">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                activeTab === tab.key
                  ? "bg-accent/10 text-accent font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile tab selector */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 px-3 py-3 text-[10px] tracking-[0.1em] uppercase font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.key ? "text-accent border-b-2 border-accent" : "text-muted-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto pb-16 lg:pb-0">
        <div className="p-4 md:p-8">
          <h1 className="font-serif text-2xl text-foreground mb-8 capitalize">{activeTab}</h1>

          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "products" && <ProductsTab />}
          {activeTab === "orders" && <OrdersTab />}
          {activeTab === "customers" && <CustomersTab />}
          {activeTab === "coupons" && <CouponsTab />}
          {activeTab === "seo" && <SeoTab />}
          {activeTab === "settings" && <SettingsTab />}
          {activeTab === "analytics" && <AnalyticsTab />}
          {activeTab === "reviews" && <ReviewsTab />}
        </div>
      </div>
    </div>
  )
}