export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <div className="border-b border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <p className="text-xs tracking-[0.3em] uppercase text-accent font-medium mb-2">Our Story</p>
          <h1 className="font-serif text-3xl md:text-5xl text-foreground">About SKCLOSET</h1>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-3xl space-y-8">
          <p className="text-sm text-muted-foreground leading-relaxed">
            SKCLOSET is a premium men&apos;s fashion destination curated for the modern gentleman. We bridge the gap between old money elegance and contemporary streetwear, offering a carefully selected collection of luxury essentials.
          </p>
          <div>
            <h2 className="text-lg font-medium text-foreground mb-2">Our Mission</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We believe that great style is an investment, not an expense. Our mission is to make premium fashion accessible by curating timeless pieces from the world&apos;s most respected brands — from Polo Ralph Lauren and Nike to Supreme and The North Face.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-medium text-foreground mb-2">Curated With Care</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every item in our collection is hand-selected for its quality, versatility, and enduring appeal. We focus on pieces that transcend seasonal trends — wardrobe staples that will remain relevant season after season.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-medium text-foreground mb-2">The SKCLOSET Difference</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We combine the convenience of modern e-commerce with the personal touch of a boutique shopping experience. From our detailed size guides to our dedicated support team, every aspect of SKCLOSET is designed to make premium fashion effortless.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
