import type { Metadata } from "next"
import { getProductBySlug } from "@/lib/local-data"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) return { title: "Product Not Found" }

  return {
    title: product.name,
    description: product.description?.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description?.slice(0, 160),
      images: product.images?.length ? [{ url: product.images[0].url, width: 1200, height: 630 }] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description?.slice(0, 160),
      images: product.images?.length ? [product.images[0].url] : [],
    },
    alternates: {
      canonical: `https://skcloset.vercel.app/product/${slug}`,
    },
  }
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
