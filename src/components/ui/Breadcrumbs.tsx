import Link from "next/link"

interface BreadcrumbItem {
  label: string
  href?: string
}

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 overflow-hidden">
      <ol className="flex flex-wrap items-center gap-2 text-xs tracking-[0.1em] uppercase text-muted-foreground">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2 min-w-0">
            {i > 0 && <span className="shrink-0">/</span>}
            {item.href ? (
              <Link href={item.href} className="hover:text-foreground transition-colors truncate">
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground font-medium truncate">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
