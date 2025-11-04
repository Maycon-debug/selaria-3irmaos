"use client"

import * as React from "react"
import Link from "next/link"
import { ShoppingCart, X, Plus } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { cn } from "@/lib/utils"

interface AddToCartModalProps {
  isOpen: boolean
  productName: string
  onContinue: () => void
  onGoToCart: () => void
  onClose: () => void
}

export function AddToCartModal({
  isOpen,
  productName,
  onContinue,
  onGoToCart,
  onClose,
}: AddToCartModalProps) {
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

  if (!isOpen) return null

  return (
    <>
      {/* Overlay com blur */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="relative w-full max-w-md bg-gradient-to-b from-neutral-900/95 via-neutral-900/90 to-neutral-950/95 backdrop-blur-2xl border border-neutral-800/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] rounded-2xl p-6 sm:p-8 transform transition-all duration-300"
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
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 mb-4">
                <ShoppingCart className="h-8 w-8 text-green-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Produto Adicionado!
              </h2>
              <p className="text-neutral-300 text-sm sm:text-base">
                <span className="font-semibold text-white">{productName}</span> foi adicionado ao carrinho
              </p>
            </div>

            {/* Botões */}
            <div className="space-y-3">
              <Button
                onClick={onGoToCart}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-5 w-5" />
                Ir para o Carrinho
              </Button>

              <Button
                onClick={onContinue}
                variant="outline"
                className="w-full bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-white/30 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Continuar Comprando
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

