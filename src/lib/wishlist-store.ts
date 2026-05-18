const STORAGE_KEY = "skcloset_wishlist"

function readWishlist(): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeWishlist(slugs: string[]): string[] {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs))
  }
  return slugs
}

export function getWishlist(): string[] {
  return readWishlist()
}

export function toggleWishlist(slug: string): string[] {
  const list = readWishlist()
  const idx = list.indexOf(slug)
  if (idx === -1) {
    list.push(slug)
  } else {
    list.splice(idx, 1)
  }
  return writeWishlist(list)
}

export function isInWishlist(slug: string): boolean {
  return readWishlist().includes(slug)
}

export function clearWishlist(): string[] {
  return writeWishlist([])
}
