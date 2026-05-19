"use client"

import { useState, useEffect, Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { FilterIcon, HeartIcon, XIcon, CheckIcon } from "@/components/layout/Icons"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { addToCart } from "@/lib/cart-store"
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

const brands = ["Polo Ralph Lauren", "Nike", "Supreme", "Jordan", "The North Face", "Birkenstock", "Adidas", "Timberland", "Hugo Boss", "Represent", "Cole Buxton", "Zara", "Levi's"]

const sizes = ["XS", "S", "M", "L", "XL", "XXL"]

const sortOptions = ["Newest", "Price: Low to High", "Price: High to Low", "Name: A-Z"]

const colorHexMap: Record<string, string> = {
  "White": "#FFFFFF",
  "Light Blue": "#ADD8E6",
  "Pink": "#FFC0CB",
  "Black": "#000000",
  "Grey": "#808080",
  "Navy": "#1B2A4A",
  "Cream": "#FFFDD0",
  "Tan": "#D2B48C",
  "Brown": "#8B4513",
  "Beige": "#F5F5DC",
  "Khaki": "#C3B091",
  "Red": "#CC0000",
  "Green": "#2E8B57",
  "Dark Wash": "#2F4F4F",
  "Light Wash": "#A0C4E8",
  "Olive": "#556B2F",
  "Multi": "#FF4500",
  "Military Blue": "#4A6FA5",
  "Wheat": "#D4A06A",
  "White/Navy": "#F5F5F5",
  "White/Blue": "#F0F0F0",
}

function getColorHex(name: string): string {
  return colorHexMap[name] || "#CCCCCC"
}

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
      className="absolute top-3 right-3 p-1.5 opacity-70 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <HeartIcon className={`w-4 h-4 ${wishlisted ? "text-accent fill-accent" : "text-foreground"}`} />
    </button>
  )
}

function QuickAddSection({ product, productSlug }: { product: typeof allProducts[number]; productSlug: string }) {
  const [selectedSize, setSelectedSize] = useState(product.size[0] || "M")
  const [adding, setAdding] = useState(false)

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setAdding(true)
    const priceNum = parseInt(product.price.replace("$", ""))
    addToCart({
      slug: productSlug,
      name: product.name,
      brand: product.brand,
      price: priceNum,
      image: product.image,
      size: selectedSize,
      color: product.colors[0] || "Default",
      quantity: 1,
    })
    showToast(`Added ${product.name} to cart`, "success")
    setTimeout(() => setAdding(false), 800)
  }

  function handleSizeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    e.preventDefault()
    e.stopPropagation()
    setSelectedSize(e.target.value)
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-8 pb-3 px-3 translate-y-full group-hover:translate-y-0 sm:translate-y-0 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300">
      <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
        <select
          value={selectedSize}
          onChange={handleSizeChange}
          onClick={(e) => e.stopPropagation()}
          className="flex-1 min-w-0 px-2 py-1.5 text-[10px] bg-black/80 text-white border border-white/20 rounded-none focus:outline-none appearance-none cursor-pointer"
        >
          {product.size.map((s) => (
            <option key={s} value={s} className="bg-black text-white">{s}</option>
          ))}
        </select>
        <button
          onClick={handleAdd}
          disabled={adding}
          className="flex-1 min-w-0 bg-accent text-accent-foreground text-[10px] tracking-[0.15em] uppercase font-medium py-1.5 px-2 hover:bg-accent/90 transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {adding ? "Added" : "Add to Cart"}
        </button>
      </div>
    </div>
  )
}

function ShopPageContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [activeCategory, setActiveCategory] = useState("all")
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [priceMin, setPriceMin] = useState("")
  const [priceMax, setPriceMax] = useState("")
  const [sortBy, setSortBy] = useState("Newest")
  const [mobileFilters, setMobileFilters] = useState(false)

  useEffect(() => {
    const category = searchParams.get("category")
    if (category && categories.some((c) => c.slug === category)) setActiveCategory(category)
    const brandParam = searchParams.get("brand")
    if (brandParam) setSelectedBrands(brandParam.split(","))
    const sizeParam = searchParams.get("size")
    if (sizeParam) setSelectedSizes(sizeParam.split(","))
    const colorParam = searchParams.get("color")
    if (colorParam) setSelectedColors(colorParam.split(","))
    const min = searchParams.get("min")
    if (min) setPriceMin(min)
    const max = searchParams.get("max")
    if (max) setPriceMax(max)
    const sort = searchParams.get("sort")
    if (sort && sortOptions.includes(sort)) setSortBy(sort)
  }, [])

  function syncUrl(params: Record<string, string | null>) {
    const sp = new URLSearchParams(searchParams.toString())
    Object.entries(params).forEach(([key, val]) => {
      if (val) sp.set(key, val)
      else sp.delete(key)
    })
    router.replace(`${pathname}?${sp.toString()}`, { scroll: false })
  }

  function toggleBrand(brand: string) {
    const next = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand]
    setSelectedBrands(next)
    syncUrl({ brand: next.length ? next.join(",") : null })
  }

  function toggleSize(size: string) {
    const next = selectedSizes.includes(size)
      ? selectedSizes.filter((s) => s !== size)
      : [...selectedSizes, size]
    setSelectedSizes(next)
    syncUrl({ size: next.length ? next.join(",") : null })
  }

  function toggleColor(color: string) {
    const next = selectedColors.includes(color)
      ? selectedColors.filter((c) => c !== color)
      : [...selectedColors, color]
    setSelectedColors(next)
    syncUrl({ color: next.length ? next.join(",") : null })
  }

  function handleCategory(cat: string) {
    setActiveCategory(cat)
    syncUrl({ category: cat !== "all" ? cat : null })
  }

  function handleSort(val: string) {
    setSortBy(val)
    syncUrl({ sort: val !== "Newest" ? val : null })
  }

  function handlePriceChange() {
    syncUrl({
      min: priceMin || null,
      max: priceMax || null,
    })
  }

  // Collect all unique brands, sizes, colors from filtered products
  const filteredForBrands = activeCategory === "all"
    ? allProducts
    : allProducts.filter((p) => p.category === activeCategory)

  const availableBrands = [...new Set(filteredForBrands.map((p) => p.brand))]
  const availableSizes = [...new Set(filteredForBrands.flatMap((p) => p.size))]
  const footwearSizes = ["7", "8", "9", "10", "11", "12", "13"]
  const availableColors = [...new Set(filteredForBrands.flatMap((p) => p.colors))]

  const filtered = allProducts.filter((p) => {
    if (activeCategory !== "all" && p.category !== activeCategory) return false
    if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) return false
    if (selectedSizes.length > 0 && !p.size.some((s) => selectedSizes.includes(s))) return false
    if (selectedColors.length > 0 && !p.colors.some((c) => selectedColors.includes(c))) return false
    if (priceMin) {
      const pNum = parseInt(p.price.replace("$", ""))
      if (pNum < parseInt(priceMin)) return false
    }
    if (priceMax) {
      const pNum = parseInt(p.price.replace("$", ""))
      if (pNum > parseInt(priceMax)) return false
    }
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "Price: Low to High") return parseInt(a.price.replace("$", "")) - parseInt(b.price.replace("$", ""))
    if (sortBy === "Price: High to Low") return parseInt(b.price.replace("$", "")) - parseInt(a.price.replace("$", ""))
    if (sortBy === "Name: A-Z") return a.name.localeCompare(b.name)
    return 0
  })

  function clearAll() {
    setActiveCategory("all")
    setSelectedBrands([])
    setSelectedSizes([])
    setSelectedColors([])
    setPriceMin("")
    setPriceMax("")
    setSortBy("Newest")
    router.replace(pathname, { scroll: false })
  }

  const hasActiveFilters = activeCategory !== "all" || selectedBrands.length > 0 || selectedSizes.length > 0 || selectedColors.length > 0 || priceMin !== "" || priceMax !== ""

  const displaySizes = activeCategory === "footwear" ? footwearSizes : sizes

  return (
    <div className="min-h-screen">
      <div className="border-b border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <p className="text-xs tracking-[0.3em] uppercase text-accent font-medium mb-2">Collections</p>
          <h1 className="font-serif text-3xl md:text-5xl text-foreground">Shop All</h1>
          <p className="text-sm text-muted-foreground mt-2">{filtered.length} products</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => handleCategory(cat.slug)}
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
          <aside className="hidden lg:block w-64 shrink-0">
            {/* Brands */}
            <div className="mb-8">
              <h4 className="text-xs tracking-[0.15em] uppercase font-medium text-foreground mb-4">Brand</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {availableBrands.map((brand) => (
                  <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="sr-only"
                    />
                    <span className={`w-4 h-4 border flex items-center justify-center transition-colors ${
                      selectedBrands.includes(brand) ? "bg-accent border-accent" : "border-border group-hover:border-foreground"
                    }`}>
                      {selectedBrands.includes(brand) && <CheckIcon className="w-3 h-3 text-accent-foreground" />}
                    </span>
                    <span className={`text-sm transition-colors ${selectedBrands.includes(brand) ? "text-foreground font-medium" : "text-muted-foreground group-hover:text-foreground"}`}>
                      {brand}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Colors */}
            {availableColors.length > 0 && (
              <div className="mb-8">
                <h4 className="text-xs tracking-[0.15em] uppercase font-medium text-foreground mb-4">Color</h4>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((color) => {
                    const hex = getColorHex(color)
                    const isSelected = selectedColors.includes(color)
                    return (
                      <button
                        key={color}
                        onClick={() => toggleColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          isSelected ? "border-foreground scale-110" : "border-border hover:border-muted-foreground"
                        }`}
                        style={{ backgroundColor: hex }}
                        title={color}
                        aria-label={`Filter by ${color}`}
                      />
                    )
                  })}
                </div>
                {selectedColors.length > 0 && (
                  <p className="text-[10px] text-muted-foreground mt-2">{selectedColors.length} selected</p>
                )}
              </div>
            )}

            {/* Sizes */}
            <div className="mb-8">
              <h4 className="text-xs tracking-[0.15em] uppercase font-medium text-foreground mb-4">Size</h4>
              <div className="flex flex-wrap gap-2">
                {displaySizes.map((size) => {
                  const isSelected = selectedSizes.includes(size)
                  return (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`px-3 py-1.5 text-xs border transition-colors ${
                        isSelected ? "border-foreground bg-foreground text-background font-medium" : "border-border text-muted-foreground hover:border-foreground"
                      }`}
                    >
                      {size}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Price range */}
            <div className="mb-8">
              <h4 className="text-xs tracking-[0.15em] uppercase font-medium text-foreground mb-4">Price Range</h4>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  onBlur={handlePriceChange}
                  className="w-full px-2 py-1.5 bg-transparent border border-border text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent"
                />
                <span className="text-muted-foreground text-xs">—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  onBlur={handlePriceChange}
                  className="w-full px-2 py-1.5 bg-transparent border border-border text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearAll}
                className="w-full py-2.5 text-xs tracking-[0.2em] uppercase border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </aside>

          <button
            onClick={() => setMobileFilters(true)}
            className="lg:hidden fixed bottom-6 right-6 z-40 bg-primary text-primary-foreground p-4 shadow-lg"
            aria-label="Filters"
          >
            <FilterIcon className="w-5 h-5" />
          </button>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-border">
              <p className="text-sm text-muted-foreground">{filtered.length} products</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground hidden sm:inline">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => handleSort(e.target.value)}
                  className="text-xs bg-transparent border border-border px-3 py-1.5 text-foreground focus:outline-none focus:border-accent"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground">No products found matching your filters.</p>
                <button onClick={clearAll} className="mt-4 text-xs tracking-[0.2em] uppercase text-accent hover:text-accent/80 transition-colors">
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {sorted.map((product) => {
                  const slug = product.name.toLowerCase().replace(/\s+/g, "-")
                  return (
                    <Link
                      key={`${product.brand}-${product.name}`}
                      href={`/product/${slug}`}
                      className="group block"
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
                        <ShopWishlistButton slug={slug} />
                        <QuickAddSection product={product} productSlug={slug} />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium">{product.brand}</p>
                        <h3 className="text-sm font-medium text-foreground">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.price}</p>
                        <p className="text-[10px] text-muted-foreground/60">{product.colors.join(", ")}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {mobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFilters(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-background p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm tracking-[0.15em] uppercase font-medium">Filters</h3>
              <button onClick={() => setMobileFilters(false)} className="text-muted-foreground hover:text-foreground">
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <h4 className="text-xs tracking-[0.15em] uppercase font-medium text-foreground mb-3">Category</h4>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => { setActiveCategory(cat.slug); syncUrl({ category: cat.slug !== "all" ? cat.slug : null }); setMobileFilters(false) }}
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
                {availableBrands.map((brand) => (
                  <label key={brand} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="sr-only"
                    />
                    <span className={`w-4 h-4 border flex items-center justify-center ${
                      selectedBrands.includes(brand) ? "bg-accent border-accent" : "border-border"
                    }`}>
                      {selectedBrands.includes(brand) && <CheckIcon className="w-3 h-3 text-accent-foreground" />}
                    </span>
                    <span className={`text-sm ${selectedBrands.includes(brand) ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                      {brand}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {availableColors.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs tracking-[0.15em] uppercase font-medium text-foreground mb-3">Color</h4>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => toggleColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColors.includes(color) ? "border-foreground scale-110" : "border-border"
                      }`}
                      style={{ backgroundColor: getColorHex(color) }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <h4 className="text-xs tracking-[0.15em] uppercase font-medium text-foreground mb-3">Size</h4>
              <div className="flex flex-wrap gap-2">
                {displaySizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`px-3 py-1.5 text-xs border transition-colors ${
                      selectedSizes.includes(size) ? "border-foreground bg-foreground text-background font-medium" : "border-border text-muted-foreground hover:border-foreground"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-xs tracking-[0.15em] uppercase font-medium text-foreground mb-3">Price</h4>
              <div className="flex items-center gap-2">
                <input type="number" placeholder="Min" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} onBlur={handlePriceChange} className="w-full px-2 py-1.5 bg-transparent border border-border text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent" />
                <span className="text-muted-foreground">—</span>
                <input type="number" placeholder="Max" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} onBlur={handlePriceChange} className="w-full px-2 py-1.5 bg-transparent border border-border text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent" />
              </div>
            </div>

            <button
              onClick={() => { clearAll(); setMobileFilters(false) }}
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