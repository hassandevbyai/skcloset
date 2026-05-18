import { generateSlug } from "./helpers"

export interface LocalProduct {
  id: string
  name: string
  slug: string
  brand: string
  base_price: number
  description: string
  category: string
  details: string[]
  features: string[]
  images: { url: string; alt_text: string; display_order: number }[]
  variants: {
    id: string
    size: string
    color: string
    color_hex: string
    stock_quantity: number
    price: number | null
  }[]
  is_active: boolean
  is_featured: boolean
}

const productsData: Omit<LocalProduct, "slug" | "id">[] = [
  {
    name: "Oxford Button-Down Shirt",
    brand: "Polo Ralph Lauren",
    base_price: 165,
    description:
      "A timeless Oxford cloth button-down crafted from premium cotton. Features a classic button-down collar, chest pocket, and box pleat with locker loop.",
    category: "shirts",
    details: [
      "100% premium cotton Oxford cloth",
      "Button-down collar with removable collar stays",
      "Chest patch pocket with embroidered Pony",
      "Box pleat with locker loop at back",
      "Machine washable",
    ],
    features: [
      "Pre-shrunk cotton fabric resists wrinkling",
      "Reinforced seaming at stress points",
      "Mother-of-pearl buttons",
      "Split back yoke for better fit",
    ],
    images: [
      {
        url: "/images/products/oxford-shirt.jpg",
        alt_text: "Polo Ralph Lauren Oxford Button-Down Shirt",
        display_order: 1,
      },
    ],
    variants: [
      { id: "oxf-white-s", size: "S", color: "White", color_hex: "#FFFFFF", stock_quantity: 25, price: null },
      { id: "oxf-white-m", size: "M", color: "White", color_hex: "#FFFFFF", stock_quantity: 42, price: null },
      { id: "oxf-white-l", size: "L", color: "White", color_hex: "#FFFFFF", stock_quantity: 38, price: null },
      { id: "oxf-white-xl", size: "XL", color: "White", color_hex: "#FFFFFF", stock_quantity: 18, price: null },
      { id: "oxf-lblue-s", size: "S", color: "Light Blue", color_hex: "#ADD8E6", stock_quantity: 15, price: null },
      { id: "oxf-lblue-m", size: "M", color: "Light Blue", color_hex: "#ADD8E6", stock_quantity: 30, price: null },
      { id: "oxf-lblue-l", size: "L", color: "Light Blue", color_hex: "#ADD8E6", stock_quantity: 27, price: null },
      { id: "oxf-lblue-xl", size: "XL", color: "Light Blue", color_hex: "#ADD8E6", stock_quantity: 12, price: null },
      { id: "oxf-pink-s", size: "S", color: "Pink", color_hex: "#FFC0CB", stock_quantity: 10, price: null },
      { id: "oxf-pink-m", size: "M", color: "Pink", color_hex: "#FFC0CB", stock_quantity: 20, price: null },
      { id: "oxf-pink-l", size: "L", color: "Pink", color_hex: "#FFC0CB", stock_quantity: 22, price: null },
      { id: "oxf-pink-xl", size: "XL", color: "Pink", color_hex: "#FFC0CB", stock_quantity: 8, price: null },
    ],
    is_active: true,
    is_featured: true,
  },
  {
    name: "Nuptse Puffer Jacket",
    brand: "The North Face",
    base_price: 295,
    description:
      "The iconic Nuptse jacket with 700-fill goose down for exceptional warmth. Packable design with stitched-through baffles and a durable water-repellent finish.",
    category: "jackets",
    details: [
      "700-fill goose down insulation",
      "Durable water-repellent (DWR) finish",
      "Stitched-through baffles prevent shifting",
      "Packable into stuff sack",
      "Zip-in compatible with outer shells",
    ],
    features: [
      "Certified Responsible Down Standard (RDS)",
      "Ripstop nylon shell resists tears",
      "Internal secure-zip pocket",
      "Elasticized cuffs and hem seal in warmth",
    ],
    images: [
      {
        url: "/images/products/puffer-jacket.jpg",
        alt_text: "The North Face Nuptse Puffer Jacket",
        display_order: 1,
      },
    ],
    variants: [
      { id: "nuptse-black-m", size: "M", color: "Black", color_hex: "#000000", stock_quantity: 35, price: null },
      { id: "nuptse-black-l", size: "L", color: "Black", color_hex: "#000000", stock_quantity: 50, price: null },
      { id: "nuptse-black-xl", size: "XL", color: "Black", color_hex: "#000000", stock_quantity: 28, price: null },
      { id: "nuptse-grey-m", size: "M", color: "Grey", color_hex: "#808080", stock_quantity: 20, price: null },
      { id: "nuptse-grey-l", size: "L", color: "Grey", color_hex: "#808080", stock_quantity: 32, price: null },
      { id: "nuptse-grey-xl", size: "XL", color: "Grey", color_hex: "#808080", stock_quantity: 15, price: null },
    ],
    is_active: true,
    is_featured: true,
  },
  {
    name: "Air Jordan 4 Retro",
    brand: "Jordan",
    base_price: 225,
    description:
      "The Air Jordan 4 Retro returns in iconic colorways. Featuring the classic mesh and leather upper with visible Air-Sole cushioning and the unmistakable wing eyelets.",
    category: "footwear",
    details: [
      "Leather and mesh upper",
      "Visible Air-Sole unit in heel",
      "Plastic wing eyelets for lockdown fit",
      "Rubber outsole with herringbone pattern",
      "Original Jumpman branding at tongue and heel",
    ],
    features: [
      "Polyurethane midsole for lightweight cushioning",
      "Perforated mesh panels enhance breathability",
      "Solid rubber outsole for durable traction",
      "Padded collar for ankle comfort",
    ],
    images: [
      {
        url: "/images/products/jordan-4.jpg",
        alt_text: "Jordan Air Jordan 4 Retro Sneakers",
        display_order: 1,
      },
    ],
    variants: [
      { id: "aj4-wn-7", size: "7", color: "White/Navy", color_hex: "#F5F5F5", stock_quantity: 8, price: null },
      { id: "aj4-wn-8", size: "8", color: "White/Navy", color_hex: "#F5F5F5", stock_quantity: 14, price: null },
      { id: "aj4-wn-9", size: "9", color: "White/Navy", color_hex: "#F5F5F5", stock_quantity: 22, price: null },
      { id: "aj4-wn-10", size: "10", color: "White/Navy", color_hex: "#F5F5F5", stock_quantity: 18, price: null },
      { id: "aj4-wn-11", size: "11", color: "White/Navy", color_hex: "#F5F5F5", stock_quantity: 6, price: null },
      { id: "aj4-mb-7", size: "7", color: "Military Blue", color_hex: "#4A6FA5", stock_quantity: 5, price: null },
      { id: "aj4-mb-8", size: "8", color: "Military Blue", color_hex: "#4A6FA5", stock_quantity: 10, price: null },
      { id: "aj4-mb-9", size: "9", color: "Military Blue", color_hex: "#4A6FA5", stock_quantity: 16, price: null },
      { id: "aj4-mb-10", size: "10", color: "Military Blue", color_hex: "#4A6FA5", stock_quantity: 12, price: null },
      { id: "aj4-mb-11", size: "11", color: "Military Blue", color_hex: "#4A6FA5", stock_quantity: 4, price: null },
    ],
    is_active: true,
    is_featured: true,
  },
  {
    name: "Wide-Leg Pleated Pants",
    brand: "Zara",
    base_price: 89,
    description:
      "Relaxed wide-leg trousers with a high-rise waist and sharp front pleats. Cut from a lightweight wool-blend fabric for a polished yet effortless silhouette.",
    category: "bottoms",
    details: [
      "Wool-polyester blend fabric",
      "High-rise waist with belt loops",
      "Double front pleats",
      "Side pockets and welt back pockets",
      "Zip fly with hook-and-bar closure",
    ],
    features: [
      "Crepe-texture fabric resists wrinkles",
      "Fully lined through the waist",
      "Trouser-style hem with 2-inch inseam allowance",
      "Can be hemmed for custom length",
    ],
    images: [
      {
        url: "/images/products/pleated-pants.jpg",
        alt_text: "Zara Wide-Leg Pleated Pants",
        display_order: 1,
      },
    ],
    variants: [
      { id: "wlp-beige-s", size: "S", color: "Beige", color_hex: "#F5F5DC", stock_quantity: 20, price: null },
      { id: "wlp-beige-m", size: "M", color: "Beige", color_hex: "#F5F5DC", stock_quantity: 35, price: null },
      { id: "wlp-beige-l", size: "L", color: "Beige", color_hex: "#F5F5DC", stock_quantity: 28, price: null },
      { id: "wlp-beige-xl", size: "XL", color: "Beige", color_hex: "#F5F5DC", stock_quantity: 12, price: null },
      { id: "wlp-grey-s", size: "S", color: "Grey", color_hex: "#A9A9A9", stock_quantity: 16, price: null },
      { id: "wlp-grey-m", size: "M", color: "Grey", color_hex: "#A9A9A9", stock_quantity: 30, price: null },
      { id: "wlp-grey-l", size: "L", color: "Grey", color_hex: "#A9A9A9", stock_quantity: 24, price: null },
      { id: "wlp-grey-xl", size: "XL", color: "Grey", color_hex: "#A9A9A9", stock_quantity: 10, price: null },
      { id: "wlp-black-s", size: "S", color: "Black", color_hex: "#222222", stock_quantity: 14, price: null },
      { id: "wlp-black-m", size: "M", color: "Black", color_hex: "#222222", stock_quantity: 28, price: null },
      { id: "wlp-black-l", size: "L", color: "Black", color_hex: "#222222", stock_quantity: 22, price: null },
      { id: "wlp-black-xl", size: "XL", color: "Black", color_hex: "#222222", stock_quantity: 8, price: null },
    ],
    is_active: true,
    is_featured: false,
  },
  {
    name: "Arizona Sandals",
    brand: "Birkenstock",
    base_price: 135,
    description:
      "The iconic Arizona two-strap sandal with BIRKENSTOCK's legendary contoured footbed. Crafted from rich oiled leather with a lightweight EVA sole.",
    category: "footwear",
    details: [
      "Oiled leather upper with suede lining",
      "Contoured cork-latex footbed molds to your feet",
      "Two adjustable metal buckle straps",
      "EVA outsole for flexible cushioning",
      "Made in Germany",
    ],
    features: [
      "Deep heel cup promotes proper posture",
      "Arch support reduces foot fatigue",
      "Toe grip encourages natural walking motion",
      "Cork footbed naturally wicks moisture",
    ],
    images: [
      {
        url: "/images/products/sandals.jpg",
        alt_text: "Birkenstock Arizona Sandals",
        display_order: 1,
      },
    ],
    variants: [
      { id: "ari-tan-7", size: "7", color: "Tan", color_hex: "#D2B48C", stock_quantity: 18, price: null },
      { id: "ari-tan-8", size: "8", color: "Tan", color_hex: "#D2B48C", stock_quantity: 30, price: null },
      { id: "ari-tan-9", size: "9", color: "Tan", color_hex: "#D2B48C", stock_quantity: 28, price: null },
      { id: "ari-tan-10", size: "10", color: "Tan", color_hex: "#D2B48C", stock_quantity: 22, price: null },
      { id: "ari-tan-11", size: "11", color: "Tan", color_hex: "#D2B48C", stock_quantity: 10, price: null },
      { id: "ari-brown-7", size: "7", color: "Brown", color_hex: "#8B4513", stock_quantity: 12, price: null },
      { id: "ari-brown-8", size: "8", color: "Brown", color_hex: "#8B4513", stock_quantity: 20, price: null },
      { id: "ari-brown-9", size: "9", color: "Brown", color_hex: "#8B4513", stock_quantity: 18, price: null },
      { id: "ari-brown-10", size: "10", color: "Brown", color_hex: "#8B4513", stock_quantity: 14, price: null },
      { id: "ari-brown-11", size: "11", color: "Brown", color_hex: "#8B4513", stock_quantity: 6, price: null },
      { id: "ari-black-7", size: "7", color: "Black", color_hex: "#1A1A1A", stock_quantity: 10, price: null },
      { id: "ari-black-8", size: "8", color: "Black", color_hex: "#1A1A1A", stock_quantity: 22, price: null },
      { id: "ari-black-9", size: "9", color: "Black", color_hex: "#1A1A1A", stock_quantity: 25, price: null },
      { id: "ari-black-10", size: "10", color: "Black", color_hex: "#1A1A1A", stock_quantity: 16, price: null },
      { id: "ari-black-11", size: "11", color: "Black", color_hex: "#1A1A1A", stock_quantity: 8, price: null },
    ],
    is_active: true,
    is_featured: false,
  },
  {
    name: "Cable Knit Sweater",
    brand: "Polo Ralph Lauren",
    base_price: 198,
    description:
      "A classic cable-knit sweater in pure cotton. Features intricate cable stitching at the front and ribbed trim for a refined preppy look.",
    category: "knitwear",
    details: [
      "100% cotton cable-knit construction",
      "Intricate front cable pattern",
      "Ribbed crew neck, cuffs, and hem",
      "Embroidered Pony at the chest",
      "Machine washable gentle cycle",
    ],
    features: [
      "Cotton yarn breathes naturally for year-round wear",
      "Reinforced shoulder seams prevent sagging",
      "Mid-weight gauge ideal for layering",
      "Anti-pilling finish maintains appearance",
    ],
    images: [
      {
        url: "/images/products/cable-knit.jpg",
        alt_text: "Polo Ralph Lauren Cable Knit Sweater",
        display_order: 1,
      },
    ],
    variants: [
      { id: "cable-navy-s", size: "S", color: "Navy", color_hex: "#1B2A4A", stock_quantity: 22, price: null },
      { id: "cable-navy-m", size: "M", color: "Navy", color_hex: "#1B2A4A", stock_quantity: 38, price: null },
      { id: "cable-navy-l", size: "L", color: "Navy", color_hex: "#1B2A4A", stock_quantity: 35, price: null },
      { id: "cable-navy-xl", size: "XL", color: "Navy", color_hex: "#1B2A4A", stock_quantity: 18, price: null },
      { id: "cable-grey-s", size: "S", color: "Grey", color_hex: "#B0B0B0", stock_quantity: 15, price: null },
      { id: "cable-grey-m", size: "M", color: "Grey", color_hex: "#B0B0B0", stock_quantity: 28, price: null },
      { id: "cable-grey-l", size: "L", color: "Grey", color_hex: "#B0B0B0", stock_quantity: 25, price: null },
      { id: "cable-grey-xl", size: "XL", color: "Grey", color_hex: "#B0B0B0", stock_quantity: 12, price: null },
      { id: "cable-cream-s", size: "S", color: "Cream", color_hex: "#FFFDD0", stock_quantity: 10, price: null },
      { id: "cable-cream-m", size: "M", color: "Cream", color_hex: "#FFFDD0", stock_quantity: 20, price: null },
      { id: "cable-cream-l", size: "L", color: "Cream", color_hex: "#FFFDD0", stock_quantity: 18, price: null },
      { id: "cable-cream-xl", size: "XL", color: "Cream", color_hex: "#FFFDD0", stock_quantity: 8, price: null },
    ],
    is_active: true,
    is_featured: true,
  },
  {
    name: "Denim Jacket",
    brand: "Levi's",
    base_price: 148,
    description:
      "A timeless trucker jacket in heavyweight denim. Features the signature button-front closure, chest pockets, and adjustable waist tabs for a custom fit.",
    category: "jackets",
    details: [
      "100% heavyweight cotton denim",
      "Button-front closure with signature shank buttons",
      "Two chest flap pockets with button closure",
      "Adjustable waist tabs on each side",
      "Levi's Red Tab at left chest pocket",
    ],
    features: [
      "Pre-washed for a broken-in feel",
      "Reinforced bartack stitching at stress points",
      "Spacious hand pockets at sides",
      "Can be layered over hoodies and flannels",
    ],
    images: [
      {
        url: "/images/products/denim-jacket.jpg",
        alt_text: "Levi's Denim Jacket",
        display_order: 1,
      },
    ],
    variants: [
      { id: "denim-dw-m", size: "M", color: "Dark Wash", color_hex: "#2F4F4F", stock_quantity: 25, price: null },
      { id: "denim-dw-l", size: "L", color: "Dark Wash", color_hex: "#2F4F4F", stock_quantity: 40, price: null },
      { id: "denim-dw-xl", size: "XL", color: "Dark Wash", color_hex: "#2F4F4F", stock_quantity: 22, price: null },
      { id: "denim-blk-m", size: "M", color: "Black", color_hex: "#1C1C1C", stock_quantity: 14, price: null },
      { id: "denim-blk-l", size: "L", color: "Black", color_hex: "#1C1C1C", stock_quantity: 28, price: null },
      { id: "denim-blk-xl", size: "XL", color: "Black", color_hex: "#1C1C1C", stock_quantity: 16, price: null },
    ],
    is_active: true,
    is_featured: false,
  },
  {
    name: "Supreme x Nike SB Dunk",
    brand: "Supreme",
    base_price: 350,
    description:
      "The highly coveted Supreme x Nike SB Dunk collaboration. Premium leather upper with star-embossed Swoosh branding and stacked Nike Air cushioning.",
    category: "footwear",
    details: [
      "Premium leather and suede upper",
      "Star-embossed leather Swoosh",
      "Nike Air-Sole unit in heel",
      "Supreme box logo at tongue and heel",
      "Rubber outsole with pivot circle",
    ],
    features: [
      "Padded low-cut collar for comfort",
      "Perforated toe box for breathability",
      "Fat tongue with exposed foam",
      "Thick flat laces with extra set included",
    ],
    images: [
      {
        url: "/images/products/sb-dunk.jpg",
        alt_text: "Supreme x Nike SB Dunk",
        display_order: 1,
      },
    ],
    variants: [
      { id: "sb-multi-8", size: "8", color: "Multi", color_hex: "#FF4500", stock_quantity: 3, price: null },
      { id: "sb-multi-9", size: "9", color: "Multi", color_hex: "#FF4500", stock_quantity: 7, price: null },
      { id: "sb-multi-10", size: "10", color: "Multi", color_hex: "#FF4500", stock_quantity: 9, price: null },
      { id: "sb-multi-11", size: "11", color: "Multi", color_hex: "#FF4500", stock_quantity: 4, price: null },
    ],
    is_active: true,
    is_featured: true,
  },
  {
    name: "Polo Short Sleeve",
    brand: "Polo Ralph Lauren",
    base_price: 98,
    description:
      "The original Polo shirt that started it all. Classic short-sleeve silhouette in breathable cotton pique with the iconic embroidered Pony at the chest.",
    category: "shirts",
    details: [
      "100% cotton pique knit",
      "Two-button placket with ribbed collar",
      "Tennis tail hem with side vents",
      "Embroidered Pony at left chest",
      "Machine washable",
    ],
    features: [
      "Pique fabric wicks moisture for comfort",
      "Ribbed collar resists curling",
      "Extended tail stays tucked in",
      "Pre-shrunk to minimize size loss",
    ],
    images: [
      {
        url: "/images/products/denim-shirt.jpg",
        alt_text: "Polo Ralph Lauren Short Sleeve Polo",
        display_order: 1,
      },
    ],
    variants: [
      { id: "polo-navy-s", size: "S", color: "Navy", color_hex: "#1B2A4A", stock_quantity: 30, price: null },
      { id: "polo-navy-m", size: "M", color: "Navy", color_hex: "#1B2A4A", stock_quantity: 55, price: null },
      { id: "polo-navy-l", size: "L", color: "Navy", color_hex: "#1B2A4A", stock_quantity: 50, price: null },
      { id: "polo-navy-xl", size: "XL", color: "Navy", color_hex: "#1B2A4A", stock_quantity: 28, price: null },
      { id: "polo-navy-xxl", size: "XXL", color: "Navy", color_hex: "#1B2A4A", stock_quantity: 12, price: null },
      { id: "polo-white-s", size: "S", color: "White", color_hex: "#F8F8F8", stock_quantity: 35, price: null },
      { id: "polo-white-m", size: "M", color: "White", color_hex: "#F8F8F8", stock_quantity: 60, price: null },
      { id: "polo-white-l", size: "L", color: "White", color_hex: "#F8F8F8", stock_quantity: 48, price: null },
      { id: "polo-white-xl", size: "XL", color: "White", color_hex: "#F8F8F8", stock_quantity: 25, price: null },
      { id: "polo-white-xxl", size: "XXL", color: "White", color_hex: "#F8F8F8", stock_quantity: 10, price: null },
      { id: "polo-red-s", size: "S", color: "Red", color_hex: "#CC0000", stock_quantity: 18, price: null },
      { id: "polo-red-m", size: "M", color: "Red", color_hex: "#CC0000", stock_quantity: 35, price: null },
      { id: "polo-red-l", size: "L", color: "Red", color_hex: "#CC0000", stock_quantity: 30, price: null },
      { id: "polo-red-xl", size: "XL", color: "Red", color_hex: "#CC0000", stock_quantity: 15, price: null },
      { id: "polo-red-xxl", size: "XXL", color: "Red", color_hex: "#CC0000", stock_quantity: 6, price: null },
      { id: "polo-green-s", size: "S", color: "Green", color_hex: "#2E8B57", stock_quantity: 12, price: null },
      { id: "polo-green-m", size: "M", color: "Green", color_hex: "#2E8B57", stock_quantity: 22, price: null },
      { id: "polo-green-l", size: "L", color: "Green", color_hex: "#2E8B57", stock_quantity: 20, price: null },
      { id: "polo-green-xl", size: "XL", color: "Green", color_hex: "#2E8B57", stock_quantity: 10, price: null },
      { id: "polo-green-xxl", size: "XXL", color: "Green", color_hex: "#2E8B57", stock_quantity: 4, price: null },
      { id: "polo-pink-s", size: "S", color: "Pink", color_hex: "#FFB6C1", stock_quantity: 14, price: null },
      { id: "polo-pink-m", size: "M", color: "Pink", color_hex: "#FFB6C1", stock_quantity: 25, price: null },
      { id: "polo-pink-l", size: "L", color: "Pink", color_hex: "#FFB6C1", stock_quantity: 22, price: null },
      { id: "polo-pink-xl", size: "XL", color: "Pink", color_hex: "#FFB6C1", stock_quantity: 12, price: null },
      { id: "polo-pink-xxl", size: "XXL", color: "Pink", color_hex: "#FFB6C1", stock_quantity: 5, price: null },
    ],
    is_active: true,
    is_featured: true,
  },
  {
    name: "Timberland 6-Inch Boot",
    brand: "Timberland",
    base_price: 210,
    description:
      "The legendary 6-inch waterproof boot built from premium nubuck leather. Seam-sealed construction with a padded collar and rugged rubber lug outsole.",
    category: "footwear",
    details: [
      "Premium waterproof nubuck leather upper",
      "Seam-sealed waterproof construction",
      "400g PrimaLoft insulation for warmth",
      "Padded leather collar for ankle comfort",
      "Rubber lug outsole for traction",
    ],
    features: [
      "Anti-fatigue comfort technology in midsole",
      "Steel shank for arch support",
      "Durable Goodyear welt construction",
      "Can be resoled for extended life",
    ],
    images: [
      {
        url: "/images/products/brown-shoes.jpg",
        alt_text: "Timberland 6-Inch Boot",
        display_order: 1,
      },
    ],
    variants: [
      { id: "tim-wheat-8", size: "8", color: "Wheat", color_hex: "#D4A06A", stock_quantity: 20, price: null },
      { id: "tim-wheat-9", size: "9", color: "Wheat", color_hex: "#D4A06A", stock_quantity: 35, price: null },
      { id: "tim-wheat-10", size: "10", color: "Wheat", color_hex: "#D4A06A", stock_quantity: 42, price: null },
      { id: "tim-wheat-11", size: "11", color: "Wheat", color_hex: "#D4A06A", stock_quantity: 28, price: null },
      { id: "tim-wheat-12", size: "12", color: "Wheat", color_hex: "#D4A06A", stock_quantity: 10, price: null },
      { id: "tim-olive-8", size: "8", color: "Olive", color_hex: "#556B2F", stock_quantity: 10, price: null },
      { id: "tim-olive-9", size: "9", color: "Olive", color_hex: "#556B2F", stock_quantity: 18, price: null },
      { id: "tim-olive-10", size: "10", color: "Olive", color_hex: "#556B2F", stock_quantity: 22, price: null },
      { id: "tim-olive-11", size: "11", color: "Olive", color_hex: "#556B2F", stock_quantity: 14, price: null },
      { id: "tim-olive-12", size: "12", color: "Olive", color_hex: "#556B2F", stock_quantity: 5, price: null },
    ],
    is_active: true,
    is_featured: true,
  },
  {
    name: "Oversized Graphic Tee",
    brand: "Nike",
    base_price: 55,
    description:
      "A relaxed-fit tee with a vintage-inspired Nike graphic. Heavyweight cotton jersey with a soft enzyme wash for a lived-in feel.",
    category: "shirts",
    details: [
      "Heavyweight 6.5 oz cotton jersey",
      "Enzyme-washed for a soft hand feel",
      "Oversized boxy fit",
      "Screen-printed Nike graphic at center chest",
      "Ribbed crew neck collar",
    ],
    features: [
      "Pre-shrunk cotton minimizes size loss",
      "Double-needle stitched hem and sleeves",
      "Taped shoulder seams prevent sagging",
      "Drop-shoulder design for relaxed drape",
    ],
    images: [
      {
        url: "/images/products/sneakers.jpg",
        alt_text: "Nike Oversized Graphic Tee",
        display_order: 1,
      },
    ],
    variants: [
      { id: "niketee-white-s", size: "S", color: "White", color_hex: "#F0F0F0", stock_quantity: 30, price: null },
      { id: "niketee-white-m", size: "M", color: "White", color_hex: "#F0F0F0", stock_quantity: 50, price: null },
      { id: "niketee-white-l", size: "L", color: "White", color_hex: "#F0F0F0", stock_quantity: 45, price: null },
      { id: "niketee-white-xl", size: "XL", color: "White", color_hex: "#F0F0F0", stock_quantity: 25, price: null },
      { id: "niketee-brown-s", size: "S", color: "Brown", color_hex: "#8B7355", stock_quantity: 15, price: null },
      { id: "niketee-brown-m", size: "M", color: "Brown", color_hex: "#8B7355", stock_quantity: 28, price: null },
      { id: "niketee-brown-l", size: "L", color: "Brown", color_hex: "#8B7355", stock_quantity: 22, price: null },
      { id: "niketee-brown-xl", size: "XL", color: "Brown", color_hex: "#8B7355", stock_quantity: 12, price: null },
      { id: "niketee-black-s", size: "S", color: "Black", color_hex: "#1C1C1C", stock_quantity: 20, price: null },
      { id: "niketee-black-m", size: "M", color: "Black", color_hex: "#1C1C1C", stock_quantity: 40, price: null },
      { id: "niketee-black-l", size: "L", color: "Black", color_hex: "#1C1C1C", stock_quantity: 35, price: null },
      { id: "niketee-black-xl", size: "XL", color: "Black", color_hex: "#1C1C1C", stock_quantity: 18, price: null },
    ],
    is_active: true,
    is_featured: false,
  },
  {
    name: "Fleece Hoodie Jacket",
    brand: "Polo Ralph Lauren",
    base_price: 175,
    description:
      "A premium fleece hoodie jacket with a full-zip front. Soft double-faced fleece with ribbed trim and signature embroidered Pony branding.",
    category: "jackets",
    details: [
      "Double-faced polyester fleece",
      "Full-zip front with YKK zipper",
      "Attached hood with drawstring adjustment",
      "Front kangaroo zip pockets",
      "Ribbed cuffs and hem",
    ],
    features: [
      "Anti-pill fleece maintains its look",
      "Interior headphone cord routing",
      "Zippered chest pocket for valuables",
      "Reinforced zipper garages prevent snagging",
    ],
    images: [
      {
        url: "/images/products/fleece-hoodie.jpg",
        alt_text: "Polo Ralph Lauren Fleece Hoodie Jacket",
        display_order: 1,
      },
    ],
    variants: [
      { id: "fleece-navy-m", size: "M", color: "Navy", color_hex: "#1B2A4A", stock_quantity: 22, price: null },
      { id: "fleece-navy-l", size: "L", color: "Navy", color_hex: "#1B2A4A", stock_quantity: 38, price: null },
      { id: "fleece-navy-xl", size: "XL", color: "Navy", color_hex: "#1B2A4A", stock_quantity: 20, price: null },
      { id: "fleece-grey-m", size: "M", color: "Grey", color_hex: "#888888", stock_quantity: 15, price: null },
      { id: "fleece-grey-l", size: "L", color: "Grey", color_hex: "#888888", stock_quantity: 28, price: null },
      { id: "fleece-grey-xl", size: "XL", color: "Grey", color_hex: "#888888", stock_quantity: 14, price: null },
    ],
    is_active: true,
    is_featured: false,
  },
  {
    name: "Linen Summer Trousers",
    brand: "Zara",
    base_price: 79,
    description:
      "Lightweight linen-blend trousers perfect for warm weather. A relaxed straight-leg cut with an elasticated drawstring waist for all-day comfort.",
    category: "bottoms",
    details: [
      "Linen-cotton blend fabric",
      "Elasticated waist with internal drawstring",
      "Straight-leg fit",
      "Side hand pockets and back welt pocket",
      "Unlined for breathability",
    ],
    features: [
      "Natural linen fibers wick moisture",
      "Crease-resistant fabric blend",
      "Easy pull-on styling with no hardware",
      "Tapered hem with 1.5-inch inseam allowance",
    ],
    images: [
      {
        url: "/images/products/linen-trousers.jpg",
        alt_text: "Zara Linen Summer Trousers",
        display_order: 1,
      },
    ],
    variants: [
      { id: "linen-khaki-s", size: "S", color: "Khaki", color_hex: "#C3B091", stock_quantity: 20, price: null },
      { id: "linen-khaki-m", size: "M", color: "Khaki", color_hex: "#C3B091", stock_quantity: 35, price: null },
      { id: "linen-khaki-l", size: "L", color: "Khaki", color_hex: "#C3B091", stock_quantity: 30, price: null },
      { id: "linen-khaki-xl", size: "XL", color: "Khaki", color_hex: "#C3B091", stock_quantity: 15, price: null },
      { id: "linen-white-s", size: "S", color: "White", color_hex: "#F5F5F5", stock_quantity: 18, price: null },
      { id: "linen-white-m", size: "M", color: "White", color_hex: "#F5F5F5", stock_quantity: 30, price: null },
      { id: "linen-white-l", size: "L", color: "White", color_hex: "#F5F5F5", stock_quantity: 25, price: null },
      { id: "linen-white-xl", size: "XL", color: "White", color_hex: "#F5F5F5", stock_quantity: 12, price: null },
      { id: "linen-beige-s", size: "S", color: "Beige", color_hex: "#E8DCC8", stock_quantity: 14, price: null },
      { id: "linen-beige-m", size: "M", color: "Beige", color_hex: "#E8DCC8", stock_quantity: 25, price: null },
      { id: "linen-beige-l", size: "L", color: "Beige", color_hex: "#E8DCC8", stock_quantity: 22, price: null },
      { id: "linen-beige-xl", size: "XL", color: "Beige", color_hex: "#E8DCC8", stock_quantity: 10, price: null },
    ],
    is_active: true,
    is_featured: false,
  },
  {
    name: "Adidas Samba",
    brand: "Adidas",
    base_price: 120,
    description:
      "The iconic Adidas Samba, a timeless indoor soccer shoe turned streetwear staple. Full-grain leather upper with the signature serrated 3-Stripe and gum rubber outsole.",
    category: "footwear",
    details: [
      "Full-grain leather upper",
      "Suede overlay at toe",
      "Signature serrated 3-Stripes",
      "Padded tongue and collar for comfort",
      "Gum rubber cupsole outsole",
    ],
    features: [
      "Leather upper molds to foot over time",
      "Low-profile court silhouette",
      "Reinforced heel counter for stability",
      "Non-marking rubber outsole",
    ],
    images: [
      {
        url: "/images/products/adidas-samba.jpg",
        alt_text: "Adidas Samba Sneakers",
        display_order: 1,
      },
    ],
    variants: [
      { id: "samba-wb-7", size: "7", color: "White/Blue", color_hex: "#F0F0F0", stock_quantity: 15, price: null },
      { id: "samba-wb-8", size: "8", color: "White/Blue", color_hex: "#F0F0F0", stock_quantity: 28, price: null },
      { id: "samba-wb-9", size: "9", color: "White/Blue", color_hex: "#F0F0F0", stock_quantity: 40, price: null },
      { id: "samba-wb-10", size: "10", color: "White/Blue", color_hex: "#F0F0F0", stock_quantity: 35, price: null },
      { id: "samba-wb-11", size: "11", color: "White/Blue", color_hex: "#F0F0F0", stock_quantity: 18, price: null },
    ],
    is_active: true,
    is_featured: true,
  },
  {
    name: "Bomber Jacket",
    brand: "Represent",
    base_price: 245,
    description:
      "A luxe bomber jacket in heavyweight Japanese nylon satin. Features a ribbed stand collar, full-zip front, and tone-on-tone embroidery for an elevated streetwear essential.",
    category: "jackets",
    details: [
      "Japanese nylon satin shell",
      "Polyester padding for lightweight warmth",
      "Ribbed stand collar, cuffs, and hem",
      "Full-zip front with YKK zipper",
      "Side zip pockets and interior pocket",
    ],
    features: [
      "Satin fabric has a subtle sheen",
      "Quilted lining for insulation without bulk",
      "Tone-on-tone brand embroidery at chest",
      "Snap storm flap over zipper",
    ],
    images: [
      {
        url: "/images/products/bomber-jacket.jpg",
        alt_text: "Represent Bomber Jacket",
        display_order: 1,
      },
    ],
    variants: [
      { id: "bomber-black-m", size: "M", color: "Black", color_hex: "#0D0D0D", stock_quantity: 18, price: null },
      { id: "bomber-black-l", size: "L", color: "Black", color_hex: "#0D0D0D", stock_quantity: 32, price: null },
      { id: "bomber-black-xl", size: "XL", color: "Black", color_hex: "#0D0D0D", stock_quantity: 20, price: null },
      { id: "bomber-olive-m", size: "M", color: "Olive", color_hex: "#4A5D23", stock_quantity: 12, price: null },
      { id: "bomber-olive-l", size: "L", color: "Olive", color_hex: "#4A5D23", stock_quantity: 22, price: null },
      { id: "bomber-olive-xl", size: "XL", color: "Olive", color_hex: "#4A5D23", stock_quantity: 14, price: null },
    ],
    is_active: true,
    is_featured: false,
  },
  {
    name: "Baggy Jeans",
    brand: "Zara",
    base_price: 69,
    description:
      "Relaxed baggy-fit jeans in mid-weight denim. A loose cut through the leg with a low-rise waist and subtle whiskering for a vintage-inspired look.",
    category: "bottoms",
    details: [
      "100% cotton mid-weight denim",
      "Baggy loose fit through leg",
      "Low-rise waist with belt loops",
      "Classic five-pocket construction",
      "Zip fly with button closure",
    ],
    features: [
      "Whiskering and hand-sanding details",
      "Reinforced pocket seams",
      "Hangtag with leather brand patch",
      "Raw hem can be cuffed or worn long",
    ],
    images: [
      {
        url: "/images/products/baggy-jeans.jpg",
        alt_text: "Zara Baggy Jeans",
        display_order: 1,
      },
    ],
    variants: [
      { id: "baggy-lw-s", size: "S", color: "Light Wash", color_hex: "#A0C4E8", stock_quantity: 25, price: null },
      { id: "baggy-lw-m", size: "M", color: "Light Wash", color_hex: "#A0C4E8", stock_quantity: 42, price: null },
      { id: "baggy-lw-l", size: "L", color: "Light Wash", color_hex: "#A0C4E8", stock_quantity: 38, price: null },
      { id: "baggy-lw-xl", size: "XL", color: "Light Wash", color_hex: "#A0C4E8", stock_quantity: 18, price: null },
      { id: "baggy-dw-s", size: "S", color: "Dark Wash", color_hex: "#2C3E50", stock_quantity: 15, price: null },
      { id: "baggy-dw-m", size: "M", color: "Dark Wash", color_hex: "#2C3E50", stock_quantity: 30, price: null },
      { id: "baggy-dw-l", size: "L", color: "Dark Wash", color_hex: "#2C3E50", stock_quantity: 25, price: null },
      { id: "baggy-dw-xl", size: "XL", color: "Dark Wash", color_hex: "#2C3E50", stock_quantity: 12, price: null },
    ],
    is_active: true,
    is_featured: false,
  },
]

function buildProduct(data: (typeof productsData)[number]): LocalProduct {
  const slug = generateSlug(data.name)
  return {
    ...data,
    id: slug,
    slug,
  }
}

export const localProducts: LocalProduct[] = productsData.map(buildProduct)

export function getProductBySlug(slug: string): LocalProduct | undefined {
  return localProducts.find((p) => p.slug === slug)
}

export function getRelatedProducts(
  category: string,
  excludeSlug: string,
): LocalProduct[] {
  return localProducts
    .filter((p) => p.category === category && p.slug !== excludeSlug)
    .slice(0, 4)
}

export function getProductsByCategory(category: string): LocalProduct[] {
  return localProducts.filter((p) => p.category === category)
}
