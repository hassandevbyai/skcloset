export interface ProductVariant {
  size: string
  color: string
  stock_quantity: number
  sku: string
}

export interface Product {
  slug: string
  name: string
  brand: string
  description: string
  base_price: number
  category: string
  is_active: boolean
  variants: ProductVariant[]
  images?: string[]
  createdAt: string
}

const STORAGE_KEY = "skcloset_products"

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    + "-" + Date.now().toString(36)
}

function readProducts(): Product[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeProducts(products: Product[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
  }
}

interface LegacyVariant {
  size?: string
  color?: string
  stock_quantity?: number
  sku?: string
  id?: number | string
}

interface LegacyProductInput {
  slug?: string
  name?: string
  brand?: string
  description?: string
  base_price?: number
  price?: number
  category?: string
  is_active?: boolean
  variants?: LegacyVariant[]
}

// Initialize with default products if empty
export function initProducts(defaultProducts: LegacyProductInput[]): void {
  const existing = readProducts()
  if (existing.length === 0) {
    // Map incoming data to Product format
    const mapped: Product[] = defaultProducts.map((p: LegacyProductInput) => ({
      slug: p.slug || p.name?.toLowerCase().replace(/\s+/g, '-') || "",
      name: p.name || "",
      brand: p.brand || "",
      description: p.description || "",
      base_price: p.base_price || p.price || 0,
      category: p.category || "shirts",
      is_active: p.is_active !== undefined ? p.is_active : true,
      variants: (p.variants || []).map((v: LegacyVariant) => ({
        size: v.size || "M",
        color: v.color || "Black",
        stock_quantity: v.stock_quantity || 0,
        sku: v.sku || v.id?.toString() || "",
      })),
      images: [],
      createdAt: new Date().toISOString(),
    }))
    writeProducts(mapped)
  }
}

export function getProducts(): Product[] {
  return readProducts()
}

export function getProductBySlug(slug: string): Product | undefined {
  return readProducts().find((p) => p.slug === slug)
}

export function addProduct(product: Omit<Product, "slug" | "createdAt"> & { images?: string[] }): Product {
  const products = readProducts()
  const newProduct: Product = {
    ...product,
    images: product.images || [],
    slug: generateSlug(product.name),
    createdAt: new Date().toISOString(),
  }
  products.push(newProduct)
  writeProducts(products)
  return newProduct
}

export function updateProduct(slug: string, updates: Partial<Product>): Product | undefined {
  const products = readProducts()
  const idx = products.findIndex((p) => p.slug === slug)
  if (idx === -1) return undefined
  products[idx] = { ...products[idx], ...updates }
  writeProducts(products)
  return products[idx]
}

export function deleteProduct(slug: string): boolean {
  const products = readProducts()
  const idx = products.findIndex((p) => p.slug === slug)
  if (idx === -1) return false
  products.splice(idx, 1)
  writeProducts(products)
  return true
}

export function toggleProductStatus(slug: string): Product | undefined {
  const products = readProducts()
  const idx = products.findIndex((p) => p.slug === slug)
  if (idx === -1) return undefined
  products[idx].is_active = !products[idx].is_active
  writeProducts(products)
  return products[idx]
}

export function getLowStockProducts(threshold: number = 10): Product[] {
  return readProducts().filter((p) => {
    const totalStock = p.variants.reduce((s, v) => s + v.stock_quantity, 0)
    return totalStock <= threshold
  })
}

export function updateVariantStock(
  productSlug: string,
  color: string,
  size: string,
  newStock: number
): { product: Product | undefined; previousStock: number } {
  const products = readProducts()
  const pIdx = products.findIndex((p) => p.slug === productSlug)
  if (pIdx === -1) return { product: undefined, previousStock: 0 }

  const variant = products[pIdx].variants.find((v) => v.color === color && v.size === size)
  if (!variant) return { product: undefined, previousStock: 0 }

  const previousStock = variant.stock_quantity
  variant.stock_quantity = Math.max(0, newStock)
  writeProducts(products)
  return { product: products[pIdx], previousStock }
}

export function getActiveProducts(): Product[] {
  return readProducts().filter((p) => p.is_active)
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase()
  return readProducts().filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
  )
}