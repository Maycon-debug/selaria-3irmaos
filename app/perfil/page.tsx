"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import {
  User,
  Mail,
  Calendar,
  ShoppingBag,
  Heart,
  Package,
  Edit,
  Save,
  X,
  MapPin,
  Phone,
  Shield,
  Award,
  TrendingUp,
  ArrowLeft
} from "lucide-react"
import { useToast } from "@/src/components/ui/toast"

export default function PerfilPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  })
  const [stats, setStats] = useState({
    totalPedidos: 0,
    totalFavoritos: 0,
    totalGasto: 0,
    ultimoPedido: null as string | null,
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      setUserData({
        name: session.user.name || "",
        email: session.user.email || "",
        phone: "",
        address: "",
      })
      // TODO: Buscar dados completos do usuário da API
      fetchUserStats()
    }
  }, [session])

  const fetchUserStats = async () => {
    // TODO: Implementar busca de estatísticas do usuário
    // Por enquanto, valores mockados
    setStats({
      totalPedidos: 0,
      totalFavoritos: 0,
      totalGasto: 0,
      ultimoPedido: null,
    })
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // TODO: Implementar atualização de perfil via API
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso",
      })
      setIsEditing(false)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o perfil",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
        <p className="text-neutral-400">Carregando...</p>
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white relative overflow-hidden">
      {/* Textura de fundo */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808015_1px,transparent_1px),linear-gradient(to_bottom,#80808015_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-neutral-400/10" />

      {/* Conteúdo */}
      <div className="relative z-10 pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Botão Voltar */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-neutral-200 transition-colors duration-200 mb-6 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="text-sm font-medium">Voltar ao início</span>
        </Link>

        {/* Header do Perfil */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="relative">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "Usuário"}
                    className="h-20 w-20 sm:h-24 sm:w-24 rounded-full border-4 border-orange-500/50 object-cover shadow-lg"
                  />
                ) : (
                  <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 border-4 border-orange-500/50 flex items-center justify-center text-white font-bold text-2xl sm:text-3xl shadow-lg">
                    {session.user.name?.[0]?.toUpperCase() || session.user.email?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <div className="absolute bottom-0 right-0 h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-green-500 border-4 border-neutral-900" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">
                  {session.user.name || "Usuário"}
                </h1>
                <p className="text-neutral-400 text-sm sm:text-base">{session.user.email}</p>
                {(session.user as any)?.role && (
                  <span className="inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    {(session.user as any).role === 'ADMIN' ? '👑 Administrador' : '👤 Usuário'}
                  </span>
                )}
              </div>
            </div>
            <Button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isEditing ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Perfil
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-neutral-800/95 to-neutral-900/95 backdrop-blur-xl border border-neutral-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-neutral-400 text-sm">Total de Pedidos</p>
                <ShoppingBag className="h-5 w-5 text-blue-400" />
              </div>
              <p className="text-3xl font-bold text-white">{stats.totalPedidos}</p>
              <p className="text-xs text-neutral-500 mt-1">Pedidos realizados</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-neutral-800/95 to-neutral-900/95 backdrop-blur-xl border border-neutral-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-neutral-400 text-sm">Favoritos</p>
                <Heart className="h-5 w-5 text-red-400" />
              </div>
              <p className="text-3xl font-bold text-white">{stats.totalFavoritos}</p>
              <p className="text-xs text-neutral-500 mt-1">Produtos favoritados</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-neutral-800/95 to-neutral-900/95 backdrop-blur-xl border border-neutral-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-neutral-400 text-sm">Total Gasto</p>
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
              <p className="text-3xl font-bold text-white">
                R$ {stats.totalGasto.toFixed(2).replace('.', ',')}
              </p>
              <p className="text-xs text-neutral-500 mt-1">Em compras</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-neutral-800/95 to-neutral-900/95 backdrop-blur-xl border border-neutral-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-neutral-400 text-sm">Membro Desde</p>
                <Calendar className="h-5 w-5 text-purple-400" />
              </div>
              <p className="text-lg font-bold text-white">Nov 2025</p>
              <p className="text-xs text-neutral-500 mt-1">Há pouco tempo</p>
            </CardContent>
          </Card>
        </div>

        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Esquerda - Informações Pessoais */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informações Pessoais */}
            <Card className="bg-gradient-to-br from-neutral-800/95 to-neutral-900/95 backdrop-blur-xl border border-neutral-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <User className="h-5 w-5 text-orange-400" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-neutral-300 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Nome Completo
                    </Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={userData.name}
                        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                        className="bg-neutral-800/50 border-neutral-700 text-white"
                      />
                    ) : (
                      <p className="text-white">{userData.name || "Não informado"}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-neutral-300 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={userData.email}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        className="bg-neutral-800/50 border-neutral-700 text-white"
                      />
                    ) : (
                      <p className="text-white">{userData.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-neutral-300 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Telefone
                    </Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        type="tel"
                        value={userData.phone}
                        onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                        placeholder="(00) 00000-0000"
                        className="bg-neutral-800/50 border-neutral-700 text-white"
                      />
                    ) : (
                      <p className="text-white">{userData.phone || "Não informado"}</p>
                    )}
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="address" className="text-neutral-300 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Endereço
                    </Label>
                    {isEditing ? (
                      <Input
                        id="address"
                        value={userData.address}
                        onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                        placeholder="Rua, número, bairro, cidade - CEP"
                        className="bg-neutral-800/50 border-neutral-700 text-white"
                      />
                    ) : (
                      <p className="text-white">{userData.address || "Não informado"}</p>
                    )}
                  </div>
                </div>
                {isEditing && (
                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={handleSave}
                      disabled={loading}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </Button>
                    <Button
                      onClick={() => {
                        setIsEditing(false)
                        // Resetar dados
                        if (session?.user) {
                          setUserData({
                            name: session.user.name || "",
                            email: session.user.email || "",
                            phone: "",
                            address: "",
                          })
                        }
                      }}
                      variant="outline"
                      className="border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Histórico de Pedidos */}
            <Card className="bg-gradient-to-br from-neutral-800/95 to-neutral-900/95 backdrop-blur-xl border border-neutral-700/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Package className="h-5 w-5 text-orange-400" />
                    Histórico de Pedidos
                  </CardTitle>
                  <Link href="/pedidos">
                    <Button variant="outline" size="sm" className="border-neutral-700 text-neutral-300 hover:bg-neutral-800">
                      Ver Todos
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {stats.totalPedidos === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-neutral-600 mx-auto mb-4" />
                    <p className="text-neutral-400 mb-4">Você ainda não realizou nenhum pedido</p>
                    <Link href="/produtos">
                      <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                        Explorar Produtos
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* TODO: Listar pedidos reais aqui */}
                    <p className="text-neutral-400 text-sm">Pedidos serão exibidos aqui</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Coluna Direita - Links Rápidos */}
          <div className="space-y-6">
            {/* Links Rápidos */}
            <Card className="bg-gradient-to-br from-neutral-800/95 to-neutral-900/95 backdrop-blur-xl border border-neutral-700/50">
              <CardHeader>
                <CardTitle className="text-white text-lg">Acesso Rápido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/favoritos">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Meus Favoritos
                  </Button>
                </Link>
                <Link href="/carrinho">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Carrinho de Compras
                  </Button>
                </Link>
                <Link href="/pedidos">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Meus Pedidos
                  </Button>
                </Link>
                {(session.user as any)?.role === 'ADMIN' && (
                  <Link href="/admin/dashboard">
                    <Button
                      variant="outline"
                      className="w-full justify-start border-orange-700 text-orange-400 hover:bg-orange-500/10 hover:text-orange-300"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Painel Admin
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>

            {/* Segurança */}
            <Card className="bg-gradient-to-br from-neutral-800/95 to-neutral-900/95 backdrop-blur-xl border border-neutral-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white text-lg">
                  <Shield className="h-5 w-5 text-green-400" />
                  Segurança
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-400" />
                    <span className="text-sm text-neutral-300">Conta Verificada</span>
                  </div>
                  <Award className="h-4 w-4 text-green-400" />
                </div>
                <Button
                  variant="outline"
                  className="w-full border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                >
                  Alterar Senha
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

