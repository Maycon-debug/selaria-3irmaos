"use client"

import { usePathname } from "next/navigation"
import { Header } from "@/src/components/layout/header"

export function ConditionalHeader() {
  const pathname = usePathname()
  
  // Não renderizar header nas páginas de login e cadastro
  if (pathname === "/login" || pathname === "/cadastro") {
    return null
  }
  
  return <Header />
}

