"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { isAdmin, logout } from "@/lib/auth-store"

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: "◈" },
  { href: "/admin/products", label: "Products", icon: "□" },
  { href: "/admin/orders", label: "Orders", icon: "◉" },
  { href: "/admin/users", label: "Users", icon: "◎" },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    if (!isAdmin()) {
      router.push("/auth/login?redirect=/admin")
    } else {
      setAuthed(true)
    }
  }, [router])

  if (!authed) return null

  function handleLogout() {
    logout()
    router.push("/")
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-56 border-r border-border bg-secondary/30 shrink-0 hidden md:block">
        <div className="p-6 border-b border-border">
          <Link href="/admin" className="font-serif text-xl tracking-[0.15em] uppercase text-foreground">SKCLOSET</Link>
          <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mt-1">Admin Panel</p>
        </div>
        <nav className="p-4 space-y-1">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-sm transition-colors ${
                pathname === link.href ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <span className="text-xs">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-border mt-auto">
          <button onClick={handleLogout} className="w-full text-xs text-muted-foreground hover:text-foreground py-2 text-center transition-colors">
            Sign Out
          </button>
        </div>
      </aside>
      <div className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">{children}</div>
      </div>
    </div>
  )
}
