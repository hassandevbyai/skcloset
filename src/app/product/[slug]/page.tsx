"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ChevronLeft, ChevronRight, HeartIcon } from "@/components/layout/Icons"
import { isInWishlist, toggleWishlist } from "@/lib/wishlist-store"
import { addToCart } from "@/lib/cart-store"
import { getProductImages } from "@/lib/product-images"
import { ImageLightbox } from "@/components/product/ImageLightbox"
import { showToast } from "@/lib/toast-store"
import ProductSchema from "@/components/product/ProductSchema"
import Breadcrumbs from "@/components/ui/Breadcrumbs"
import { ReviewForm } from "@/components/product/ReviewForm"
import { ReviewList } from "@/components/product/ReviewList"

interface ProductColor {
  name: string
  hex: string
}

interface ProductData {
  id: string
  name: string
  brand: string
  base_price: number
  description: string
  category: string
  variants: {
    id: string
    size: string
    color: string
    color_hex: string | null
    stock_quantity: number
    price: number | null
  }[]
  details: string[]
  features: string[]
  images: { url: string; alt_text: string; display_order: number }[]
  relatedProducts: {
    name: string
    brand: string
    base_price: number
    slug: string
  }[]
}

function v(slug: string, i: number, color: string, hex: string, size: string, stock = 10) {
  return { id: `${slug}-${i}`, size, color, color_hex: hex, stock_quantity: stock, price: null }
}

const localProducts: Record<string, ProductData> = {
  "oxford-button-down-shirt": {
    id: "oxford-button-down-shirt",
    name: "Oxford Button-Down Shirt",
    brand: "Polo Ralph Lauren",
    base_price: 165,
    description: "A timeless Oxford cloth button-down crafted from premium cotton. Features a classic button-down collar, chest pocket, and box pleat with locker loop.",
    category: "shirts",
    variants: [
      v("oxford-button-down-shirt", 0, "White", "#F5F5F0", "S"),
      v("oxford-button-down-shirt", 1, "White", "#F5F5F0", "M"),
      v("oxford-button-down-shirt", 2, "White", "#F5F5F0", "L"),
      v("oxford-button-down-shirt", 3, "White", "#F5F5F0", "XL"),
      v("oxford-button-down-shirt", 4, "Light Blue", "#B8C4D0", "S"),
      v("oxford-button-down-shirt", 5, "Light Blue", "#B8C4D0", "M"),
      v("oxford-button-down-shirt", 6, "Light Blue", "#B8C4D0", "L"),
      v("oxford-button-down-shirt", 7, "Light Blue", "#B8C4D0", "XL"),
      v("oxford-button-down-shirt", 8, "Pink", "#E8C4C8", "S"),
      v("oxford-button-down-shirt", 9, "Pink", "#E8C4C8", "M"),
      v("oxford-button-down-shirt", 10, "Pink", "#E8C4C8", "L"),
      v("oxford-button-down-shirt", 11, "Pink", "#E8C4C8", "XL"),
    ],
    details: ["100% premium cotton oxford cloth", "Button-down collar", "Chest pocket with signature embroidered Pony", "Box pleat with locker loop", "Machine washable"],
    features: ["Regular fit — true to size", "Model is 6'1\" wearing size M", "Length: 30\" (size M)"],
    images: [{ url: "/images/products/oxford-shirt.jpg", alt_text: "Oxford Button-Down Shirt", display_order: 0 }],
    relatedProducts: [],
  },
  "nuptse-puffer-jacket": {
    id: "nuptse-puffer-jacket",
    name: "Nuptse Puffer Jacket",
    brand: "The North Face",
    base_price: 295,
    description: "The iconic Nuptse jacket with 700-fill goose down for exceptional warmth. Packable design with stitched-through baffles.",
    category: "jackets",
    variants: [
      v("nuptse-puffer-jacket", 0, "Black", "#1A1A1A", "M"),
      v("nuptse-puffer-jacket", 1, "Black", "#1A1A1A", "L"),
      v("nuptse-puffer-jacket", 2, "Black", "#1A1A1A", "XL"),
      v("nuptse-puffer-jacket", 3, "Grey", "#8C8C8C", "M"),
      v("nuptse-puffer-jacket", 4, "Grey", "#8C8C8C", "L"),
      v("nuptse-puffer-jacket", 5, "Grey", "#8C8C8C", "XL"),
    ],
    details: ["700-fill goose down", "Ripstop nylon shell with DWR finish", "Stowable hood packs into collar", "Zip hand pockets", "Elasticized cuffs and hem"],
    features: ["Relaxed fit — size down for trim look", "Model is 6'1\" wearing size M", "Length: 27\" (size M)"],
    images: [{ url: "/images/products/puffer-jacket.jpg", alt_text: "Nuptse Puffer Jacket", display_order: 0 }],
    relatedProducts: [],
  },
  "air-jordan-4-retro": {
    id: "air-jordan-4-retro",
    name: "Air Jordan 4 Retro",
    brand: "Jordan",
    base_price: 225,
    description: "The Air Jordan 4 Retro brings back a timeless silhouette with premium materials and visible Air-Sole cushioning.",
    category: "footwear",
    variants: [
      v("air-jordan-4-retro", 0, "White/Navy", "#FFFFFF", "7"),
      v("air-jordan-4-retro", 1, "White/Navy", "#FFFFFF", "8"),
      v("air-jordan-4-retro", 2, "White/Navy", "#FFFFFF", "9"),
      v("air-jordan-4-retro", 3, "White/Navy", "#FFFFFF", "10"),
      v("air-jordan-4-retro", 4, "White/Navy", "#FFFFFF", "11"),
      v("air-jordan-4-retro", 5, "Military Blue", "#3E6B8C", "7"),
      v("air-jordan-4-retro", 6, "Military Blue", "#3E6B8C", "8"),
      v("air-jordan-4-retro", 7, "Military Blue", "#3E6B8C", "9"),
      v("air-jordan-4-retro", 8, "Military Blue", "#3E6B8C", "10"),
      v("air-jordan-4-retro", 9, "Military Blue", "#3E6B8C", "11"),
    ],
    details: ["Leather and mesh upper", "Visible Air-Sole heel unit", "Wings lace locks", "Rubber outsole with herringbone pattern"],
    features: ["Fits true to size", "Lace-up closure"],
    images: [{ url: "/images/products/jordan-4.jpg", alt_text: "Air Jordan 4 Retro", display_order: 0 }],
    relatedProducts: [],
  },
  "wide-leg-pleated-pants": {
    id: "wide-leg-pleated-pants",
    name: "Wide-Leg Pleated Pants",
    brand: "Zara",
    base_price: 89,
    description: "Relaxed-fit trousers with knife pleats for a refined yet effortless silhouette. Crafted from lightweight stretch wool.",
    category: "bottoms",
    variants: [
      v("wide-leg-pleated-pants", 0, "Beige", "#D4C9B8", "S"),
      v("wide-leg-pleated-pants", 1, "Beige", "#D4C9B8", "M"),
      v("wide-leg-pleated-pants", 2, "Beige", "#D4C9B8", "L"),
      v("wide-leg-pleated-pants", 3, "Beige", "#D4C9B8", "XL"),
      v("wide-leg-pleated-pants", 4, "Grey", "#9E9E9E", "S"),
      v("wide-leg-pleated-pants", 5, "Grey", "#9E9E9E", "M"),
      v("wide-leg-pleated-pants", 6, "Grey", "#9E9E9E", "L"),
      v("wide-leg-pleated-pants", 7, "Grey", "#9E9E9E", "XL"),
      v("wide-leg-pleated-pants", 8, "Black", "#2A2A2A", "S"),
      v("wide-leg-pleated-pants", 9, "Black", "#2A2A2A", "M"),
      v("wide-leg-pleated-pants", 10, "Black", "#2A2A2A", "L"),
      v("wide-leg-pleated-pants", 11, "Black", "#2A2A2A", "XL"),
    ],
    details: ["Lightweight stretch wool blend", "Double knife pleats", "Side pockets and welt back pockets", "Hook-and-bar closure", "Unfinished hem for custom tailoring"],
    features: ["Relaxed wide-leg fit", "Model is 6'1\" wearing size 32", "Inseam: 33\" (size 32)"],
    images: [{ url: "/images/products/pleated-pants.jpg", alt_text: "Wide-Leg Pleated Pants", display_order: 0 }],
    relatedProducts: [],
  },
  "arizona-sandals": {
    id: "arizona-sandals",
    name: "Arizona Sandals",
    brand: "Birkenstock",
    base_price: 135,
    description: "The iconic Arizona sandal with two adjustable straps and a contoured cork footbed that molds to your feet.",
    category: "footwear",
    variants: [
      v("arizona-sandals", 0, "Tan", "#C4A882", "7"),
      v("arizona-sandals", 1, "Tan", "#C4A882", "8"),
      v("arizona-sandals", 2, "Tan", "#C4A882", "9"),
      v("arizona-sandals", 3, "Tan", "#C4A882", "10"),
      v("arizona-sandals", 4, "Tan", "#C4A882", "11"),
      v("arizona-sandals", 5, "Brown", "#6B4226", "7"),
      v("arizona-sandals", 6, "Brown", "#6B4226", "8"),
      v("arizona-sandals", 7, "Brown", "#6B4226", "9"),
      v("arizona-sandals", 8, "Brown", "#6B4226", "10"),
      v("arizona-sandals", 9, "Brown", "#6B4226", "11"),
      v("arizona-sandals", 10, "Black", "#2A2A2A", "7"),
      v("arizona-sandals", 11, "Black", "#2A2A2A", "8"),
      v("arizona-sandals", 12, "Black", "#2A2A2A", "9"),
      v("arizona-sandals", 13, "Black", "#2A2A2A", "10"),
      v("arizona-sandals", 14, "Black", "#2A2A2A", "11"),
    ],
    details: ["Two adjustable straps with metal buckles", "Contoured cork-latex footbed", "EVA sole for lightweight comfort", "Made in Germany"],
    features: ["Fits true to size", "Footbed molds to foot over time", "Width: Regular/Narrow"],
    images: [{ url: "/images/products/sandals.jpg", alt_text: "Arizona Sandals", display_order: 0 }],
    relatedProducts: [],
  },
  "cable-knit-sweater": {
    id: "cable-knit-sweater",
    name: "Cable Knit Sweater",
    brand: "Polo Ralph Lauren",
    base_price: 198,
    description: "A heavyweight cable-knit sweater crafted from pure cotton. Features a crew neck, ribbed cuffs, and hem.",
    category: "knitwear",
    variants: [
      v("cable-knit-sweater", 0, "Navy", "#1B2A4A", "S"),
      v("cable-knit-sweater", 1, "Navy", "#1B2A4A", "M"),
      v("cable-knit-sweater", 2, "Navy", "#1B2A4A", "L"),
      v("cable-knit-sweater", 3, "Navy", "#1B2A4A", "XL"),
      v("cable-knit-sweater", 4, "Grey", "#9E9E9E", "S"),
      v("cable-knit-sweater", 5, "Grey", "#9E9E9E", "M"),
      v("cable-knit-sweater", 6, "Grey", "#9E9E9E", "L"),
      v("cable-knit-sweater", 7, "Grey", "#9E9E9E", "XL"),
      v("cable-knit-sweater", 8, "Cream", "#F5F0E8", "S"),
      v("cable-knit-sweater", 9, "Cream", "#F5F0E8", "M"),
      v("cable-knit-sweater", 10, "Cream", "#F5F0E8", "L"),
      v("cable-knit-sweater", 11, "Cream", "#F5F0E8", "XL"),
    ],
    details: ["100% cotton cable knit", "Crew neck", "Ribbed cuffs, collar, and hem", "Signature embroidered Pony at chest"],
    features: ["Relaxed fit", "Model is 6'1\" wearing size M", "Length: 28\" (size M)"],
    images: [{ url: "/images/products/cable-knit.jpg", alt_text: "Cable Knit Sweater", display_order: 0 }],
    relatedProducts: [],
  },
  "denim-jacket": {
    id: "denim-jacket",
    name: "Denim Jacket",
    brand: "Levi's",
    base_price: 148,
    description: "A classic denim trucker jacket in 12 oz. selvedge denim. Features a button-front closure and adjustable waist tabs.",
    category: "jackets",
    variants: [
      v("denim-jacket", 0, "Dark Wash", "#2B3D4F", "M"),
      v("denim-jacket", 1, "Dark Wash", "#2B3D4F", "L"),
      v("denim-jacket", 2, "Dark Wash", "#2B3D4F", "XL"),
      v("denim-jacket", 3, "Black", "#1A1A1A", "M"),
      v("denim-jacket", 4, "Black", "#1A1A1A", "L"),
      v("denim-jacket", 5, "Black", "#1A1A1A", "XL"),
    ],
    details: ["100% cotton 12 oz. selvedge denim", "Button-front closure", "Two chest pockets with button flaps", "Adjustable waist tabs", "Raw hem — expect shrinkage"],
    features: ["Classic trucker fit — size up for layering", "Model is 6'1\" wearing size M"],
    images: [{ url: "/images/products/denim-jacket.jpg", alt_text: "Denim Jacket", display_order: 0 }],
    relatedProducts: [],
  },
  "supreme-x-nike-sb-dunk": {
    id: "supreme-x-nike-sb-dunk",
    name: "Supreme x Nike SB Dunk",
    brand: "Supreme",
    base_price: 350,
    description: "The highly coveted Supreme x Nike SB Dunk collaboration featuring premium leather and star-embossed detailing.",
    category: "footwear",
    variants: [
      v("supreme-x-nike-sb-dunk", 0, "Multi", "#2A2A2A", "8"),
      v("supreme-x-nike-sb-dunk", 1, "Multi", "#2A2A2A", "9"),
      v("supreme-x-nike-sb-dunk", 2, "Multi", "#2A2A2A", "10"),
      v("supreme-x-nike-sb-dunk", 3, "Multi", "#2A2A2A", "11"),
    ],
    details: ["Premium leather upper with star embossing", "Nike SB Zoom Air cushioning", "Supreme branding at heel and insole", "Puffy tongue with exposed foam", "Rubber outsole"],
    features: ["Fits true to size", "Lace-up closure with extra laces included"],
    images: [{ url: "/images/products/sb-dunk.jpg", alt_text: "Supreme x Nike SB Dunk", display_order: 0 }],
    relatedProducts: [],
  },
  "polo-short-sleeve": {
    id: "polo-short-sleeve",
    name: "Polo Short Sleeve",
    brand: "Polo Ralph Lauren",
    base_price: 98,
    description: "The classic Polo short sleeve shirt in premium cotton pique. Features a two-button placket, ribbed collar, and the iconic embroidered Pony.",
    category: "shirts",
    variants: [
      v("polo-short-sleeve", 0, "Navy", "#1B2A4A", "S"),
      v("polo-short-sleeve", 1, "Navy", "#1B2A4A", "M"),
      v("polo-short-sleeve", 2, "Navy", "#1B2A4A", "L"),
      v("polo-short-sleeve", 3, "Navy", "#1B2A4A", "XL"),
      v("polo-short-sleeve", 4, "Navy", "#1B2A4A", "XXL"),
      v("polo-short-sleeve", 5, "White", "#F5F5F0", "S"),
      v("polo-short-sleeve", 6, "White", "#F5F5F0", "M"),
      v("polo-short-sleeve", 7, "White", "#F5F5F0", "L"),
      v("polo-short-sleeve", 8, "White", "#F5F5F0", "XL"),
      v("polo-short-sleeve", 9, "White", "#F5F5F0", "XXL"),
      v("polo-short-sleeve", 10, "Red", "#C41E3A", "S"),
      v("polo-short-sleeve", 11, "Red", "#C41E3A", "M"),
      v("polo-short-sleeve", 12, "Red", "#C41E3A", "L"),
      v("polo-short-sleeve", 13, "Red", "#C41E3A", "XL"),
      v("polo-short-sleeve", 14, "Red", "#C41E3A", "XXL"),
      v("polo-short-sleeve", 15, "Green", "#2E7D32", "S"),
      v("polo-short-sleeve", 16, "Green", "#2E7D32", "M"),
      v("polo-short-sleeve", 17, "Green", "#2E7D32", "L"),
      v("polo-short-sleeve", 18, "Green", "#2E7D32", "XL"),
      v("polo-short-sleeve", 19, "Green", "#2E7D32", "XXL"),
      v("polo-short-sleeve", 20, "Pink", "#E8C4C8", "S"),
      v("polo-short-sleeve", 21, "Pink", "#E8C4C8", "M"),
      v("polo-short-sleeve", 22, "Pink", "#E8C4C8", "L"),
      v("polo-short-sleeve", 23, "Pink", "#E8C4C8", "XL"),
      v("polo-short-sleeve", 24, "Pink", "#E8C4C8", "XXL"),
    ],
    details: ["100% cotton pique", "Two-button placket", "Ribbed collar and cuffs", "Embroidered Pony at chest", "Machine washable"],
    features: ["Classic fit — true to size", "Model is 6'1\" wearing size M", "Length: 29\" (size M)"],
    images: [{ url: "/images/products/denim-shirt.jpg", alt_text: "Polo Short Sleeve", display_order: 0 }],
    relatedProducts: [],
  },
  "timberland-6-inch-boot": {
    id: "timberland-6-inch-boot",
    name: "Timberland 6-Inch Boot",
    brand: "Timberland",
    base_price: 210,
    description: "The iconic 6-inch waterproof boot crafted from premium nubuck leather with a padded collar and durable rubber lug outsole.",
    category: "footwear",
    variants: [
      v("timberland-6-inch-boot", 0, "Wheat", "#D4B886", "8"),
      v("timberland-6-inch-boot", 1, "Wheat", "#D4B886", "9"),
      v("timberland-6-inch-boot", 2, "Wheat", "#D4B886", "10"),
      v("timberland-6-inch-boot", 3, "Wheat", "#D4B886", "11"),
      v("timberland-6-inch-boot", 4, "Wheat", "#D4B886", "12"),
      v("timberland-6-inch-boot", 5, "Olive", "#556B2F", "8"),
      v("timberland-6-inch-boot", 6, "Olive", "#556B2F", "9"),
      v("timberland-6-inch-boot", 7, "Olive", "#556B2F", "10"),
      v("timberland-6-inch-boot", 8, "Olive", "#556B2F", "11"),
      v("timberland-6-inch-boot", 9, "Olive", "#556B2F", "12"),
    ],
    details: ["Premium nubuck leather upper", "Waterproof construction", "Padded collar for comfort", "Rubber lug outsole", "Steel shank for arch support"],
    features: ["Fits true to size", "Lace-up closure with rustproof hardware"],
    images: [{ url: "/images/products/brown-shoes.jpg", alt_text: "Timberland 6-Inch Boot", display_order: 0 }],
    relatedProducts: [],
  },
  "oversized-graphic-tee": {
    id: "oversized-graphic-tee",
    name: "Oversized Graphic Tee",
    brand: "Nike",
    base_price: 55,
    description: "A heavyweight cotton tee with an oversized fit and bold graphic print. Features a ribbed crew neck and dropped shoulders.",
    category: "shirts",
    variants: [
      v("oversized-graphic-tee", 0, "White", "#F5F5F0", "S"),
      v("oversized-graphic-tee", 1, "White", "#F5F5F0", "M"),
      v("oversized-graphic-tee", 2, "White", "#F5F5F0", "L"),
      v("oversized-graphic-tee", 3, "White", "#F5F5F0", "XL"),
      v("oversized-graphic-tee", 4, "Brown", "#6B4226", "S"),
      v("oversized-graphic-tee", 5, "Brown", "#6B4226", "M"),
      v("oversized-graphic-tee", 6, "Brown", "#6B4226", "L"),
      v("oversized-graphic-tee", 7, "Brown", "#6B4226", "XL"),
      v("oversized-graphic-tee", 8, "Black", "#1A1A1A", "S"),
      v("oversized-graphic-tee", 9, "Black", "#1A1A1A", "M"),
      v("oversized-graphic-tee", 10, "Black", "#1A1A1A", "L"),
      v("oversized-graphic-tee", 11, "Black", "#1A1A1A", "XL"),
    ],
    details: ["100% heavyweight cotton jersey", "Oversized fit with dropped shoulders", "Ribbed crew neck", "Screen-printed graphic", "Machine washable"],
    features: ["Oversized fit — size down for less volume", "Model is 6'1\" wearing size L", "Length: 31\" (size L)"],
    images: [{ url: "/images/products/sneakers.jpg", alt_text: "Oversized Graphic Tee", display_order: 0 }],
    relatedProducts: [],
  },
  "fleece-hoodie-jacket": {
    id: "fleece-hoodie-jacket",
    name: "Fleece Hoodie Jacket",
    brand: "Polo Ralph Lauren",
    base_price: 175,
    description: "A full-zip fleece jacket with a classic athletic silhouette. Features a stand-up collar, zip pockets, and ribbed cuffs.",
    category: "jackets",
    variants: [
      v("fleece-hoodie-jacket", 0, "Navy", "#1B2A4A", "M"),
      v("fleece-hoodie-jacket", 1, "Navy", "#1B2A4A", "L"),
      v("fleece-hoodie-jacket", 2, "Navy", "#1B2A4A", "XL"),
      v("fleece-hoodie-jacket", 3, "Grey", "#8C8C8C", "M"),
      v("fleece-hoodie-jacket", 4, "Grey", "#8C8C8C", "L"),
      v("fleece-hoodie-jacket", 5, "Grey", "#8C8C8C", "XL"),
    ],
    details: ["Cotton-polyester fleece blend", "Full-zip front", "Stand-up collar", "Zip hand pockets", "Ribbed cuffs and hem"],
    features: ["Regular fit", "Model is 6'1\" wearing size M", "Length: 27\" (size M)"],
    images: [{ url: "/images/products/fleece-hoodie.jpg", alt_text: "Fleece Hoodie Jacket", display_order: 0 }],
    relatedProducts: [],
  },
  "linen-summer-trousers": {
    id: "linen-summer-trousers",
    name: "Linen Summer Trousers",
    brand: "Zara",
    base_price: 79,
    description: "Lightweight linen trousers with an easy, relaxed fit. Features an elastic drawstring waist and side pockets.",
    category: "bottoms",
    variants: [
      v("linen-summer-trousers", 0, "Khaki", "#C3B091", "S"),
      v("linen-summer-trousers", 1, "Khaki", "#C3B091", "M"),
      v("linen-summer-trousers", 2, "Khaki", "#C3B091", "L"),
      v("linen-summer-trousers", 3, "Khaki", "#C3B091", "XL"),
      v("linen-summer-trousers", 4, "White", "#F5F5F0", "S"),
      v("linen-summer-trousers", 5, "White", "#F5F5F0", "M"),
      v("linen-summer-trousers", 6, "White", "#F5F5F0", "L"),
      v("linen-summer-trousers", 7, "White", "#F5F5F0", "XL"),
      v("linen-summer-trousers", 8, "Beige", "#D4C9B8", "S"),
      v("linen-summer-trousers", 9, "Beige", "#D4C9B8", "M"),
      v("linen-summer-trousers", 10, "Beige", "#D4C9B8", "L"),
      v("linen-summer-trousers", 11, "Beige", "#D4C9B8", "XL"),
    ],
    details: ["100% linen", "Elastic drawstring waist", "Side pockets", "Relaxed straight leg", "Machine washable"],
    features: ["Relaxed fit — size down for less volume", "Model is 6'1\" wearing size 32", "Inseam: 31\" (size 32)"],
    images: [{ url: "/images/products/linen-trousers.jpg", alt_text: "Linen Summer Trousers", display_order: 0 }],
    relatedProducts: [],
  },
  "adidas-samba": {
    id: "adidas-samba",
    name: "Adidas Samba",
    brand: "Adidas",
    base_price: 120,
    description: "The legendary Adidas Samba sneaker with a leather upper and signature gum sole. A timeless indoor soccer trainer turned lifestyle icon.",
    category: "footwear",
    variants: [
      v("adidas-samba", 0, "White/Blue", "#FFFFFF", "7"),
      v("adidas-samba", 1, "White/Blue", "#FFFFFF", "8"),
      v("adidas-samba", 2, "White/Blue", "#FFFFFF", "9"),
      v("adidas-samba", 3, "White/Blue", "#FFFFFF", "10"),
      v("adidas-samba", 4, "White/Blue", "#FFFFFF", "11"),
    ],
    details: ["Full-grain leather upper", "Suede overlay at toe", "Gum rubber outsole", "Padded tongue and collar", "Signature 3-Stripes branding"],
    features: ["Fits true to size", "Lace-up closure"],
    images: [{ url: "/images/products/adidas-samba.jpg", alt_text: "Adidas Samba", display_order: 0 }],
    relatedProducts: [],
  },
  "bomber-jacket": {
    id: "bomber-jacket",
    name: "Bomber Jacket",
    brand: "Represent",
    base_price: 245,
    description: "A heavyweight satin bomber jacket with a ribbed collar, cuffs, and hem. Features a two-way zip front and zippered side pockets.",
    category: "jackets",
    variants: [
      v("bomber-jacket", 0, "Black", "#1A1A1A", "M"),
      v("bomber-jacket", 1, "Black", "#1A1A1A", "L"),
      v("bomber-jacket", 2, "Black", "#1A1A1A", "XL"),
      v("bomber-jacket", 3, "Olive", "#556B2F", "M"),
      v("bomber-jacket", 4, "Olive", "#556B2F", "L"),
      v("bomber-jacket", 5, "Olive", "#556B2F", "XL"),
    ],
    details: ["Heavyweight satin shell", "Nylon lining", "Ribbed knit collar, cuffs, and hem", "Two-way zip front closure", "Zippered side pockets"],
    features: ["Regular fit — true to size", "Model is 6'1\" wearing size M", "Length: 26.5\" (size M)"],
    images: [{ url: "/images/products/bomber-jacket.jpg", alt_text: "Bomber Jacket", display_order: 0 }],
    relatedProducts: [],
  },
  "baggy-jeans": {
    id: "baggy-jeans",
    name: "Baggy Jeans",
    brand: "Zara",
    base_price: 69,
    description: "Relaxed-fit baggy jeans in mid-weight denim. Features a low-rise waist, five-pocket styling, and a straight-leg cut.",
    category: "bottoms",
    variants: [
      v("baggy-jeans", 0, "Light Wash", "#8FB1C4", "S"),
      v("baggy-jeans", 1, "Light Wash", "#8FB1C4", "M"),
      v("baggy-jeans", 2, "Light Wash", "#8FB1C4", "L"),
      v("baggy-jeans", 3, "Light Wash", "#8FB1C4", "XL"),
      v("baggy-jeans", 4, "Dark Wash", "#2B3D4F", "S"),
      v("baggy-jeans", 5, "Dark Wash", "#2B3D4F", "M"),
      v("baggy-jeans", 6, "Dark Wash", "#2B3D4F", "L"),
      v("baggy-jeans", 7, "Dark Wash", "#2B3D4F", "XL"),
    ],
    details: ["100% cotton denim", "Low-rise waist", "Five-pocket styling", "Straight leg with relaxed thigh", "Zip-fly with button closure"],
    features: ["Relaxed baggy fit — true to size", "Model is 6'1\" wearing size 32", "Inseam: 32\" (size 32)"],
    images: [{ url: "/images/products/baggy-jeans.jpg", alt_text: "Baggy Jeans", display_order: 0 }],
    relatedProducts: [],
  },
}

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string

  const [product, setProduct] = useState<ProductData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [wishlisted, setWishlisted] = useState(false)
  const [addedNotice, setAddedNotice] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  useEffect(() => {
    setWishlisted(isInWishlist(slug))
  }, [slug])

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true)
        setError(null)

        let data: ProductData | null = null

        try {
          const res = await fetch(`/api/products/${slug}`)
          const json = await res.json()
          if (json.success) {
            data = json.data
          }
        } catch {
          /* API unavailable — fall back to local data */
        }

        if (!data) {
          const local = localProducts[slug]
          if (local) {
            const related = Object.values(localProducts)
              .filter((p) => p.category === local.category && p.id !== slug)
              .slice(0, 4)
              .map((p) => ({
                name: p.name,
                brand: p.brand,
                base_price: p.base_price,
                slug: p.id,
              }))
            data = { ...local, relatedProducts: related }
          }
        }

        if (data) {
          setProduct(data)
        } else {
          setError("Product not found")
        }
      } catch {
        setError("Failed to load product. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [slug])

  function handleToggleWishlist() {
    toggleWishlist(slug)
    const now = !wishlisted
    setWishlisted(now)
    showToast(now ? `Added ${product?.name || "item"} to wishlist` : `Removed from wishlist`, "info")
  }

  function handleAddToCart() {
    if (!product) return
    const size = selectedSize || (sizes.length > 0 ? sizes[0] : "M")
    const color = selectedColor || (colors.length > 0 ? colors[0].name : "Default")
    addToCart({
      slug,
      name: product.name,
      brand: product.brand,
      price: product.base_price,
      image: product.images?.[0]?.url || getProductImages(slug)?.[0] || "",
      size,
      color,
      quantity,
    })
    setAddedNotice(true)
    setTimeout(() => setAddedNotice(false), 2000)
    showToast(`Added ${product.name} to cart`, "success")
  }

  // Derive colors from variants
  const colors: ProductColor[] = product
    ? [...new Map(
        (product.variants || []).map((v) => [v.color, { name: v.color, hex: v.color_hex || "#CCCCCC" }])
      ).values()]
    : []

  // Derive sizes from selected color
  const sizes = product && selectedColor
    ? [...new Set(
        (product.variants || [])
          .filter((v) => v.color === selectedColor)
          .map((v) => v.size)
      )]
    : product
    ? [...new Set((product.variants || []).map((v) => v.size))]
    : []

  // Derive selected variant stock for low-stock indicator
  const selectedVariant = product && selectedColor && selectedSize
    ? product.variants.find(v => v.color === selectedColor && v.size === selectedSize) || null
    : null
  const selectedStock = selectedVariant?.stock_quantity ?? null

  const allImages: string[] = product
    ? product.images?.length > 0
      ? product.images.map((img) => img.url)
      : getProductImages(slug)?.length > 0
        ? getProductImages(slug)
        : ["/images/products/oxford-shirt.jpg"]
    : ["/images/products/oxford-shirt.jpg"]

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-secondary rounded w-48 mx-auto" />
          <div className="h-4 bg-secondary rounded w-64 mx-auto" />
          <div className="h-96 bg-secondary rounded max-w-lg mx-auto mt-8" />
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="font-serif text-3xl text-foreground mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-8">{error || "This product doesn't exist or has been removed."}</p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 text-xs tracking-[0.2em] uppercase font-medium hover:bg-primary/90 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Back to Shop
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Schema */}
      <ProductSchema product={product} />
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: product.name },
        ]} />
      </div>

      {/* Product */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Image gallery */}
          <div className="flex gap-4">
            {/* Thumbnails - left side on desktop */}
            {allImages.length > 1 && (
              <div className="hidden sm:flex flex-col gap-2 w-20 shrink-0">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`aspect-[4/5] bg-secondary overflow-hidden relative transition-colors ${
                      selectedImage === i ? "ring-1 ring-foreground" : "ring-1 ring-transparent hover:ring-border"
                    }`}
                  >
                    <Image src={img} alt={`View ${i + 1}`} fill sizes="80px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
            <div className="flex-1 space-y-4">
              <button
                onClick={() => setLightboxOpen(true)}
                className="aspect-[4/5] bg-secondary overflow-hidden relative w-full cursor-zoom-in"
              >
                <Image
                  src={allImages[selectedImage]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </button>
              {/* Mobile thumbnails */}
              {allImages.length > 1 && (
                <div className="flex sm:hidden gap-2 overflow-x-auto pb-1">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`aspect-square w-16 shrink-0 bg-secondary overflow-hidden relative transition-colors ${
                        selectedImage === i ? "ring-1 ring-foreground" : "ring-1 ring-transparent"
                      }`}
                    >
                      <Image src={img} alt={`View ${i + 1}`} fill sizes="64px" className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product info */}
          <div className="flex flex-col">
            <p className="text-xs tracking-[0.15em] uppercase text-accent font-medium mb-1">{product.brand}</p>
            <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-2">{product.name}</h1>
            <div className="flex items-center gap-3 mb-6">
              <p className="text-xl text-foreground font-medium">${product.base_price.toFixed(2)}</p>
              {selectedStock !== null && selectedStock <= 5 && selectedStock > 0 && (
                <span className="text-[10px] tracking-[0.1em] uppercase bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-2 py-0.5 rounded-sm font-medium animate-pulse">
                  Only {selectedStock} left
                </span>
              )}
              {selectedStock !== null && selectedStock <= 0 && (
                <span className="text-[10px] tracking-[0.1em] uppercase bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-0.5 rounded-sm font-medium">
                  Out of Stock
                </span>
              )}
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Color selector */}
            {colors.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs tracking-[0.15em] uppercase text-foreground font-medium">Color</h3>
                  <span className="text-xs text-muted-foreground">{selectedColor || "Select"}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => { setSelectedColor(color.name); setSelectedSize(null) }}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor === color.name
                          ? "border-foreground scale-110"
                          : "border-border hover:border-muted-foreground"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      aria-label={color.name}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size selector */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs tracking-[0.15em] uppercase text-foreground font-medium">Size</h3>
                <Link href="/size-guide" className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2">
                  Size Guide
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[3rem] px-4 py-2.5 text-xs font-medium border transition-colors ${
                      selectedSize === size
                        ? "border-foreground bg-foreground text-background"
                        : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + Add to cart */}
            <div className="relative flex gap-3 mb-8">
              <div className="flex items-center border border-border">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  −
                </button>
                <span className="px-4 py-3 text-sm text-foreground min-w-[3rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-primary text-primary-foreground text-xs tracking-[0.2em] uppercase font-medium hover:bg-primary/90 transition-colors"
              >
                Add to Cart
              </button>
              <button
                onClick={handleToggleWishlist}
                className="p-3 border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <HeartIcon className={`w-5 h-5 ${wishlisted ? "text-accent fill-accent" : ""}`} />
              </button>
              {addedNotice && (
                <div className="absolute bottom-0 left-0 right-0 bg-accent text-accent-foreground text-[10px] tracking-[0.15em] uppercase font-medium text-center py-2 animate-fade-in">
                  Added to cart
                </div>
              )}
            </div>

            {/* Details accordion */}
            {product.details && product.details.length > 0 && (
              <div className="border-t border-border pt-6 space-y-4">
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer text-sm font-medium text-foreground list-none">
                    Details
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-open:rotate-90 transition-transform" />
                  </summary>
                  <ul className="mt-3 space-y-1.5">
                    {product.details.map((detail, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-accent mt-1">•</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </details>
                {product.features && product.features.length > 0 && (
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer text-sm font-medium text-foreground list-none">
                      Features & Fit
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-open:rotate-90 transition-transform" />
                    </summary>
                    <ul className="mt-3 space-y-1.5">
                      {product.features.map((feature, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-accent mt-1">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer text-sm font-medium text-foreground list-none">
                    Shipping & Returns
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-open:rotate-90 transition-transform" />
                  </summary>
                  <div className="mt-3 text-sm text-muted-foreground space-y-2">
                    <p>Free shipping on orders over $200. Standard delivery 3-5 business days.</p>
                    <p>Free returns within 30 days of delivery. Items must be unworn with tags attached.</p>
                  </div>
                </details>
              </div>
            )}

            {/* Payment icons */}
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-3">We Accept</p>
              <div className="flex gap-3">
                {["Visa", "MC", "Amex", "PayPal", "Apple Pay"].map((method) => (
                  <span key={method} className="text-xs text-muted-foreground/50 font-medium tracking-wider">
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews */}
      <section className="border-t border-border py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-xl text-foreground mb-6">Customer Reviews</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xs tracking-[0.15em] uppercase text-muted-foreground mb-4">Write a Review</h3>
              <ReviewForm productSlug={slug} />
            </div>
            <div>
              <h3 className="text-xs tracking-[0.15em] uppercase text-muted-foreground mb-4">Reviews</h3>
              <ReviewList productSlug={slug} />
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <section className="border-t border-border py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-accent font-medium mb-2">Complete the Look</p>
                <h2 className="font-serif text-2xl md:text-3xl text-foreground">You May Also Like</h2>
              </div>
              <Link
                href={`/shop?category=${product.category}`}
                className="hidden md:inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors"
              >
                View More
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {product.relatedProducts.map((rp) => (
                <Link key={rp.slug} href={`/product/${rp.slug}`} className="group">
                  <div className="aspect-[3/4] bg-secondary overflow-hidden relative mb-3">
                    {getProductImages(rp.slug)?.[0] ? (
                      <Image
                        src={getProductImages(rp.slug)[0]}
                        alt={`${rp.brand} - ${rp.name}`}
                        fill
                        sizes="25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-muted">
                        <span className="text-xs tracking-[0.15em] uppercase text-muted-foreground font-medium">
                          {rp.brand}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium">{rp.brand}</p>
                    <h3 className="text-sm font-medium text-foreground">{rp.name}</h3>
                    <p className="text-sm text-muted-foreground">${rp.base_price.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {lightboxOpen && (
        <ImageLightbox
          images={allImages.map((url) => ({ url, alt_text: product.name }))}
          currentIndex={selectedImage}
          onClose={() => setLightboxOpen(false)}
          onPrev={() => setSelectedImage((selectedImage - 1 + allImages.length) % allImages.length)}
          onNext={() => setSelectedImage((selectedImage + 1) % allImages.length)}
        />
      )}
    </div>
  )
}
