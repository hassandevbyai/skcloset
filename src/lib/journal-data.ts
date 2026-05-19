export interface JournalArticle {
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  image: string
  category: string
}

export const journalArticles: JournalArticle[] = [
  {
    slug: "the-art-of-the-old-money-wardrobe",
    title: "The Art of the Old Money Wardrobe",
    excerpt:
      "Discover the timeless principles behind classic menswear and how to build a wardrobe that transcends trends.",
    content: `
      <p>There is a distinct difference between being well-dressed and being fashionable. The old money aesthetic is not about chasing seasonal trends or logo-heavy garments—it's about quality, fit, and an unwavering commitment to timeless style.</p>
      <h2>The Foundation: Quality Over Quantity</h2>
      <p>The old money wardrobe begins with a simple premise: buy fewer things, but buy better things. A well-constructed navy blazer from a reputable tailor will outlast ten fast-fashion alternatives, both in durability and style relevance.</p>
      <p>Key investments include a worsted wool suit in charcoal or navy, a selection of Oxford cloth button-down shirts, and leather shoes that can be resoled rather than replaced.</p>
      <h2>The Color Palette</h2>
      <p>Muted, natural tones form the backbone of the old money palette. Navy, cream, olive, camel, and burgundy are perennial staples. Patterns are classic: houndstooth, glen plaid, and pinstripes—never logo prints or trend-driven graphics.</p>
      <h2>The Finishing Touches</h2>
      <p>Accessories matter immensely in this aesthetic. A quality leather belt, a simple gold watch, and perhaps a silk pocket square communicate attention to detail without shouting for attention.</p>
      <p>The old money approach is not about mimicking wealth—it's about respecting craftsmanship and understanding that true style is quiet, confident, and enduring.</p>
    `,
    author: "SKCLOSET Editors",
    date: "2026-05-15",
    image: "/images/products/oxford-shirt.jpg",
    category: "Style Guide",
  },
  {
    slug: "streetwear-evolution-from-skateparks-to-runways",
    title: "Streetwear's Evolution: From Skateparks to Runways",
    excerpt:
      "How streetwear transformed from a subcultural uniform to a dominant force in luxury fashion.",
    content: `
      <p>Streetwear's journey from the sidewalks of 1980s California to the hallowed runways of Paris Fashion Week is one of the most remarkable stories in modern fashion history.</p>
      <h2>The Origins</h2>
      <p>What began as a practical uniform for skateboarders and surfers in Los Angeles—baggy jeans, graphic tees, and sneakers—quickly became a cultural movement. Shawn Stussy's eponymous brand, with its hand-drawn logo on surf tees, laid the groundwork for an industry now worth billions.</p>
      <h2>The Hype Era</h2>
      <p>The 2010s saw streetwear explode into the mainstream, driven by limited-edition drops and the rise of sneaker culture. Supreme's collaboration strategy became the blueprint, with brands from Louis Vuitton to The North Face seeking partnerships that blurred the lines between street and luxury.</p>
      <h2>Today's Landscape</h2>
      <p>Contemporary streetwear has matured beyond logo-heavy hoodies. Brands like Represent and Cole Buxton champion elevated essentials—heavier fabrics, refined silhouettes, and muted palettes that bridge the gap between street and sophistication.</p>
      <p>The modern wardrobe often mixes tailoring with sneakers, blazers with hoodies, creating a tension that is distinctly of its time. Streetwear is no longer a subculture; it has become a fundamental part of how men dress.</p>
    `,
    author: "SKCLOSET Editors",
    date: "2026-05-10",
    image: "/images/products/sb-dunk.jpg",
    category: "Culture",
  },
  {
    slug: "building-a-capsule-wardrobe-for-every-season",
    title: "Building a Capsule Wardrobe for Every Season",
    excerpt:
      "A practical guide to curating a versatile, seasonless wardrobe with fewer pieces and more possibilities.",
    content: `
      <p>A capsule wardrobe is the ultimate expression of intentional dressing. By curating a limited selection of versatile, high-quality pieces, you eliminate decision fatigue and ensure you always have something appropriate to wear.</p>
      <h2>The Core Principles</h2>
      <p>A well-designed capsule wardrobe consists of 30-40 items that work together seamlessly. Every piece should be able to create at least three different outfits. The key is versatility: neutral colors, classic silhouettes, and fabrics that transition between seasons.</p>
      <h2>Spring & Summer Essentials</h2>
      <p>For warmer months, prioritize breathable fabrics. Linen shirts, lightweight cotton trousers, and unstructured blazers in navy or beige form the foundation. White sneakers and leather loafers cover footwear needs from casual to smart-casual.</p>
      <h2>Fall & Winter Layering</h2>
      <p>Colder weather demands strategic layering. A wool overcoat, cable-knit sweaters, and quality denim are non-negotiables. Add a leather boot and a cashmere scarf, and you have a winter wardrobe that is both functional and refined.</p>
      <h2>The Investment Pieces</h2>
      <p>Certain items are worth spending more on: a tailored overcoat, Goodyear-welted boots, a quality watch, and a leather weekender bag. These pieces improve with age and form the backbone of a lasting wardrobe.</p>
      <p>Remember: a capsule wardrobe is not about deprivation—it's about curation. Every piece earns its place.</p>
    `,
    author: "SKCLOSET Editors",
    date: "2026-05-05",
    image: "/images/products/cable-knit.jpg",
    category: "Style Guide",
  },
]

export function getJournalArticle(slug: string): JournalArticle | undefined {
  return journalArticles.find((a) => a.slug === slug)
}

export function getRelatedArticles(slug: string): JournalArticle[] {
  return journalArticles.filter((a) => a.slug !== slug).slice(0, 2)
}

export function getArticleCategories(): string[] {
  return [...new Set(journalArticles.map((a) => a.category))]
}