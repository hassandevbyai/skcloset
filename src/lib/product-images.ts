export const localProductImages: Record<string, string[]> = {
  "oxford-button-down-shirt": ["/images/products/oxford-shirt.jpg"],
  "nuptse-puffer-jacket": ["/images/products/puffer-jacket.jpg"],
  "air-jordan-4-retro": ["/images/products/jordan-4.jpg"],
  "wide-leg-pleated-pants": ["/images/products/pleated-pants.jpg"],
  "arizona-sandals": ["/images/products/sandals.jpg"],
  "cable-knit-sweater": ["/images/products/cable-knit.jpg"],
  "denim-jacket": ["/images/products/denim-jacket.jpg"],
  "supreme-x-nike-sb-dunk": ["/images/products/sb-dunk.jpg"],
  "polo-short-sleeve": ["/images/products/denim-shirt.jpg"],
  "timberland-6-inch-boot": ["/images/products/brown-shoes.jpg"],
  "oversized-graphic-tee": ["/images/products/sneakers.jpg"],
  "fleece-hoodie-jacket": ["/images/products/fleece-hoodie.jpg"],
  "linen-summer-trousers": ["/images/products/linen-trousers.jpg"],
  "adidas-samba": ["/images/products/adidas-samba.jpg"],
  "bomber-jacket": ["/images/products/bomber-jacket.jpg"],
  "baggy-jeans": ["/images/products/baggy-jeans.jpg"],
}

export function getProductImages(slug: string): string[] {
  return localProductImages[slug] || []
}

export function getPrimaryImage(slug: string): string {
  const images = localProductImages[slug]
  return images?.[0] || ""
}
