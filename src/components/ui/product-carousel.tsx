"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface Product {
  id: string
  name: string
  description: string
  image: string
  price?: string
}

interface ProductCarouselProps {
  products: Product[]
  className?: string
}

export function ProductCarousel({ products, className }: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [isHovering, setIsHovering] = React.useState<string | null>(null)
  const [isPaused, setIsPaused] = React.useState(false)
  const [mousePositions, setMousePositions] = React.useState<Record<string, { x: number; y: number }>>({})
  const imageRefs = React.useRef<Record<string, HTMLDivElement | null>>({})

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // Auto-play com pausa ao interagir
  React.useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length)
    }, 5000) // Muda de slide a cada 5 segundos

    return () => clearInterval(interval)
  }, [currentIndex, isPaused, products.length])

  // Handler para movimento do mouse na imagem
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, productId: string) => {
    const imageRef = imageRefs.current[productId]
    if (!imageRef) return
    
    setIsHovering(productId)
    const rect = imageRef.getBoundingClientRect()
    
    // Calcula a posição do mouse relativa ao container (0 a 100%)
    const mouseX = ((e.clientX - rect.left) / rect.width) * 100
    const mouseY = ((e.clientY - rect.top) / rect.height) * 100
    
    // Mapeia para backgroundPosition - quando o mouse está no centro (50%), a imagem fica centralizada
    // Quando move para as bordas, a imagem se move na direção oposta
    const bgX = Math.max(0, Math.min(100, mouseX))
    const bgY = Math.max(0, Math.min(100, mouseY))
    
    setMousePositions(prev => ({
      ...prev,
      [productId]: { x: bgX, y: bgY }
    }))
  }

  const handleMouseLeave = (productId: string) => {
    setIsHovering(null)
    setMousePositions(prev => {
      const newPositions = { ...prev }
      delete newPositions[productId]
      return newPositions
    })
  }

  return (
    <div className={cn("relative w-full max-w-7xl mx-auto px-4", className)}>
      {/* Carrossel Container */}
      <div
        className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-neutral-900/95 via-neutral-900/90 to-neutral-950/95 backdrop-blur-2xl border border-neutral-800/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] p-6"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Efeito espelho/glassmorphism */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-transparent pointer-events-none rounded-2xl" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.08)_50%,transparent_100%)] pointer-events-none opacity-60 rounded-2xl" />
        <div className="relative z-10">
          {/* Slides */}
          <div className="relative h-[500px] md:h-[600px] z-10">
          {products.map((product, index) => (
            <div
              key={product.id}
              className={cn(
                "absolute inset-0 transition-all duration-700 ease-in-out",
                index === currentIndex
                  ? "opacity-100 translate-x-0 scale-100"
                  : index < currentIndex
                  ? "opacity-0 -translate-x-full scale-95"
                  : "opacity-0 translate-x-full scale-95"
              )}
            >
              <div className="grid md:grid-cols-2 gap-8 h-full items-center">
                {/* Imagem com Zoom e Pan */}
                <div 
                  ref={(el) => {
                    imageRefs.current[product.id] = el
                  }}
                  className="relative h-full rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800/50 group cursor-zoom-in"
                  onMouseMove={(e) => handleMouseMove(e, product.id)}
                  onMouseLeave={() => handleMouseLeave(product.id)}
                >
                  <div
                    className={cn(
                      "absolute inset-0 transition-transform duration-300 ease-out cursor-zoom-in",
                      isHovering === product.id ? "scale-[2.5]" : "scale-100"
                    )}
                    style={{
                      backgroundImage: `url(${product.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: mousePositions[product.id]
                        ? `${mousePositions[product.id].x}% ${mousePositions[product.id].y}%`
                        : "center",
                      backgroundRepeat: "no-repeat",
                      transition: isHovering === product.id 
                        ? "background-position 0s ease-out, transform 0.7s ease-out"
                        : "background-position 0.3s ease-out, transform 0.7s ease-out",
                    }}
                  />
                  {/* Overlay Gradient para melhor contraste */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  {/* Indicador de zoom */}
                  <div className="absolute top-4 right-4 bg-neutral-900/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-neutral-700/50 shadow-lg">
                    🔍 Mova o mouse para explorar
                  </div>
                </div>

                {/* Descrição */}
                <div className="flex flex-col justify-center space-y-4 px-4">
                  <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight drop-shadow-lg">
                    {product.name}
                  </h3>
                  <p className="text-neutral-200 text-lg leading-relaxed">
                    {product.description}
                  </p>
                  {product.price && (
                    <div className="pt-4">
                      <span className="text-2xl font-semibold text-white drop-shadow-md">
                        {product.price}
                      </span>
                    </div>
                  )}
                  <div className="pt-2">
                    <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all duration-200 border border-white/20 backdrop-blur-sm hover:shadow-lg shadow-md">
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

          {/* Navegação - Setas */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white hover:text-white transition-all duration-200 backdrop-blur-sm shadow-lg hover:shadow-xl"
            aria-label="Slide anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white hover:text-white transition-all duration-200 backdrop-blur-sm shadow-lg hover:shadow-xl"
            aria-label="Próximo slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Indicadores */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  index === currentIndex
                    ? "w-8 bg-white/90"
                    : "w-2 bg-white/40 hover:bg-white/60"
                )}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

