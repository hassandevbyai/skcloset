import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "@/components/layout/Icons"
import { FeaturedProductCard } from "@/components/product/FeaturedProductCard"

const products = [
  { name: "Oxford Button-Down Shirt", brand: "Polo Ralph Lauren", price: "$165", category: "shirts", image: "/images/products/oxford-shirt.jpg" },
  { name: "Nuptse Puffer Jacket", brand: "The North Face", price: "$295", category: "jackets", image: "/images/products/puffer-jacket.jpg" },
  { name: "Air Jordan 4 Retro", brand: "Jordan", price: "$225", category: "footwear", image: "/images/products/jordan-4.jpg" },
  { name: "Wide-Leg Pleated Pants", brand: "Zara", price: "$89", category: "bottoms", image: "/images/products/pleated-pants.jpg" },
  { name: "Arizona Sandals", brand: "Birkenstock", price: "$135", category: "footwear", image: "/images/products/sandals.jpg" },
  { name: "Cable Knit Sweater", brand: "Polo Ralph Lauren", price: "$198", category: "knitwear", image: "/images/products/cable-knit.jpg" },
  { name: "Denim Jacket", brand: "Levi's", price: "$148", category: "jackets", image: "/images/products/denim-jacket.jpg" },
  { name: "Supreme x Nike SB Dunk", brand: "Supreme", price: "$350", category: "footwear", image: "/images/products/sb-dunk.jpg" },
]

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-end bg-primary overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/hero.jpg"
          alt="SKCLOSET"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/10" />
      <div className="relative z-10 w-full pb-16 md:pb-20">
        <div className="mx-auto max-w-screen-2xl px-6 sm:px-8 lg:px-12">
          <h1 className="font-sans text-white/90 text-[10px] md:text-[11px] tracking-[0.4em] uppercase font-medium mb-8 animate-fade-in">
            SKCLOSET
          </h1>
          <div className="flex flex-wrap gap-4 animate-fade-in delay-200">
            <Link href="/shop?category=new-arrivals" className="inline-flex items-center gap-3 bg-accent text-accent-foreground px-8 py-4 text-[11px] tracking-[0.25em] uppercase font-semibold hover:bg-accent/90 transition-all group">
              Shop New In
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/shop" className="inline-flex items-center gap-3 border border-white/30 text-white px-8 py-4 text-[11px] tracking-[0.25em] uppercase font-medium hover:bg-white/10 transition-all">
              Explore
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <svg className="w-5 h-5 text-white/40 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </section>
  )
}

function BrandMarquee() {
  const brands = ["Polo Ralph Lauren", "Nike", "Supreme", "Jordan", "The North Face", "Birkenstock", "Adidas", "Timberland", "Represent", "Cole Buxton"]
  return (
    <section className="py-8 md:py-10 bg-primary border-b border-white/10 overflow-hidden marquee-group">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...brands, ...brands].map((brand, i) => (
          <span key={`${brand}-${i}`} className="mx-10 text-[11px] tracking-[0.25em] uppercase text-accent font-medium hover:text-accent/80 transition-colors duration-300">{brand}</span>
        ))}
      </div>
    </section>
  )
}

function LookbookSection() {
  const spreads = [
    { label: "Tailoring", image: "/images/lookbook-tailoring.jpg", href: "/shop?category=shirts" },
    { label: "Street", image: "/images/lookbook-street.jpg", href: "/shop?category=jackets" },
    { label: "Evening", image: "/images/lookbook-evening.jpg", href: "/shop?category=bottoms" },
    { label: "Weekend", image: "/images/lookbook-weekend.jpg", href: "/shop?category=footwear" },
  ]
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="mx-auto max-w-screen-2xl px-6 sm:px-8 lg:px-12">
        <div className="mb-12 md:mb-16">
          <p className="text-accent text-[10px] tracking-[0.35em] uppercase font-medium mb-3">The Lookbook</p>
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-foreground tracking-tight">Seasonal Edit</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {spreads.map((s, i) => (
            <Link key={s.label} href={s.href} className="group relative overflow-hidden bg-secondary aspect-[4/5] md:aspect-[3/4]">
              <Image
                src={s.image}
                alt={s.label}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
                <span className="text-white/40 text-[10px] tracking-[0.35em] uppercase font-medium mb-2">0{i + 1}</span>
                <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-1">{s.label}</h3>
                <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-accent font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  Shop <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturedProducts() {
  return (
    <section className="py-20 md:py-28 bg-secondary/30">
      <div className="mx-auto max-w-screen-2xl px-6 sm:px-8 lg:px-12">
        <div className="flex items-end justify-between mb-12 md:mb-16">
          <div>
            <p className="text-accent text-[10px] tracking-[0.35em] uppercase font-medium mb-3">New In</p>
            <h2 className="font-serif text-3xl md:text-5xl text-foreground">Latest Pieces</h2>
          </div>
          <Link href="/shop" className="hidden md:inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors group">
            View All <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6 lg:gap-8">
          {products.slice(0, 8).map((product) => (
            <FeaturedProductCard key={`${product.brand}-${product.name}`} {...product} />
          ))}
        </div>
        <div className="mt-10 text-center md:hidden">
          <Link href="/shop" className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors group">
            View All <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

const categories = [
  { title: "Shirts", href: "/shop?category=shirts", image: "/images/category-shirts.jpg" },
  { title: "Jackets", href: "/shop?category=jackets", image: "/images/category-jackets.jpg" },
  { title: "Bottoms", href: "/shop?category=bottoms", image: "/images/category-bottoms.jpg" },
  { title: "Footwear", href: "/shop?category=footwear", image: "/images/category-footwear.jpg" },
]

function CategoriesGrid() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-screen-2xl px-6 sm:px-8 lg:px-12">
        <div className="mb-12 md:mb-16">
          <p className="text-accent text-[10px] tracking-[0.35em] uppercase font-medium mb-3">Shop By</p>
          <h2 className="font-serif text-3xl md:text-5xl text-foreground">Category</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {categories.map((cat) => (
            <Link key={cat.title} href={cat.href} className="group relative h-[50vw] min-h-[280px] md:h-[40vw] md:min-h-[380px] lg:min-h-[440px] overflow-hidden bg-secondary">
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors duration-500" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white tracking-tight">
                  <span className="relative inline-block">
                    {cat.title}
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-500" />
                  </span>
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

const instaImages = [
  "/images/ig-1.jpg", "/images/ig-2.jpg",
  "/images/ig-3.jpg", "/images/ig-4.jpg",
  "/images/ig-5.jpg", "/images/ig-6.jpg",
]

function InstagramSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-screen-2xl px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground">@skcloset2.o</h2>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
          {instaImages.map((src, i) => (
            <a key={i} href="https://instagram.com/skcloset2.o" target="_blank" rel="noopener noreferrer" className="group relative aspect-square overflow-hidden bg-secondary cursor-pointer">
              <Image
                src={src}
                alt={`SKCLOSET Instagram ${i + 1}`}
                fill
                sizes="(max-width: 768px) 33vw, 16vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

function NewsletterSection() {
  const newsletterId = "newsletter-email"
  return (
    <section className="relative py-24 md:py-32 bg-primary overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-accent/5" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-accent/3 blur-[80px]" />
      <div className="relative z-10 mx-auto max-w-lg px-6 sm:px-8 text-center">
        <h2 className="font-serif text-4xl md:text-5xl text-primary-foreground mb-4 leading-tight">Stay in the know</h2>
        <p className="text-primary-foreground/40 text-sm mb-8">Sign up for early access to drops, exclusive content, and more.</p>
        <form action="/api/newsletter" method="POST" className="flex flex-col sm:flex-row gap-3">
          <label htmlFor={newsletterId} className="sr-only">Email address</label>
          <input id={newsletterId} type="email" name="email" placeholder="Email address" required className="flex-1 px-5 py-4 bg-white/5 border border-white/10 text-primary-foreground placeholder:text-primary-foreground/30 text-sm focus:outline-none focus:border-accent/50 transition-colors" />
          <button type="submit" className="px-8 py-4 bg-accent text-accent-foreground text-[10px] tracking-[0.25em] uppercase font-semibold hover:bg-accent/90 transition-colors whitespace-nowrap">Subscribe</button>
        </form>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BrandMarquee />
      <LookbookSection />
      <FeaturedProducts />
      <CategoriesGrid />
      <NewsletterSection />
      <InstagramSection />
    </>
  )
}