"use client"

import { Suspense, useState, useEffect, type FormEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { getUser } from "@/lib/auth-store"
import { HeartIcon, XIcon, ChevronRight } from "@/components/layout/Icons"
import { getUserOrders, type Order } from "@/lib/order-store"
import { getWishlist, toggleWishlist } from "@/lib/wishlist-store"
import { localProducts } from "@/lib/local-data"
import { getProductImages } from "@/lib/product-images"
import { getProfile, updateProfile, type UserProfile } from "@/lib/profile-store"
import { getUserNotifications, markAsRead, markAllAsRead, type Notification } from "@/lib/notification-store"
import ShareWishlistModal from "@/components/wishlist/ShareWishlistModal"

type Tab = "orders" | "saved" | "profile" | "notifications"

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  confirmed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  shipped: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  delivered: "bg-accent/10 text-accent dark:bg-accent/20",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
}

const tabs: { key: Tab; label: string }[] = [
  { key: "orders", label: "Order History" },
  { key: "saved", label: "Saved Items" },
  { key: "notifications", label: "Notifications" },
  { key: "profile", label: "Profile Settings" },
]

function AccountPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<Tab>((searchParams.get("tab") as Tab) || "orders")
  const [orders, setOrders] = useState<Order[]>([])
  const [wishlistSlugs, setWishlistSlugs] = useState<string[]>([])
  const [profile, setProfile] = useState<UserProfile>(getProfile())
  const [saved, setSaved] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [mounted, setMounted] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    if (!getUser()) {
      router.push("/auth/login?redirect=/account")
      return
    }
    setAuthChecked(true)
  }, [router])

  useEffect(() => {
    if (!authChecked) return
    const user = getUser()
    if (user) {
      setOrders(getUserOrders(user.email))
    }
    setWishlistSlugs(getWishlist())
    setProfile(getProfile())
    const userForNotif = getUser()
    if (userForNotif) { setNotifications(getUserNotifications(userForNotif.email)) }
    setMounted(true)
  }, [authChecked])

  function refreshWishlist() {
    setWishlistSlugs([...getWishlist()])
  }

  function handleRemoveWishlist(slug: string) {
    toggleWishlist(slug)
    refreshWishlist()
  }

  function handleProfileSubmit(e: FormEvent) {
    e.preventDefault()
    updateProfile(profile)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function updateProfileField(field: keyof UserProfile, value: string) {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const wishlistProducts = wishlistSlugs
    .map((slug) => localProducts.find((p) => p.slug === slug))
    .filter(Boolean) as typeof localProducts

  if (!mounted || !authChecked) {
    return <div className="min-h-screen" />
  }

  return (
    <div className="min-h-screen">
      <div className="border-b border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <p className="text-xs tracking-[0.3em] uppercase text-accent font-medium mb-2">Profile</p>
          <h1 className="font-serif text-3xl md:text-5xl text-foreground">My Account</h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="border-b border-border mb-8 overflow-x-auto">
          <div className="flex gap-8 min-w-max md:min-w-0">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-3 text-sm transition-colors relative ${
                  activeTab === tab.key
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                )}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "orders" && (
          <div>
            {orders.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground mb-6">No orders yet</p>
                <Link
                  href="/shop"
                  className="inline-block bg-primary text-primary-foreground px-8 py-3 text-xs tracking-[0.2em] uppercase font-medium hover:bg-primary/90 transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/orders/${order.id}`}
                    className="block border border-border p-5 hover:border-accent/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-xs tracking-[0.15em] uppercase text-foreground font-medium">{order.id}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] tracking-[0.1em] uppercase font-medium px-2.5 py-1 ${statusColors[order.status] || ""}`}>
                          {order.status}
                        </span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{order.items.length} {order.items.length === 1 ? "item" : "items"}</span>
                      <span className="text-foreground font-medium">${order.total.toFixed(2)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "saved" && (
          <div>
            {wishlistProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground mb-6">No saved items</p>
                <Link
                  href="/shop"
                  className="inline-block bg-primary text-primary-foreground px-8 py-3 text-xs tracking-[0.2em] uppercase font-medium hover:bg-primary/90 transition-colors"
                >
                  Explore Products
                </Link>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm text-muted-foreground">Saved Items ({wishlistProducts.length})</p>
                  <button
                    onClick={() => setShowShare(true)}
                    className="text-xs tracking-[0.15em] uppercase bg-accent text-white px-4 py-2 rounded-sm hover:bg-accent/90 transition-colors"
                  >
                    Share Wishlist
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {wishlistProducts.map((product) => (
                  <div key={product.slug} className="group">
                    <Link href={`/product/${product.slug}`}>
                      <div className="aspect-[3/4] bg-secondary overflow-hidden relative mb-3">
                        <Image
                          src={getProductImages(product.slug)?.[0] || ""}
                          alt={`${product.brand} - ${product.name}`}
                          fill
                          sizes="(max-width: 640px) 50vw, 25vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                      </div>
                    </Link>
                    <div className="space-y-0.5">
                      <p className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium">{product.brand}</p>
                      <h3 className="text-sm font-medium text-foreground">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">${product.base_price.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveWishlist(product.slug)}
                      className="mt-2 text-[10px] tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                    >
                      <XIcon className="w-3 h-3" />
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
            )}
          </div>
        )}

        {activeTab === "notifications" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">{notifications.length} notification{notifications.length !== 1 ? "s" : ""}</p>
              {notifications.some(n => !n.read) && (
                <button onClick={() => { const u = getUser(); if (u) { markAllAsRead(u.email); setNotifications(getUserNotifications(u.email)) } }}
                  className="text-xs text-accent hover:underline">Mark all read</button>
              )}
            </div>
            {notifications.length === 0 ? (
              <div className="border border-border p-8 text-center text-sm text-muted-foreground">No notifications yet</div>
            ) : (
              <div className="space-y-1">
                {notifications.map((n) => (
                  <Link key={n.id} href={`/orders/${n.orderId}`}
                    className={`flex items-start gap-3 p-4 border border-border hover:bg-secondary/10 transition-colors ${n.read ? "opacity-60" : ""}`}>
                    <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${n.read ? "bg-transparent" : "bg-accent"}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">{n.title}</p>
                        <button onClick={(e) => { e.preventDefault(); markAsRead(n.id); setNotifications(getUserNotifications(getUser()?.email || "")) }}
                          className="text-[10px] text-muted-foreground hover:text-foreground">Mark read</button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{n.message}</p>
                      <p className="text-[10px] text-muted-foreground/60 mt-2">{new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "profile" && (
          <div className="max-w-lg">
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium mb-1.5">First Name</label>
                  <input
                    type="text"
                    value={profile.firstName}
                    onChange={(e) => updateProfileField("firstName", e.target.value)}
                    className="w-full px-4 py-2.5 bg-transparent border border-border text-sm text-foreground focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium mb-1.5">Last Name</label>
                  <input
                    type="text"
                    value={profile.lastName}
                    onChange={(e) => updateProfileField("lastName", e.target.value)}
                    className="w-full px-4 py-2.5 bg-transparent border border-border text-sm text-foreground focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium mb-1.5">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => updateProfileField("email", e.target.value)}
                  className="w-full px-4 py-2.5 bg-transparent border border-border text-sm text-foreground focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium mb-1.5">Phone</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => updateProfileField("phone", e.target.value)}
                  className="w-full px-4 py-2.5 bg-transparent border border-border text-sm text-foreground focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium mb-1.5">Address</label>
                <input
                  type="text"
                  value={profile.address}
                  onChange={(e) => updateProfileField("address", e.target.value)}
                  className="w-full px-4 py-2.5 bg-transparent border border-border text-sm text-foreground focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium mb-1.5">City</label>
                  <input
                    type="text"
                    value={profile.city}
                    onChange={(e) => updateProfileField("city", e.target.value)}
                    className="w-full px-4 py-2.5 bg-transparent border border-border text-sm text-foreground focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium mb-1.5">State</label>
                  <input
                    type="text"
                    value={profile.state}
                    onChange={(e) => updateProfileField("state", e.target.value)}
                    className="w-full px-4 py-2.5 bg-transparent border border-border text-sm text-foreground focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium mb-1.5">ZIP</label>
                  <input
                    type="text"
                    value={profile.zip}
                    onChange={(e) => updateProfileField("zip", e.target.value)}
                    className="w-full px-4 py-2.5 bg-transparent border border-border text-sm text-foreground focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4 pt-2">
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground px-8 py-2.5 text-xs tracking-[0.2em] uppercase font-medium hover:bg-primary/90 transition-colors"
                >
                  Save Changes
                </button>
                {saved && (
                  <span className="text-xs text-accent animate-fade-in">Changes saved</span>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
      <ShareWishlistModal open={showShare} onClose={() => setShowShare(false)} />
    </div>
  )
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <AccountPageContent />
    </Suspense>
  )
}
