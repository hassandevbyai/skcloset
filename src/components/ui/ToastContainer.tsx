"use client"

import { useState, useEffect } from "react"
import { subscribe, type Toast } from "@/lib/toast-store"

const typeStyles: Record<string, string> = {
  success: "border-l-4 border-accent bg-accent/10",
  error: "border-l-4 border-red-500 bg-red-500/10",
  info: "border-l-4 border-accent/60 bg-accent/5",
}

const typeIcons: Record<string, string> = {
  success: "\u2713",
  error: "\u2715",
  info: "i",
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const unsub = subscribe(setToasts)
    return unsub
  }, [])

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.slice(0, 3).map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 bg-background border border-border shadow-lg animate-toast ${typeStyles[toast.type] || typeStyles.info}`}
        >
          <span className={`text-sm font-bold mt-0.5 ${
            toast.type === "success" ? "text-accent" : toast.type === "error" ? "text-red-500" : "text-accent"
          }`}>
            {typeIcons[toast.type] || typeIcons.info}
          </span>
          <p className="text-sm text-foreground flex-1">{toast.message}</p>
        </div>
      ))}
    </div>
  )
}