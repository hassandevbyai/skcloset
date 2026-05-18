"use client"

import { useEffect, useState } from "react"

export function useTheme() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme")
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      const isDark = stored ? stored === "dark" : prefersDark
      setDark(isDark)
      document.documentElement.classList.toggle("dark", isDark)
    } catch {
      // localStorage may be disabled in some environments
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setDark(prefersDark)
      document.documentElement.classList.toggle("dark", prefersDark)
    }
  }, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle("dark", next)
    localStorage.setItem("theme", next ? "dark" : "light")
  }

  return { dark, toggle }
}
