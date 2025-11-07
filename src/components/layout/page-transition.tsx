"use client"

import { useEffect, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'

export function PageTransition() {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)
  const previousPathnameRef = useRef(pathname)

  useEffect(() => {
    // Só mostra loading se a rota realmente mudou
    if (previousPathnameRef.current !== pathname) {
      setIsLoading(true)
      previousPathnameRef.current = pathname

      // Delay mínimo para melhorar percepção de performance
      // Em produção, isso ajuda a evitar "flash" muito rápido
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 300) // 300ms de delay mínimo

      return () => clearTimeout(timer)
    }
  }, [pathname])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-neutral-900/95 via-neutral-800/95 to-neutral-900/95 flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-200">
      {/* Efeito de fundo */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808015_1px,transparent_1px),linear-gradient(to_bottom,#80808015_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />
      
      {/* Loading spinner */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="relative">
          {/* Spinner externo */}
          <div className="w-16 h-16 border-4 border-neutral-700 rounded-full"></div>
          {/* Spinner interno animado */}
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-orange-500 rounded-full animate-spin"></div>
          {/* Spinner secundário */}
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-r-orange-400/50 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-neutral-400 text-sm font-medium animate-pulse">
            Carregando
          </p>
          <div className="flex gap-1">
            <span className="w-1 h-1 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-1 h-1 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-1 h-1 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
        </div>
      </div>
    </div>
  )
}
