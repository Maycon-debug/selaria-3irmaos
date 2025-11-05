"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { TextToSpeech } from "./text-to-speech"
import { Button } from "./button"
import { ShoppingCart } from "lucide-react"

interface Product {
  id: string
  name: string
  description: string
  image: string
  price?: string
  originalPrice?: string
  category?: string
  rating?: number
}

interface ProductModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onAddToCart?: (product: Product) => void
}

export function ProductModal({ product, isOpen, onClose, onAddToCart }: ProductModalProps) {
  const [imageLoaded, setImageLoaded] = React.useState(false)

  // Fechar com ESC
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  // Prevenir scroll do body quando modal está aberto
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen || !product) return null

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleAddToCartClick = () => {
    if (onAddToCart) {
      onAddToCart(product)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={handleBackdropClick}
    >
      {/* Modal Container */}
      <div
        className={cn(
          "relative w-full max-w-6xl max-h-[90vh] bg-gradient-to-br from-neutral-900/98 via-neutral-900/95 to-neutral-950/98",
          "backdrop-blur-2xl border border-neutral-800/50 rounded-2xl shadow-2xl",
          "overflow-hidden flex flex-col animate-in zoom-in-95 duration-300",
          "flex-col lg:flex-row"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-neutral-800/90 hover:bg-neutral-700/90 text-white transition-all duration-200 backdrop-blur-sm border border-neutral-700/50 shadow-lg hover:shadow-xl hover:scale-110"
          aria-label="Fechar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Imagem Grande */}
        <div className="relative w-full lg:w-1/2 h-64 sm:h-80 lg:h-auto bg-neutral-950 flex items-center justify-center overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <img
            src={product.image}
            alt={product.name}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-300",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
          />
          {/* Overlay gradient sutil */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-neutral-900/20 pointer-events-none" />
        </div>

        {/* Conteúdo */}
        <div className="flex-1 flex flex-col p-6 sm:p-8 lg:p-10 overflow-y-auto">
          {/* Categoria */}
          {product.category && (
            <div className="mb-4">
              <span className="inline-block px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-semibold border border-orange-500/30">
                {product.category}
              </span>
            </div>
          )}

          {/* Nome do Produto */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">
            {product.name}
          </h2>

          {/* Rating */}
          {product.rating !== undefined && product.rating > 0 && (
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={cn(
                      "w-5 h-5",
                      i < Math.floor(product.rating || 0)
                        ? "text-yellow-400 fill-current"
                        : "text-neutral-600"
                    )}
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <span className="text-neutral-400 text-sm">
                {product.rating.toFixed(1)} / 5.0
              </span>
            </div>
          )}

          {/* Descrição */}
          <div className="mb-6">
            <div className="flex items-start gap-3 mb-4">
              <p className="text-neutral-200 text-base sm:text-lg leading-relaxed flex-1">
                {product.description}
              </p>
              <TextToSpeech 
                text={product.description}
                className="flex-shrink-0"
              />
            </div>
          </div>

          {/* Preço */}
          <div className="mb-8 pb-6 border-b border-neutral-800/50">
            <div className="flex items-baseline gap-3 flex-wrap">
              {product.originalPrice && (
                <span className="text-xl text-neutral-500 line-through">
                  {product.originalPrice}
                </span>
              )}
              <span className="text-4xl sm:text-5xl font-bold text-white">
                {product.price || "Preço não disponível"}
              </span>
            </div>
            {product.originalPrice && product.price && (
              <p className="text-sm text-green-400 mt-2 font-medium">
                {(() => {
                  // Extrair valores numéricos dos preços formatados
                  const original = parseFloat(product.originalPrice.replace(/[^\d,]/g, '').replace(',', '.'))
                  const current = parseFloat(product.price.replace(/[^\d,]/g, '').replace(',', '.'))
                  const savings = original - current
                  return `Economia de ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(savings)}`
                })()}
              </p>
            )}
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-3 mt-auto">
            <Button
              onClick={handleAddToCartClick}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 text-lg shadow-lg hover:shadow-xl hover:shadow-orange-500/50 transition-all duration-300"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Adicionar ao Carrinho
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-2 border-neutral-700 hover:border-neutral-600 bg-neutral-800/50 hover:bg-neutral-700/50 text-white font-semibold py-3 px-6 text-lg transition-all duration-300"
            >
              Continuar Navegando
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

