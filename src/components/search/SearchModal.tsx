"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { SearchIcon, XIcon } from "@/components/layout/Icons"
import { localProducts } from "@/lib/local-data"
import { getProductImages } from "@/lib/product-images"

interface SearchModalProps {
  open: boolean
  onClose: () => void
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [onClose])

  const results = query.trim()
    ? localProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.brand.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      )
    : []

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute top-0 left-0 right-0 bg-background border-b border-border shadow-lg">
        <div className="mx-auto max-w-3xl px-4 py-6">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <SearchIcon className="w-5 h-5 text-muted-foreground shrink-0" />
            <label htmlFor="search-input" className="sr-only">Search products</label>
            <input
              id="search-input"
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search our collection..."
              className="flex-1 bg-transparent text-lg text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
            />
            <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 max-h-[60vh] overflow-y-auto">
            {query.trim() === "" ? (
              <p className="text-sm text-muted-foreground/60 py-8 text-center">Search our collection...</p>
            ) : results.length === 0 ? (
              <p className="text-sm text-muted-foreground/60 py-8 text-center">
                No products found for &ldquo;{query}&rdquo;
              </p>
            ) : (
              <div className="space-y-1">
                {results.map((product) => (
                  <Link
                    key={product.slug}
                    href={`/product/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-4 p-3 hover:bg-secondary/50 rounded-sm transition-colors group"
                  >
                    <div className="relative w-14 h-14 bg-secondary shrink-0 overflow-hidden">
                      {getProductImages(product.slug)?.[0] ? (
                        <Image
                          src={getProductImages(product.slug)[0]}
                          alt={product.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-muted">
                          <span className="text-[8px] tracking-[0.1em] uppercase text-muted-foreground font-medium">{product.brand.slice(0, 2)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium">{product.brand}</p>
                      <p className="text-sm text-foreground truncate">{product.name}</p>
                    </div>
                    <p className="text-sm text-foreground font-medium">${product.base_price.toFixed(2)}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
