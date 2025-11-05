"use client"

import Link from "next/link"
import { Instagram, Facebook, MessageCircle, Mail, Phone, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

export function Footer() {
  return (
    <footer className="relative mt-auto border-t border-neutral-900/30 bg-gradient-to-b from-neutral-900/95 via-neutral-900/90 to-neutral-950/95 backdrop-blur-2xl">
      {/* Efeito espelho/glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.08)_50%,transparent_100%)] pointer-events-none opacity-60" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {/* Logo e Descrição */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Selaria <span className="text-neutral-400">III</span> Irmãos
            </h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Qualidade e tradição em equipamentos de vaquejada. Vendemos para todo Brasil.
            </p>
            <div className="flex items-center gap-2 text-neutral-400 text-sm">
              <MapPin className="h-4 w-4 text-orange-500" />
              <span>Cachoeirinha-PE • Cidade do Couro e Aço</span>
            </div>
          </div>

          {/* Links Rápidos */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-4">Links Rápidos</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-neutral-400 hover:text-white transition-colors duration-200 text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-neutral-600 group-hover:bg-orange-500 transition-colors duration-200"></span>
                  Início
                </Link>
              </li>
              <li>
                <Link href="/produtos/selas" className="text-neutral-400 hover:text-white transition-colors duration-200 text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-neutral-600 group-hover:bg-orange-500 transition-colors duration-200"></span>
                  Produtos
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="text-neutral-400 hover:text-white transition-colors duration-200 text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-neutral-600 group-hover:bg-orange-500 transition-colors duration-200"></span>
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-neutral-400 hover:text-white transition-colors duration-200 text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-neutral-600 group-hover:bg-orange-500 transition-colors duration-200"></span>
                  Contato
                </Link>
              </li>
              <li>
                <Link href="/favoritos" className="text-neutral-400 hover:text-white transition-colors duration-200 text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-neutral-600 group-hover:bg-orange-500 transition-colors duration-200"></span>
                  Meus Favoritos
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-4">Contato</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="https://wa.me/5511999999999" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-white transition-colors duration-200 text-sm flex items-center gap-3 group"
                >
                  <MessageCircle className="h-4 w-4 text-green-500 group-hover:scale-110 transition-transform duration-200" />
                  <span>(81) 99999-9999</span>
                </a>
              </li>
              <li>
                <a 
                  href="mailto:contato@selaria3irmãos.com.br" 
                  className="text-neutral-400 hover:text-white transition-colors duration-200 text-sm flex items-center gap-3 group"
                >
                  <Mail className="h-4 w-4 text-orange-500 group-hover:scale-110 transition-transform duration-200" />
                  <span>contato@selaria3irmãos.com.br</span>
                </a>
              </li>
              <li>
                <a 
                  href="tel:+5581999999999" 
                  className="text-neutral-400 hover:text-white transition-colors duration-200 text-sm flex items-center gap-3 group"
                >
                  <Phone className="h-4 w-4 text-orange-500 group-hover:scale-110 transition-transform duration-200" />
                  <span>(81) 99999-9999</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Redes Sociais */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-4">Redes Sociais</h4>
            <p className="text-neutral-400 text-sm mb-4">
              Siga-nos nas redes sociais e fique por dentro das novidades!
            </p>
            <div className="flex gap-4">
              {/* Instagram */}
              <a
                href="https://instagram.com/selaria3irmãos"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "group relative inline-flex h-12 w-12 items-center justify-center rounded-full",
                  "bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500",
                  "hover:from-purple-500 hover:via-pink-500 hover:to-orange-400",
                  "text-white border border-white/20 hover:border-white/40",
                  "backdrop-blur-sm shadow-lg hover:shadow-xl",
                  "transition-all duration-300 hover:scale-110"
                )}
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com/selaria3irmãos"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "group relative inline-flex h-12 w-12 items-center justify-center rounded-full",
                  "bg-[#1877F2] hover:bg-[#166FE5]",
                  "text-white border border-white/20 hover:border-white/40",
                  "backdrop-blur-sm shadow-lg hover:shadow-xl",
                  "transition-all duration-300 hover:scale-110"
                )}
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "group relative inline-flex h-12 w-12 items-center justify-center rounded-full",
                  "bg-[#25D366] hover:bg-[#20BA5A]",
                  "text-white border border-white/20 hover:border-white/40",
                  "backdrop-blur-sm shadow-lg hover:shadow-xl",
                  "transition-all duration-300 hover:scale-110"
                )}
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              </a>
            </div>
          </div>
        </div>

        {/* Linha Divisória */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-neutral-500 text-sm text-center sm:text-left">
              © {new Date().getFullYear()} Selaria III Irmãos. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-6 text-sm text-neutral-500">
              <Link href="/termos" className="hover:text-white transition-colors duration-200">
                Termos de Uso
              </Link>
              <span className="text-neutral-700">•</span>
              <Link href="/privacidade" className="hover:text-white transition-colors duration-200">
                Política de Privacidade
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

