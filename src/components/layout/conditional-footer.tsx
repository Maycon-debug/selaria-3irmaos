"use client"

import { usePathname } from "next/navigation"
import { Footer } from "@/src/components/layout/footer"

export function ConditionalFooter() {
  const pathname = usePathname()
  
  // Não renderizar footer nas páginas de login, cadastro e admin
  if (
    pathname === "/login" || 
    pathname === "/cadastro" ||
    pathname?.startsWith("/admin")
  ) {
    return null
  }
  
  return <Footer />
}

