"use client"

import { Suspense, useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { login } from "@/lib/auth-store"
import { showToast } from "@/lib/toast-store"

function LoginPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")
    if (!email.includes("@")) { setError("Please enter a valid email"); return }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 500))
    const result = login(email, password)
    if (result.success) {
      showToast(`Welcome back, ${result.user?.name || ""}`, "success")
      router.push(redirect)
    } else {
      setError(result.error || "Invalid credentials")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="font-serif text-3xl tracking-[0.15em] text-accent uppercase">SKCLOSET</Link>
          <h1 className="font-serif text-2xl text-foreground mt-6 mb-2">Sign In</h1>
          <p className="text-sm text-muted-foreground">Welcome back to SKCLOSET</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium mb-1.5">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2.5 bg-transparent border border-border text-sm text-foreground focus:outline-none focus:border-accent transition-colors" />
          </div>
          <div>
            <label htmlFor="password" className="block text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium mb-1.5">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="w-full px-4 py-2.5 bg-transparent border border-border text-sm text-foreground focus:outline-none focus:border-accent transition-colors" />
          </div>
          {error && <p className="text-xs text-red-500 bg-red-500/5 border border-red-500/20 p-3">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-accent text-accent-foreground py-3 text-xs tracking-[0.2em] uppercase font-medium hover:bg-accent/90 transition-colors disabled:opacity-50">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <div className="mt-6 text-center space-y-2">
          <Link href="/auth/forgot-password" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">Forgot Password?</Link>
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-foreground hover:text-accent underline underline-offset-2 transition-colors">Register</Link>
          </p>
          <Link href="/shop" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">Continue as Guest</Link>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" />}>
      <LoginPageContent />
    </Suspense>
  )
}
