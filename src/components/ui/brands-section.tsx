"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface Brand {
  id: string
  name: string
  logo: string
  url?: string
}

interface BrandsSectionProps {
  brands: Brand[]
  className?: string
}

export function BrandsSection({ brands, className }: BrandsSectionProps) {
  const [hoveredBrand, setHoveredBrand] = React.useState<string | null>(null)

  return (
    <div className={cn("w-full max-w-7xl mx-auto px-4 py-16", className)}>
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-neutral-800 mb-3 tracking-tight drop-shadow-sm">
          Nossos Parceiros
        </h2>
        <p className="text-neutral-700 text-lg">
          Trabalhamos com as melhores marcas do mercado
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="group relative"
            onMouseEnter={() => setHoveredBrand(brand.id)}
            onMouseLeave={() => setHoveredBrand(null)}
          >
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-neutral-900/95 via-neutral-900/90 to-neutral-950/95 backdrop-blur-2xl border border-neutral-800/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] p-8 transition-all duration-300 hover:shadow-[0_12px_48px_0_rgba(0,0,0,0.6)] hover:scale-105 hover:border-white/20">
              {/* Efeito espelho/glassmorphism */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-transparent pointer-events-none rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.08)_50%,transparent_100%)] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              
              <div className="relative z-10 flex items-center justify-center h-20">
                {/* Logo da marca */}
                <div
                  className={cn(
                    "w-full h-full transition-all duration-500",
                    hoveredBrand === brand.id ? "scale-110" : "scale-100"
                  )}
                  style={{
                    backgroundImage: `url(${brand.logo})`,
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    filter: "brightness(0) invert(1)",
                    opacity: hoveredBrand === brand.id ? 1 : 0.7,
                  }}
                />
              </div>

              {/* Nome da marca (opcional) */}
              <div className="mt-4 text-center">
                <p className="text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors font-medium">
                  {brand.name}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

