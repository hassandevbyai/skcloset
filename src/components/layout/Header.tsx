"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { Logo } from "./Logo"
import { MenuIcon, SearchIcon, BagIcon, UserIcon, SunIcon, MoonIcon, XIcon } from "./Icons"
import { useTheme } from "../../hooks/useTheme"
import { getCartCount } from "@/lib/cart-store"
import { SearchModal } from "@/components/search/SearchModal"
import { getUser, logout } from "@/lib/auth-store"
import { NotificationBell } from "./NotificationBell"

const navLinks = [
  { href: "/shop", label: "Shop All" },
  { href: "/shop?category=new-arrivals", label: "New In" },
  { href: "/shop?category=shirts", label: "Shirts" },
  { href: "/shop?category=jackets", label: "Jackets" },
  { href: "/shop?category=bottoms", label: "Bottoms" },
  { href: "/shop?category=footwear", label: "Footwear" },
  { href: "/journal", label: "Journal" },
]

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [searchOpen, setSearchOpen] = useState(false)
  const [user, setUser] = useState<ReturnType<typeof getUser>>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { dark, toggle } = useTheme()
  const headerRef = useRef<HTMLElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setCartCount(getCartCount())
    setUser(getUser())
    const onStorage = () => { setCartCount(getCartCount()); setUser(getUser()) }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (mobileOpen) { document.body.style.overflow = "hidden" }
    else { document.body.style.overflow = "" }
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setUserMenuOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    document.addEventListener("keydown", handleKey)
    return () => {
      document.removeEventListener("mousedown", handleClick)
      document.removeEventListener("keydown", handleKey)
    }
  }, [])

  function handleLogout() {
    logout()
    setUser(null)
    setUserMenuOpen(false)
    router.push("/")
  }

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/98 backdrop-blur-md border-b border-border"
            : "bg-background/80 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto max-w-screen-2xl px-5 sm:px-8 lg:px-12">
          <div className="flex items-center h-16 md:h-[72px]">
            {/* Left: Navigation */}
            <div className="flex-1 flex items-center gap-1">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden relative z-50 p-2 -ml-2 text-foreground hover:text-accent transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
              </button>
              <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Main navigation">
                {navLinks.map((link) => (
                  <Link
                    key={`${link.href}-${link.label}`}
                    href={link.href}
                    className="px-3 py-2 text-[11px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Center: Logo */}
            <div className="flex-shrink-0">
              <Logo />
            </div>

            {/* Right: Actions */}
            <div className="flex-1 flex items-center justify-end gap-0.5 md:gap-1">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Search"
              >
                <SearchIcon className="w-[18px] h-[18px]" />
              </button>

              {user ? (
                <>
                <NotificationBell />
                <div className="relative hidden md:block" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="p-2.5 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Account menu"
                  >
                    <UserIcon className="w-[18px] h-[18px]" />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-background border border-border shadow-lg z-50">
                      <div className="p-3 border-b border-border">
                        <p className="text-xs text-foreground font-medium truncate">{user.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link href="/account" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">My Account</Link>
                        <Link href="/account?tab=orders" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">Orders</Link>
                        {user.role === "admin" && (
                          <Link href="/admin" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">Admin Panel</Link>
                        )}
                        <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">Sign Out</button>
                      </div>
                    </div>
                  )}
                </div>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  className="hidden md:inline-flex p-2.5 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Sign in"
                >
                  <UserIcon className="w-[18px] h-[18px]" />
                </Link>
              )}

              <button
                onClick={() => router.push('/cart')}
                className="relative p-2.5 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Cart"
              >
                <BagIcon className="w-[18px] h-[18px]" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-accent text-accent-foreground text-[8px] font-semibold rounded-full flex items-center justify-center leading-none">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={toggle}
                className="p-2.5 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Toggle theme"
              >
                {dark ? <SunIcon className="w-[18px] h-[18px]" /> : <MoonIcon className="w-[18px] h-[18px]" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-72 max-w-[85vw] bg-background border-r border-border p-6 pt-24 overflow-y-auto">
              <nav className="space-y-1" role="navigation" aria-label="Mobile navigation">
                {navLinks.map((link) => (
                  <Link
                    key={`mobile-${link.href}-${link.label}`}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 text-sm tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors rounded-sm"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-8 pt-6 border-t border-border">
                <div className="space-y-3 px-4">
                  <button onClick={() => { setMobileOpen(false); setSearchOpen(true) }} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors w-full text-left">
                    <SearchIcon className="w-4 h-4" />
                    Search
                  </button>
                  {user ? (
                    <>
                      <Link href="/account" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <UserIcon className="w-4 h-4" />
                        Account
                      </Link>
                      {user.role === "admin" && (
                        <Link href="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                          <UserIcon className="w-4 h-4" />
                          Admin
                        </Link>
                      )}
                      <button onClick={() => { handleLogout(); setMobileOpen(false) }} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors w-full text-left">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></svg>
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <UserIcon className="w-4 h-4" />
                      Sign In
                    </Link>
                  )}
                  <button onClick={() => { setMobileOpen(false); router.push('/cart') }} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <BagIcon className="w-4 h-4" />
                    Cart
                    {cartCount > 0 && <span className="text-[10px] text-accent">({cartCount})</span>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}