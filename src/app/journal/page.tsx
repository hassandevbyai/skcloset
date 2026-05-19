import Link from "next/link"
import Image from "next/image"
import { journalArticles, getArticleCategories } from "@/lib/journal-data"

export default function JournalPage() {
  const articles = journalArticles
  const categories = getArticleCategories()

  return (
    <div className="min-h-screen">
      <div className="border-b border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <p className="text-xs tracking-[0.3em] uppercase text-accent font-medium mb-2">Editorial</p>
          <h1 className="font-serif text-3xl md:text-5xl text-foreground">The Journal</h1>
          <p className="text-sm text-muted-foreground mt-2">Stories, guides, and insights from the SKCLOSET team</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <span key={cat} className="px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase bg-secondary text-muted-foreground font-medium">
              {cat}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link key={article.slug} href={`/journal/${article.slug}`} className="group">
              <div className="aspect-[4/3] bg-secondary overflow-hidden relative mb-4">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] tracking-[0.15em] uppercase text-accent font-medium">{article.category}</span>
                  <span className="text-[10px] text-muted-foreground">{article.date}</span>
                </div>
                <h2 className="font-serif text-lg text-foreground group-hover:text-accent transition-colors">{article.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{article.excerpt}</p>
                <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground pt-2">By {article.author}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}