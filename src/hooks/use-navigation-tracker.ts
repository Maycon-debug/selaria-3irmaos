"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

// Hook para marcar navegação quando o usuário navega pelo site
export function useNavigationTracker() {
  const pathname = usePathname()
  const previousPathnameRef = useRef<string | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Se mudou de rota e não é a primeira vez (já tinha uma rota anterior)
      if (previousPathnameRef.current !== null && previousPathnameRef.current !== pathname) {
        // Marca que o usuário navegou pelo site
        sessionStorage.setItem("hasNavigated", "true")
      }
      
      // Atualiza a rota anterior
      previousPathnameRef.current = pathname
    }
  }, [pathname])
}


