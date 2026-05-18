"use client"

import { useState, useEffect, Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, FilterIcon, HeartIcon } from "@/components/layout/Icons"
import { useSearchParams } from "next/navigation"
import { isInWishlist, toggleWishlist } from "@/lib/wishlist-store"
import { showToast } from "@/lib/toast-store"

const categories = [
  { slug: "all", label: "All" },
  { slug: "shirts", label: "Shirts & Tops" },
  { slug: "jackets", label: "Jackets & Outerwear" },
  { slug: "bottoms", label: "Bottoms" },
  { slug: "footwear", label: "Footwear" },
  { slug: "accessories", label: "Accessories" },
  { slug: "knitwear", label: "Knitwear & Sweaters" },
]

const brands = ["Polo Ralph Lauren", "Nike", "Supreme", "Jordan", "The North Face", "Birkenstock", "Adidas", "Timberland", "Hugo Boss", "Represent", "Cole Buxton", "Zara"]

const sizes = ["XS", "S", "M", "L", "XL", "XXL"]

const sortOptions = ["Newest", "Price: Low to High", "Price: High to Low", "Best Selling"]

const allProducts = [
  { name: "Oxford Button-Down Shirt", brand: "Polo Ralph Lauren", price: "$165", category: "shirts", size: ["S", "M", "L", "XL"], colors: ["White", "Light Blue", "Pink"], image: "/images/products/oxford-shirt.jpg" },
  { name: "Nuptse Puffer Jacket", brand: "The North Face", price: "$295", category: "jackets", size: ["M", "L", "XL"], colors: ["Black", "Grey"], image: "/images/products/puffer-jacket.jpg" },
  { name: "Air Jordan 4 Retro", brand: "Jordan", price: "$225", category: "footwear", size: ["7", "8", "9", "10", "11"], colors: ["White/Navy", "Military Blue"], image: "/images/products/jordan-4.jpg" },
  { name: "Wide-Leg Pleated Pants", brand: "Zara", price: "$89", category: "bottoms", size: ["S", "M", "L", "XL"], colors: ["Beige", "Grey", "Black"], image: "/images/products/pleated-pants.jpg" },
  { name: "Arizona Sandals", brand: "Birkenstock", price: "$135", category: "footwear", size: ["7", "8", "9", "10", "11"], colors: ["Tan", "Brown", "Black"], image: "/images/products/sandals.jpg" },
  { name: "Cable Knit Sweater", brand: "Polo Ralph Lauren", price: "$198", category: "knitwear", size: ["S", "M", "L", "XL"], colors: ["Navy", "Grey", "Cream"], image: "/images/products/cable-knit.jpg" },
  { name: "Denim Jacket", brand: "Levi's", price: "$148", category: "jackets", size: ["M", "L", "XL"], colors: ["Dark Wash", "Black"], image: "/images/products/denim-jacket.jpg" },
  { name: "Supreme x Nike SB Dunk", brand: "Supreme", price: "$350", category: "footwear", size: ["8", "9", "10", "11"], colors: ["Multi"], image: "/images/products/sb-dunk.jpg" },
  { name: "Polo Short Sleeve", brand: "Polo Ralph Lauren", price: "$98", category: "shirts", size: ["S", "M", "L", "XL", "XXL"], colors: ["Navy", "White", "Red", "Green", "Pink"], image: "/images/products/denim-shirt.jpg" },
  { name: "Timberland 6-Inch Boot", brand: "Timberland", price: "$210", category: "footwear", size: ["8", "9", "10", "11", "12"], colors: ["Wheat", "Olive"], image: "/images/products/brown-shoes.jpg" },
  { name: "Oversized Graphic Tee", brand: "Nike", price: "$55", category: "shirts", size: ["S", "M", "L", "XL"], colors: ["White", "Brown", "Black"], image: "/images/products/sneakers.jpg" },
  { name: "Fleece Hoodie Jacket", brand: "Polo Ralph Lauren", price: "$175", category: "jackets", size: ["M", "L", "XL"], colors: ["Navy", "Grey"], image: "/images/products/fleece-hoodie.jpg" },
  { name: "Linen Summer Trousers", brand: "Zara", price: "$79", category: "bottoms", size: ["S", "M", "L", "XL"], colors: ["Khaki", "White", "Beige"], image: "/images/products/linen-trousers.jpg" },
  { name: "Adidas Samba", brand: "Adidas", price: "$120", category: "footwear", size: ["7", "8", "9", "10", "11"], colors: ["White/Blue"], image: "/images/products/adidas-samba.jpg" },
  { name: "Bomber Jacket", brand: "Represent", price: "$245", category: "jackets", size: ["M", "L", "XL"], colors: ["Black", "Olive"], image: "/images/products/bomber-jacket.jpg" },
  { name: "Baggy Jeans", brand: "Zara", price: "$69", category: "bottoms", size: ["S", "M", "L", "XL"], colors: ["Light Wash", "Dark Wash"], image: "/images/products/baggy-jeans.jpg" },
]

function ShopWishlistButton({ slug }: { slug: string }) {
  const [wishlisted, setWishlisted] = useState(false)

  useEffect(() => {
    setWishlisted(isInWishlist(slug))
  }, [slug])

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(slug)
    const now = !wishlisted
    setWishlisted(now)
    showToast(now ? "Added to wishlist" : "Removed from wishlist", "info")
  }

  return (
    <button
      onClick={handleClick}
      className="absolute top-3 right-3 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <HeartIcon className={`w-4 h-4 ${wishlisted ? "text-accent fill-accent" : "text-foreground"}`} />
    </button>
  )
}

function ShopPageContent() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [activeBrand, setActiveBrand] = useState<string | null>(null)
  const [activeSize, setActiveSize] = useState<string | null>(null)
  const [mobileFilters, setMobileFilters] = useState(false)
  const [sortBy, setSortBy] = useState("Newest")
  const searchParams = useSearchParams()

  useEffect(() => {
    const categoryParam = searchParams.get('category')
    if (categoryParam) {
      const validCategories = ['shirts', 'jackets', 'bottoms', 'footwear', 'accessories', 'knitwear']
      if (validCategories.includes(categoryParam)) {
        setActiveCategory(categoryParam)
      }
    }
  }, [searchParams])

  const filtered = allProducts.filter((p) => {
    if (activeCategory !== "all" && p.category !== activeCategory) return false
    if (activeBrand && p.brand !== activeBrand) return false
    if (activeSize && !p.size.includes(activeSize)) return false
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "Price: Low to High") {
      return parseInt(a.price.replace('$', '')) - parseInt(b.price.replace('$', ''))
    }
    if (sortBy === "Price: High to Low") {
      return parseInt(b.price.replace('$', '')) - parseInt(a.price.replace('$', ''))
    }
    return 0
  })

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="border-b border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <p className="text-xs tracking-[0.3em] uppercase text-accent font-medium mb-2">Collections</p>
          <h1 className="font-serif text-3xl md:text-5xl text-foreground">Shop All</h1>
          <p className="text-sm text-muted-foreground mt-2">{filtered.length} products</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={`px-4 py-2 text-xs tracking-[0.15em] uppercase transition-colors ${
                activeCategory === cat.slug
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            {/* Brands */}
            <div className="mb-8">
              <h4 className="text-xs tracking-[0.15em] uppercase font-medium text-foreground mb-4">Brand</h4>
              <div className="space-y-2">
                <button
                  onClick={() => setActiveBrand(null)}
                  className={`block text-sm transition-colors ${!activeBrand ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}
                >
                  All Brands
                </button>
                {brands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => setActiveBrand(brand)}
                    className={`block text-sm transition-colors ${activeBrand === brand ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-8">
              <h4 className="text-xs tracking-[0.15em] uppercase font-medium text-foreground mb-4">Size</h4>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveSize(null)}
                  className={`px-3 py-1.5 text-xs border transition-colors ${!activeSize ? "border-foreground text-foreground" : "border-border text-muted-foreground hover:border-foreground"}`}
                >
                  All
                </button>
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setActiveSize(size)}
                    className={`px-3 py-1.5 text-xs border transition-colors ${activeSize === size ? "border-foreground text-foreground" : "border-border text-muted-foreground hover:border-foreground"}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Mobile filter button */}
          <button
            onClick={() => setMobileFilters(true)}
            className="lg:hidden fixed bottom-6 right-6 z-40 bg-primary text-primary-foreground p-4 shadow-lg"
            aria-label="Filters"
          >
            <FilterIcon className="w-5 h-5" />
          </button>

          {/* Product grid */}
          <div className="flex-1">
            {/* Sort bar */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-border">
              <p className="text-sm text-muted-foreground">{filtered.length} products</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground hidden sm:inline">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs bg-transparent border border-border px-3 py-1.5 text-foreground focus:outline-none focus:border-accent"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products */}
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground">No products found matching your filters.</p>
                <button
                  onClick={() => { setActiveCategory("all"); setActiveBrand(null); setActiveSize(null) }}
                  className="mt-4 text-xs tracking-[0.2em] uppercase text-accent hover:text-accent/80 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {sorted.map((product) => (
                  <Link
                    key={`${product.brand}-${product.name}`}
                    href={`/product/${product.name.toLowerCase().replace(/\s+/g, "-")}`}
                    className="group"
                  >
                    <div className="aspect-[3/4] bg-secondary overflow-hidden relative mb-3">
                      <Image
                        src={product.image}
                        alt={`${product.brand} - ${product.name}`}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                      <ShopWishlistButton slug={product.name.toLowerCase().replace(/\s+/g, "-")} />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium">{product.brand}</p>
                      <h3 className="text-sm font-medium text-foreground">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.price}</p>
                      <p className="text-[10px] text-muted-foreground/60">{product.colors.join(", ")}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFilters(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-background p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm tracking-[0.15em] uppercase font-medium">Filters</h3>
              <button onClick={() => setMobileFilters(false)} className="text-muted-foreground hover:text-foreground">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-6">
              <h4 className="text-xs tracking-[0.15em] uppercase font-medium text-foreground mb-3">Category</h4>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => { setActiveCategory(cat.slug); setMobileFilters(false) }}
                    className={`block text-sm transition-colors ${activeCategory === cat.slug ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-xs tracking-[0.15em] uppercase font-medium text-foreground mb-3">Brand</h4>
              <div className="space-y-2">
                {brands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => { setActiveBrand(brand); setMobileFilters(false) }}
                    className={`block text-sm transition-colors ${activeBrand === brand ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-xs tracking-[0.15em] uppercase font-medium text-foreground mb-3">Size</h4>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => { setActiveSize(size); setMobileFilters(false) }}
                    className={`px-3 py-1.5 text-xs border transition-colors ${activeSize === size ? "border-foreground text-foreground" : "border-border text-muted-foreground hover:border-foreground"}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => { setActiveCategory("all"); setActiveBrand(null); setActiveSize(null); setMobileFilters(false) }}
              className="w-full py-3 text-xs tracking-[0.2em] uppercase border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ShopPageContent />
    </Suspense>
  )
}
