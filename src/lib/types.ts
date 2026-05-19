// Shared types for Supabase query results

export interface ProductImage {
  id?: string
  product_id?: string
  url: string
  alt_text?: string
  display_order: number
  is_primary: boolean
  created_at?: string
}

export interface ProductVariant {
  id: string
  product_id?: string
  sku?: string
  size: string
  color: string
  color_hex?: string | null
  price?: number | null
  stock_quantity: number
  low_stock_threshold?: number
  is_default?: boolean
}

export interface ProductRecord {
  id: string
  name: string
  slug: string
  description?: string | null
  brand?: string | null
  category: string
  subcategory?: string | null
  base_price: number
  sale_price?: number | null
  currency?: string
  is_active: boolean
  is_featured: boolean
  tags?: string[] | null
  variants?: ProductVariant[]
  images?: ProductImage[]
  primary_image?: ProductImage[]
  primaryImage?: ProductImage | null
  created_at?: string
}

export function getPrimaryImage(images?: ProductImage[]): ProductImage | null {
  return images?.find((img) => img.is_primary) || images?.[0] || null
}
