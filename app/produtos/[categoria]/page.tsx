"use client"

import { use, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ShoppingCart } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { useProducts, Product } from "@/src/hooks/use-products"
import { formatPrice } from "@/src/lib/product-utils"
import { useCart } from "@/src/hooks/use-cart"
import { useToast } from "@/src/components/ui/toast"
import { AddToCartModal } from "@/src/components/ui/add-to-cart-modal"

// Mapeamento de categorias da URL para categorias do banco
const categoriaParaCategoria: Record<string, string> = {
  selas: "Selas",
  "peitoral-e-cia": "Equipamentos",
  "espora-profissional": "Equipamentos",
  cabecada: "Equipamentos",
  cabresto: "Equipamentos",
  "luva-para-cavalo": "Equipamentos",
  capacete: "Segurança",
  redea: "Equipamentos",
  arreios: "Arreios",
  botas: "Botas",
}

// Nomes das categorias para exibição
const nomesCategorias: Record<string, string> = {
  selas: "Selas",
  "peitoral-e-cia": "Peitoral e Cia",
  "espora-profissional": "Espora Profissional",
  cabecada: "Cabeçada",
  cabresto: "Cabresto",
  "luva-para-cavalo": "Luva para Cavalo",
  capacete: "Capacete",
  redea: "Rédea",
  arreios: "Arreios",
  botas: "Botas",
}

interface PageProps {
  params: Promise<{ categoria: string }>
}

export default function ProdutoCategoriaPage({ params }: PageProps) {
  const { categoria } = use(params)
  const router = useRouter()
  const { addToCart } = useCart()
  const { toast } = useToast()
  
  // Estados para o modal
  const [modalOpen, setModalOpen] = useState(false)
  const [addedProduct, setAddedProduct] = useState<Product | null>(null)
  
  // Buscar produtos da categoria
  const categoriaDB = categoriaParaCategoria[categoria] || categoria
  const { products, loading, error } = useProducts({ category: categoriaDB })

  const nomeCategoria = nomesCategorias[categoria] || categoria

  // Função para adicionar ao carrinho
  const handleAddToCart = (product: Product) => {
    // Converter preço para número
    const price = typeof product.price === 'number' 
      ? product.price 
      : parseFloat(String(product.price).replace(/[^\d,]/g, '').replace(',', '.')) || 0

    // Adicionar ao carrinho
    addToCart({
      id: product.id,
      name: product.name,
      price: price,
      image: product.image,
    })

    // Mostrar toast
    toast({
      title: "Produto adicionado!",
      description: `${product.name} foi adicionado ao carrinho`,
      duration: 3000,
    })

    // Abrir modal
    setAddedProduct(product)
    setModalOpen(true)
  }

  // Função para ir ao carrinho
  const handleGoToCart = () => {
    setModalOpen(false)
    router.push("/carrinho")
  }

  // Função para continuar comprando
  const handleContinueShopping = () => {
    setModalOpen(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-200 via-neutral-300 to-neutral-250 text-neutral-900 relative overflow-hidden">
      {/* Textura sutil de fundo */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808015_1px,transparent_1px),linear-gradient(to_bottom,#80808015_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-neutral-400/10" />

      {/* Conteúdo */}
      <section className="relative pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-2 sm:px-4 z-10">
        {/* Botão Voltar */}
        <div className="max-w-7xl mx-auto mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-white/80 hover:bg-white/90 backdrop-blur-sm text-neutral-800 hover:text-neutral-900 transition-all duration-200 group shadow-sm hover:shadow-md border border-neutral-200/50 hover:border-neutral-300"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="text-base font-semibold">Voltar ao início</span>
          </Link>
        </div>

        {/* Título e Estatísticas */}
        <div className="max-w-7xl mx-auto mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-800 tracking-tight drop-shadow-sm mb-2">
                {nomeCategoria}
              </h1>
              <p className="text-neutral-600 text-sm sm:text-base">
                {loading ? "Carregando..." : `${products.length} produto${products.length !== 1 ? "s" : ""} disponível${products.length !== 1 ? "is" : ""}`}
              </p>
            </div>
          </div>
          
          {/* Cards de Estatísticas */}
          {!loading && products.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 backdrop-blur-sm border border-orange-500/20 rounded-xl p-4 text-center">
                <p className="text-2xl sm:text-3xl font-bold text-orange-600 mb-1">{products.length}</p>
                <p className="text-xs sm:text-sm text-neutral-700 font-medium">Produtos</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-sm border border-blue-500/20 rounded-xl p-4 text-center">
                <p className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">
                  {products.filter(p => (p.stock || 0) > 0).length}
                </p>
                <p className="text-xs sm:text-sm text-neutral-700 font-medium">Em Estoque</p>
              </div>
              <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 backdrop-blur-sm border border-green-500/20 rounded-xl p-4 text-center">
                <p className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">
                  {products.filter(p => p.originalPrice).length}
                </p>
                <p className="text-xs sm:text-sm text-neutral-700 font-medium">Em Promoção</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4 text-center">
                <p className="text-xs sm:text-sm font-bold text-purple-600 mb-1">
                  {products.length > 0 
                    ? formatPrice(Math.min(...products.map(p => typeof p.price === 'number' ? p.price : parseFloat(String(p.price).replace(/[^\d,]/g, '').replace(',', '.')) || 0)))
                    : 'R$ 0,00'
                  }
                </p>
                <p className="text-xs sm:text-sm text-neutral-700 font-medium">Menor Preço</p>
              </div>
            </div>
          )}
        </div>

        {/* Grid de Produtos */}
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <p className="text-neutral-600 text-lg">Carregando produtos...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-600 text-lg">Erro ao carregar produtos: {error}</p>
              <Link href="/" className="text-orange-500 hover:text-orange-600 underline mt-4 inline-block">
                Voltar ao início
              </Link>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {products.map((produto) => (
                <div
                  key={produto.id}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-neutral-900/95 via-neutral-900/90 to-neutral-950/95 backdrop-blur-2xl border border-neutral-800/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] transition-all duration-300 hover:shadow-[0_12px_48px_0_rgba(0,0,0,0.6)] hover:scale-[1.02]"
                >
                  {/* Efeito espelho/glassmorphism */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-white/3 to-transparent pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.05)_50%,transparent_100%)] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

                  <div className="relative z-10">
                    {/* Imagem do Produto */}
                    <div className="relative h-64 overflow-hidden bg-neutral-950">
                      <div
                        className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110"
                        style={{
                          backgroundImage: `url(${produto.image})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />
                    </div>

                    {/* Conteúdo do Card */}
                    <div className="p-5 space-y-3">
                      {/* Nome do Produto */}
                      <h3 className="text-lg font-semibold text-white line-clamp-2 group-hover:text-white transition-colors">
                        {produto.name}
                      </h3>

                      {/* Descrição */}
                      {produto.description && (
                        <p className="text-sm text-neutral-400 line-clamp-2">
                          {produto.description}
                        </p>
                      )}

                      {/* Preço */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-white">
                          {formatPrice(produto.price)}
                        </span>
                        {produto.originalPrice && (
                          <span className="text-sm text-neutral-500 line-through">
                            {formatPrice(produto.originalPrice)}
                          </span>
                        )}
                      </div>

                      {/* Botão Comprar Agora */}
                      <Button
                        onClick={() => handleAddToCart(produto)}
                        className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Comprar Agora
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-neutral-600 text-lg">Nenhum produto encontrado nesta categoria.</p>
              <Link href="/" className="text-orange-500 hover:text-orange-600 underline mt-4 inline-block">
                Voltar ao início
              </Link>
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
          onClose={() => setModalOpen(false)}
        />
      )}
    </main>
  )
}
