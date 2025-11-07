"use client"

import * as React from "react"

type Theme = "light" | "dark"

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<Theme>("light")
  const [mounted, setMounted] = React.useState(false)

  // Carregar tema do localStorage após montagem
  React.useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("theme") as Theme | null
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle("dark", savedTheme === "dark")
    } else {
      // Verificar preferência do sistema
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      const systemTheme: Theme = prefersDark ? "dark" : "light"
      setTheme(systemTheme)
      document.documentElement.classList.toggle("dark", systemTheme === "dark")
    }
  }, [])

  const toggleTheme = React.useCallback(() => {
    setTheme((prev) => {
      const newTheme = prev === "light" ? "dark" : "light"
      localStorage.setItem("theme", newTheme)
      document.documentElement.classList.toggle("dark", newTheme === "dark")
      return newTheme
    })
  }, [])

  // Sempre fornecer o contexto, mesmo antes da montagem
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = React.useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme deve ser usado dentro de ThemeProvider")
  }
  return context
}

