"use client"

import { useState, useEffect, useRef } from "react"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/src/components/ui/navigation-menu"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Sidebar } from "@/src/components/ui/sidebar"
import Link from "next/link"
import { User, ShoppingCart, Menu, LogOut, Settings, Heart, ChevronDown, Home, Search, Moon, Sun } from "lucide-react"
import { useCart } from "@/src/hooks/use-cart"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useToast } from "@/src/components/ui/toast"
import { useTheme } from "@/src/hooks/use-theme"

export function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const { cartCount } = useCart()
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const { theme, toggleTheme } = useTheme()
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Fechar menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isUserMenuOpen])

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false })
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      })
      router.push("/")
      router.refresh()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível fazer logout",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      {/* NAVBAR FIXA */}
      <header className="fixed top-0 left-0 w-full border-b border-neutral-900/30 bg-gradient-to-b from-neutral-900/95 via-neutral-900/90 to-neutral-950/95 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] z-50">
        {/* Efeito espelho/glassmorphism */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] pointer-events-none opacity-50" />
        <div className="relative max-w-7xl mx-auto flex items-center justify-between py-3 px-2 sm:px-4 lg:px-6 gap-2 sm:gap-4">
          {/* Lado Esquerdo: Logo e Menu Mobile */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="inline-flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-white/5 backdrop-blur-sm text-neutral-300 hover:text-white hover:bg-white/15 hover:backdrop-blur-md border border-white/10 hover:border-white/30 transition-all duration-300 shadow-sm hover:shadow-md"
              aria-label="Abrir menu"
            >
              <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline text-sm font-medium">Menu</span>
            </button>
            
            <Link 
              href="/" 
              className="flex items-center group relative overflow-visible px-2 py-1 rounded-lg transition-all duration-300 hover:bg-white/5"
            >
              <h1 className="text-base sm:text-lg lg:text-xl font-bold tracking-tight drop-shadow-lg transition-all duration-300 group-hover:scale-110 relative z-10">
                {/* VAQ - Parte branca com efeito de brilho */}
                <span className="inline-block relative overflow-hidden">
                  <span className="relative z-10 text-white group-hover:text-neutral-200 transition-colors duration-300">
                    VAQ
                  </span>
                  {/* Efeito de brilho deslizante */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                </span>
                
                {/* APP - Parte laranja suave */}
                <span className="inline-block ml-1 sm:ml-1.5 relative">
                  <span className="relative z-10 text-orange-500 group-hover:text-orange-400 transition-colors duration-300 group-hover:drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]">
                    APP
                  </span>
                  {/* Efeito de brilho pulsante */}
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out delay-100" />
                  {/* Efeito de pulso ao redor */}
                  <span className="absolute inset-0 rounded-md bg-orange-500/25 opacity-0 group-hover:opacity-100 blur-md animate-pulse transition-opacity duration-500 -z-10" />
                </span>
              </h1>
              
              {/* Efeito de brilho suave ao redor do logo completo */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-500/0 via-orange-500/25 to-orange-500/0 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 -z-0" />
            </Link>
          </div>

          {/* Centro: Navegação e Busca */}
          <div className="flex-1 flex items-center justify-center gap-2 sm:gap-3 lg:gap-4 max-w-3xl mx-2 sm:mx-4">
            {/* Menu de Navegação - Oculto em mobile pequeno */}
            <NavigationMenu className="text-neutral-200 hidden md:flex">
              <NavigationMenuList className="gap-1 sm:gap-2">
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-xs sm:text-sm px-2 sm:px-3">Produtos</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
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
                            Selas artesanais de couro legítimo para vaquejada
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
                            Arreios artesanais com acabamento impecável
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
                            Botas resistentes e elegantes para vaquejada
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/produtos/peitoral-e-cia"
                          className="block select-none space-y-1 rounded-lg p-4 leading-none no-underline outline-none transition-all duration-200 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white group border border-transparent hover:border-white/20"
                        >
                          <div className="text-base font-semibold leading-none text-white mb-2 drop-shadow-sm">
                            Peitoral e Cia
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-neutral-300 group-hover:text-neutral-200">
                            Conjunto completo de peitoral para montaria profissional
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/produtos/espora-profissional"
                          className="block select-none space-y-1 rounded-lg p-4 leading-none no-underline outline-none transition-all duration-200 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white group border border-transparent hover:border-white/20"
                        >
                          <div className="text-base font-semibold leading-none text-white mb-2 drop-shadow-sm">
                            Espora Profissional
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-neutral-300 group-hover:text-neutral-200">
                            Espora de alta qualidade para controle preciso durante competições
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/produtos/cabecada"
                          className="block select-none space-y-1 rounded-lg p-4 leading-none no-underline outline-none transition-all duration-200 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white group border border-transparent hover:border-white/20"
                        >
                          <div className="text-base font-semibold leading-none text-white mb-2 drop-shadow-sm">
                            Cabeçada
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-neutral-300 group-hover:text-neutral-200">
                            Cabeçada profissional em couro nobre para vaquejada
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/produtos/cabresto"
                          className="block select-none space-y-1 rounded-lg p-4 leading-none no-underline outline-none transition-all duration-200 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white group border border-transparent hover:border-white/20"
                        >
                          <div className="text-base font-semibold leading-none text-white mb-2 drop-shadow-sm">
                            Cabresto
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-neutral-300 group-hover:text-neutral-200">
                            Cabresto de couro legítimo, resistente e confortável
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/produtos/luva-para-cavalo"
                          className="block select-none space-y-1 rounded-lg p-4 leading-none no-underline outline-none transition-all duration-200 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white group border border-transparent hover:border-white/20"
                        >
                          <div className="text-base font-semibold leading-none text-white mb-2 drop-shadow-sm">
                            Luva para Cavalo
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-neutral-300 group-hover:text-neutral-200">
                            Luva especializada para proteção e cuidado do cavalo
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/produtos/capacete"
                          className="block select-none space-y-1 rounded-lg p-4 leading-none no-underline outline-none transition-all duration-200 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white group border border-transparent hover:border-white/20"
                        >
                          <div className="text-base font-semibold leading-none text-white mb-2 drop-shadow-sm">
                            Capacete
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-neutral-300 group-hover:text-neutral-200">
                            Capacete de segurança profissional certificado
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/produtos/redea"
                          className="block select-none space-y-1 rounded-lg p-4 leading-none no-underline outline-none transition-all duration-200 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white group border border-transparent hover:border-white/20"
                        >
                          <div className="text-base font-semibold leading-none text-white mb-2 drop-shadow-sm">
                            Rédea
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-neutral-300 group-hover:text-neutral-200">
                            Rédea de couro legítimo com acabamento artesanal
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li className="col-span-2">
                      <NavigationMenuLink asChild>
                        <Link
                          href="/produtos"
                          className="block select-none space-y-1 rounded-lg p-4 leading-none no-underline outline-none transition-all duration-200 hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-orange-600/20 hover:text-white focus:bg-gradient-to-r focus:from-orange-500/20 focus:to-orange-600/20 focus:text-white group border border-transparent hover:border-orange-500/50"
                        >
                          <div className="text-base font-bold leading-none text-white mb-2 drop-shadow-sm flex items-center gap-2">
                            <Search className="w-5 h-5 text-orange-400" />
                            Explorar Todos os Produtos
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-neutral-300 group-hover:text-neutral-200">
                            Veja todos os nossos produtos disponíveis
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/contato" className="text-xs sm:text-sm px-2 sm:px-3 py-2 rounded-md text-neutral-200 hover:text-white hover:bg-white/10 transition-colors">
                      Suporte
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Barra de Busca */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-neutral-400" />
              </div>
              <Input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchTerm.trim()) {
                    router.push(`/produtos?search=${encodeURIComponent(searchTerm.trim())}`)
                    setSearchTerm("")
                  }
                }}
                className="pl-10 pr-4 py-2 h-9 text-sm bg-white/5 backdrop-blur-sm border-white/10 text-neutral-200 placeholder:text-neutral-500 focus:bg-white/10 focus:border-orange-500/50 transition-all duration-200 w-full"
              />
            </div>
          </div>

          {/* Lado Direito: Tema, Usuário e Carrinho */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Botão de Toggle de Tema */}
            <button
              onClick={toggleTheme}
              className="inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-white/5 backdrop-blur-sm text-neutral-300 hover:text-white hover:bg-white/15 hover:backdrop-blur-md border border-white/10 hover:border-white/30 transition-all duration-300 shadow-sm hover:shadow-md relative group"
              aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-180 transition-transform duration-500" />
              ) : (
                <Moon className="h-4 w-4 sm:h-5 sm:w-5 group-hover:-rotate-12 transition-transform duration-500" />
              )}
            </button>
            
            {/* Menu do Usuário Logado */}
            {status === "authenticated" && session?.user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-white/5 backdrop-blur-sm text-neutral-300 hover:text-white hover:bg-white/15 hover:backdrop-blur-md border border-white/10 hover:border-white/30 transition-all duration-300 shadow-sm hover:shadow-md group"
                  aria-label="Menu do usuário"
                >
                  {/* Foto do perfil ou inicial */}
                  <div className="relative flex-shrink-0">
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || "Usuário"}
                        className="h-8 w-8 sm:h-9 sm:w-9 rounded-full border-2 border-white/20 group-hover:border-white/40 transition-all duration-300 object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 border-2 border-white/20 group-hover:border-white/40 transition-all duration-300 flex items-center justify-center text-white font-semibold text-sm">
                        {session.user.name?.[0]?.toUpperCase() || session.user.email?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                    {/* Indicador de online */}
                    <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-neutral-900" />
                  </div>
                  
                  {/* Nome do usuário (oculto em mobile pequeno) */}
                  <div className="hidden lg:flex flex-col items-start min-w-0">
                    <span className="text-xs font-medium text-white leading-tight truncate max-w-[120px]">
                      {session.user.name || "Usuário"}
                    </span>
                    <span className="text-[10px] text-neutral-400 leading-tight truncate max-w-[120px]">
                      {session.user.email}
                    </span>
                  </div>
                  
                  <ChevronDown className={`h-4 w-4 text-neutral-400 transition-transform duration-300 flex-shrink-0 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-gradient-to-b from-neutral-900/95 to-neutral-950/95 backdrop-blur-xl border border-neutral-800/50 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Header do menu */}
                    <div className="p-4 border-b border-neutral-800/50">
                      <div className="flex items-center gap-3">
                        {session.user.image ? (
                          <img
                            src={session.user.image}
                            alt={session.user.name || "Usuário"}
                            className="h-12 w-12 rounded-full border-2 border-orange-500/50 object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg">
                            {session.user.name?.[0]?.toUpperCase() || session.user.email?.[0]?.toUpperCase() || "U"}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">
                            {session.user.name || "Usuário"}
                          </p>
                          <p className="text-xs text-neutral-400 truncate">
                            {session.user.email}
                          </p>
                          {(session.user as any)?.role && (
                            <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                              {(session.user as any).role === 'ADMIN' ? 'Administrador' : 'Usuário'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Links do menu */}
                    <div className="p-2">
                      <Link
                        href="/favoritos"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 transition-all duration-200 group"
                      >
                        <Heart className="h-4 w-4 group-hover:text-red-400 transition-colors" />
                        <span className="text-sm">Meus Favoritos</span>
                      </Link>
                      <Link
                        href="/perfil"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 transition-all duration-200 group"
                      >
                        <Settings className="h-4 w-4 group-hover:text-blue-400 transition-colors" />
                        <span className="text-sm">Configurações</span>
                      </Link>
                      {(session.user as any)?.role === 'ADMIN' && (
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 transition-all duration-200 group border-t border-neutral-800/50 mt-2 pt-2"
                        >
                          <User className="h-4 w-4" />
                          <span className="text-sm font-medium">Painel Admin</span>
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false)
                          handleLogout()
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 group border-t border-neutral-800/50 mt-2 pt-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span className="text-sm font-medium">Sair</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Botão Perfil quando não logado */}
                <Link
                  href="/login"
                  className="inline-flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-white/5 backdrop-blur-sm text-neutral-300 hover:text-white hover:bg-white/15 hover:backdrop-blur-md border border-white/10 hover:border-white/30 transition-all duration-300 shadow-sm hover:shadow-md relative"
                  aria-label="Fazer login"
                >
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
                
                {/* Botão Entrar (desktop) */}
                <Link href="/login" className="hidden sm:inline-block">
                  <Button
                    variant="secondary"
                    className="bg-white/5 backdrop-blur-sm text-neutral-300 hover:text-white hover:bg-white/15 hover:backdrop-blur-md border border-white/10 hover:border-white/30 transition-all duration-300 shadow-sm hover:shadow-md text-xs sm:text-sm px-3 sm:px-4 h-8 sm:h-10"
                  >
                    Entrar
                  </Button>
                </Link>
              </>
            )}
            
            {/* Carrinho */}
            <Link
              href="/carrinho"
              className="inline-flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-white/5 backdrop-blur-sm text-neutral-300 hover:text-white hover:bg-white/15 hover:backdrop-blur-md border border-white/10 hover:border-white/30 transition-all duration-300 shadow-sm hover:shadow-md relative"
              aria-label="Carrinho de compras"
            >
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-orange-500 text-white text-[8px] sm:text-[10px] font-semibold flex items-center justify-center">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  )
}
