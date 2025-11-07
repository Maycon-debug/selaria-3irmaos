"use client"

import { useEffect, useState } from "react"
import { X, LogIn, UserCircle } from "lucide-react"
import { Button } from "@/src/components/ui/button"

interface LogoutConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: () => void
  onContinueAsVisitor: () => void
}

export function LogoutConfirmModal({ 
  isOpen, 
  onClose, 
  onLogin, 
  onContinueAsVisitor 
}: LogoutConfirmModalProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      // Pequeno delay para animação de entrada
      const timeoutId = setTimeout(() => {
        setIsVisible(true)
      }, 10)
      return () => {
        clearTimeout(timeoutId)
        document.body.style.overflow = ""
      }
    } else {
      document.body.style.overflow = ""
      // Atualização assíncrona para evitar cascading renders
      const frameId = requestAnimationFrame(() => {
        setIsVisible(false)
      })
      return () => {
        cancelAnimationFrame(frameId)
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Overlay com blur */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-md z-[100] transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div
          className={`relative w-full max-w-md bg-gradient-to-b from-neutral-900/95 via-neutral-900/90 to-neutral-950/95 backdrop-blur-2xl border border-neutral-800/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] rounded-2xl p-6 sm:p-8 transform transition-all duration-300 ${
            isVisible ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Efeito espelho/glassmorphism */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-transparent pointer-events-none rounded-2xl" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.08)_50%,transparent_100%)] pointer-events-none opacity-60 rounded-2xl" />

          <div className="relative z-10">
            {/* Botão Fechar */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white border border-white/20 hover:border-white/30 transition-all duration-200 flex items-center justify-center"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Conteúdo */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 mb-4">
                <UserCircle className="h-10 w-10 text-orange-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Desconectar?
              </h2>
              <p className="text-neutral-300 text-sm sm:text-base">
                Como deseja continuar?
              </p>
            </div>

            {/* Botões */}
            <div className="space-y-3">
              <Button
                onClick={onLogin}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <LogIn className="h-5 w-5" />
                Fazer Login
              </Button>

              <Button
                onClick={onContinueAsVisitor}
                variant="outline"
                className="w-full bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-white/30 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2"
              >
                Continuar como Visitante
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

