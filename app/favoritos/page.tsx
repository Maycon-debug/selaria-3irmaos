"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Heart, ShoppingCart, Star, Trash2 } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { cn } from "@/lib/utils"
import { AddToCartModal } from "@/src/components/ui/add-to-cart-modal"
import { useCart } from "@/src/hooks/use-cart"
import { useToast } from "@/src/components/ui/toast"

interface Product {
  id: string
  name: string
  price: string
  originalPrice?: string
  image: string
  rating?: number
  category?: string
  description?: string
}

export default function FavoritosPage() {
  const router = useRouter()
  const { addToCart } = useCart()
  const { toast } = useToast()
  const [favoriteProducts, setFavoriteProducts] = React.useState<Product[]>([])
  const [hoveredProduct, setHoveredProduct] = React.useState<string | null>(null)
  const [modalOpen, setModalOpen] = React.useState(false)
  const [addedProduct, setAddedProduct] = React.useState<Product | null>(null)

  // Carregar favoritos do localStorage
  React.useEffect(() => {
    const loadFavorites = () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("favorites")
        if (saved) {
          try {
            const productIds = JSON.parse(saved)
            // Buscar produtos completos (aqui você pode buscar de uma API ou usar dados mock)
            const allProducts = getAllProducts()
            const favorites = allProducts.filter((p) => productIds.includes(p.id))
            setFavoriteProducts(favorites)
          } catch (error) {
            console.error("Erro ao carregar favoritos:", error)
          }
        }
      }
    }

    loadFavorites()
    // Recarregar quando a página receber foco (caso favoritos sejam adicionados em outra aba)
    window.addEventListener("focus", loadFavorites)
    return () => window.removeEventListener("focus", loadFavorites)
  }, [])

  const removeFavorite = (productId: string) => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("favorites")
      if (saved) {
        try {
          const productIds = JSON.parse(saved)
          const updated = productIds.filter((id: string) => id !== productId)
          localStorage.setItem("favorites", JSON.stringify(updated))
          setFavoriteProducts((prev) => prev.filter((p) => p.id !== productId))
        } catch (error) {
          console.error("Erro ao remover favorito:", error)
        }
      }
    }
  }

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Converter preço de string para número
    const priceStr = product.price.replace("R$", "").trim()
    const price = parseFloat(priceStr.replace(/\./g, "").replace(",", "."))
    
    // Adicionar ao carrinho usando o hook
    addToCart({
      id: product.id,
      name: product.name,
      price: price,
      image: product.image,
    })

    // Mostrar notificação
    toast({
      title: "Item adicionado ao carrinho",
      description: product.name,
      duration: 3000,
    })

    // Mostrar modal
    setAddedProduct(product)
    setModalOpen(true)
  }

  const handleContinueShopping = () => {
    // Produto já está no carrinho, apenas fecha o modal
    setModalOpen(false)
    setAddedProduct(null)
  }

  const handleGoToCart = () => {
    // Produto já está no carrinho, navega para a página do carrinho
    setModalOpen(false)
    setAddedProduct(null)
    router.push("/carrinho")
  }

  // Função para obter todos os produtos (mesmos produtos da página inicial)
  const getAllProducts = (): Product[] => {
    return [
      {
        id: "sela-1",
        name: "Sela Vaquejada Premium",
        description: "Sela artesanal de couro legítimo, design ergonômico para máximo conforto e segurança.",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
        price: "R$ 1.899,00",
        originalPrice: "R$ 2.299,00",
        rating: 4.8,
        category: "Selas",
      },
      {
        id: "peitoral-1",
        name: "Peitoral e Cia Completo",
        description: "Peitoral completo para vaquejada com acabamento em couro legítimo.",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
        price: "R$ 1.499,00",
        rating: 4.9,
        category: "Equipamentos",
      },
      {
        id: "espora-1",
        name: "Espora Profissional",
        description: "Espora de alta qualidade para vaquejada, fabricada com materiais premium.",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
        price: "R$ 349,00",
        rating: 4.7,
        category: "Equipamentos",
      },
      {
        id: "cabecada-1",
        name: "Cabeçada Vaquejada",
        description: "Cabeçada profissional para vaquejada em couro nobre.",
        image: "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?w=600&h=600&fit=crop",
        price: "R$ 599,00",
        rating: 4.8,
        category: "Equipamentos",
      },
      {
        id: "cabresto-1",
        name: "Cabresto Premium",
        description: "Cabresto de couro legítimo para vaquejada. Resistente e confortável.",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
        price: "R$ 449,00",
        rating: 4.6,
        category: "Equipamentos",
      },
      {
        id: "luva-1",
        name: "Luva para Cavalo",
        description: "Luva especializada para proteção e cuidado do cavalo.",
        image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=600&h=600&fit=crop",
        price: "R$ 199,00",
        rating: 4.5,
        category: "Equipamentos",
      },
      {
        id: "capacete-1",
        name: "Capacete Vaquejada",
        description: "Capacete de segurança profissional para vaquejada.",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
        price: "R$ 399,00",
        rating: 4.9,
        category: "Equipamentos",
      },
      {
        id: "redea-1",
        name: "Rédea Premium",
        description: "Rédea de couro legítimo, acabamento artesanal e durabilidade excepcional.",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
        price: "R$ 299,00",
        rating: 4.7,
        category: "Equipamentos",
      },
    ]
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-200 via-neutral-300 to-neutral-250 text-neutral-900 relative overflow-hidden">
      {/* Textura sutil de fundo */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808015_1px,transparent_1px),linear-gradient(to_bottom,#80808015_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-neutral-400/10" />

      {/* CONTEÚDO */}
      <section className="relative pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20 flex flex-col items-center px-2 sm:px-4 z-10">
        <div className="w-full max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 sm:mb-10 md:mb-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <Link href="/" className="order-2 sm:order-1">
                <Button
                  variant="outline"
                  className="bg-neutral-800/90 hover:bg-neutral-900 text-neutral-100 hover:text-white border border-neutral-700 hover:border-neutral-600 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar ao Início
                </Button>
              </Link>
              <div className="text-center order-1 sm:order-2 flex-1 sm:absolute sm:left-1/2 sm:-translate-x-1/2">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-800 tracking-tight drop-shadow-sm mb-2 flex items-center justify-center gap-3">
                  <Heart className="h-8 w-8 sm:h-10 sm:w-10 text-red-500 fill-red-500" />
                  Meus Favoritos
                </h1>
                <p className="text-neutral-700 text-base sm:text-lg">
                  {favoriteProducts.length} {favoriteProducts.length === 1 ? "produto favoritado" : "produtos favoritados"}
                </p>
              </div>
              <div className="hidden sm:block order-3 w-24" />
            </div>
          </div>

          {/* Grid de Produtos Favoritos */}
          {favoriteProducts.length === 0 ? (
            <div className="text-center py-16 sm:py-24 md:py-32">
              <div className="inline-flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-b from-neutral-900/95 via-neutral-900/90 to-neutral-950/95 backdrop-blur-2xl border border-neutral-800/50 shadow-lg mb-6 sm:mb-8">
                <Heart className="h-12 w-12 sm:h-16 sm:w-16 text-neutral-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-800 mb-4 tracking-tight">
                Nenhum favorito ainda
              </h2>
              <p className="text-neutral-700 text-base sm:text-lg mb-8 max-w-md mx-auto px-4">
                Comece a adicionar produtos aos seus favoritos clicando no ícone de coração
              </p>
              <Link href="/">
                <Button
                  variant="default"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Explorar Produtos
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {favoriteProducts.map((product) => (
              <div
                key={product.id}
                className="group relative"
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-neutral-900/95 via-neutral-900/90 to-neutral-950/95 backdrop-blur-2xl border border-neutral-800/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] transition-all duration-300 hover:shadow-[0_12px_48px_0_rgba(0,0,0,0.6)] hover:scale-[1.02]">
                  {/* Efeito espelho/glassmorphism */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-white/3 to-transparent pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.05)_50%,transparent_100%)] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                  
                  <div className="relative z-10">
                    {/* Imagem do Produto */}
                    <div className="relative h-64 overflow-hidden bg-neutral-950">
                      <div
                        className={cn(
                          "absolute inset-0 transition-transform duration-700 ease-out",
                          hoveredProduct === product.id ? "scale-110" : "scale-100"
                        )}
                        style={{
                          backgroundImage: `url(${product.image})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />
                      
                      {/* Botão Remover dos Favoritos */}
                      <button
                        onClick={() => removeFavorite(product.id)}
                        className="absolute top-3 right-3 z-20 p-2 rounded-full bg-red-500/90 hover:bg-red-600 text-white border border-red-400/50 hover:border-red-300/70 backdrop-blur-sm transition-all duration-300 shadow-lg hover:shadow-xl"
                        aria-label="Remover dos favoritos"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      {/* Badge de categoria */}
                      {product.category && (
                        <div className="absolute top-3 left-3 z-20 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white text-xs font-medium border border-white/20">
                          {product.category}
                        </div>
                      )}
                    </div>

                    {/* Conteúdo do Card */}
                    <div className="p-5 space-y-3">
                      {/* Rating */}
                      {product.rating && (
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-3.5 w-3.5",
                                i < Math.floor(product.rating!)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-neutral-600"
                              )}
                            />
                          ))}
                          <span className="text-xs text-neutral-400 ml-1">
                            ({product.rating})
                          </span>
                        </div>
                      )}

                      {/* Nome do Produto */}
                      <h3 className="text-lg font-semibold text-white line-clamp-2 group-hover:text-white transition-colors">
                        {product.name}
                      </h3>

                      {/* Preço */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-white">
                          {product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-neutral-500 line-through">
                            {product.originalPrice}
                          </span>
                        )}
                      </div>

                      {/* Botão de Adicionar ao Carrinho */}
                      <button
                        className="w-full mt-4 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all duration-300 border border-white/20 hover:border-white/30 backdrop-blur-sm hover:shadow-lg flex items-center justify-center gap-2 group/btn"
                        onClick={(e) => handleAddToCart(product, e)}
                      >
                        <ShoppingCart className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                        Adicionar ao Carrinho
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal de Adicionar ao Carrinho */}
      {addedProduct && (
        <AddToCartModal
          isOpen={modalOpen}
          productName={addedProduct.name}
          onContinue={handleContinueShopping}
          onGoToCart={handleGoToCart}
          onClose={handleContinueShopping}
        />
      )}
    </main>
  )
}

