import { ImageResponse } from "@vercel/og"
import { getProductBySlug } from "@/lib/local-data"

export const runtime = "edge"

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) {
    return new Response("Not Found", { status: 404 })
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
          color: "#f5f5f5",
          fontFamily: "serif",
          padding: "60px 80px",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", fontSize: 24, letterSpacing: "0.3em", textTransform: "uppercase", color: "#c9a84c" }}>
          SKCLOSET
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 64, fontWeight: 700, marginBottom: 16 }}>{product.name}</div>
          <div style={{ fontSize: 28, color: "#a0a0a0", marginBottom: 8 }}>{product.brand}</div>
          <div style={{ fontSize: 36, color: "#c9a84c" }}>${product.base_price?.toFixed(2)}</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
