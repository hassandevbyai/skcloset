"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { BellIcon } from "./Icons"
import { getUserNotifications, getUnreadCount, markAsRead, markAllAsRead, type Notification } from "@/lib/notification-store"
import { getUser } from "@/lib/auth-store"

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unread, setUnread] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  function refresh() {
    const user = getUser()
    if (!user) { setNotifications([]); setUnread(0); return }
    setNotifications(getUserNotifications(user.email))
    setUnread(getUnreadCount(user.email))
  }

  useEffect(() => { refresh(); const iv = setInterval(refresh, 10000); return () => clearInterval(iv) }, [])
  useEffect(() => {
    function handleClick(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    function handleKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false) }
    document.addEventListener("mousedown", handleClick)
    document.addEventListener("keydown", handleKey)
    return () => {
      document.removeEventListener("mousedown", handleClick)
      document.removeEventListener("keydown", handleKey)
    }
  }, [])

  const user = getUser()
  if (!user) return null

  return (
    <div className="relative hidden md:block" ref={ref}>
      <button onClick={() => { setOpen(!open); refresh() }}
        className="p-2.5 text-muted-foreground hover:text-foreground transition-colors relative" aria-label="Notifications">
        <BellIcon className="w-[18px] h-[18px]" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-semibold rounded-full flex items-center justify-center leading-none">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-80 bg-background border border-border shadow-lg z-50 max-h-96 flex flex-col">
          <div className="flex items-center justify-between p-3 border-b border-border shrink-0">
            <p className="text-xs font-medium text-foreground">Notifications</p>
            {unread > 0 && (
              <button onClick={() => { markAllAsRead(user.email); refresh() }}
                className="text-[10px] text-accent hover:underline">Mark all read</button>
            )}
          </div>
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <p className="p-6 text-center text-xs text-muted-foreground">No notifications yet</p>
            ) : (
              notifications.slice(0, 20).map((n) => (
                <Link
                  key={n.id}
                  href={`/orders/${n.orderId}`}
                  onClick={() => { markAsRead(n.id); setOpen(false) }}
                  className={`block p-3 border-b border-border/50 hover:bg-secondary/10 transition-colors ${n.read ? "opacity-60" : ""}`}
                >
                  <div className="flex items-start gap-2">
                    <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${n.read ? "bg-transparent" : "bg-accent"}`} />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{n.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-[9px] text-muted-foreground/60 mt-1">{new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
          {notifications.length > 0 && (
            <Link href="/account?tab=notifications" onClick={() => setOpen(false)}
              className="block p-3 text-center text-[10px] text-accent hover:underline border-t border-border shrink-0">View all</Link>
          )}
        </div>
      )}
    </div>
  )
}