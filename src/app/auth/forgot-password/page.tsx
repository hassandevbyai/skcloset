"use client"

import { Suspense, useState, type FormEvent } from "react"
import Link from "next/link"

function ForgotPasswordPageContent() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")
    if (!email.includes("@")) { setError("Please enter a valid email"); return }
    setLoading(true)
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (data.success) {
        setSent(true)
      } else {
        setError(data.error || "Something went wrong")
      }
    } catch {
      setError("Network error. Please try again.")
    }
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <h1 className="font-serif text-2xl text-foreground mb-4">Check Your Email</h1>
          <p className="text-sm text-muted-foreground mb-8">
            If an account exists with {email}, we&apos;ve sent password reset instructions.
          </p>
          <Link href="/auth/login" className="inline-block bg-accent text-accent-foreground px-8 py-3 text-xs tracking-[0.2em] uppercase font-medium hover:bg-accent/90 transition-colors">
            Back to Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="font-serif text-3xl tracking-[0.15em] text-accent uppercase">SKCLOSET</Link>
          <h1 className="font-serif text-2xl text-foreground mt-6 mb-2">Forgot Password</h1>
          <p className="text-sm text-muted-foreground">Enter your email to receive reset instructions</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="fpEmail" className="block text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium mb-1.5">Email</label>
            <input id="fpEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2.5 bg-transparent border border-border text-sm text-foreground focus:outline-none focus:border-accent transition-colors" />
          </div>
          {error && <p className="text-xs text-red-500 bg-red-500/5 border border-red-500/20 p-3">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-accent text-accent-foreground py-3 text-xs tracking-[0.2em] uppercase font-medium hover:bg-accent/90 transition-colors disabled:opacity-50">
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link href="/auth/login" className="text-foreground hover:text-accent underline underline-offset-2 transition-colors">Sign In</Link>
        </p>
      </div>
    </div>
  )
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh]" />}>
      <ForgotPasswordPageContent />
    </Suspense>
  )
}
