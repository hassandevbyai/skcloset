import type { LocalProduct } from "@/lib/local-data"

export default function ProductSchema({ product }: { product: Pick<LocalProduct, "name" | "description" | "brand" | "base_price" | "is_active" | "images" | "variants"> }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: { "@type": "Brand", name: product.brand },
    offers: {
      "@type": "Offer",
      price: product.base_price,
      priceCurrency: "USD",
      availability: product.is_active ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    image: product.images?.[0],
    sku: product.variants?.[0]?.sku,
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}
