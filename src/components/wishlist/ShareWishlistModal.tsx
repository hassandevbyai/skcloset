"use client"

import { useMemo, useEffect, useState } from "react"
import { Copy, MessageCircle, Mail } from "lucide-react"
import { getWishlist } from "@/lib/wishlist-store"
import { localProducts } from "@/lib/local-data"
import { showToast } from "@/lib/toast-store"

interface Props {
  open: boolean
  onClose: () => void
}

export default function ShareWishlistModal({ open, onClose }: Props) {
  const [shareUrl, setShareUrl] = useState("")

  const wishlistSlugs = getWishlist()
  const shareId = useMemo(() => {
    if (wishlistSlugs.length === 0) return ""
    return btoa(JSON.stringify(wishlistSlugs)).replace(/=/g, "")
  }, [open])

  useEffect(() => {
    if (open) {
      setShareUrl(`https://skcloset.vercel.app/wishlist/shared/${shareId}`)
    }
  }, [open, shareId])

  const previewItems = useMemo(() => {
    const items = wishlistSlugs
      .map((slug) => localProducts.find((p) => p.slug === slug))
      .filter(Boolean)
    return items.slice(0, 4)
  }, [open])

  function handleCopy() {
    navigator.clipboard.writeText(shareUrl)
    showToast("Wishlist link copied to clipboard!")
  }

  function handleShare(platform: "twitter" | "facebook" | "whatsapp" | "email") {
    const text = "Check out my wishlist on SKCLOSET!"
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + " " + shareUrl)}`,
      email: `mailto:?subject=${encodeURIComponent("My SKCLOSET Wishlist")}&body=${encodeURIComponent(text + "\n\n" + shareUrl)}`,
    }
    window.open(urls[platform], "_blank", "noopener,noreferrer")
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md mx-4 bg-background border border-border shadow-xl">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-sm tracking-[0.15em] uppercase font-medium text-foreground">
            Share Wishlist
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-5">
          {previewItems.length > 0 && (
            <div>
              <p className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium mb-2">
                Sharing {wishlistSlugs.length} item{wishlistSlugs.length !== 1 ? "s" : ""}
              </p>
              <div className="space-y-1.5">
                {previewItems.map((item: { slug: string; name: string }) => (
                  <div key={item.slug} className="flex items-center gap-3 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                    <span className="text-foreground truncate">{item.name}</span>
                  </div>
                ))}
                {wishlistSlugs.length > 4 && (
                  <p className="text-xs text-muted-foreground pl-4">
                    +{wishlistSlugs.length - 4} more
                  </p>
                )}
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium mb-1.5">
              Share Link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 px-3 py-2.5 bg-secondary border border-border text-sm text-foreground focus:outline-none truncate"
              />
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 bg-accent text-white px-4 py-2.5 text-xs tracking-[0.15em] uppercase font-medium hover:bg-accent/90 transition-colors shrink-0"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy
              </button>
            </div>
          </div>

          <div>
            <p className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium mb-3">
              Share via
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleShare("twitter")}
                className="flex items-center justify-center w-10 h-10 border border-border hover:border-accent/50 hover:bg-accent/5 transition-colors text-muted-foreground hover:text-foreground"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </button>
              <button
                onClick={() => handleShare("facebook")}
                className="flex items-center justify-center w-10 h-10 border border-border hover:border-accent/50 hover:bg-accent/5 transition-colors text-muted-foreground hover:text-foreground"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </button>
              <button
                onClick={() => handleShare("whatsapp")}
                className="flex items-center justify-center w-10 h-10 border border-border hover:border-accent/50 hover:bg-accent/5 transition-colors text-muted-foreground hover:text-foreground"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleShare("email")}
                className="flex items-center justify-center w-10 h-10 border border-border hover:border-accent/50 hover:bg-accent/5 transition-colors text-muted-foreground hover:text-foreground"
              >
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
