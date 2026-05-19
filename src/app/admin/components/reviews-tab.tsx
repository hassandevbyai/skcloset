"use client"

import { useState, useEffect } from "react"
import { Star, Check, X } from "lucide-react"
import { getReviews, moderateReview, type Review } from "@/lib/review-store"
import { showToast } from "@/lib/toast-store"

type Filter = "all" | "pending" | "approved" | "rejected"

const statusBadge: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  approved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
}

export function ReviewsTab() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [filter, setFilter] = useState<Filter>("all")

  function loadReviews() {
    setReviews(getReviews())
  }

  useEffect(() => { loadReviews() }, [])

  const filtered = reviews.filter((r) => filter === "all" || r.status === filter)
  const pendingCount = reviews.filter((r) => r.status === "pending").length

  function handleModerate(id: string, status: "approved" | "rejected") {
    moderateReview(id, status)
    showToast(`Review ${status}`, "success")
    loadReviews()
  }

  function StarDisplay({ rating }: { rating: number }) {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`w-3 h-3 ${
              s <= rating ? "fill-accent text-accent" : "text-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          {reviews.length} total review{reviews.length !== 1 ? "s" : ""}
          {pendingCount > 0 && (
            <span className="ml-2 text-yellow-600 dark:text-yellow-400">
              | {pendingCount} pending moderation
            </span>
          )}
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        {(["all", "pending", "approved", "rejected"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-xs tracking-[0.15em] uppercase font-medium border transition-colors ${
              filter === f
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
            }`}
          >
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            {f !== "all" && (
              <span className="ml-1 text-[10px] opacity-60">
                ({reviews.filter((r) => r.status === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-[10px] tracking-[0.15em] uppercase text-muted-foreground">
              <th className="text-left p-4 font-medium">Product</th>
              <th className="text-left p-4 font-medium">User</th>
              <th className="text-left p-4 font-medium">Rating</th>
              <th className="text-left p-4 font-medium">Comment</th>
              <th className="text-left p-4 font-medium">Date</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-left p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted-foreground">
                  No reviews found
                </td>
              </tr>
            ) : (
              filtered.map((review, i) => (
                <tr
                  key={review.id}
                  className={`border-b border-border/50 ${
                    i % 2 === 0 ? "bg-background" : "bg-secondary/10"
                  }`}
                >
                  <td className="p-4 text-foreground font-mono text-xs">
                    {review.productSlug}
                  </td>
                  <td className="p-4 text-muted-foreground">{review.userName}</td>
                  <td className="p-4">
                    <StarDisplay rating={review.rating} />
                  </td>
                  <td className="p-4 text-muted-foreground max-w-[200px] truncate">
                    {review.comment}
                  </td>
                  <td className="p-4 text-muted-foreground text-xs whitespace-nowrap">
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-[10px] tracking-[0.1em] uppercase font-medium px-2 py-1 ${statusBadge[review.status] || ""}`}
                    >
                      {review.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {review.status === "pending" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleModerate(review.id, "approved")}
                          className="p-1.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                          title="Approve"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleModerate(review.id, "rejected")}
                          className="p-1.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                          title="Reject"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
