import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getJournalArticle, getRelatedArticles } from "@/lib/journal-data"
import Breadcrumbs from "@/components/ui/Breadcrumbs"

interface Props {
  params: Promise<{ slug: string }>
}

export default async function JournalArticlePage({ params }: Props) {
  const { slug } = await params
  const article = getJournalArticle(slug)

  if (!article) notFound()

  const related = getRelatedArticles(slug)

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Journal", href: "/journal" },
          { label: article.title },
        ]} />
      </div>

      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] tracking-[0.15em] uppercase text-accent font-medium">{article.category}</span>
            <span className="text-xs text-muted-foreground">{article.date}</span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl text-foreground leading-tight mb-4">{article.title}</h1>
          <p className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground">By {article.author}</p>
        </div>

        <div className="aspect-[16/9] bg-secondary overflow-hidden relative mb-10">
          <Image
            src={article.image}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            priority
          />
        </div>

        <div
          className="prose prose-sm prose-invert max-w-none
            prose-headings:font-serif prose-headings:text-foreground prose-headings:mt-8 prose-headings:mb-4
            prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
            prose-h2:text-xl prose-h2:font-serif
            prose-strong:text-foreground"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>

      {related.length > 0 && (
        <section className="border-t border-border py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-accent font-medium mb-2">Continue Reading</p>
                <h2 className="font-serif text-2xl md:text-3xl text-foreground">More from the Journal</h2>
              </div>
              <Link
                href="/journal"
                className="hidden md:inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors"
              >
                View All
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m9 18 6-6-6-6" /></svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {related.map((a) => (
                <Link key={a.slug} href={`/journal/${a.slug}`} className="group flex gap-4">
                  <div className="w-28 h-28 bg-secondary overflow-hidden relative shrink-0">
                    <Image src={a.image} alt={a.title} fill sizes="112px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] tracking-[0.15em] uppercase text-accent font-medium">{a.category}</span>
                    <h3 className="text-sm font-medium text-foreground group-hover:text-accent transition-colors mt-1">{a.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}