import Link from "next/link"
import { Logo } from "./Logo"

const footerLinks = {
  Shop: [
    { href: "/shop", label: "All Products" },
    { href: "/shop?category=shirts", label: "Shirts" },
    { href: "/shop?category=jackets", label: "Jackets" },
    { href: "/shop?category=bottoms", label: "Bottoms" },
    { href: "/shop?category=footwear", label: "Footwear" },
    { href: "/shop?category=accessories", label: "Accessories" },
  ],
  Support: [
    { href: "/contact", label: "Contact Us" },
    { href: "/shipping", label: "Shipping & Delivery" },
    { href: "/returns", label: "Returns & Exchanges" },
    { href: "/size-guide", label: "Size Guide" },
    { href: "/faq", label: "FAQ" },
  ],
  Company: [
    { href: "/about", label: "About Us" },
    { href: "/careers", label: "Careers" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xs">
              Premium men&apos;s fashion curated for the modern gentleman. Old money elegance meets contemporary streetwear.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs tracking-[0.15em] uppercase font-medium text-foreground mb-4">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={`${link.href}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} SKCLOSET. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">Follow us</span>
            <div className="flex gap-3">
              {[
                { name: "Instagram", href: "https://instagram.com/skcloset2.o" },
                { name: "TikTok", href: "https://tiktok.com/@skcloset2.o" },
                { name: "YouTube", href: "https://youtube.com/@skcloset2.o" },
              ].map((platform) => (
                <Link
                  key={platform.name}
                  href={platform.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
                >
                  {platform.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
