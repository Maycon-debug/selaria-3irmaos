"use client"

import { useState } from "react"
import { Mail, Phone, MapPin, MessageCircle, Instagram, Facebook, Clock, Send } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Textarea } from "@/src/components/ui/textarea"
import { Label } from "@/src/components/ui/label"
import { useToast } from "@/src/components/ui/toast"

interface FormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

export default function Contato() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro ao enviar mensagem")
      }

      toast({
        title: "Mensagem enviada!",
        description: "Entraremos em contato em breve.",
      })

      // Limpar formulário
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
      toast({
        title: "Erro ao enviar",
        description: errorMessage,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-200 via-neutral-300 to-neutral-250 text-neutral-900 relative overflow-hidden">
      {/* Textura sutil de fundo */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808015_1px,transparent_1px),linear-gradient(to_bottom,#80808015_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-neutral-400/10" />

      <div className="relative z-10 pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="max-w-7xl mx-auto mb-12 sm:mb-16 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-800 mb-4 tracking-tight drop-shadow-sm">
            Entre em <span className="text-orange-500">Contato</span>
          </h1>
          <p className="text-neutral-700 text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto">
            Estamos prontos para ajudar você. Envie sua mensagem ou entre em contato pelos nossos canais.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent rounded-full mx-auto mt-6 opacity-60" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Formulário de Contato */}
          <div className="lg:col-span-2">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-neutral-900/95 via-neutral-900/90 to-neutral-950/95 backdrop-blur-2xl border border-neutral-800/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] p-6 sm:p-8 md:p-10">
              {/* Efeito espelho/glassmorphism */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-transparent pointer-events-none rounded-2xl" />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.08)_50%,transparent_100%)] pointer-events-none opacity-60 rounded-2xl" />

              <div className="relative z-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 tracking-tight">
                  Envie sua Mensagem
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo *</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Seu nome"
                        className="bg-white/5 border-white/10 text-white placeholder:text-neutral-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="seu@email.com"
                        className="bg-white/5 border-white/10 text-white placeholder:text-neutral-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="(81) 99999-9999"
                        className="bg-white/5 border-white/10 text-white placeholder:text-neutral-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Assunto *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Assunto da mensagem"
                        className="bg-white/5 border-white/10 text-white placeholder:text-neutral-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Mensagem *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Escreva sua mensagem aqui..."
                      rows={6}
                      className="bg-white/5 border-white/10 text-white placeholder:text-neutral-500 min-h-[150px]"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold transition-all duration-300 px-8 py-3 shadow-lg hover:shadow-xl hover:shadow-orange-500/50 hover:scale-105"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Enviar Mensagem
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>

          {/* Informações de Contato */}
          <div className="space-y-6">
            {/* Card de Informações */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-neutral-900/95 via-neutral-900/90 to-neutral-950/95 backdrop-blur-2xl border border-neutral-800/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] p-6 sm:p-8">
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-transparent pointer-events-none rounded-2xl" />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.08)_50%,transparent_100%)] pointer-events-none opacity-60 rounded-2xl" />

              <div className="relative z-10 space-y-6">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 tracking-tight">
                  Informações de Contato
                </h3>

                {/* Telefone */}
                <a
                  href="tel:+5581999999999"
                  className="flex items-start gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 group"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center border border-orange-500/30 group-hover:scale-110 transition-transform duration-200 flex-shrink-0">
                    <Phone className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">
                      Telefone
                    </p>
                    <p className="text-base sm:text-lg font-semibold text-white">
                      (81) 99999-9999
                    </p>
                    <p className="text-sm text-neutral-300 mt-1">
                      Atendimento de segunda a sábado
                    </p>
                  </div>
                </a>

                {/* E-mail */}
                <a
                  href="mailto:contato@selaria3irmãos.com.br"
                  className="flex items-start gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 group"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center border border-orange-500/30 group-hover:scale-110 transition-transform duration-200 flex-shrink-0">
                    <Mail className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">
                      E-mail
                    </p>
                    <p className="text-base sm:text-lg font-semibold text-white break-all">
                      contato@selaria3irmãos.com.br
                    </p>
                    <p className="text-sm text-neutral-300 mt-1">
                      Respondemos em até 24h
                    </p>
                  </div>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/5581999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 group"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center border border-green-500/30 group-hover:scale-110 transition-transform duration-200 flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">
                      WhatsApp
                    </p>
                    <p className="text-base sm:text-lg font-semibold text-white">
                      (81) 99999-9999
                    </p>
                    <p className="text-sm text-neutral-300 mt-1">
                      Atendimento rápido e direto
                    </p>
                  </div>
                </a>

                {/* Localização */}
                <div className="flex items-start gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center border border-orange-500/30 flex-shrink-0">
                    <MapPin className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">
                      Localização
                    </p>
                    <p className="text-base sm:text-lg font-semibold text-white">
                      Cachoeirinha-PE
                    </p>
                    <p className="text-sm text-neutral-300 mt-1">
                      Cidade do Couro e Aço
                    </p>
                  </div>
                </div>

                {/* Horário de Funcionamento */}
                <div className="flex items-start gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center border border-orange-500/30 flex-shrink-0">
                    <Clock className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">
                      Horário de Atendimento
                    </p>
                    <p className="text-base sm:text-lg font-semibold text-white">
                      Segunda a Sábado
                    </p>
                    <p className="text-sm text-neutral-300 mt-1">
                      8h às 18h
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Redes Sociais */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-neutral-900/95 via-neutral-900/90 to-neutral-950/95 backdrop-blur-2xl border border-neutral-800/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] p-6 sm:p-8">
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-transparent pointer-events-none rounded-2xl" />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.08)_50%,transparent_100%)] pointer-events-none opacity-60 rounded-2xl" />

              <div className="relative z-10">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 tracking-tight">
                  Redes Sociais
                </h3>
                <p className="text-neutral-400 text-sm mb-6">
                  Siga-nos e fique por dentro das novidades!
                </p>

                <div className="flex flex-wrap gap-4">
                  {/* Instagram */}
                  <a
                    href="https://instagram.com/selaria3irmãos"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 hover:from-purple-500 hover:via-pink-500 hover:to-orange-400 text-white border border-white/20 hover:border-white/40 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
                  </a>

                  {/* Facebook */}
                  <a
                    href="https://facebook.com/selaria3irmãos"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#1877F2] hover:bg-[#166FE5] text-white border border-white/20 hover:border-white/40 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
                  </a>

                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/5581999999999"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white border border-white/20 hover:border-white/40 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                    aria-label="WhatsApp"
                  >
                    <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
