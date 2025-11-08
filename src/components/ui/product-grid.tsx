"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { AddToCartModal } from "./add-to-cart-modal"
import { useCart } from "@/src/hooks/use-cart"
import { useToast } from "./toast"
import { useSession } from "next-auth/react"

interface Product {
  id: string
  name: string
  description?: string
  price: string
  originalPrice?: string
  image: string
  rating?: number
  category?: string
}

interface ProductGridProps {
  products: Product[]
  className?: string
  onProductClick?: (product: Product) => void
}

export function ProductGrid({ products, className, onProductClick }: ProductGridProps) {
  const router = useRouter()
  const { addToCart } = useCart()
  const { toast } = useToast()
  const { data: session } = useSession()
  const [favorites, setFavorites] = React.useState<Set<string>>(new Set())
  const [hoveredProduct, setHoveredProduct] = React.useState<string | null>(null)
  const [modalOpen, setModalOpen] = React.useState(false)
  const [addedProduct, setAddedProduct] = React.useState<Product | null>(null)

  React.useEffect(() => {
    const loadFavorites = async () => {
      if (typeof window !== "undefined") {
        let localIds: string[] = []
        
        const saved = localStorage.getItem("favorites")
        if (saved) {
          try {
            localIds = JSON.parse(saved)
            setFavorites(new Set(localIds))
          } catch (error) {
            console.error("Erro ao carregar favoritos:", error)
          }
        }

        if (session?.user) {
          try {
            const res = await fetch('/api/favorites')
            if (res.ok) {
              const dbFavorites = await res.json()
              const dbProductIds = dbFavorites.map((f: any) => f.productId)
              const allIds = [...new Set([...localIds, ...dbProductIds])]
              setFavorites(new Set(allIds))
              localStorage.setItem("favorites", JSON.stringify(allIds))
            }
          } catch (error) {
            console.error("Erro ao carregar favoritos do banco:", error)
          }
        }
      }
    }
    loadFavorites()
  }, [session])

  const toggleFavorite = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const isAdding = !favorites.has(productId)
    
    if (session?.user) {
      try {
        if (isAdding) {
          const res = await fetch('/api/favorites', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId }),
          })
          
          if (res.ok) {
            toast({
              title: "Favorito adicionado!",
              description: "Produto salvo nos seus favoritos",
              duration: 2000,
            })
          } else {
            const error = await res.json()
            console.error('Erro ao salvar favorito no banco:', error)
            toast({
              title: "Aviso",
              description: "Favorito salvo localmente. Faça login para sincronizar.",
              duration: 3000,
            })
          }
        } else {
          const res = await fetch(`/api/favorites?productId=${productId}`, {
            method: 'DELETE',
          })
          
          if (!res.ok) {
            console.warn('Erro ao remover favorito do banco')
          }
        }
      } catch (error) {
        console.error('Erro ao salvar favorito no banco:', error)
        toast({
          title: "Aviso",
          description: "Favorito salvo localmente. Verifique sua conexão.",
          duration: 3000,
        })
      }
    }
    
    setFavorites((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(productId)) {
        newSet.delete(productId)
      } else {
        newSet.add(productId)
      }
      
      if (typeof window !== "undefined") {
        try {
          const productIds = Array.from(newSet)
          localStorage.setItem("favorites", JSON.stringify(productIds))
        } catch (error) {
          console.error("Erro ao salvar favoritos:", error)
        }
      }
      
      return newSet
    })
    
    if (isAdding) {
      setTimeout(() => {
        window.location.href = "/favoritos"
      }, 300)
    }
  }

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const priceStr = product.price.replace("R$", "").trim()
    const price = parseFloat(priceStr.replace(/\./g, "").replace(",", "."))
    
    addToCart({
      id: product.id,
      name: product.name,
      price: price,
      image: product.image,
    })

    toast({
      title: "Item adicionado ao carrinho",
      description: product.name,
      duration: 3000,
    })

    setAddedProduct(product)
    setModalOpen(true)
  }

  const handleContinueShopping = () => {
    setModalOpen(false)
    setAddedProduct(null)
  }

  const handleGoToCart = () => {
    setModalOpen(false)
    setAddedProduct(null)
    router.push("/carrinho")
  }

  return (
    <>
      <div className={cn("w-full max-w-7xl mx-auto px-2 sm:px-4 py-8 sm:py-12 md:py-16", className)}>
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-700 mb-2 sm:mb-3 tracking-tight drop-shadow-sm">
            Produtos em Destaque
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base md:text-lg px-4">
            Seleção especial dos nossos melhores produtos
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-neutral-900/95 via-neutral-900/90 to-neutral-950/95 backdrop-blur-2xl border border-neutral-800/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] transition-all duration-300 hover:shadow-[0_12px_48px_0_rgba(0,0,0,0.6)] hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-white/3 to-transparent pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.05)_50%,transparent_100%)] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                
                <div className="relative z-10">
                  <div 
                    className="relative h-64 overflow-hidden bg-neutral-950 cursor-pointer group/image"
                    onClick={() => onProductClick?.(product)}
                  >
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
                    
                    <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 text-white text-sm font-medium px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                        Clique para ver detalhes
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(product.id, e)
                      }}
                      className={cn(
                        "absolute top-3 right-3 z-20 p-2 rounded-full backdrop-blur-sm transition-all duration-300",
                        favorites.has(product.id)
                          ? "bg-red-500/90 text-white border border-red-400/50"
                          : "bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white border border-white/20"
                      )}
                      aria-label="Adicionar aos favoritos"
                    >
                      <Heart
                        className={cn(
                          "h-4 w-4 transition-all duration-300",
                          favorites.has(product.id) && "fill-current"
                        )}
                      />
                    </button>

                    {product.category && (
                      <div className="absolute top-3 left-3 z-20 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white text-xs font-medium border border-white/20">
                        {product.category}
                      </div>
                    )}
                  </div>

                  <div className="p-5 space-y-3">
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

                    <h3 className="text-lg font-semibold text-white line-clamp-2 group-hover:text-white transition-colors">
                      {product.name}
                    </h3>

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
      </div>

      {addedProduct && (
        <AddToCartModal
          isOpen={modalOpen}
          productName={addedProduct.name}
          onContinue={handleContinueShopping}
          onGoToCart={handleGoToCart}
          onClose={handleContinueShopping}
        />
      )}
    </>
  )
}
