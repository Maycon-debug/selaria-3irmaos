"use client"

import * as React from "react"
import Link from "next/link"
import { X, ShoppingBag, Heart, User, Settings, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  // Fechar sidebar ao clicar fora
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  // Prevenir scroll do body quando sidebar está aberto
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-80 z-50 transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full bg-gradient-to-b from-neutral-900/95 via-neutral-900/90 to-neutral-950/95 backdrop-blur-2xl border-r border-neutral-800/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] flex flex-col">
          {/* Efeito espelho/glassmorphism */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.08)_50%,transparent_100%)] pointer-events-none opacity-60" />

          <div className="relative z-10 flex flex-col h-full">
            {/* Header do Sidebar */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">Categorias</h2>
              <button
                onClick={onClose}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-all duration-200 border border-white/10 hover:border-white/20"
                aria-label="Fechar menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Navegação */}
            <nav className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              <Link
                href="/"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-all duration-200 border border-transparent hover:border-white/20 group"
              >
                <Home className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Início</span>
              </Link>

              <div className="pt-4">
                <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider px-4 mb-2">
                  Equipamentos
                </h3>
                <div className="space-y-1">
                  <Link
                    href="/produtos/selas"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-all duration-200 border border-transparent hover:border-white/20 group"
                  >
                    <ShoppingBag className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Selas</span>
                  </Link>
                  <Link
                    href="/produtos/arreios"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-all duration-200 border border-transparent hover:border-white/20 group"
                  >
                    <ShoppingBag className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Arreios</span>
                  </Link>
                  <Link
                    href="/produtos/botas"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-all duration-200 border border-transparent hover:border-white/20 group"
                  >
                    <ShoppingBag className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Botas</span>
                  </Link>
                  <Link
                    href="/produtos/peitoral-e-cia"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-all duration-200 border border-transparent hover:border-white/20 group"
                  >
                    <ShoppingBag className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Peitoral e Cia</span>
                  </Link>
                  <Link
                    href="/produtos/espora-profissional"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-all duration-200 border border-transparent hover:border-white/20 group"
                  >
                    <ShoppingBag className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Espora Profissional</span>
                  </Link>
                  <Link
                    href="/produtos/cabecada"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-all duration-200 border border-transparent hover:border-white/20 group"
                  >
                    <ShoppingBag className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Cabeçada</span>
                  </Link>
                  <Link
                    href="/produtos/cabresto"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-all duration-200 border border-transparent hover:border-white/20 group"
                  >
                    <ShoppingBag className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Cabresto</span>
                  </Link>
                  <Link
                    href="/produtos/luva-para-cavalo"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-all duration-200 border border-transparent hover:border-white/20 group"
                  >
                    <ShoppingBag className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Luva para Cavalo</span>
                  </Link>
                  <Link
                    href="/produtos/capacete"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-all duration-200 border border-transparent hover:border-white/20 group"
                  >
                    <ShoppingBag className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Capacete</span>
                  </Link>
                  <Link
                    href="/produtos/redea"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-all duration-200 border border-transparent hover:border-white/20 group"
                  >
                    <ShoppingBag className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Rédea</span>
                  </Link>
                </div>
              </div>
            </nav>

            {/* Footer do Sidebar */}
            <div className="border-t border-white/10 p-4 space-y-2">
              <Link
                href="/favoritos"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-all duration-200 border border-transparent hover:border-white/20 group"
              >
                <Heart className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Favoritos</span>
              </Link>
              <Link
                href="/perfil"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-all duration-200 border border-transparent hover:border-white/20 group"
              >
                <User className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Perfil</span>
              </Link>
              <Link
                href="/configuracoes"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-all duration-200 border border-transparent hover:border-white/20 group"
              >
                <Settings className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Configurações</span>
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

