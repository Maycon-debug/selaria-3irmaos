"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { useToast } from '@/src/components/ui/toast'
import { useMessageCount } from '@/src/hooks/use-message-count'
import {
  MessageSquare,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  Archive,
  Trash2,
  Search,
  Filter,
  LogOut,
  Home,
  Package,
  Eye,
  Reply,
  Clock,
  X,
  MessageCircle
} from 'lucide-react'
import { ReplyModal } from '@/src/components/ui/reply-modal'

interface MensagemContato {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  status: 'PENDING' | 'READ' | 'REPLIED' | 'ARCHIVED'
  createdAt: string
  updatedAt: string
}

export default function MessagesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { count: messageCount, refresh: refreshCount } = useMessageCount()
  const [user, setUser] = useState<any>(null)
  const [mensagens, setMensagens] = useState<MensagemContato[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedMessage, setSelectedMessage] = useState<MensagemContato | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [replyModalOpen, setReplyModalOpen] = useState(false)
  const [replyType, setReplyType] = useState<'email' | 'whatsapp'>('email')

  useEffect(() => {
    // Verificar autenticação
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }

    // Carregar dados do usuário
    const userData = localStorage.getItem('admin_user')
    if (userData) {
      setUser(JSON.parse(userData))
    }

    loadMessages()
  }, [router])

  const loadMessages = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/contact')
      if (res.ok) {
        const data = await res.json()
        setMensagens(data)
        // Atualizar contagem após carregar mensagens
        refreshCount()
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error)
      toast({
        title: 'Erro',
        description: 'Erro ao carregar mensagens',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    router.push('/admin/login')
    toast({
      title: 'Logout realizado',
      description: 'Você foi desconectado com sucesso',
    })
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      const data = await res.json()

      if (res.ok) {
        toast({
          title: 'Status atualizado',
          description: 'Status da mensagem atualizado com sucesso',
        })
        loadMessages()
        // Atualizar contagem após mudar status
        refreshCount()
      } else {
        throw new Error(data.error || 'Erro ao atualizar status')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao atualizar status'
      console.error('Erro ao atualizar status:', error)
      toast({
        title: 'Erro',
        description: errorMessage,
      })
    }
  }

  const deleteMessage = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta mensagem?')) {
      return
    }

    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'DELETE',
      })

      const data = await res.json()

      if (res.ok) {
        toast({
          title: 'Mensagem deletada',
          description: 'Mensagem deletada com sucesso',
        })
        loadMessages()
        // Atualizar contagem após deletar mensagem
        refreshCount()
        if (selectedMessage?.id === id) {
          setIsModalOpen(false)
          setSelectedMessage(null)
        }
      } else {
        throw new Error(data.error || 'Erro ao deletar mensagem')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao deletar mensagem'
      console.error('Erro ao deletar mensagem:', error)
      toast({
        title: 'Erro ao deletar',
        description: errorMessage,
      })
    }
  }

  const openMessage = (mensagem: MensagemContato) => {
    setSelectedMessage(mensagem)
    setIsModalOpen(true)
    // Marcar como lida se estiver pendente
    if (mensagem.status === 'PENDING') {
      updateStatus(mensagem.id, 'READ')
    }
  }

  const formatPhoneForWhatsApp = (phone: string | null): string | null => {
    if (!phone) return null
    
    // Remove todos os caracteres não numéricos
    const cleaned = phone.replace(/\D/g, '')
    
    // Validação básica - precisa ter pelo menos 10 dígitos
    if (cleaned.length < 10) return null
    
    // Se não começar com 55 (código do Brasil), adiciona
    if (cleaned.length >= 10 && cleaned.length <= 11) {
      // Número brasileiro sem código do país (10 ou 11 dígitos)
      return `55${cleaned}`
    } else if (cleaned.length >= 12 && cleaned.startsWith('55')) {
      // Já tem código do país
      return cleaned
    } else if (cleaned.length >= 12) {
      // Número internacional sem código do Brasil
      return cleaned
    }
    
    return cleaned.length >= 10 ? `55${cleaned}` : null
  }

  const getWhatsAppLink = (mensagem: MensagemContato, customMessage?: string): string | null => {
    const phone = formatPhoneForWhatsApp(mensagem.phone)
    
    if (!phone) return null
    
    // Mensagem melhorada e mais profissional
    const message = customMessage || `Olá ${mensagem.name}! 👋

Obrigado por entrar em contato conosco sobre: *${mensagem.subject}*

Recebemos sua mensagem e nossa equipe está analisando sua solicitação. Em breve entraremos em contato com mais informações.

Se precisar de algo urgente, fique à vontade para nos chamar a qualquer momento.

Estamos sempre prontos para ajudar! 🤝

Atenciosamente,
*Equipe Selaria III Irmãos* 🐂

📍 Cachoeirinha-PE • Cidade do Couro e Aço
📧 contato@selaria3irmãos.com.br
📱 (81) 99999-9999`
    
    const encodedMessage = encodeURIComponent(message)
    return `https://wa.me/${phone}?text=${encodedMessage}`
  }

  const handleReplyClick = (type: 'email' | 'whatsapp') => {
    if (!selectedMessage) return
    setReplyType(type)
    setReplyModalOpen(true)
  }

  const handleReplySuccess = () => {
    if (selectedMessage) {
      updateStatus(selectedMessage.id, 'REPLIED')
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      READ: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      REPLIED: 'bg-green-500/20 text-green-400 border-green-500/30',
      ARCHIVED: 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30',
    }
    return styles[status as keyof typeof styles] || styles.PENDING
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      PENDING: 'Pendente',
      READ: 'Lida',
      REPLIED: 'Respondida',
      ARCHIVED: 'Arquivada',
    }
    return labels[status as keyof typeof labels] || status
  }

  const filteredMessages = mensagens.filter((msg) => {
    const matchesSearch =
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || msg.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const stats = {
    total: mensagens.length,
    pending: mensagens.filter((m) => m.status === 'PENDING').length,
    read: mensagens.filter((m) => m.status === 'READ').length,
    replied: mensagens.filter((m) => m.status === 'REPLIED').length,
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center">
        <p className="text-neutral-400">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-neutral-900/95 backdrop-blur-xl border-r border-neutral-800/50 z-50">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-neutral-800/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Admin Panel</h1>
                <p className="text-xs text-neutral-400">Painel Administrativo</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-400 hover:bg-neutral-800/50 hover:text-white transition-all"
            >
              <Package className="w-5 h-5" />
              <span>Produtos</span>
            </Link>
            <Link
              href="/admin/messages"
              className="relative flex items-center gap-3 px-4 py-3 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 transition-all"
            >
              <MessageSquare className="w-5 h-5" />
              <span className="font-medium">Mensagens</span>
              {messageCount.pending > 0 && (
                <span className="absolute top-2 right-2 flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-xs font-bold animate-pulse shadow-lg shadow-red-500/50">
                  {messageCount.pending > 99 ? '99+' : messageCount.pending}
                </span>
              )}
            </Link>
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-400 hover:bg-neutral-800/50 hover:text-white transition-all"
            >
              <Home className="w-5 h-5" />
              <span>Voltar ao Site</span>
            </Link>
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-neutral-800/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 flex items-center justify-center">
                <Mail className="w-5 h-5 text-orange-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name || user?.email}</p>
                <p className="text-xs text-neutral-400">Administrador</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full bg-neutral-800/50 border-neutral-700 text-neutral-300 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Gerenciamento de Mensagens</h1>
            <p className="text-neutral-400">Gerencie mensagens de contato e suporte</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-neutral-800/95 to-neutral-900/95 backdrop-blur-xl border border-neutral-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-neutral-400 text-sm">Total</p>
                <MessageSquare className="w-5 h-5 text-orange-400" />
              </div>
              <p className="text-3xl font-bold text-white">{stats.total}</p>
            </div>

            <div className="bg-gradient-to-br from-neutral-800/95 to-neutral-900/95 backdrop-blur-xl border border-neutral-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-neutral-400 text-sm">Pendentes</p>
                <Clock className="w-5 h-5 text-yellow-400" />
              </div>
              <p className="text-3xl font-bold text-white">{stats.pending}</p>
            </div>

            <div className="bg-gradient-to-br from-neutral-800/95 to-neutral-900/95 backdrop-blur-xl border border-neutral-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-neutral-400 text-sm">Lidas</p>
                <Eye className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-3xl font-bold text-white">{stats.read}</p>
            </div>

            <div className="bg-gradient-to-br from-neutral-800/95 to-neutral-900/95 backdrop-blur-xl border border-neutral-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-neutral-400 text-sm">Respondidas</p>
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-3xl font-bold text-white">{stats.replied}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <Input
                type="text"
                placeholder="Buscar por nome, email, assunto ou mensagem..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-neutral-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 rounded-lg bg-neutral-800/50 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              >
                <option value="all">Todos os status</option>
                <option value="PENDING">Pendentes</option>
                <option value="READ">Lidas</option>
                <option value="REPLIED">Respondidas</option>
                <option value="ARCHIVED">Arquivadas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Messages List */}
        <div className="bg-gradient-to-br from-neutral-800/95 to-neutral-900/95 backdrop-blur-xl border border-neutral-700/50 rounded-xl overflow-hidden">
          {filteredMessages.length === 0 ? (
            <div className="p-12 text-center">
              <MessageSquare className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
              <p className="text-neutral-400 text-lg">Nenhuma mensagem encontrada</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-700/50">
              {filteredMessages.map((mensagem) => (
                <div
                  key={mensagem.id}
                  className={`p-6 hover:bg-neutral-800/50 transition-all cursor-pointer ${
                    mensagem.status === 'PENDING' ? 'bg-yellow-500/5 border-l-4 border-l-yellow-500' : ''
                  }`}
                  onClick={() => openMessage(mensagem)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{mensagem.name}</h3>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium border ${getStatusBadge(
                            mensagem.status
                          )}`}
                        >
                          {getStatusLabel(mensagem.status)}
                        </span>
                      </div>
                      <p className="text-neutral-400 text-sm mb-2 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {mensagem.email}
                      </p>
                      {mensagem.phone && (
                        <p className="text-neutral-400 text-sm mb-2 flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {mensagem.phone}
                        </p>
                      )}
                      <p className="text-white font-medium mb-1">{mensagem.subject}</p>
                      <p className="text-neutral-400 text-sm line-clamp-2">{mensagem.message}</p>
                      <p className="text-neutral-500 text-xs mt-2 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(mensagem.createdAt).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
                      {getWhatsAppLink(mensagem) ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedMessage(mensagem)
                            handleReplyClick('whatsapp')
                          }}
                          className="bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20 hover:scale-105 transition-transform"
                          title={`Responder via WhatsApp - ${mensagem.phone}`}
                        >
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      ) : mensagem.phone ? (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled
                          className="bg-neutral-700/30 border-neutral-600/30 text-neutral-500 cursor-not-allowed opacity-50"
                          title={`Telefone inválido: ${mensagem.phone}`}
                        >
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      ) : null}
                      {mensagem.status !== 'REPLIED' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStatus(mensagem.id, 'REPLIED')}
                          className="bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20"
                          title="Marcar como Respondida"
                        >
                          <Reply className="w-4 h-4" />
                        </Button>
                      )}
                      {mensagem.status !== 'ARCHIVED' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStatus(mensagem.id, 'ARCHIVED')}
                          className="bg-neutral-500/10 border-neutral-500/30 text-neutral-400 hover:bg-neutral-500/20"
                        >
                          <Archive className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteMessage(mensagem.id)}
                        className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal de Detalhes */}
      {isModalOpen && selectedMessage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-neutral-800/95 to-neutral-900/95 backdrop-blur-xl border border-neutral-700/50 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-700/50 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Detalhes da Mensagem</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsModalOpen(false)
                  setSelectedMessage(null)
                }}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="text-sm text-neutral-400 mb-1 block">Nome</label>
                <p className="text-white text-lg font-semibold">{selectedMessage.name}</p>
              </div>
              <div>
                <label className="text-sm text-neutral-400 mb-1 block">E-mail</label>
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="text-orange-400 hover:text-orange-300 flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  {selectedMessage.email}
                </a>
              </div>
              {selectedMessage.phone && (
                <div>
                  <label className="text-sm text-neutral-400 mb-1 block">Telefone</label>
                  {getWhatsAppLink(selectedMessage) ? (
                    <a
                      href={getWhatsAppLink(selectedMessage)!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-400 hover:text-green-300 flex items-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {selectedMessage.phone}
                      <span className="text-xs text-neutral-500">(Abrir WhatsApp)</span>
                    </a>
                  ) : (
                    <a
                      href={`tel:${selectedMessage.phone}`}
                      className="text-orange-400 hover:text-orange-300 flex items-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      {selectedMessage.phone}
                    </a>
                  )}
                </div>
              )}
              <div>
                <label className="text-sm text-neutral-400 mb-1 block">Assunto</label>
                <p className="text-white font-medium">{selectedMessage.subject}</p>
              </div>
              <div>
                <label className="text-sm text-neutral-400 mb-1 block">Mensagem</label>
                <p className="text-white whitespace-pre-wrap bg-neutral-900/50 p-4 rounded-lg border border-neutral-700/50">
                  {selectedMessage.message}
                </p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-neutral-700/50">
                <div>
                  <label className="text-sm text-neutral-400 mb-1 block">Data de Envio</label>
                  <p className="text-white text-sm">
                    {new Date(selectedMessage.createdAt).toLocaleString('pt-BR')}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-neutral-400 mb-1 block">Status</label>
                  <span
                    className={`px-3 py-1 rounded text-sm font-medium border ${getStatusBadge(
                      selectedMessage.status
                    )}`}
                  >
                    {getStatusLabel(selectedMessage.status)}
                  </span>
                </div>
              </div>
              <div className="space-y-3 pt-4 border-t border-neutral-700/50">
                {/* Botões principais de resposta */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button 
                    onClick={() => handleReplyClick('email')}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Responder por E-mail
                  </Button>
                  {getWhatsAppLink(selectedMessage) ? (
                    <Button
                      onClick={() => handleReplyClick('whatsapp')}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Responder via WhatsApp
                    </Button>
                  ) : (
                    <div className="w-full">
                      <Button
                        disabled
                        className="w-full bg-neutral-700/50 text-neutral-500 cursor-not-allowed opacity-50"
                        title={selectedMessage.phone ? `Telefone inválido: ${selectedMessage.phone}` : 'Telefone não informado'}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        WhatsApp {selectedMessage.phone ? '(telefone inválido)' : '(sem telefone)'}
                      </Button>
                      {selectedMessage.phone && (
                        <p className="text-xs text-neutral-500 mt-1 text-center">
                          Telefone: {selectedMessage.phone}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Botões de ação */}
                <div className="flex flex-wrap gap-2">
                  {selectedMessage.status !== 'REPLIED' && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        updateStatus(selectedMessage.id, 'REPLIED')
                        setIsModalOpen(false)
                      }}
                      className="bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Marcar como Respondida
                    </Button>
                  )}
                  {selectedMessage.status !== 'ARCHIVED' && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        updateStatus(selectedMessage.id, 'ARCHIVED')
                        setIsModalOpen(false)
                      }}
                      className="bg-neutral-500/10 border-neutral-500/30 text-neutral-400 hover:bg-neutral-500/20"
                    >
                      <Archive className="w-4 h-4 mr-2" />
                      Arquivar
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => {
                      deleteMessage(selectedMessage.id)
                      setIsModalOpen(false)
                    }}
                    className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Deletar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Resposta */}
      {selectedMessage && (
        <ReplyModal
          isOpen={replyModalOpen}
          onClose={() => {
            setReplyModalOpen(false)
            handleReplySuccess()
          }}
          message={selectedMessage}
          type={replyType}
        />
      )}
    </div>
  )
}

