import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "./supabase-server"
import type { ApiResponse } from "./validators"
import { generateSlug, generateOrderNumber, corsHeaders } from "./helpers"

// --- Response helpers ---

export function ok<T>(data: T, meta?: ApiResponse["meta"]) {
  return NextResponse.json({ success: true, data, meta })
}

export function created<T>(data: T) {
  return NextResponse.json({ success: true, data }, { status: 201 })
}

export function badRequest(error: string) {
  return NextResponse.json({ success: false, error }, { status: 400 })
}

export function unauthorized(error = "Unauthorized") {
  return NextResponse.json({ success: false, error }, { status: 401 })
}

export function forbidden(error = "Forbidden") {
  return NextResponse.json({ success: false, error }, { status: 403 })
}

export function notFound(error = "Not found") {
  return NextResponse.json({ success: false, error }, { status: 404 })
}

export function conflict(error = "Conflict") {
  return NextResponse.json({ success: false, error }, { status: 409 })
}

export function serverError(error?: unknown) {
  console.error("Internal server error:", error)
  return NextResponse.json(
    { success: false, error: "Internal server error" },
    { status: 500 }
  )
}

// --- Auth helpers ---

export async function getAuthenticatedUser() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function requireAdmin() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") return null
  return user
}

// --- Pagination ---

export function getPagination(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10))
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("limit") || "20", 10))
  )
  const offset = (page - 1) * limit
  return { page, limit, offset }
}

// --- Slug generation ---

export { generateSlug }

// --- Order number generation ---

export { generateOrderNumber }

// --- CORS headers for webhooks ---

export { corsHeaders }
