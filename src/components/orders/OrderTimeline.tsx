"use client"

import { CheckIcon, XIcon } from "@/components/layout/Icons"

interface OrderTimelineProps {
  status: string
  createdAt: string
  updatedAt?: string
}

const normalSteps = [
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
]

const terminalStates = ["cancelled", "refunded"]

export default function OrderTimeline({ status, createdAt, updatedAt }: OrderTimelineProps) {
  const isTerminal = terminalStates.includes(status)
  const currentIndex = normalSteps.findIndex((s) => s.key === status)
  const isFailure = isTerminal || currentIndex === -1 || (status !== "delivered" && currentIndex < normalSteps.length - 1 && (status === "cancelled" || status === "refunded"))

  if (isFailure) {
    return (
      <div className="flex items-center justify-center gap-3 py-6">
        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <XIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground capitalize">{status}</p>
          {updatedAt && (
            <p className="text-xs text-muted-foreground">
              {new Date(updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          )}
        </div>
        {createdAt && (
          <div className="ml-auto text-right">
            <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground">Ordered</p>
            <p className="text-xs text-foreground">
              {new Date(createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="py-4">
      <div className="flex items-center justify-between">
        {normalSteps.map((step, i) => {
          const isCompleted = i <= currentIndex
          const isCurrent = i === currentIndex
          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                    isCompleted
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-muted-foreground"
                  } ${isCurrent ? "ring-2 ring-accent/50 ring-offset-2 ring-offset-background" : ""}`}
                >
                  {isCompleted ? (
                    <CheckIcon className="w-4 h-4" />
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </div>
                <span
                  className={`text-[10px] tracking-[0.15em] uppercase mt-2 whitespace-nowrap ${
                    isCompleted ? "text-foreground font-medium" : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
                {isCurrent && createdAt && (
                  <span className="text-[9px] text-muted-foreground mt-0.5">
                    {new Date(createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                )}
              </div>
              {i < normalSteps.length - 1 && (
                <div
                  className={`flex-1 h-px mx-2 ${
                    i < currentIndex ? "bg-accent" : "bg-border"
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}