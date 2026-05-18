import Link from "next/link"

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-baseline gap-0.5 group ${className || ""}`}>
      <span className="font-serif text-xl md:text-2xl tracking-[0.15em] uppercase text-foreground group-hover:text-accent transition-colors duration-300">
        SK
      </span>
      <span className="font-sans text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-muted-foreground group-hover:text-accent transition-colors duration-300 self-end mb-0.5">
        CLOSET
      </span>
    </Link>
  )
}