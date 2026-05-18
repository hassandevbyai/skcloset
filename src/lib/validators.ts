import { z } from "zod"

// Auth
export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  token: z.string().min(1),
})

// Profile
export const updateProfileSchema = z.object({
  firstName: z.string().max(50).optional(),
  lastName: z.string().max(50).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(20).optional(),
  address: z.string().max(255).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  zip: z.string().max(20).optional(),
})

// Address
export const addressSchema = z.object({
  label: z.string().max(50).optional(),
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  addressLine1: z.string().min(1, "Address is required").max(255),
  addressLine2: z.string().max(255).optional(),
  city: z.string().min(1, "City is required").max(100),
  state: z.string().max(100).optional(),
  postalCode: z.string().min(1, "Postal code is required").max(20),
  country: z.string().min(1, "Country is required").max(100),
  phone: z.string().max(20).optional(),
  isDefault: z.boolean().optional(),
})

// Cart
export const addToCartSchema = z.object({
  variantId: z.string().uuid("Invalid variant ID"),
  quantity: z.number().int().min(1).default(1),
})

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1),
})

// Checkout
export const createCheckoutSchema = z.object({
  items: z.array(
    z.object({
      variantId: z.string(),
      quantity: z.number().int().min(1),
      price: z.number().positive(),
      name: z.string().optional(),
      image: z.string().optional(),
    })
  ),
  shippingAddress: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    address: z.string().min(1),
    city: z.string().min(1),
    state: z.string().optional(),
    zip: z.string().min(1),
    phone: z.string().optional(),
  }),
  paymentMethod: z.enum(["cod", "stripe"], {
    errorMap: () => ({ message: "Payment method must be 'cod' or 'stripe'" }),
  }),
})

// Orders
export const createOrderSchema = z.object({
  items: z.array(
    z.object({
      variantId: z.string(),
      quantity: z.number().int().min(1),
      price: z.number().positive(),
      name: z.string().optional(),
    })
  ),
  shippingAddress: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    address: z.string().min(1),
    city: z.string().min(1),
    state: z.string().optional(),
    zip: z.string().min(1),
    phone: z.string().optional(),
  }),
  paymentMethod: z.enum(["cod", "stripe"]),
})

// Admin
export const createProductSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  description: z.string().optional(),
  brand: z.string().max(100).optional(),
  category: z.enum(["shirts", "jackets", "bottoms", "footwear", "accessories", "knitwear"]),
  subcategory: z.string().max(100).optional(),
  basePrice: z.number().positive("Price must be positive"),
  salePrice: z.number().positive().optional(),
  tags: z.array(z.string()).optional(),
  isActive: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
})

export const updateProductSchema = createProductSchema.partial().extend({
  id: z.string().uuid(),
})

export const updateOrderStatusSchema = z.object({
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled", "refunded"]),
  trackingNumber: z.string().optional(),
  trackingUrl: z.string().optional(),
})

export const updateInventorySchema = z.object({
  stockQuantity: z.number().int().min(0),
  lowStockThreshold: z.number().int().min(0).optional(),
})

// API response helper types
export type ApiResponse<T = unknown> = {
  success: boolean
  data?: T
  error?: string | { field: string; message: string }[]
  meta?: {
    page?: number
    limit?: number
    total?: number
  }
}

export function successResponse<T>(data: T, meta?: ApiResponse["meta"]): ApiResponse<T> {
  return { success: true, data, meta }
}

export function errorResponse(error: string, status?: number): ApiResponse & { status: number } {
  return { success: false, error, status: status || 400 }
}
