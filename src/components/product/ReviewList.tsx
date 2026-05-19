"use client"

import { useState, useEffect } from "react"
import { Star } from "lucide-react"
import { getApprovedReviews, getReviewStats, type Review } from "@/lib/review-store"

interface ReviewListProps {
  productSlug: string
}

export function ReviewList({ productSlug }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState({ average: 0, count: 0 })

  useEffect(() => {
    setReviews(getApprovedReviews(productSlug))
    setStats(getReviewStats(productSlug))
  }, [productSlug])

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 border border-border">
        <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 ${
                star <= Math.round(stats.average)
                  ? "fill-accent text-accent"
                  : "text-muted-foreground/30"
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-foreground">
          {stats.average} out of 5 stars ({stats.count} {stats.count === 1 ? "review" : "reviews"})
        </p>
      </div>

      {reviews.map((review) => (
        <div key={review.id} className="pb-4 border-b border-border/50 last:border-0 last:pb-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3.5 h-3.5 ${
                    star <= review.rating
                      ? "fill-accent text-accent"
                      : "text-muted-foreground/20"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-foreground">{review.userName}</span>
            <span className="text-[10px] text-muted-foreground">
              {new Date(review.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
          {review.images && review.images.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {review.images.map((url, i) => (
                <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="w-20 h-20 bg-secondary overflow-hidden block hover:opacity-80 transition-opacity">
                  <img src={url} alt={`Review image ${i + 1}`} className="w-full h-full object-cover" />
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}