export interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
}

const STORAGE_KEY = "skcloset_profile"

const defaults: UserProfile = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zip: "",
}

function readProfile(): UserProfile {
  if (typeof window === "undefined") return { ...defaults }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...defaults, ...JSON.parse(raw) } : { ...defaults }
  } catch {
    return { ...defaults }
  }
}

function writeProfile(profile: UserProfile): UserProfile {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  }
  return profile
}

export function getProfile(): UserProfile {
  return readProfile()
}

export function updateProfile(updates: Partial<UserProfile>): UserProfile {
  const current = readProfile()
  const updated = { ...current, ...updates }
  return writeProfile(updated)
}
