"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ProductCarousel } from "@/src/components/ui/product-carousel"
import { ProductGrid } from "@/src/components/ui/product-grid"
import { ProductModal } from "@/src/components/ui/product-modal"
import { BrandsSection } from "@/src/components/ui/brands-section"
import { WelcomeModal } from "@/src/components/ui/welcome-modal"
import { ErrorState } from "@/src/components/ui/error-state"
import { Package } from "lucide-react"
import { useProducts } from "@/src/hooks/use-products"
import { useSiteConfig } from "@/src/hooks/use-site-config"
import { useCart } from "@/src/hooks/use-cart"
import { useToast } from "@/src/components/ui/toast"
import { useTheme } from "@/src/hooks/use-theme"
import { formatProductForCarousel, formatProductForGrid, formatPrice } from "@/src/lib/product-utils"

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
  const { config, loading: configLoading } = useSiteConfig()
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const previousLogoRef = useRef<string | undefined>(undefined)
  
  // Log quando config.siteLogo mudar e resetar erro
  useEffect(() => {
    if (previousLogoRef.current !== config.siteLogo) {
      console.log('🔄 Logo mudou:', {
        anterior: previousLogoRef.current,
        novo: config.siteLogo,
        loading: configLoading
      });
      previousLogoRef.current = config.siteLogo;
      // Resetar erro quando logo mudar (de forma assíncrona)
      if (config.siteLogo && logoError) {
        console.log('🔄 Resetando erro porque logo mudou');
        setTimeout(() => {
          setLogoError(false);
        }, 0);
      }
    }
  }, [config.siteLogo, configLoading, logoError])
  
  const [selectedProduct, setSelectedProduct] = useState<SelectedProduct | null>(null)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const router = useRouter()
  const { addToCart } = useCart()
  const { toast } = useToast()
  const { theme } = useTheme()
  
  const { products, loading: productsLoading, error: productsError } = useProducts()
  
  // Debug: log quando config mudar
  useEffect(() => {
    console.log('🏠 Home - Config atual:', {
      siteLogo: config.siteLogo,
      siteName: config.siteName,
      isCloudinary: config.siteLogo?.startsWith('https://res.cloudinary.com'),
      startsWithHttps: config.siteLogo?.startsWith('https://'),
      loading: configLoading
    });
    
    // Resetar erro quando logo mudar (de forma assíncrona para evitar warning do linter)
    if (config.siteLogo && logoError) {
      setTimeout(() => {
        setLogoError(false)
      }, 0)
    }
  }, [config, configLoading, logoError])

  useEffect(() => {
    const hasSeenModal = sessionStorage.getItem("welcomeModalShown")
    const hasNavigated = sessionStorage.getItem("hasNavigated")
    
    if (!hasSeenModal && !hasNavigated) {
      requestAnimationFrame(() => {
        setShowWelcomeModal(true)
      })
    }
  }, [])

  const handleCloseModal = () => {
    setShowWelcomeModal(false)
    if (typeof window !== "undefined") {
      sessionStorage.setItem("welcomeModalShown", "true")
    }
  }

  const handleLogin = () => {
    setShowWelcomeModal(false)
    if (typeof window !== "undefined") {
      sessionStorage.setItem("welcomeModalShown", "true")
    }
    router.push("/login")
  }

  const handleProductClick = async (product: ProductForComponent) => {
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

    addToCart({
      id: product.id,
      name: product.name,
      price: price,
      image: product.image,
    })

    toast({
      title: "Produto adicionado!",
      description: `${product.name} foi adicionado ao carrinho`,
      duration: 3000,
    })

    handleCloseProductModal()
  }

  return (
    <>
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
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808015_1px,transparent_1px),linear-gradient(to_bottom,#80808015_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 dark:opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-neutral-400/10 dark:to-neutral-700/10" />

      <section className="relative pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20 flex flex-col items-center px-2 sm:px-4 z-10">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <div className="relative inline-block px-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8">
              {config.siteLogo && !logoError && !configLoading ? (
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 min-h-[112px]">
                  <div className="relative w-full h-full z-10">
                    <Image
                      key={`logo-${config.siteLogo}-${logoError ? 'error' : 'ok'}`}
                      src={config.siteLogo}
                      alt={`${config.siteName || 'VAQ APP'} Logo`}
                      fill
                      className="object-contain relative z-10 opacity-100"
                      style={{ 
                        objectFit: 'contain',
                        opacity: 1,
                        visibility: 'visible'
                      }}
                      priority
                      unoptimized={config.siteLogo.startsWith('http://') || config.siteLogo.startsWith('https://')}
                      sizes="(max-width: 640px) 112px, (max-width: 768px) 128px, (max-width: 1024px) 144px, 160px"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        const currentSrc = target.src;
                        console.error('❌ Erro ao carregar logo:', {
                          currentSrc,
                          originalLogo: config.siteLogo,
                          logoError
                        });
                        // Marcar erro se ainda não estiver em erro
                        if (!logoError) {
                          console.log('🔄 Erro ao carregar logo');
                          setLogoError(true);
                        }
                      }}
                      onLoad={(e) => {
                        const target = e.target as HTMLImageElement;
                        const currentSrc = target.src;
                        console.log('✅ Logo carregado com sucesso:', {
                          currentSrc,
                          originalLogo: config.siteLogo,
                          logoError,
                          imageWidth: target.naturalWidth,
                          imageHeight: target.naturalHeight
                        });
                        // Resetar erro quando logo carregar com sucesso
                        if (logoError) {
                          console.log('🔄 Resetando erro - logo carregou com sucesso');
                          setLogoError(false);
                        }
                      }}
                    />
                  </div>
                </div>
              ) : configLoading ? (
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 min-h-[112px] flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
              ) : null}
              
              <div className="relative flex flex-col items-center sm:items-start min-w-0">
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
                    <span className="inline-block relative overflow-hidden">
                      <span 
                        className="relative z-10 text-neutral-800 dark:text-neutral-100" 
                        style={{ 
                          animation: theme === 'dark' 
                            ? 'color-shift-vaq-dark 4s ease-in-out infinite' 
                            : 'color-shift-vaq 4s ease-in-out infinite'
                        }}
                      >
                        {(config.siteName || 'VAQ APP').split(' ')[0] || 'VAQ'}
                      </span>
                      <span 
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-400/40 dark:via-neutral-500/40 to-transparent"
                        style={{ 
                          animation: 'shimmer 3s ease-in-out infinite',
                          transform: 'translateX(-100%)',
                        }}
                      />
                    </span>
                    
                    <span className="inline-block ml-1.5 sm:ml-2 relative">
                      <span 
                        className="relative z-10 text-orange-600"
                        style={{ 
                          animation: 'glow-app 2.5s ease-in-out infinite',
                          textShadow: '0 0 4px rgba(234, 88, 12, 0.3)',
                        }}
                      >
                        {(config.siteName || 'VAQ APP').split(' ').slice(1).join(' ') || 'APP'}
                      </span>
                      <span 
                        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
                        style={{ 
                          animation: 'shimmer-app 3.5s ease-in-out infinite',
                          transform: 'translateX(-100%)',
                        }}
                      />
                      <span 
                        className="absolute inset-0 rounded-lg bg-orange-500/25 blur-xl"
                        style={{ 
                          animation: 'pulse-ring 2s ease-in-out infinite',
                        }}
                      />
                    </span>
                  </h1>
                  
                  <div 
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/0 via-orange-500/25 to-orange-500/0 blur-3xl"
                    style={{ 
                      animation: 'glow-outer 4s ease-in-out infinite',
                    }}
                  />
                </div>
              </div>
            </div>
            
            <p className="text-neutral-700 dark:text-neutral-300 text-lg sm:text-xl md:text-2xl font-medium mb-6 sm:mb-8 md:mb-10 px-4">
              O aplicativo do Vaqueiro
            </p>
            
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 sm:w-32 h-1 bg-gradient-to-r from-transparent via-neutral-600 dark:via-neutral-400 to-transparent rounded-full opacity-60" />
          </div>
          <p className="text-neutral-700 dark:text-neutral-300 mb-6 sm:mb-8 md:mb-10 text-base sm:text-lg px-4 mt-8">
            Qualidade e tradição em equipamentos de vaquejada
          </p>
        </div>

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
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-3"></div>
              <p className="text-neutral-600 dark:text-neutral-400">Carregando produtos...</p>
            </div>
          ) : productsError ? (
            <ErrorState
              title="Não foi possível carregar os produtos"
              message="Ocorreu um erro ao buscar os produtos. Por favor, tente novamente em alguns instantes."
              showRetry={true}
              onRetry={() => window.location.reload()}
            />
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-neutral-400 mx-auto mb-4 opacity-50" />
              <p className="text-neutral-600 dark:text-neutral-400 text-lg mb-2">
                Nenhum produto disponível no momento
              </p>
              <p className="text-neutral-500 dark:text-neutral-500 text-sm">
                Novos produtos serão adicionados em breve
              </p>
            </div>
          ) : (
            <ProductCarousel
              products={products.map(formatProductForCarousel)}
              onProductClick={handleProductClick}
            />
          )}
        </div>

        {productsLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-3"></div>
            <p className="text-neutral-600 dark:text-neutral-400">Carregando produtos...</p>
          </div>
        ) : productsError ? (
          <ErrorState
            title="Não foi possível carregar os produtos"
            message="Ocorreu um erro ao buscar os produtos. Por favor, tente novamente em alguns instantes."
            showRetry={true}
            onRetry={() => window.location.reload()}
          />
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-neutral-400 mx-auto mb-4 opacity-50" />
            <p className="text-neutral-600 dark:text-neutral-400 text-lg mb-2">
              Nenhum produto disponível no momento
            </p>
            <p className="text-neutral-500 dark:text-neutral-500 text-sm">
              Novos produtos serão adicionados em breve
            </p>
          </div>
        ) : (
          <ProductGrid
            products={products.map(formatProductForGrid)}
            onProductClick={handleProductClick}
          />
        )}

        <div id="sobre-section" className="w-full max-w-5xl mx-auto mb-12 sm:mb-16 md:mb-20 px-4 scroll-mt-20">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-neutral-900/95 via-neutral-900/90 to-neutral-950/95 backdrop-blur-2xl border border-neutral-800/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] p-8 sm:p-10 md:p-12">
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
    
    <WelcomeModal
      isOpen={showWelcomeModal}
      onClose={handleCloseModal}
      onLogin={handleLogin}
    />

    <ProductModal
      product={selectedProduct}
      isOpen={isProductModalOpen}
      onClose={handleCloseProductModal}
      onAddToCart={handleAddToCart}
    />
    </>
  )
}
