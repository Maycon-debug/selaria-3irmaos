"use client"

import { use } from "react"
import Link from "next/link"
import { ArrowLeft, ShoppingCart } from "lucide-react"
import { Button } from "@/src/components/ui/button"

// Função para obter TODOS os produtos do site (carrossel + grid)
const getAllProducts = () => {
  return [
    // Produtos do carrossel
    {
      id: "1",
      name: "Sela Vaquejada Premium",
      price: "R$ 1.899,00",
      originalPrice: undefined,
      image: "/images/products/carousel/sela01.jpeg",
      description: "Sela de vaquejada artesanal com couro legítimo de primeira qualidade. Design ergonômico para máximo conforto e segurança durante as competições. Perfeita para atletas profissionais e amadores.",
    },
    {
      id: "2",
      name: "Peitoral e Cia",
      price: "R$ 1.499,00",
      originalPrice: undefined,
      image: "/images/products/carousel/sela02.jpeg",
      description: "Peitoral completo para vaquejada com acabamento em couro legítimo. Conjunto completo com todas as peças necessárias para montaria profissional. Resistente e durável para uso intensivo.",
    },
    {
      id: "3",
      name: "Espora Profissional",
      price: "R$ 349,00",
      originalPrice: undefined,
      image: "/images/hero/espora01.jpeg",
      description: "Espora de alta qualidade para vaquejada, fabricada com materiais premium. Design ergonômico e seguro, proporcionando controle preciso durante as competições. Disponível em vários tamanhos.",
    },
    {
      id: "4",
      name: "Cabeçada Vaquejada",
      price: "R$ 599,00",
      originalPrice: undefined,
      image: "/images/products/grid/cabeçada01.jpeg",
      description: "Cabeçada profissional para vaquejada em couro nobre. Acabamento impecável e design tradicional. Perfeita para controle e direcionamento do cavalo durante as competições.",
    },
    {
      id: "5",
      name: "Cabresto Premium",
      price: "R$ 449,00",
      originalPrice: undefined,
      image: "/images/products/grid/cabresto01.jpeg",
      description: "Cabresto de couro legítimo para vaquejada. Resistente e confortável para o cavalo. Design clássico com detalhes artesanais. Essencial para o manejo adequado do animal.",
    },
    {
      id: "6",
      name: "Luva para Cavalo",
      price: "R$ 199,00",
      originalPrice: undefined,
      image: "/images/products/grid/luvaCavalo01.jpeg",
      description: "Luva especializada para proteção e cuidado do cavalo. Confeccionada em material de alta qualidade, oferece proteção e conforto durante o treinamento e competições.",
    },
    {
      id: "7",
      name: "Capacete Vaquejada",
      price: "R$ 399,00",
      originalPrice: undefined,
      image: "/images/products/grid/capacete01.jpg",
      description: "Capacete de segurança profissional para vaquejada. Certificado e aprovado para competições. Design moderno com ventilação adequada e sistema de ajuste seguro.",
    },
    {
      id: "8",
      name: "Rédea Premium",
      price: "R$ 299,00",
      originalPrice: undefined,
      image: "/images/products/carousel/sela03.jpeg",
      description: "Rédea de couro legítimo para vaquejada. Acabamento artesanal e durabilidade excepcional. Controle preciso e conforto nas mãos. Disponível em várias cores e estilos.",
    },
    // Produtos do grid
    {
      id: "sela-1",
      name: "Sela Vaquejada Premium",
      price: "R$ 1.899,00",
      originalPrice: "R$ 2.299,00",
      image: "/images/products/carousel/sela04.jpeg",
      description: "Sela artesanal com couro legítimo de primeira qualidade",
    },
    {
      id: "peitoral-1",
      name: "Peitoral e Cia Completo",
      price: "R$ 1.499,00",
      originalPrice: undefined,
      image: "/images/products/carousel/sela05.jpeg",
      description: "Conjunto completo de peitoral para montaria profissional",
    },
    {
      id: "espora-1",
      name: "Espora Profissional",
      price: "R$ 349,00",
      originalPrice: undefined,
      image: "/images/hero/espora02.jpeg",
      description: "Espora de alta qualidade para controle preciso",
    },
    {
      id: "cabecada-1",
      name: "Cabeçada Vaquejada",
      price: "R$ 599,00",
      originalPrice: undefined,
      image: "/images/products/grid/cabeçada01.jpeg",
      description: "Cabeçada profissional em couro nobre",
    },
    {
      id: "cabresto-1",
      name: "Cabresto Premium",
      price: "R$ 449,00",
      originalPrice: undefined,
      image: "/images/products/grid/cabresto01.jpeg",
      description: "Cabresto de couro legítimo resistente",
    },
    {
      id: "luva-1",
      name: "Luva para Cavalo",
      price: "R$ 199,00",
      originalPrice: undefined,
      image: "/images/products/grid/luvaCavalo01.jpeg",
      description: "Luva especializada para proteção e cuidado",
    },
    {
      id: "capacete-1",
      name: "Capacete Vaquejada",
      price: "R$ 399,00",
      originalPrice: undefined,
      image: "/images/products/grid/capacete01.jpg",
      description: "Capacete de segurança certificado",
    },
    {
      id: "redea-1",
      name: "Rédea Premium",
      price: "R$ 299,00",
      originalPrice: undefined,
      image: "/images/products/carousel/sela06.jpeg",
      description: "Rédea de couro legítimo com acabamento artesanal",
    },
    {
      id: "arreio-1",
      name: "Arreio Vaquejada Artesanal",
      price: "R$ 899,00",
      originalPrice: undefined,
      image: "/images/products/carousel/sela07.jpeg",
      description: "Arreio artesanal com acabamento impecável",
    },
    {
      id: "bota-1",
      name: "Bota Vaquejada Clássica",
      price: "R$ 649,00",
      originalPrice: undefined,
      image: "/images/products/grid/bota01.jpeg",
      description: "Bota resistente e elegante",
    },
    {
      id: "sela-2",
      name: "Sela Vaquejada Esportiva",
      price: "R$ 2.199,00",
      originalPrice: undefined,
      image: "/images/products/carousel/sela08.jpeg",
      description: "Sela com tecnologia avançada para alta performance",
    },
    {
      id: "bota-2",
      name: "Bota Vaquejada Premium",
      price: "R$ 799,00",
      originalPrice: "R$ 999,00",
      image: "/images/products/grid/bota02.jpeg",
      description: "Bota de couro legítimo premium",
    },
    {
      id: "bota-3",
      name: "Bota Vaquejada Esportiva",
      price: "R$ 749,00",
      originalPrice: undefined,
      image: "/images/products/grid/bota03.jpeg",
      description: "Bota desenvolvida para competições",
    },
    {
      id: "sela-3",
      name: "Sela Vaquejada Artesanal",
      price: "R$ 2.499,00",
      originalPrice: undefined,
      image: "/images/products/carousel/sela09.jpeg",
      description: "Sela única com detalhes personalizados",
    },
    {
      id: "bota-4",
      name: "Bota Vaquejada Tradicional",
      price: "R$ 549,00",
      originalPrice: undefined,
      image: "/images/products/grid/bota04.jpeg",
      description: "Bota tradicional para vaquejada",
    },
    {
      id: "sela-4",
      name: "Sela Vaquejada Deluxe",
      price: "R$ 2.799,00",
      originalPrice: undefined,
      image: "/images/products/carousel/sela10.jpeg",
      description: "Sela premium com acabamento exclusivo",
    },
    {
      id: "sela-5",
      name: "Sela Vaquejada Clássica",
      price: "R$ 1.299,00",
      originalPrice: undefined,
      image: "/images/products/carousel/sela11.jpeg",
      description: "Sela tradicional com acabamento impecável",
    },
    {
      id: "sela-6",
      name: "Sela Vaquejada Exclusiva",
      price: "R$ 2.599,00",
      originalPrice: undefined,
      image: "/images/products/carousel/sela13.jpeg",
      description: "Sela exclusiva com design único",
    },
  ]
}

// Mapeamento de categorias para termos de busca
const categoriaParaTermo: Record<string, string> = {
  selas: "sela",
  "peitoral-e-cia": "peitoral",
  "espora-profissional": "espora",
  cabecada: "cabeçada",
  cabresto: "cabresto",
  "luva-para-cavalo": "luva",
  capacete: "capacete",
  redea: "rédea",
  arreios: "arreio",
  botas: "bota",
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

  // Obter todos os produtos
  const allProducts = getAllProducts()

  // Obter termo de busca baseado na categoria
  const searchTerm = categoriaParaTermo[categoria] || categoria.toLowerCase()

  // Filtrar produtos que contenham o termo no nome (case-insensitive)
  const produtos = allProducts.filter((produto) =>
    produto.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const nomeCategoria = nomesCategorias[categoria] || categoria

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
            className="inline-flex items-center gap-2 text-neutral-700 hover:text-neutral-900 transition-colors duration-200 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="text-sm font-medium">Voltar ao início</span>
          </Link>
        </div>

        {/* Título e Botão Comprar Agora */}
        <div className="max-w-7xl mx-auto mb-8 sm:mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-800 tracking-tight drop-shadow-sm mb-2">
              {nomeCategoria}
            </h1>
            <p className="text-neutral-600 text-sm sm:text-base">
              {produtos.length} produto{produtos.length !== 1 ? "s" : ""} disponível{produtos.length !== 1 ? "is" : ""}
            </p>
          </div>
          <Button
            className="bg-orange-500 hover:bg-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 px-6 sm:px-8 py-3 text-base sm:text-lg font-semibold"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Comprar Agora
          </Button>
        </div>

        {/* Grid de Produtos */}
        <div className="max-w-7xl mx-auto">
          {produtos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {produtos.map((produto) => (
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
                          {produto.price}
                        </span>
                        {produto.originalPrice && (
                          <span className="text-sm text-neutral-500 line-through">
                            {produto.originalPrice}
                          </span>
                        )}
                      </div>

                      {/* Botão Comprar Agora */}
                      <Button
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
    </main>
  )
}
