"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useProducts, Product } from "@/src/hooks/use-products"
import { formatProductForGrid, formatPrice, extractCategoryFromName, smartProductSearch } from "@/src/lib/product-utils"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { ProductGrid } from "@/src/components/ui/product-grid"
import { 
  Search, 
  Filter, 
  Grid3x3, 
  List, 
  ArrowLeft,
  SlidersHorizontal,
  X,
  Package,
  TrendingUp,
  Star,
  ShoppingCart
} from "lucide-react"
import { useCart } from "@/src/hooks/use-cart"
import { useToast } from "@/src/components/ui/toast"
import { AddToCartModal } from "@/src/components/ui/add-to-cart-modal"
import { ErrorState } from "@/src/components/ui/error-state"

type ViewMode = 'grid' | 'list'
type SortOption = 'name' | 'price-asc' | 'price-desc' | 'rating' | 'newest'

export default function ProdutosPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { products, loading, error } = useProducts()
  const { addToCart } = useCart()
  const { toast } = useToast()
  
  // Inicializar searchTerm com o parâmetro da URL se existir
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || "")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
  const [modalOpen, setModalOpen] = useState(false)
  const [addedProduct, setAddedProduct] = useState<Product | null>(null)

  // Atualizar searchTerm quando o parâmetro da URL mudar
  useEffect(() => {
    const searchFromUrl = searchParams.get('search')
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl)
    }
  }, [searchParams])

  // Extrair categorias únicas dos produtos
  const categories = useMemo(() => {
    const cats = new Set<string>()
    products.forEach(product => {
      const category = extractCategoryFromName(product.name)
      if (category) cats.add(category)
    })
    return Array.from(cats).sort()
  }, [products])

  // Filtrar e ordenar produtos
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products

    // Filtro por busca inteligente
    if (searchTerm) {
      filtered = filtered.filter(product => smartProductSearch(product, searchTerm))
    }

    // Filtro por categoria
    if (selectedCategory) {
      filtered = filtered.filter(product =>
        extractCategoryFromName(product.name) === selectedCategory
      )
    }

    // Filtro por faixa de preço
    filtered = filtered.filter(product => {
      const price = typeof product.price === 'number' ? product.price : parseFloat(String(product.price).replace(/[^\d,]/g, '').replace(',', '.')) || 0
      return price >= priceRange[0] && price <= priceRange[1]
    })

    // Ordenação
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'price-asc': {
          const priceA = typeof a.price === 'number' ? a.price : parseFloat(String(a.price).replace(/[^\d,]/g, '').replace(',', '.')) || 0
          const priceB = typeof b.price === 'number' ? b.price : parseFloat(String(b.price).replace(/[^\d,]/g, '').replace(',', '.')) || 0
          return priceA - priceB
        }
        case 'price-desc': {
          const priceA = typeof a.price === 'number' ? a.price : parseFloat(String(a.price).replace(/[^\d,]/g, '').replace(',', '.')) || 0
          const priceB = typeof b.price === 'number' ? b.price : parseFloat(String(b.price).replace(/[^\d,]/g, '').replace(',', '.')) || 0
          return priceB - priceA
        }
        case 'rating':
          return (b.rating || 0) - (a.rating || 0)
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

    return sorted
  }, [products, searchTerm, selectedCategory, sortBy, priceRange])

  const handleAddToCart = (product: Product) => {
    const price = typeof product.price === 'number' ? product.price : parseFloat(String(product.price).replace(/[^\d,]/g, '').replace(',', '.')) || 0
    
    addToCart({
      id: product.id,
      name: product.name,
      price: price,
      image: product.image,
    })

    setAddedProduct(product)
    setModalOpen(true)

    toast({
      title: "Produto adicionado!",
      description: `${product.name} foi adicionado ao carrinho`,
      duration: 3000,
    })
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

  // Estatísticas
  const stats = {
    total: products.length,
    emEstoque: products.filter(p => (p.stock || 0) > 0).length,
    categorias: categories.length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 pt-20 pb-16">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_50%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.02)_50%,transparent_100%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-neutral-200 transition-colors duration-200 mb-6 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="text-sm font-medium">Voltar ao início</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-2 tracking-tight">
                Nossos Produtos
              </h1>
              <p className="text-neutral-400 text-sm sm:text-base">
                Encontre os melhores equipamentos de vaquejada
              </p>
            </div>

            {/* Estatísticas */}
            <div className="flex gap-4">
              <div className="bg-gradient-to-br from-neutral-800/95 to-neutral-900/95 backdrop-blur-xl border border-neutral-700/50 rounded-xl p-4 min-w-[100px]">
                <p className="text-neutral-400 text-xs mb-1">Total</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="bg-gradient-to-br from-neutral-800/95 to-neutral-900/95 backdrop-blur-xl border border-neutral-700/50 rounded-xl p-4 min-w-[100px]">
                <p className="text-neutral-400 text-xs mb-1">Estoque</p>
                <p className="text-2xl font-bold text-green-400">{stats.emEstoque}</p>
              </div>
            </div>
          </div>

          {/* Barra de Busca e Filtros */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Busca */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <Input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-neutral-900/50 border-neutral-700 text-white placeholder:text-neutral-500"
              />
            </div>

            {/* Botão Filtros */}
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="bg-neutral-900/50 border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filtros
              {selectedCategory && (
                <span className="ml-2 px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded-full text-xs">
                  1
                </span>
              )}
            </Button>

            {/* Ordenação */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 rounded-lg bg-neutral-900/50 border border-neutral-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            >
              <option value="newest">Mais Recentes</option>
              <option value="name">Nome A-Z</option>
              <option value="price-asc">Menor Preço</option>
              <option value="price-desc">Maior Preço</option>
              <option value="rating">Melhor Avaliação</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex gap-2 bg-neutral-900/50 border border-neutral-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-orange-500/20 text-orange-400'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-orange-500/20 text-orange-400'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Painel de Filtros */}
          {showFilters && (
            <div className="mb-6 p-6 bg-gradient-to-br from-neutral-900/95 to-neutral-950/95 backdrop-blur-xl border border-neutral-800/50 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Filtros</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Categorias */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-3">
                    Categorias
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`px-4 py-2 rounded-lg text-sm transition-all ${
                        selectedCategory === null
                          ? 'bg-orange-500 text-white'
                          : 'bg-neutral-800/50 text-neutral-300 hover:bg-neutral-700'
                      }`}
                    >
                      Todas
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-lg text-sm transition-all ${
                          selectedCategory === cat
                            ? 'bg-orange-500 text-white'
                            : 'bg-neutral-800/50 text-neutral-300 hover:bg-neutral-700'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Faixa de Preço */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-3">
                    Faixa de Preço: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                  </label>
                  <div className="flex gap-4">
                    <Input
                      type="number"
                      placeholder="Mínimo"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="bg-neutral-800/50 border-neutral-700 text-white"
                    />
                    <Input
                      type="number"
                      placeholder="Máximo"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="bg-neutral-800/50 border-neutral-700 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Resultados */}
          <div className="mb-4 text-sm text-neutral-400">
            {filteredAndSortedProducts.length === products.length ? (
              <span>Mostrando todos os {filteredAndSortedProducts.length} produtos</span>
            ) : (
              <span>
                Mostrando {filteredAndSortedProducts.length} de {products.length} produtos
                {(searchTerm || selectedCategory) && (
                  <button
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedCategory(null)
                    }}
                    className="ml-2 text-orange-400 hover:text-orange-300 underline"
                  >
                    Limpar filtros
                  </button>
                )}
              </span>
            )}
          </div>
        </div>

        {/* Grid de Produtos */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
            <p className="text-neutral-400 text-lg">Carregando produtos...</p>
          </div>
        ) : error ? (
          <ErrorState
            title="Não foi possível carregar os produtos"
            message="Ocorreu um erro ao buscar os produtos. Por favor, tente novamente em alguns instantes."
            showRetry={true}
            onRetry={() => window.location.reload()}
            showHomeButton={true}
          />
        ) : filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-400 text-lg mb-2">Nenhum produto encontrado</p>
            <p className="text-neutral-500 text-sm mb-6">
              Tente ajustar os filtros ou buscar por outro termo
            </p>
            <button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory(null)
                setPriceRange([0, 10000])
              }}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <ProductGrid
            products={filteredAndSortedProducts.map(formatProductForGrid)}
          />
        ) : (
          <div className="space-y-4">
            {filteredAndSortedProducts.map((product) => {
              const price = typeof product.price === 'number' ? product.price : parseFloat(String(product.price).replace(/[^\d,]/g, '').replace(',', '.')) || 0
              const originalPrice = product.originalPrice ? (typeof product.originalPrice === 'number' ? product.originalPrice : parseFloat(String(product.originalPrice).replace(/[^\d,]/g, '').replace(',', '.')) || 0) : null
              
              return (
                <div
                  key={product.id}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-neutral-900/95 via-neutral-900/90 to-neutral-950/95 backdrop-blur-2xl border border-neutral-800/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] transition-all duration-300 hover:shadow-[0_12px_48px_0_rgba(0,0,0,0.6)] hover:scale-[1.01]"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-white/3 to-transparent pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10 flex flex-col sm:flex-row gap-6 p-6">
                    {/* Imagem */}
                    <div className="relative w-full sm:w-48 h-64 sm:h-48 rounded-xl overflow-hidden bg-neutral-950 flex-shrink-0">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                        style={{ backgroundImage: `url(${product.image})` }}
                      />
                      <div className="absolute top-3 left-3 px-2 py-1 bg-orange-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-lg">
                        {extractCategoryFromName(product.name)}
                      </div>
                    </div>

                    {/* Informações */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-neutral-400 text-sm sm:text-base mb-4 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center gap-4 mb-4">
                          {product.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm text-neutral-300">{product.rating.toFixed(1)}</span>
                            </div>
                          )}
                          {product.stock !== undefined && (
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              product.stock > 10
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                : product.stock > 0
                                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                              {product.stock > 0 ? `${product.stock} em estoque` : 'Esgotado'}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-2xl font-bold text-white">{formatPrice(price)}</p>
                          {originalPrice && (
                            <p className="text-sm text-neutral-500 line-through">
                              {formatPrice(originalPrice)}
                            </p>
                          )}
                        </div>
                        <Button
                          onClick={() => handleAddToCart(product)}
                          className="bg-orange-500 hover:bg-orange-600 text-white"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Adicionar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

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
    </div>
  )
}
