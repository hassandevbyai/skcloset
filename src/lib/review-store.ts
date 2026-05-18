const STORAGE_KEY = "skcloset_reviews"

export interface Review {
  id: string
  productSlug: string
  userName: string
  rating: number
  comment: string
  createdAt: string
  status: "pending" | "approved" | "rejected"
}

function readReviews(): Review[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function writeReviews(reviews: Review[]): Review[] {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews))
  }
  return reviews
}

function seedIfEmpty(): void {
  const existing = readReviews()
  if (existing.length > 0) return

  const demoReviews: Review[] = [
    {
      id: "demo-1",
      productSlug: "oxford-button-down-shirt",
      userName: "James",
      rating: 5,
      comment: "Perfect fit and amazing quality. The fabric feels premium and the color is exactly as pictured.",
      createdAt: "2026-05-10T14:30:00Z",
      status: "approved",
    },
    {
      id: "demo-2",
      productSlug: "oxford-button-down-shirt",
      userName: "Sarah",
      rating: 4,
      comment: "Great shirt, runs slightly large. Would recommend sizing down if between sizes.",
      createdAt: "2026-05-08T10:15:00Z",
      status: "approved",
    },
    {
      id: "demo-3",
      productSlug: "nuptse-puffer-jacket",
      userName: "Mike",
      rating: 5,
      comment: "Warmest jacket I've ever owned. The 700-fill down is no joke. Perfect for NYC winters.",
      createdAt: "2026-05-05T09:00:00Z",
      status: "approved",
    },
    {
      id: "demo-4",
      productSlug: "air-jordan-4-retro",
      userName: "Alex",
      rating: 3,
      comment: "Decent shoes but the color is slightly different from the photos.",
      createdAt: "2026-05-01T16:45:00Z",
      status: "pending",
    },
    {
      id: "demo-5",
      productSlug: "cable-knit-sweater",
      userName: "Emily",
      rating: 5,
      comment: "Beautiful sweater. The cable knit pattern is gorgeous and it's incredibly soft.",
      createdAt: "2026-04-28T11:20:00Z",
      status: "approved",
    },
  ]

  writeReviews(demoReviews)
}

export function getReviews(productSlug?: string): Review[] {
  seedIfEmpty()
  const all = readReviews()
  if (productSlug) return all.filter(r => r.productSlug === productSlug)
  return all
}

export function getApprovedReviews(productSlug: string): Review[] {
  seedIfEmpty()
  return readReviews().filter(r => r.productSlug === productSlug && r.status === "approved")
}

export function addReview(review: Omit<Review, "id" | "createdAt" | "status">): Review {
  const newReview: Review = {
    ...review,
    id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
    createdAt: new Date().toISOString(),
    status: "pending",
  }
  const all = readReviews()
  all.push(newReview)
  writeReviews(all)
  return newReview
}

export function moderateReview(id: string, status: "approved" | "rejected"): void {
  const all = readReviews()
  const idx = all.findIndex(r => r.id === id)
  if (idx !== -1) {
    all[idx].status = status
    writeReviews(all)
  }
}

export function getReviewStats(productSlug: string): { average: number; count: number } {
  const approved = getApprovedReviews(productSlug)
  if (approved.length === 0) return { average: 0, count: 0 }
  const sum = approved.reduce((a, r) => a + r.rating, 0)
  return { average: Math.round((sum / approved.length) * 10) / 10, count: approved.length }
}
