"use client"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/src/components/ui/navigation-menu"
import { Button } from "@/src/components/ui/button"
import { ProductCarousel } from "@/src/components/ui/product-carousel"
import { ProductGrid } from "@/src/components/ui/product-grid"
import { BrandsSection } from "@/src/components/ui/brands-section"
import Link from "next/link"
import { User, ShoppingCart } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-200 via-neutral-300 to-neutral-250 text-neutral-900 relative overflow-hidden">
      {/* Textura sutil de fundo */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808015_1px,transparent_1px),linear-gradient(to_bottom,#80808015_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-neutral-400/10" />
      {/* NAVBAR FIXA */}
      <header className="fixed top-0 left-0 w-full border-b border-neutral-900/30 bg-gradient-to-b from-neutral-900/95 via-neutral-900/90 to-neutral-950/95 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] z-50">
        {/* Efeito espelho/glassmorphism */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] pointer-events-none opacity-50" />
        <div className="relative max-w-6xl mx-auto flex items-center justify-center py-3 px-4 gap-6">
          <h1 className="absolute left-4 text-lg font-semibold tracking-tight text-white drop-shadow-lg">MeuSite</h1>

          <NavigationMenu className="text-neutral-200">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Produtos</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-2 p-4 w-[320px]">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/produtos/selas"
                          className="block select-none space-y-1 rounded-lg p-4 leading-none no-underline outline-none transition-all duration-200 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white group border border-transparent hover:border-white/20"
                        >
                          <div className="text-base font-semibold leading-none text-white mb-2 drop-shadow-sm">
                            Selas
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-neutral-300 group-hover:text-neutral-200">
                            Selas de alta qualidade para máxima conforto e durabilidade
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/produtos/arreios"
                          className="block select-none space-y-1 rounded-lg p-4 leading-none no-underline outline-none transition-all duration-200 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white group border border-transparent hover:border-white/20"
                        >
                          <div className="text-base font-semibold leading-none text-white mb-2 drop-shadow-sm">
                            Arreios
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-neutral-300 group-hover:text-neutral-200">
                            Arreios artesanais com acabamento impecável e design sofisticado
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/produtos/botas"
                          className="block select-none space-y-1 rounded-lg p-4 leading-none no-underline outline-none transition-all duration-200 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white group border border-transparent hover:border-white/20"
                        >
                          <div className="text-base font-semibold leading-none text-white mb-2 drop-shadow-sm">
                            Botas
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-neutral-300 group-hover:text-neutral-200">
                            Botas resistentes e elegantes para todas as ocasiões
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Contato</NavigationMenuTrigger>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Sobre</NavigationMenuTrigger>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="absolute right-4 flex items-center gap-4">
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 backdrop-blur-sm text-neutral-300 hover:text-white hover:bg-white/15 hover:backdrop-blur-md border border-white/10 hover:border-white/30 transition-all duration-300 shadow-sm hover:shadow-md"
              aria-label="Perfil"
            >
              <User className="h-5 w-5" />
            </button>
            
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 backdrop-blur-sm text-neutral-300 hover:text-white hover:bg-white/15 hover:backdrop-blur-md border border-white/10 hover:border-white/30 transition-all duration-300 shadow-sm hover:shadow-md relative"
              aria-label="Carrinho de compras"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-white/90 text-neutral-900 text-[10px] font-semibold flex items-center justify-center">
                0
              </span>
            </button>
            
            <Link href="/login">
              <Button
                variant="secondary"
                className="bg-white/5 backdrop-blur-sm text-neutral-300 hover:text-white hover:bg-white/15 hover:backdrop-blur-md border border-white/10 hover:border-white/30 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Entrar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* CONTEÚDO */}
      <section className="relative pt-32 pb-20 flex flex-col items-center px-4 z-10">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 text-neutral-800 tracking-tight drop-shadow-sm">
            Bem-vindo ao site
          </h1>
          <p className="text-neutral-700 mb-10 text-lg">
            Interface elegante com Shadcn + Tailwind CSS
          </p>

          <div className="flex gap-4 justify-center">
            <Button
              variant="default"
              className="rounded-md bg-neutral-100 text-neutral-900 font-medium hover:bg-neutral-200 transition-colors duration-200 px-6 py-2 shadow-sm hover:shadow-md"
            >
              Explorar
            </Button>

            <Button
              variant="outline"
              className="rounded-md border border-neutral-700 text-neutral-200 font-medium hover:bg-neutral-800 hover:text-white transition-colors duration-200 px-6 py-2 shadow-sm hover:shadow-md"
            >
              Saiba mais
            </Button>
          </div>
        </div>

        {/* Carrossel de Produtos */}
        <div className="w-full">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral-800 mb-3 tracking-tight drop-shadow-sm">
              Nossos Produtos
            </h2>
            <p className="text-neutral-700 text-lg">
              Passe o cursor sobre as imagens para ver os detalhes
            </p>
          </div>
          
          <ProductCarousel
            products={[
              {
                id: "1",
                name: "Sela Vaquejada Premium",
                description:
                  "Sela de vaquejada artesanal com couro legítimo de primeira qualidade. Design ergonômico para máximo conforto e segurança durante as competições. Perfeita para atletas profissionais e amadores.",
                image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop",
                price: "R$ 1.899,00",
              },
              {
                id: "2",
                name: "Sela Vaquejada Clássica",
                description:
                  "Sela tradicional com acabamento impecável em couro nobre. Construída com atenção aos mínimos detalhes, oferecendo durabilidade e elegância para o verdadeiro vaqueiro.",
                image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop",
                price: "R$ 1.299,00",
              },
              {
                id: "3",
                name: "Sela Vaquejada Esportiva",
                description:
                  "Sela desenvolvida especialmente para vaquejada, com tecnologia avançada e materiais de alta performance. Oferece estabilidade e conforto durante as competições mais exigentes.",
                image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop",
                price: "R$ 2.199,00",
              },
              {
                id: "4",
                name: "Sela Vaquejada Exclusiva",
                description:
                  "Sela única com detalhes personalizados e couro premium. Cada peça é cuidadosamente selecionada para garantir exclusividade e qualidade superior. Uma escolha que faz toda a diferença.",
                image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop",
                price: "R$ 2.599,00",
              },
            ]}
          />
        </div>

        {/* Grid de Produtos em Destaque */}
        <ProductGrid
          products={[
            {
              id: "sela-1",
              name: "Sela Vaquejada Premium",
              price: "R$ 1.899,00",
              originalPrice: "R$ 2.299,00",
              image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
              rating: 4.8,
              category: "Selas",
            },
            {
              id: "arreio-1",
              name: "Arreio Vaquejada Artesanal",
              price: "R$ 899,00",
              image: "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?w=600&h=600&fit=crop",
              rating: 4.9,
              category: "Arreios",
            },
            {
              id: "bota-1",
              name: "Bota Vaquejada Clássica",
              price: "R$ 649,00",
              image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=600&h=600&fit=crop",
              rating: 4.7,
              category: "Botas",
            },
            {
              id: "sela-2",
              name: "Sela Vaquejada Esportiva",
              price: "R$ 2.199,00",
              image: "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?w=600&h=600&fit=crop",
              rating: 4.6,
              category: "Selas",
            },
            {
              id: "arreio-2",
              name: "Arreio Vaquejada Deluxe",
              price: "R$ 1.299,00",
              originalPrice: "R$ 1.599,00",
              image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
              rating: 5.0,
              category: "Arreios",
            },
            {
              id: "bota-2",
              name: "Bota Vaquejada Premium",
              price: "R$ 799,00",
              image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=600&h=600&fit=crop",
              rating: 4.8,
              category: "Botas",
            },
            {
              id: "sela-3",
              name: "Sela Vaquejada Tradicional",
              price: "R$ 1.599,00",
              image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
              rating: 4.5,
              category: "Selas",
            },
            {
              id: "bota-3",
              name: "Bota Vaquejada Couro Legítimo",
              price: "R$ 549,00",
              image: "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?w=600&h=600&fit=crop",
              rating: 4.9,
              category: "Botas",
            },
          ]}
        />

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
  )
}
