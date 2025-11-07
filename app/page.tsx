"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ProductCarousel } from "@/src/components/ui/product-carousel"
import { ProductGrid } from "@/src/components/ui/product-grid"
import { ProductModal } from "@/src/components/ui/product-modal"
import { BrandsSection } from "@/src/components/ui/brands-section"
import { WelcomeModal } from "@/src/components/ui/welcome-modal"
import { useProducts } from "@/src/hooks/use-products"
import { useCart } from "@/src/hooks/use-cart"
import { useToast } from "@/src/components/ui/toast"
import { useTheme } from "@/src/hooks/use-theme"
import { formatProductForCarousel, formatProductForGrid, formatPrice } from "@/src/lib/product-utils"

// Tipo para produto selecionado no modal (compatível com ProductModal)
interface SelectedProduct {
  id: string
  name: string
  description: string
  image: string
  price?: string
  originalPrice?: string
  category?: string
  rating?: number
}

// Tipo para produtos dos componentes (description opcional)
type ProductForComponent = {
  id: string
  name: string
  description?: string
  image: string
  price?: string
  originalPrice?: string
  category?: string
  rating?: number
}

export default function Home() {
  // Estado inicial sempre false para evitar erro de hidratação
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<SelectedProduct | null>(null)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const router = useRouter()
  const { addToCart } = useCart()
  const { toast } = useToast()
  const { theme } = useTheme()
  
  // Buscar produtos da API
  const { products, loading: productsLoading, error: productsError } = useProducts()

  // Verificar sessionStorage apenas no cliente após montagem (evita erro de hidratação)
  useEffect(() => {
    // Verificar se já viu o modal nesta sessão
    const hasSeenModal = sessionStorage.getItem("welcomeModalShown")
    
    // Verificar se já navegou pelo site (mudou de página)
    const hasNavigated = sessionStorage.getItem("hasNavigated")
    
    // Mostrar modal apenas se:
    // 1. Não viu o modal ainda nesta sessão
    // 2. E não navegou pelo site ainda (primeira vez na home)
    if (!hasSeenModal && !hasNavigated) {
      // Usar requestAnimationFrame para garantir execução após hidratação
      requestAnimationFrame(() => {
        setShowWelcomeModal(true)
      })
    }
  }, [])

  const handleCloseModal = () => {
    setShowWelcomeModal(false)
    // Marcar que o modal foi visto nesta sessão
    if (typeof window !== "undefined") {
      sessionStorage.setItem("welcomeModalShown", "true")
    }
  }

  const handleLogin = () => {
    setShowWelcomeModal(false)
    // Marcar que o modal foi visto
    if (typeof window !== "undefined") {
      sessionStorage.setItem("welcomeModalShown", "true")
    }
    router.push("/login")
  }

  const handleProductClick = async (product: ProductForComponent) => {
    // Se o produto já tem descrição, usar direto
    if (product.description) {
      setSelectedProduct({
        id: product.id,
        name: product.name,
        description: product.description,
        image: product.image,
        price: product.price,
        originalPrice: product.originalPrice,
        category: product.category,
        rating: product.rating,
      })
      setIsProductModalOpen(true)
    } else {
      // Se não tem descrição, buscar do banco usando o ID
      try {
        const res = await fetch(`/api/products/${product.id}`)
        if (res.ok) {
          const fullProduct = await res.json()
          setSelectedProduct({
            id: fullProduct.id,
            name: fullProduct.name,
            description: fullProduct.description,
            image: fullProduct.image,
            price: formatProductForCarousel(fullProduct).price,
            originalPrice: fullProduct.originalPrice ? formatPrice(fullProduct.originalPrice) : undefined,
            category: fullProduct.category,
            rating: fullProduct.rating,
          })
          setIsProductModalOpen(true)
        }
      } catch (error) {
        console.error('Erro ao buscar produto:', error)
      }
    }
  }

  const handleCloseProductModal = () => {
    setIsProductModalOpen(false)
    setSelectedProduct(null)
  }

  const handleAddToCart = (product: SelectedProduct) => {
    // Converter preço de string formatada para número
    const price = product.price 
      ? parseFloat(product.price.replace(/[^\d,]/g, '').replace(',', '.')) 
      : 0
    
    if (price <= 0) {
      toast({
        title: "Erro",
        description: "Preço inválido para este produto",
      })
      return
    }

    // Adicionar ao carrinho
    addToCart({
      id: product.id,
      name: product.name,
      price: price,
      image: product.image,
    })

    // Mostrar toast de sucesso
    toast({
      title: "Produto adicionado!",
      description: `${product.name} foi adicionado ao carrinho`,
      duration: 3000,
    })

    // Fechar o modal
    handleCloseProductModal()
  }

  return (
    <>
      {/* Animações CSS para o logo */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes shimmer-app {
          0% { transform: translateX(-100%); opacity: 0; }
          30% { opacity: 1; }
          70% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes glow-app {
          0%, 100% { 
            text-shadow: 0 0 4px rgba(234, 88, 12, 0.3);
            filter: brightness(1);
          }
          50% { 
            text-shadow: 0 0 8px rgba(234, 88, 12, 0.5), 0 0 12px rgba(234, 88, 12, 0.3);
            filter: brightness(1.1);
          }
        }
        
        @keyframes pulse-ring {
          0%, 100% { 
            opacity: 0.2;
            transform: scale(1);
          }
          50% { 
            opacity: 0.4;
            transform: scale(1.05);
          }
        }
        
        @keyframes glow-outer {
          0%, 100% { 
            opacity: 0.2;
          }
          50% { 
            opacity: 0.35;
          }
        }
        
        @keyframes color-shift-vaq {
          0%, 100% { 
            color: rgb(38, 38, 38);
          }
          50% { 
            color: rgb(82, 82, 91);
          }
        }
        
        @keyframes color-shift-vaq-dark {
          0%, 100% { 
            color: rgb(245, 245, 245);
          }
          50% { 
            color: rgb(212, 212, 216);
          }
        }
        
        @keyframes pulse-glow {
          0%, 100% { 
            transform: scale(1);
          }
          50% { 
            transform: scale(1.01);
          }
        }
      `}} />
      
      <main className="min-h-screen bg-gradient-to-br from-neutral-200 via-neutral-300 to-neutral-250 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-950 text-neutral-900 dark:text-neutral-100 relative overflow-hidden transition-colors duration-300">
      {/* Textura sutil de fundo */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808015_1px,transparent_1px),linear-gradient(to_bottom,#80808015_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 dark:opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-neutral-400/10 dark:to-neutral-700/10" />

      {/* CONTEÚDO */}
      <section className="relative pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20 flex flex-col items-center px-2 sm:px-4 z-10">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <div className="relative inline-block px-4">
            {/* Container principal com logo e título - alinhados e mesmo tamanho */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8">
              {/* Logo sem reflexo */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40">
                <div className="relative w-full h-full pb-2 z-10">
                  <Image
                    src="/images/logo/vq-app-logo.png"
                    alt="VAQ APP Logo"
                    fill
                    className="object-contain relative z-10"
                    priority
                    sizes="(max-width: 640px) 112px, (max-width: 768px) 128px, (max-width: 1024px) 144px, 160px"
                  />
                </div>
              </div>
              
              {/* Título VAQ APP com animações automáticas */}
              <div className="relative flex flex-col items-center sm:items-start min-w-0">
                {/* Texto com animações automáticas */}
                <div className="relative w-full pb-1 overflow-visible">
                  <h1 
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-wider drop-shadow-lg relative z-10 whitespace-nowrap animate-pulse-slow"
                    style={{
                      fontFamily: 'var(--font-logo)',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      fontWeight: 400,
                      lineHeight: 0.9,
                      animation: 'pulse-glow 3s ease-in-out infinite',
                    }}
                  >
                    {/* VAQ - Parte escura com efeito de brilho automático */}
                    <span className="inline-block relative overflow-hidden">
                      <span 
                        className="relative z-10 text-neutral-800 dark:text-neutral-100" 
                        style={{ 
                          animation: theme === 'dark' 
                            ? 'color-shift-vaq-dark 4s ease-in-out infinite' 
                            : 'color-shift-vaq 4s ease-in-out infinite'
                        }}
                      >
                        VAQ
                      </span>
                      {/* Efeito de brilho deslizante automático - mais suave */}
                      <span 
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-400/40 dark:via-neutral-500/40 to-transparent"
                        style={{ 
                          animation: 'shimmer 3s ease-in-out infinite',
                          transform: 'translateX(-100%)',
                        }}
                      />
                    </span>
                    
                    {/* APP - Parte laranja suave */}
                    <span className="inline-block ml-1.5 sm:ml-2 relative">
                      <span 
                        className="relative z-10 text-orange-600"
                        style={{ 
                          animation: 'glow-app 2.5s ease-in-out infinite',
                          textShadow: '0 0 4px rgba(234, 88, 12, 0.3)',
                        }}
                      >
                        APP
                      </span>
                      {/* Efeito de brilho pulsante automático */}
                      <span 
                        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
                        style={{ 
                          animation: 'shimmer-app 3.5s ease-in-out infinite',
                          transform: 'translateX(-100%)',
                        }}
                      />
                      {/* Efeito de pulso ao redor automático */}
                      <span 
                        className="absolute inset-0 rounded-lg bg-orange-500/25 blur-xl"
                        style={{ 
                          animation: 'pulse-ring 2s ease-in-out infinite',
                        }}
                      />
                    </span>
                  </h1>
                  
                  {/* Efeito de brilho suave ao redor do logo completo automático */}
                  <div 
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/0 via-orange-500/25 to-orange-500/0 blur-3xl"
                    style={{ 
                      animation: 'glow-outer 4s ease-in-out infinite',
                    }}
                  />
                </div>
              </div>
            </div>
            
            {/* Subtítulo */}
            <p className="text-neutral-700 dark:text-neutral-300 text-lg sm:text-xl md:text-2xl font-medium mb-6 sm:mb-8 md:mb-10 px-4">
              O aplicativo do Vaqueiro
            </p>
            
            {/* Linha decorativa abaixo do subtítulo */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 sm:w-32 h-1 bg-gradient-to-r from-transparent via-neutral-600 dark:via-neutral-400 to-transparent rounded-full opacity-60" />
          </div>
          <p className="text-neutral-700 dark:text-neutral-300 mb-6 sm:mb-8 md:mb-10 text-base sm:text-lg px-4 mt-8">
            Qualidade e tradição em equipamentos de vaquejada
          </p>

          {/* Botão WhatsApp Centralizado com Animações */}
          <div className="flex justify-center px-4 mb-8">
            <a
              href="https://wa.me/5581999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:from-green-600 hover:via-green-700 hover:to-green-800 text-white font-bold transition-all duration-500 px-10 sm:px-16 py-5 sm:py-6 text-lg sm:text-xl shadow-2xl hover:shadow-green-500/60 hover:scale-110 hover:-translate-y-2 flex items-center justify-center animate-pulse hover:animate-none"
            >
              {/* Efeito de brilho animado mais intenso */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              
              {/* Efeito de partículas brilhantes */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-3 left-6 w-3 h-3 bg-white rounded-full animate-ping" style={{ animationDelay: '0s' }} />
                <div className="absolute bottom-3 right-8 w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDelay: '0.3s' }} />
                <div className="absolute top-1/2 left-1/4 w-1.5 h-1.5 bg-white rounded-full animate-ping" style={{ animationDelay: '0.6s' }} />
              </div>
              
              {/* Efeito de ondas */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent animate-pulse" />
              </div>
              
              <span className="relative z-10 flex items-center justify-center gap-4">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 group-hover:animate-bounce group-hover:rotate-12 transition-all duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span className="tracking-wide drop-shadow-lg">Entre em contato agora via Zap</span>
                <svg className="w-6 h-6 sm:w-7 sm:h-7 group-hover:translate-x-3 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </a>
          </div>
        </div>

        {/* Carrossel de Produtos */}
        <div id="produtos-section" className="w-full scroll-mt-20">
          <div className="text-center mb-8 sm:mb-10 md:mb-12 px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-800 dark:text-neutral-100 mb-2 sm:mb-3 tracking-tight drop-shadow-sm">
              Nossos Produtos
            </h2>
            <p className="text-neutral-700 dark:text-neutral-300 text-sm sm:text-base md:text-lg">
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
              products={products.map(formatProductForCarousel)}
              onProductClick={handleProductClick}
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
            onProductClick={handleProductClick}
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

    {/* Modal de Produto */}
    <ProductModal
      product={selectedProduct}
      isOpen={isProductModalOpen}
      onClose={handleCloseProductModal}
      onAddToCart={handleAddToCart}
    />
    </>
  )
}
