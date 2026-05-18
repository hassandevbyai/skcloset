"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { HeartIcon } from "@/components/layout/Icons"
import { isInWishlist, toggleWishlist } from "@/lib/wishlist-store"
import { addToCart } from "@/lib/cart-store"
import { getProductImages } from "@/lib/product-images"
import { localProducts } from "@/lib/local-data"
import { showToast } from "@/lib/toast-store"

interface FeaturedProductCardProps {
  name: string
  brand: string
  price: string
  image: string
}

export function FeaturedProductCard({ name, brand, price, image }: FeaturedProductCardProps) {
  const slug = name.toLowerCase().replace(/\s+/g, "-")
  const [wishlisted, setWishlisted] = useState(false)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    setWishlisted(isInWishlist(slug))
  }, [slug])

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(slug)
    const now = !wishlisted
    setWishlisted(now)
    showToast(now ? `Added ${name} to wishlist` : `Removed from wishlist`, "info")
  }

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    const product = localProducts.find((p) => p.slug === slug)
    if (product && product.variants.length > 0) {
      const v = product.variants[0]
      addToCart({
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        price: product.base_price,
        image: getProductImages(product.slug)?.[0] || image,
        size: v.size,
        color: v.color,
        quantity: 1,
      })
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
      showToast(`Added ${product.name} to cart`, "success")
    }
  }

  return (
    <Link href={`/product/${slug}`} className="group block relative">
      <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-secondary">
        <Image
          src={image}
          alt={`${brand} - ${name}`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 p-1.5 z-10"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <HeartIcon className={`w-4 h-4 transition-colors ${wishlisted ? "text-accent fill-accent" : "text-foreground"}`} />
        </button>
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={handleQuickAdd}
            className="block w-full text-center py-2.5 bg-white/90 backdrop-blur-sm text-black text-[10px] tracking-[0.2em] uppercase font-medium"
          >
            Quick Add
          </button>
        </div>
      </div>
      <div className="space-y-1.5 px-0.5">
        <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/70 font-medium">{brand}</p>
        <h3 className="text-sm font-medium text-foreground leading-snug">{name}</h3>
        <p className="text-sm text-muted-foreground/90">{price}</p>
      </div>
      {added && (
        <div className="absolute top-2 left-2 right-2 z-20 bg-accent text-accent-foreground text-[10px] tracking-[0.15em] uppercase font-medium text-center py-1.5 rounded-sm animate-fade-in">
          Added to cart
        </div>
      )}
    </Link>
  )
}
