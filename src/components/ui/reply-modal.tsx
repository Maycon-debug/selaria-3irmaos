"use client"

import { useState } from "react"
import { X, Mail, MessageCircle, Send } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Textarea } from "@/src/components/ui/textarea"
import { Label } from "@/src/components/ui/label"
import { useToast } from "@/src/components/ui/toast"

interface ReplyModalProps {
  isOpen: boolean
  onClose: () => void
  message: {
    id: string
    name: string
    email: string
    phone: string | null
    subject: string
  }
  type: "email" | "whatsapp"
}

export function ReplyModal({ isOpen, onClose, message, type }: ReplyModalProps) {
  const [replyText, setReplyText] = useState("")
  const [isSending, setIsSending] = useState(false)
  const { toast } = useToast()

  // Informações da loja
  const storeInfo = {
    name: "Selaria III Irmãos",
    phone: "(81) 99999-9999",
    phoneFormatted: "5581999999999",
    email: "contato@selaria3irmãos.com.br",
    location: "Cachoeirinha-PE • Cidade do Couro e Aço",
    hours: "Segunda a Sábado, 8h às 18h"
  }

  // Formatar data e hora atual
  const getFormattedDateTime = () => {
    const now = new Date()
    const date = now.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
    const time = now.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
    return { date, time }
  }

  // Gerar mensagem completa do WhatsApp
  const getWhatsAppMessage = () => {
    const { date, time } = getFormattedDateTime()
    return `Olá ${message.name}! 👋

${replyText || '[Sua mensagem aparecerá aqui]'}

━━━━━━━━━━━━━━━━━━━━
*${storeInfo.name}* 🐂

📱 ${storeInfo.phone}
📧 ${storeInfo.email}
📍 ${storeInfo.location}
🕐 ${storeInfo.hours}

📅 Resposta enviada em: ${date} às ${time}

Atenciosamente,
Equipe ${storeInfo.name}`
  }

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!replyText.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, digite uma mensagem antes de enviar.",
      })
      return
    }

    setIsSending(true)

    try {
      if (type === "email") {
        const response = await fetch("/api/contact/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: message.email,
            toName: message.name,
            subject: message.subject,
            replyText,
            originalSubject: message.subject,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Erro ao enviar email")
        }

        // Se retornou HTML mas não enviou (sem serviço configurado)
        if (data.html && !data.success) {
          // Abrir cliente de email com o HTML
          const mailtoLink = data.mailtoLink || `mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject}`)}&body=${encodeURIComponent(replyText)}`
          window.location.href = mailtoLink
          
          toast({
            title: "Email preparado!",
            description: "O cliente de email foi aberto. Configure um serviço de email para envio automático.",
          })
        } else {
          toast({
            title: "Email enviado!",
            description: "O email foi enviado com sucesso.",
          })
        }
      } else {
        // Para WhatsApp, apenas atualiza o link com a mensagem personalizada
        const phone = message.phone?.replace(/\D/g, '')
        if (!phone || phone.length < 10) {
          throw new Error("Telefone inválido")
        }

        const formattedPhone = phone.length >= 10 && phone.length <= 11 
          ? `55${phone}` 
          : phone.startsWith('55') 
            ? phone 
            : `55${phone}`

        const whatsappMessage = getWhatsAppMessage()
        const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(whatsappMessage)}`
        window.open(whatsappUrl, '_blank')
        
        toast({
          title: "WhatsApp aberto!",
          description: "A mensagem foi preparada no WhatsApp com todas as informações da loja.",
        })
      }

      setReplyText("")
      onClose()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
      toast({
        title: "Erro ao enviar",
        description: errorMessage,
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-neutral-800/95 to-neutral-900/95 backdrop-blur-xl border border-neutral-700/50 rounded-xl max-w-2xl w-full">
        <div className="p-6 border-b border-neutral-700/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {type === "email" ? (
              <Mail className="w-6 h-6 text-orange-400" />
            ) : (
              <MessageCircle className="w-6 h-6 text-green-400" />
            )}
            <h2 className="text-2xl font-bold text-white">
              Responder via {type === "email" ? "E-mail" : "WhatsApp"}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <Label className="text-neutral-400 mb-2 block">Para</Label>
            <p className="text-white font-medium">
              {type === "email" ? message.email : message.phone}
            </p>
          </div>

          <div>
            <Label className="text-neutral-400 mb-2 block">
              {type === "email" ? "Assunto" : "Assunto da conversa"}
            </Label>
            <p className="text-white font-medium">Re: {message.subject}</p>
          </div>

          <div>
            <Label htmlFor="replyText" className="text-neutral-400 mb-2 block">
              Sua mensagem *
            </Label>
            <Textarea
              id="replyText"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={
                type === "email"
                  ? "Digite sua resposta aqui..."
                  : "Digite apenas o conteúdo da sua mensagem. As informações da loja serão adicionadas automaticamente."
              }
              rows={8}
              className="bg-neutral-900/50 border-neutral-700 text-white placeholder:text-neutral-500"
              required
            />
            {type === "email" && (
              <p className="text-xs text-neutral-500 mt-2">
                A mensagem será enviada em um email estiloso com o logo e nome da loja.
              </p>
            )}
            {type === "whatsapp" && (
              <div className="mt-4 p-4 bg-neutral-900/70 border border-neutral-700/50 rounded-lg">
                <p className="text-xs text-neutral-400 mb-3 font-medium">Prévia da mensagem completa:</p>
                <div className="text-xs text-neutral-300 whitespace-pre-wrap bg-neutral-950/50 p-3 rounded border border-neutral-800/50 font-mono max-h-48 overflow-y-auto">
                  {getWhatsAppMessage()}
                </div>
                <p className="text-xs text-neutral-500 mt-3">
                  ℹ️ As informações da loja (nome, telefone, horário, data/hora) serão adicionadas automaticamente.
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-neutral-700/50">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSending}
              className="bg-neutral-800/50 border-neutral-700 text-neutral-300 hover:bg-neutral-700/50"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSending}
              className={
                type === "email"
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                  : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
              }
            >
              {isSending ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar {type === "email" ? "E-mail" : "WhatsApp"}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

