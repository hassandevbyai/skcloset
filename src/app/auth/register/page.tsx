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
  const [socialLoading, setSocialLoading] = useState<string | null>(null)

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

  async function handleOAuth(provider: "google" | "apple") {
    setSocialLoading(provider)
    try {
      const res = await fetch("/api/auth/oauth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider }),
      })
      const data = await res.json()
      if (data.data?.url) {
        window.location.href = data.data.url
      }
    } catch {
      setError("Failed to initiate sign in. Please try again.")
    } finally {
      setSocialLoading(null)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="font-serif text-3xl tracking-[0.15em] text-accent uppercase">SKCLOSET</Link>
          <h1 className="font-serif text-2xl text-foreground mt-6 mb-2">Create Account</h1>
          <p className="text-sm text-muted-foreground">Join SKCLOSET today</p>
        </div>

        <div className="space-y-3 mb-6">
          <button
            onClick={() => handleOAuth("google")}
            disabled={socialLoading !== null}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 border border-border py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>
          <button
            onClick={() => handleOAuth("apple")}
            disabled={socialLoading !== null}
            className="w-full flex items-center justify-center gap-3 bg-black text-white border border-gray-700 py-2.5 text-sm font-medium hover:bg-gray-900 transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
            Continue with Apple
          </button>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground">Or continue with</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="fullName" className="block text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium mb-1.5">Full Name</label>
            <input id="fullName" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-2.5 bg-transparent border border-border text-sm text-foreground focus:outline-none focus:border-accent transition-colors" />
          </div>
          <div>
            <label htmlFor="regEmail" className="block text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium mb-1.5">Email</label>
            <input id="regEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2.5 bg-transparent border border-border text-sm text-foreground focus:outline-none focus:border-accent transition-colors" />
          </div>
          <div>
            <label htmlFor="regPassword" className="block text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium mb-1.5">Password</label>
            <input id="regPassword" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="w-full px-4 py-2.5 bg-transparent border border-border text-sm text-foreground focus:outline-none focus:border-accent transition-colors" />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-medium mb-1.5">Confirm Password</label>
            <input id="confirmPassword" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required className="w-full px-4 py-2.5 bg-transparent border border-border text-sm text-foreground focus:outline-none focus:border-accent transition-colors" />
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
