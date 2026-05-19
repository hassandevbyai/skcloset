const STORAGE_KEY = "skcloset_auth"
const USERS_KEY = "skcloset_users"

export interface AuthUser {
  email: string
  name: string
  role: "customer" | "admin"
}

export interface AuthState {
  isLoggedIn: boolean
  user: AuthUser | null
}

interface StoredUser {
  email: string
  passwordHash: string
  name: string
  role: "customer" | "admin"
}

// WARNING: This is a trivial hash for LOCAL DEVELOPMENT ONLY.
// It is NOT cryptographically secure and can be reversed trivially.
// Before deploying to production:
//   1. Delete this file entirely and use Supabase Auth exclusively.
//   2. Never store passwords in localStorage.
//   3. If a local fallback is absolutely required, use bcrypt or argon2.
function hashPassword(password: string): string {
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return "h_" + Math.abs(hash).toString(36)
}

function getUsers(): StoredUser[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveUsers(users: StoredUser[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  }
}

// WARNING: Seed accounts use hardcoded credentials for local development only.
// Before deploying to production, remove this function entirely and rely
// exclusively on Supabase Auth (which is the primary auth mechanism).
// The credentials below MUST be changed or moved to environment variables.
function ensureSeedUsers(): void {
  const users = getUsers()
  if (users.length > 0) return

  const adminEmail = process.env.NEXT_PUBLIC_SEED_ADMIN_EMAIL || "admin@skcloset.com"
  const adminPassword = process.env.NEXT_PUBLIC_SEED_ADMIN_PASSWORD || "admin123"
  const demoEmail = process.env.NEXT_PUBLIC_SEED_DEMO_EMAIL || "demo@skcloset.com"
  const demoPassword = process.env.NEXT_PUBLIC_SEED_DEMO_PASSWORD || "demo123456"

  const seedUsers: StoredUser[] = [
    {
      email: adminEmail,
      passwordHash: hashPassword(adminPassword),
      name: "Admin",
      role: "admin",
    },
    {
      email: demoEmail,
      passwordHash: hashPassword(demoPassword),
      name: "Demo",
      role: "customer",
    },
  ]
  saveUsers(seedUsers)
}

export function getAuthState(): AuthState {
  if (typeof window === "undefined") return { isLoggedIn: false, user: null }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { isLoggedIn: false, user: null }
    const user: AuthUser = JSON.parse(raw)
    return { isLoggedIn: true, user }
  } catch {
    return { isLoggedIn: false, user: null }
  }
}

export function register(
  email: string,
  password: string,
  name: string
): { success: boolean; error?: string } {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Please enter a valid email" }
  }
  if (password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters" }
  }
  if (!name.trim()) {
    return { success: false, error: "Name is required" }
  }

  ensureSeedUsers()
  const users = getUsers()

  // Check for duplicate email
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, error: "An account with this email already exists" }
  }

  const newUser: StoredUser = {
    email: email.toLowerCase(),
    passwordHash: hashPassword(password),
    name: name.trim(),
    role: "customer",
  }

  users.push(newUser)
  saveUsers(users)

  // Auto-login after registration
  const authUser: AuthUser = { email: email.toLowerCase(), name: name.trim(), role: "customer" }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser))

  return { success: true }
}

export function login(
  email: string,
  password: string
): { success: boolean; user?: AuthUser; error?: string } {
  ensureSeedUsers()

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Please enter a valid email" }
  }
  if (password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters" }
  }

  const users = getUsers()
  const normalizedEmail = email.toLowerCase()
  const stored = users.find((u) => u.email === normalizedEmail)

  if (!stored) {
    return { success: false, error: "Invalid email or password" }
  }

  if (stored.passwordHash !== hashPassword(password)) {
    return { success: false, error: "Invalid email or password" }
  }

  const user: AuthUser = {
    email: stored.email,
    name: stored.name,
    role: stored.role,
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  return { success: true, user }
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function getUser(): AuthUser | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function isLoggedIn(): boolean {
  return !!getUser()
}

export function isAdmin(): boolean {
  const user = getUser()
  return user?.role === "admin"
}
