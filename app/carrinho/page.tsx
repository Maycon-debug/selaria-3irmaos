"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, ShoppingCart, Trash2, Plus, Minus, MapPin, Package, MessageCircle } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { cn } from "@/lib/utils"

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

export default function CarrinhoPage() {
  const [cartItems, setCartItems] = React.useState<CartItem[]>([
    {
      id: "sela-1",
      name: "Sela Vaquejada Premium",
      price: 1899.00,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
      quantity: 1,
    },
  ])
  const [cep, setCep] = React.useState("")
  const [cepLoading, setCepLoading] = React.useState(false)
  const [shippingPrice, setShippingPrice] = React.useState<number | null>(null)

  const updateQuantity = (id: string, change: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    )
  }

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    if (value.length <= 8) {
      setCep(value)
      if (value.length === 8) {
        consultarFrete(value)
      } else {
        setShippingPrice(null)
      }
    }
  }

  const consultarFrete = async (cepValue: string) => {
    setCepLoading(true)
    // Simulação de consulta de frete
    setTimeout(() => {
      // Valor simulado de frete
      const simulatedShipping = Math.random() * 100 + 50
      setShippingPrice(simulatedShipping)
      setCepLoading(false)
    }, 1000)
  }

  const formatCep = (value: string) => {
    return value.replace(/(\d{5})(\d{3})/, "$1-$2")
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal + (shippingPrice || 0)

  const handleNegociarEnvio = () => {
    const itemsText = cartItems
      .map((item) => `${item.name} x${item.quantity}`)
      .join("\n")
    const message = encodeURIComponent(
      `Olá! Gostaria de negociar o envio para os seguintes produtos:\n\n${itemsText}\n\nCEP: ${formatCep(cep) || "Não informado"}\n\nTotal: R$ ${total.toFixed(2).replace(".", ",")}`
    )
    const phoneNumber = "5511999999999" // Substitua pelo número real
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank")
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-200 via-neutral-300 to-neutral-250 text-neutral-900 relative overflow-hidden">
      {/* Textura sutil de fundo */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808015_1px,transparent_1px),linear-gradient(to_bottom,#80808015_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-neutral-400/10" />

      {/* CONTEÚDO */}
      <section className="relative pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20 flex flex-col items-center px-2 sm:px-4 z-10">
        <div className="w-full max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 sm:mb-10 md:mb-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <Link href="/" className="order-2 sm:order-1">
                <Button
                  variant="outline"
                  className="bg-neutral-800/90 hover:bg-neutral-900 text-neutral-100 hover:text-white border border-neutral-700 hover:border-neutral-600 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Continuar Comprando
                </Button>
              </Link>
              <div className="text-center order-1 sm:order-2 flex-1 sm:absolute sm:left-1/2 sm:-translate-x-1/2">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-800 tracking-tight drop-shadow-sm mb-2 flex items-center justify-center gap-3">
                  <ShoppingCart className="h-8 w-8 sm:h-10 sm:w-10 text-orange-500" />
                  Carrinho de Compras
                </h1>
                <p className="text-neutral-700 text-base sm:text-lg">
                  {cartItems.length} {cartItems.length === 1 ? "produto" : "produtos"} no carrinho
                </p>
              </div>
              <div className="hidden sm:block order-3 w-24" />
            </div>
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-16 sm:py-24 md:py-32">
              <div className="inline-flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-b from-neutral-900/95 via-neutral-900/90 to-neutral-950/95 backdrop-blur-2xl border border-neutral-800/50 shadow-lg mb-6 sm:mb-8">
                <ShoppingCart className="h-12 w-12 sm:h-16 sm:w-16 text-neutral-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-800 mb-4 tracking-tight">
                Carrinho vazio
              </h2>
              <p className="text-neutral-700 text-base sm:text-lg mb-8 max-w-md mx-auto px-4">
                Adicione produtos ao seu carrinho para começar a comprar
              </p>
              <Link href="/">
                <Button
                  variant="default"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Explorar Produtos
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Lista de Produtos */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-neutral-900/95 via-neutral-900/90 to-neutral-950/95 backdrop-blur-2xl border border-neutral-800/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] p-4 sm:p-6"
                  >
                    {/* Efeito espelho/glassmorphism */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-white/3 to-transparent pointer-events-none rounded-2xl" />
                    
                    <div className="relative z-10 flex flex-col sm:flex-row gap-4">
                      {/* Imagem */}
                      <div className="relative w-full sm:w-32 h-48 sm:h-32 rounded-lg overflow-hidden bg-neutral-950 flex-shrink-0">
                        <div
                          className="absolute inset-0 bg-cover bg-center"
                          style={{
                            backgroundImage: `url(${item.image})`,
                          }}
                        />
                      </div>

                      {/* Informações do Produto */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                            {item.name}
                          </h3>
                          <p className="text-xl sm:text-2xl font-bold text-orange-400 mb-4">
                            R$ {item.price.toFixed(2).replace(".", ",")}
                          </p>
                        </div>

                        {/* Controles de Quantidade e Remover */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 transition-all duration-200 flex items-center justify-center"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="text-white font-semibold w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 transition-all duration-200 flex items-center justify-center"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="px-4 py-2 rounded-lg bg-red-500/90 hover:bg-red-600 text-white text-sm font-medium transition-all duration-200 flex items-center gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            Remover
                          </button>
                        </div>
                      </div>

                      {/* Preço Total do Item */}
                      <div className="flex sm:flex-col items-end sm:items-start justify-between sm:justify-end">
                        <div className="text-right sm:text-left">
                          <p className="text-xs text-neutral-400 uppercase mb-1">Subtotal</p>
                          <p className="text-xl sm:text-2xl font-bold text-white">
                            R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Resumo do Pedido */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-neutral-900/95 via-neutral-900/90 to-neutral-950/95 backdrop-blur-2xl border border-neutral-800/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] p-6">
                    {/* Efeito espelho/glassmorphism */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-white/3 to-transparent pointer-events-none rounded-2xl" />
                    
                    <div className="relative z-10">
                      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <Package className="h-6 w-6 text-orange-400" />
                        Resumo do Pedido
                      </h2>

                      {/* Consulta de CEP */}
                      <div className="mb-6 space-y-3">
                        <Label htmlFor="cep" className="text-neutral-300 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Consultar Frete
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="cep"
                            type="text"
                            placeholder="00000-000"
                            value={formatCep(cep)}
                            onChange={handleCepChange}
                            maxLength={9}
                            className="bg-white/5 border-white/20 text-white placeholder:text-neutral-500 focus:border-orange-500/50"
                          />
                          {cepLoading && (
                            <div className="flex items-center justify-center w-12">
                              <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                          )}
                        </div>
                        {shippingPrice !== null && (
                          <p className="text-sm text-neutral-300">
                            Frete estimado: <span className="text-orange-400 font-semibold">R$ {shippingPrice.toFixed(2).replace(".", ",")}</span>
                          </p>
                        )}
                      </div>

                      {/* Divisor */}
                      <div className="border-t border-white/10 my-6" />

                      {/* Resumo de Valores */}
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-neutral-300">
                          <span>Subtotal</span>
                          <span className="text-white font-medium">
                            R$ {subtotal.toFixed(2).replace(".", ",")}
                          </span>
                        </div>
                        {shippingPrice !== null && (
                          <div className="flex justify-between text-neutral-300">
                            <span>Frete</span>
                            <span className="text-white font-medium">
                              R$ {shippingPrice.toFixed(2).replace(".", ",")}
                            </span>
                          </div>
                        )}
                        <div className="border-t border-white/10 pt-3 flex justify-between text-lg font-bold text-white">
                          <span>Total</span>
                          <span className="text-orange-400">
                            R$ {total.toFixed(2).replace(".", ",")}
                          </span>
                        </div>
                      </div>

                      {/* Botão Negociar Envio */}
                      <Button
                        onClick={handleNegociarEnvio}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 mb-4"
                      >
                        <MessageCircle className="h-5 w-5" />
                        Negociar Envio no WhatsApp
                      </Button>

                      {/* Botão Finalizar Compra */}
                      <Button
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Finalizar Compra
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

