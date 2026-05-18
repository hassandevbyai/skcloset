"use client"

import { Suspense, useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { register } from "@/lib/auth-store"
import { showToast } from "@/lib/toast-store"

function RegisterPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/"
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")
    if (!name.trim()) { setError("Full name is required"); return }
    if (!email.includes("@")) { setError("Please enter a valid email"); return }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return }
    if (password !== confirm) { setError("Passwords do not match"); return }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 500))
    const result = register(email, password, name)
    if (result.success) {
      showToast("Account created successfully", "success")
      router.push(redirect)
    } else {
      setError(result.error || "Registration failed. Please try again.")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="font-serif text-3xl tracking-[0.15em] text-accent uppercase">SKCLOSET</Link>
          <h1 className="font-serif text-2xl text-foreground mt-6 mb-2">Create Account</h1>
          <p className="text-sm text-muted-foreground">Join SKCLOSET today</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[11px] tracking-[0.15em] uppercase text-accent font-medium mb-1.5">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-2.5 bg-transparent border border-border text-sm text-foreground focus:outline-none focus:border-accent transition-colors" />
          </div>
          <div>
            <label className="block text-[11px] tracking-[0.15em] uppercase text-accent font-medium mb-1.5">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2.5 bg-transparent border border-border text-sm text-foreground focus:outline-none focus:border-accent transition-colors" />
          </div>
          <div>
            <label className="block text-[11px] tracking-[0.15em] uppercase text-accent font-medium mb-1.5">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="w-full px-4 py-2.5 bg-transparent border border-border text-sm text-foreground focus:outline-none focus:border-accent transition-colors" />
          </div>
          <div>
            <label className="block text-[11px] tracking-[0.15em] uppercase text-accent font-medium mb-1.5">Confirm Password</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required className="w-full px-4 py-2.5 bg-transparent border border-border text-sm text-foreground focus:outline-none focus:border-accent transition-colors" />
          </div>
          {error && <p className="text-xs text-red-500 bg-red-500/5 border border-red-500/20 p-3">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-accent text-accent-foreground py-3 text-xs tracking-[0.2em] uppercase font-medium hover:bg-accent/90 transition-colors disabled:opacity-50">
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href={`/auth/login${redirect !== "/" ? `?redirect=${redirect}` : ""}`} className="text-foreground hover:text-accent underline underline-offset-2 transition-colors">Sign In</Link>
        </p>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh]" />}>
      <RegisterPageContent />
    </Suspense>
  )
}