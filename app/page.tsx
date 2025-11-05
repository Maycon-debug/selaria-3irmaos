"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProductCarousel } from "@/src/components/ui/product-carousel"
import { ProductGrid } from "@/src/components/ui/product-grid"
import { BrandsSection } from "@/src/components/ui/brands-section"
import { Button } from "@/src/components/ui/button"
import { WelcomeModal } from "@/src/components/ui/welcome-modal"
import { useProducts } from "@/src/hooks/use-products"
import { formatProductForCarousel, formatProductForGrid } from "@/src/lib/product-utils"

export default function Home() {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const router = useRouter()
  
  // Buscar produtos da API
  const { products, loading: productsLoading, error: productsError } = useProducts()

  useEffect(() => {
    // Verificar se o usuário já escolheu antes
    if (typeof window !== "undefined") {
      const hasChosen = localStorage.getItem("userChoice")
      if (!hasChosen) {
        // Mostrar modal apenas se não houver escolha salva
        setShowWelcomeModal(true)
      }
    }
  }, [])

  const handleCloseModal = () => {
    setShowWelcomeModal(false)
    // Salvar escolha de visitante
    if (typeof window !== "undefined") {
      localStorage.setItem("userChoice", "visitor")
    }
  }

  const handleLogin = () => {
    // Salvar escolha de login
    if (typeof window !== "undefined") {
      localStorage.setItem("userChoice", "login")
    }
    setShowWelcomeModal(false)
    router.push("/login")
  }

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-neutral-200 via-neutral-300 to-neutral-250 text-neutral-900 relative overflow-hidden">
      {/* Textura sutil de fundo */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808015_1px,transparent_1px),linear-gradient(to_bottom,#80808015_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-neutral-400/10" />

      {/* CONTEÚDO */}
      <section className="relative pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20 flex flex-col items-center px-2 sm:px-4 z-10">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <div className="relative inline-block px-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight drop-shadow-lg">
              <span className="text-neutral-800">Bem-vindo </span>
              <span className="text-neutral-800">Selaria </span>
              <span className="relative inline-block mx-1">
                {/* Sombra */}
                <span 
                  className="absolute inset-0 font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl select-none pointer-events-none"
                  style={{
                    fontFamily: "'Times New Roman', 'Georgia', serif",
                    fontStyle: "italic",
                    fontWeight: 900,
                    transform: "translateY(3px) translateX(3px)",
                    filter: "blur(2px)",
                    color: "rgba(0, 0, 0, 0.3)",
                  }}
                >
                  III
                </span>
                {/* Marca principal - cor sólida */}
                <span 
                  className="relative z-10 font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl select-none"
                  style={{
                    fontFamily: "'Times New Roman', 'Georgia', serif",
                    fontStyle: "italic",
                    fontWeight: 900,
                    letterSpacing: "0.02em",
                    color: "#404040",
                    filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4))",
                    transform: "perspective(600px) rotateX(-3deg)",
                    transformStyle: "preserve-3d",
                  }}
                >
                  III
                </span>
                {/* Reflexo espelhado */}
                <span 
                  className="absolute inset-0 font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl select-none pointer-events-none"
                  style={{
                    fontFamily: "'Times New Roman', 'Georgia', serif",
                    fontStyle: "italic",
                    fontWeight: 900,
                    letterSpacing: "0.02em",
                    transform: "scaleY(-1) translateY(-4px) perspective(600px) rotateX(3deg)",
                    color: "rgba(64, 64, 64, 0.3)",
                    filter: "blur(1.5px)",
                    opacity: 0.4,
                  }}
                >
                  III
                </span>
              </span>
              <span className="text-neutral-800"> Irmãos</span>
            </h1>
            {/* Linha decorativa abaixo do título */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 sm:w-32 h-1 bg-gradient-to-r from-transparent via-neutral-600 to-transparent rounded-full opacity-60" />
          </div>
          <p className="text-neutral-700 mb-6 sm:mb-8 md:mb-10 text-base sm:text-lg px-4 mt-8">
            Qualidade e tradição em equipamentos de vaquejada
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Button
              onClick={() => router.push('/produtos')}
              className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold transition-all duration-300 px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base shadow-lg hover:shadow-xl hover:shadow-orange-500/50 hover:scale-105 w-full sm:w-auto"
            >
              {/* Efeito de brilho animado */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg className="w-5 h-5 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Explorar Produtos
                <svg className="w-4 h-4 group-hover:translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </Button>

            <Button
              onClick={() => {
                const sobreSection = document.getElementById('sobre-section')
                sobreSection?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              variant="outline"
              className="group relative overflow-hidden rounded-lg border-2 border-neutral-700 hover:border-orange-500/50 bg-neutral-900/50 hover:bg-neutral-800/80 text-neutral-200 hover:text-white font-semibold transition-all duration-300 px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base shadow-lg hover:shadow-xl hover:shadow-orange-500/20 hover:scale-105 w-full sm:w-auto backdrop-blur-sm"
            >
              {/* Efeito de brilho animado */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Sobre Nós
              </span>
            </Button>
          </div>
        </div>

        {/* Carrossel de Produtos */}
        <div id="produtos-section" className="w-full scroll-mt-20">
          <div className="text-center mb-8 sm:mb-10 md:mb-12 px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-800 mb-2 sm:mb-3 tracking-tight drop-shadow-sm">
              Nossos Produtos
            </h2>
            <p className="text-neutral-700 text-sm sm:text-base md:text-lg">
              Passe o cursor sobre as imagens para ver os detalhes
            </p>
          </div>
          
          {productsLoading ? (
            <div className="text-center py-12">
              <p className="text-neutral-600">Carregando produtos...</p>
            </div>
          ) : productsError ? (
            <div className="text-center py-12">
              <p className="text-red-600">Erro ao carregar produtos: {productsError}</p>
            </div>
          ) : (
            <ProductCarousel
              products={products.slice(0, 8).map(formatProductForCarousel)}
            />
          )}
        </div>

        {/* Grid de Produtos em Destaque */}
        {productsLoading ? (
          <div className="text-center py-12">
            <p className="text-neutral-600">Carregando produtos...</p>
          </div>
        ) : productsError ? (
          <div className="text-center py-12">
            <p className="text-red-600">Erro ao carregar produtos: {productsError}</p>
          </div>
        ) : (
          <ProductGrid
            products={products.map(formatProductForGrid)}
          />
        )}

        {/* Seção Quem Somos */}
        <div id="sobre-section" className="w-full max-w-5xl mx-auto mb-12 sm:mb-16 md:mb-20 px-4 scroll-mt-20">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-neutral-900/95 via-neutral-900/90 to-neutral-950/95 backdrop-blur-2xl border border-neutral-800/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] p-8 sm:p-10 md:p-12">
            {/* Efeito espelho/glassmorphism */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-transparent pointer-events-none rounded-2xl" />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.08)_50%,transparent_100%)] pointer-events-none opacity-60 rounded-2xl" />
            
            <div className="relative z-10">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">
                  Quem Somos
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent rounded-full mx-auto opacity-80" />
              </div>
              
              <div className="space-y-4 sm:space-y-6 text-center">
                <p className="text-lg sm:text-xl md:text-2xl text-neutral-200 leading-relaxed font-medium">
                  Somos uma <span className="text-white font-bold">família</span> diretamente envolvida com o nicho de <span className="text-orange-400 font-semibold">vaquejada</span>, dedicada a oferecer os melhores equipamentos para este esporte que tanto amamos.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mt-8 sm:mt-10">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center border border-orange-500/30">
                      <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-neutral-400 uppercase tracking-wider">Localização</p>
                      <p className="text-base sm:text-lg font-semibold text-white">Cachoeirinha-PE</p>
                      <p className="text-sm text-neutral-300">Cidade do Couro e Aço</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center border border-orange-500/30">
                      <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-neutral-400 uppercase tracking-wider">Atendimento</p>
                      <p className="text-base sm:text-lg font-semibold text-white">Todo Brasil</p>
                      <p className="text-sm text-neutral-300">Entregas em todo território nacional</p>
                    </div>
                  </div>
                </div>
                
                <p className="text-base sm:text-lg text-neutral-300 leading-relaxed mt-6 sm:mt-8 max-w-3xl mx-auto">
                  Com conhecimento profundo e paixão pela vaquejada, nossa família está comprometida em fornecer produtos de <span className="text-white font-semibold">alta qualidade</span> que atendam às necessidades de atletas profissionais e amadores em todo o país.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Seção de Marcas/Parceiros */}
        <BrandsSection
          brands={[
            {
              id: "brand-1",
              name: "Parceiro 1",
              logo: "https://via.placeholder.com/150x80/000000/FFFFFF?text=Parceiro+1",
            },
            {
              id: "brand-2",
              name: "Parceiro 2",
              logo: "https://via.placeholder.com/150x80/000000/FFFFFF?text=Parceiro+2",
            },
            {
              id: "brand-3",
              name: "Parceiro 3",
              logo: "https://via.placeholder.com/150x80/000000/FFFFFF?text=Parceiro+3",
            },
            {
              id: "brand-4",
              name: "Parceiro 4",
              logo: "https://via.placeholder.com/150x80/000000/FFFFFF?text=Parceiro+4",
            },
            {
              id: "brand-5",
              name: "Parceiro 5",
              logo: "https://via.placeholder.com/150x80/000000/FFFFFF?text=Parceiro+5",
            },
            {
              id: "brand-6",
              name: "Parceiro 6",
              logo: "https://via.placeholder.com/150x80/000000/FFFFFF?text=Parceiro+6",
            },
          ]}
        />
      </section>
    </main>
    
    {/* Modal de Boas-vindas */}
    <WelcomeModal
      isOpen={showWelcomeModal}
      onClose={handleCloseModal}
      onLogin={handleLogin}
    />
    </>
  )
}
