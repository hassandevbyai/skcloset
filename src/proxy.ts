import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX = 60 // 60 requests per minute per IP

// Clean up stale entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now()
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetAt) rateLimitMap.delete(key)
    }
  }, 5 * 60 * 1000)
}

const ALLOWED_ORIGINS = [
  "https://skcloset.com",
  "https://www.skcloset.com",
  "http://localhost:3000",
  "http://localhost:3001",
]

function getCorsOrigin(request: NextRequest): string {
  const origin = request.headers.get("origin") || ""
  // In development, allow any origin
  if (process.env.NODE_ENV === "development") return origin || "*"
  // In production, restrict to allowed origins
  return ALLOWED_ORIGINS.includes(origin) ? origin : "https://skcloset.com"
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next()

  if (pathname.startsWith("/api/")) {
    const corsOrigin = getCorsOrigin(request)

    // Rate limiting check
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown"
    const now = Date.now()
    const record = rateLimitMap.get(ip)

    if (record && now < record.resetAt) {
      record.count++
      if (record.count > RATE_LIMIT_MAX) {
        return NextResponse.json(
          { success: false, error: "Too many requests. Please try again later." },
          {
            status: 429,
            headers: {
              "Retry-After": "60",
              "Access-Control-Allow-Origin": corsOrigin,
              "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
          }
        )
      }
    } else {
      rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
    }

    // CORS headers
    response.headers.set("Access-Control-Allow-Origin", corsOrigin)
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    )
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    )
    response.headers.set("X-RateLimit-Limit", String(RATE_LIMIT_MAX))
    response.headers.set(
      "X-RateLimit-Remaining",
      record ? String(Math.max(0, RATE_LIMIT_MAX - record.count)) : String(RATE_LIMIT_MAX)
    )

    // Handle OPTIONS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": corsOrigin,
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      })
    }

    return response
  }

  return response
}

export const config = {
  matcher: ["/api/:path*"],
}
