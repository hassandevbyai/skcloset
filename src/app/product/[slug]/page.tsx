"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ChevronLeft, ChevronRight, HeartIcon } from "@/components/layout/Icons"
import { isInWishlist, toggleWishlist } from "@/lib/wishlist-store"
import { addToCart } from "@/lib/cart-store"
import { getProductImages } from "@/lib/product-images"
import { ImageLightbox } from "@/components/product/ImageLightbox"
import SizeGuideModal from "@/components/product/SizeGuideModal"
import { showToast } from "@/lib/toast-store"
import ProductSchema from "@/components/product/ProductSchema"
import Breadcrumbs from "@/components/ui/Breadcrumbs"
import { ReviewForm } from "@/components/product/ReviewForm"
import { ReviewList } from "@/components/product/ReviewList"
import { getProductBySlug, getRelatedProducts, type LocalProduct } from "@/lib/local-data"
interface ProductColor {
  name: string
  hex: string
}

interface ProductData extends LocalProduct {
  relatedProducts: {
    name: string
    brand: string
    base_price: number
    slug: string
  }[]
}


export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string

  const [product, setProduct] = useState<ProductData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [wishlisted, setWishlisted] = useState(false)
  const [addedNotice, setAddedNotice] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)

  useEffect(() => {
    setWishlisted(isInWishlist(slug))
  }, [slug])

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true)
        setError(null)

        let data: ProductData | null = null

        try {
          const res = await fetch(`/api/products/${slug}`)
          const json = await res.json()
          if (json.success) {
            data = json.data
          }
        } catch {
          /* API unavailable — fall back to local data */
        }

        if (!data) {
          const local = getProductBySlug(slug)
          if (local) {
            const related = getRelatedProducts(local.category, slug)
              .map((p) => ({
                name: p.name,
                brand: p.brand,
                base_price: p.base_price,
                slug: p.slug,
              }))
            data = { ...local, relatedProducts: related }
        }
        }

        if (data) {
          setProduct(data)
        } else {
          setError("Product not found")
        }
      } catch {
        setError("Failed to load product. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [slug])

  function handleToggleWishlist() {
    toggleWishlist(slug)
    const now = !wishlisted
    setWishlisted(now)
    showToast(now ? `Added ${product?.name || "item"} to wishlist` : `Removed from wishlist`, "info")
  }

  function handleAddToCart() {
    if (!product) return
    const size = selectedSize || (sizes.length > 0 ? sizes[0] : "M")
    const color = selectedColor || (colors.length > 0 ? colors[0].name : "Default")
    addToCart({
      slug,
      name: product.name,
      brand: product.brand,
      price: product.base_price,
      image: product.images?.[0]?.url || getProductImages(slug)?.[0] || "",
      size,
      color,
      quantity,
    })
    setAddedNotice(true)
    setTimeout(() => setAddedNotice(false), 2000)
    showToast(`Added ${product.name} to cart`, "success")
  }

  // Derive colors from variants
  const colors: ProductColor[] = product
    ? [...new Map(
        (product.variants || []).map((v) => [v.color, { name: v.color, hex: v.color_hex || "#CCCCCC" }])
      ).values()]
    : []

  // Derive sizes from selected color
  const sizes = product && selectedColor
    ? [...new Set(
        (product.variants || [])
          .filter((v) => v.color === selectedColor)
          .map((v) => v.size)
      )]
    : product
    ? [...new Set((product.variants || []).map((v) => v.size))]
    : []

  // Derive selected variant stock for low-stock indicator
  const selectedVariant = product && selectedColor && selectedSize
    ? product.variants.find(v => v.color === selectedColor && v.size === selectedSize) || null
    : null
  const selectedStock = selectedVariant?.stock_quantity ?? null

  const allImages: string[] = product
    ? product.images?.length > 0
      ? product.images.map((img) => img.url)
      : getProductImages(slug)?.length > 0
        ? getProductImages(slug)
        : []
    : []

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-secondary rounded w-48 mx-auto" />
          <div className="h-4 bg-secondary rounded w-64 mx-auto" />
          <div className="h-96 bg-secondary rounded max-w-lg mx-auto mt-8" />
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="font-serif text-3xl text-foreground mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-8">{error || "This product doesn't exist or has been removed."}</p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 text-xs tracking-[0.2em] uppercase font-medium hover:bg-primary/90 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Back to Shop
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Schema */}
      <ProductSchema product={product} />
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: product.name },
        ]} />
      </div>

      {/* Product */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Image gallery */}
          <div className="flex gap-4">
            {/* Thumbnails - left side on desktop */}
            {allImages.length > 1 && (
              <div className="hidden sm:flex flex-col gap-2 w-20 shrink-0">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`aspect-[4/5] bg-secondary overflow-hidden relative transition-colors ${
                      selectedImage === i ? "ring-1 ring-foreground" : "ring-1 ring-transparent hover:ring-border"
                    }`}
                  >
                    <Image src={img} alt={`View ${i + 1}`} fill sizes="80px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
            <div className="flex-1 space-y-4">
              <button
                onClick={() => setLightboxOpen(true)}
                className="aspect-[4/5] bg-secondary overflow-hidden relative w-full cursor-zoom-in"
              >
                <Image
                  src={allImages[selectedImage]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </button>
              {/* Mobile thumbnails */}
              {allImages.length > 1 && (
                <div className="flex sm:hidden gap-2 overflow-x-auto pb-1">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`aspect-square w-16 shrink-0 bg-secondary overflow-hidden relative transition-colors ${
                        selectedImage === i ? "ring-1 ring-foreground" : "ring-1 ring-transparent"
                      }`}
                    >
                      <Image src={img} alt={`View ${i + 1}`} fill sizes="64px" className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product info */}
          <div className="flex flex-col">
            <p className="text-xs tracking-[0.15em] uppercase text-accent font-medium mb-1">{product.brand}</p>
            <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-2">{product.name}</h1>
            <div className="flex items-center gap-3 mb-6">
              <p className="text-xl text-foreground font-medium">${product.base_price.toFixed(2)}</p>
              {selectedStock !== null && selectedStock <= 5 && selectedStock > 0 && (
                <span className="text-[10px] tracking-[0.1em] uppercase bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-2 py-0.5 rounded-sm font-medium animate-pulse">
                  Only {selectedStock} left
                </span>
              )}
              {selectedStock !== null && selectedStock <= 0 && (
                <span className="text-[10px] tracking-[0.1em] uppercase bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-0.5 rounded-sm font-medium">
                  Out of Stock
                </span>
              )}
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Color selector */}
            {colors.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs tracking-[0.15em] uppercase text-foreground font-medium">Color</h3>
                  <span className="text-xs text-muted-foreground">{selectedColor || "Select"}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => { setSelectedColor(color.name); setSelectedSize(null) }}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor === color.name
                          ? "border-foreground scale-110"
                          : "border-border hover:border-muted-foreground"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      aria-label={color.name}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size selector */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs tracking-[0.15em] uppercase text-foreground font-medium">Size</h3>
                <button type="button" onClick={() => setSizeGuideOpen(true)} className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2">
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[3rem] px-4 py-2.5 text-xs font-medium border transition-colors ${
                      selectedSize === size
                        ? "border-foreground bg-foreground text-background"
                        : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + Add to cart */}
            <div className="relative flex gap-3 mb-8">
              <div className="flex items-center border border-border">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  −
                </button>
                <span className="px-4 py-3 text-sm text-foreground min-w-[3rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-primary text-primary-foreground text-xs tracking-[0.2em] uppercase font-medium hover:bg-primary/90 transition-colors"
              >
                Add to Cart
              </button>
              <button
                onClick={handleToggleWishlist}
                className="p-3 border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <HeartIcon className={`w-5 h-5 ${wishlisted ? "text-accent fill-accent" : ""}`} />
              </button>
              {addedNotice && (
                <div className="absolute bottom-0 left-0 right-0 bg-accent text-accent-foreground text-[10px] tracking-[0.15em] uppercase font-medium text-center py-2 animate-fade-in">
                  Added to cart
                </div>
              )}
            </div>

            {/* Details accordion */}
            {product.details && product.details.length > 0 && (
              <div className="border-t border-border pt-6 space-y-4">
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer text-sm font-medium text-foreground list-none">
                    Details
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-open:rotate-90 transition-transform" />
                  </summary>
                  <ul className="mt-3 space-y-1.5">
                    {product.details.map((detail, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-accent mt-1">•</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </details>
                {product.features && product.features.length > 0 && (
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer text-sm font-medium text-foreground list-none">
                      Features & Fit
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-open:rotate-90 transition-transform" />
                    </summary>
                    <ul className="mt-3 space-y-1.5">
                      {product.features.map((feature, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-accent mt-1">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer text-sm font-medium text-foreground list-none">
                    Shipping & Returns
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-open:rotate-90 transition-transform" />
                  </summary>
                  <div className="mt-3 text-sm text-muted-foreground space-y-2">
                    <p>Free shipping on orders over $200. Standard delivery 3-5 business days.</p>
                    <p>Free returns within 30 days of delivery. Items must be unworn with tags attached.</p>
                  </div>
                </details>
              </div>
            )}

            {/* Payment icons */}
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-3">We Accept</p>
              <div className="flex gap-3">
                {["Visa", "MC", "Amex", "PayPal", "Apple Pay"].map((method) => (
                  <span key={method} className="text-xs text-muted-foreground/50 font-medium tracking-wider">
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews */}
      <section className="border-t border-border py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-xl text-foreground mb-6">Customer Reviews</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xs tracking-[0.15em] uppercase text-muted-foreground mb-4">Write a Review</h3>
              <ReviewForm productSlug={slug} />
            </div>
            <div>
              <h3 className="text-xs tracking-[0.15em] uppercase text-muted-foreground mb-4">Reviews</h3>
              <ReviewList productSlug={slug} />
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <section className="border-t border-border py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-accent font-medium mb-2">Complete the Look</p>
                <h2 className="font-serif text-2xl md:text-3xl text-foreground">You May Also Like</h2>
              </div>
              <Link
                href={`/shop?category=${product.category}`}
                className="hidden md:inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors"
              >
                View More
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {product.relatedProducts.map((rp) => (
                <Link key={rp.slug} href={`/product/${rp.slug}`} className="group">
                  <div className="aspect-[3/4] bg-secondary overflow-hidden relative mb-3">
                    {getProductImages(rp.slug)?.[0] ? (
                      <Image
                        src={getProductImages(rp.slug)[0]}
                        alt={`${rp.brand} - ${rp.name}`}
                        fill
                        sizes="25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-muted">
                        <span className="text-xs tracking-[0.15em] uppercase text-muted-foreground font-medium">
                          {rp.brand}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium">{rp.brand}</p>
                    <h3 className="text-sm font-medium text-foreground">{rp.name}</h3>
                    <p className="text-sm text-muted-foreground">${rp.base_price.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {lightboxOpen && (
        <ImageLightbox
          images={allImages.map((url) => ({ url, alt_text: product.name }))}
          currentIndex={selectedImage}
          onClose={() => setLightboxOpen(false)}
          onPrev={() => setSelectedImage((selectedImage - 1 + allImages.length) % allImages.length)}
          onNext={() => setSelectedImage((selectedImage + 1) % allImages.length)}
        />
      )}
      <SizeGuideModal
        category={product.category}
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
      />
    </div>
  )
}
