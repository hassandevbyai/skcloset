"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { addReview } from "@/lib/review-store"
import { showToast } from "@/lib/toast-store"
import { getUser } from "@/lib/auth-store"

interface ReviewFormProps {
  productSlug: string
  onSubmit?: () => void
}

export function ReviewForm({ productSlug, onSubmit }: ReviewFormProps) {
  const user = getUser()
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [userName, setUserName] = useState(user?.name || "")
  const [submitting, setSubmitting] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (rating === 0) { showToast("Please select a rating", "error"); return }
    if (!comment.trim()) { showToast("Please write a review", "error"); return }
    if (!userName.trim()) { showToast("Please enter your name", "error"); return }

    setSubmitting(true)
    addReview({ productSlug, userName: userName.trim(), rating, comment: comment.trim() })
    setSubmitting(false)
    setRating(0)
    setComment("")
    showToast("Review submitted for moderation")
    onSubmit?.()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2">Your Rating</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-0.5 transition-colors"
                aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
              >
              <Star
                className={`w-5 h-5 ${
                  star <= (hoveredRating || rating)
                    ? "fill-accent text-accent"
                    : "text-muted-foreground/30"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="reviewName" className="text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2 block">
          Your Name
        </label>
        <input id="reviewName" type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Enter your name" className="w-full px-3 py-2.5 bg-transparent border border-border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent transition-colors" />
      </div>

      <div>
        <label htmlFor="reviewComment" className="text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2 block">
          Your Review
        </label>
        <textarea id="reviewComment" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your thoughts about this product..." rows={4} className="w-full px-3 py-2.5 bg-transparent border border-border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent transition-colors resize-none" />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="bg-primary text-primary-foreground text-xs tracking-[0.2em] uppercase font-medium px-6 py-3 hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  )
}
