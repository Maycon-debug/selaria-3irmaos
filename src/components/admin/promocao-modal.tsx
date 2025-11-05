"use client"

import { useState, useEffect, useRef } from "react"
import { X, Percent, DollarSign, Tag, Sparkles, TrendingDown, Calculator, ChevronDown, Check } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Product } from "@/src/hooks/use-products"
import { formatPrice } from "@/src/lib/product-utils"

interface PromocaoModalProps {
  isOpen: boolean
  onClose: () => void
  products: Product[]
  onApplyPromotion: (productId: string, discountPercent: number) => Promise<void>
}

export function PromocaoModal({ isOpen, onClose, products, onApplyPromotion }: PromocaoModalProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>("")
  const [discountType, setDiscountType] = useState<"percent" | "fixed">("percent")
  const [discountValue, setDiscountValue] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
      // Reset form ao fechar
      setSelectedProductId("")
      setDiscountValue("")
      setDiscountType("percent")
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const selectedProduct = products.find(p => p.id === selectedProductId)

  // Calcular preço com desconto
  const calculateDiscountedPrice = () => {
    if (!selectedProduct || !discountValue) return null

    const currentPrice = typeof selectedProduct.price === 'number' 
      ? selectedProduct.price 
      : parseFloat(String(selectedProduct.price).replace(/[^\d,]/g, '').replace(',', '.')) || 0

    if (discountType === "percent") {
      const percent = parseFloat(discountValue) || 0
      return currentPrice * (1 - percent / 100)
    } else {
      const fixed = parseFloat(discountValue.replace(/[^\d,]/g, '').replace(',', '.')) || 0
      return Math.max(0, currentPrice - fixed)
    }
  }

  const calculateDiscountPercent = () => {
    if (!selectedProduct || !discountValue) return 0

    const currentPrice = typeof selectedProduct.price === 'number' 
      ? selectedProduct.price 
      : parseFloat(String(selectedProduct.price).replace(/[^\d,]/g, '').replace(',', '.')) || 0

    if (discountType === "percent") {
      return parseFloat(discountValue) || 0
    } else {
      const fixed = parseFloat(discountValue.replace(/[^\d,]/g, '').replace(',', '.')) || 0
      return (fixed / currentPrice) * 100
    }
  }

  const discountedPrice = calculateDiscountedPrice()
  const discountPercent = calculateDiscountPercent()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedProductId || !discountValue) {
      return
    }

    setLoading(true)
    try {
      await onApplyPromotion(selectedProductId, discountPercent)
      onClose()
    } catch (error) {
      console.error("Erro ao aplicar promoção:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="relative w-full max-w-2xl bg-gradient-to-b from-neutral-900/95 via-neutral-900/90 to-neutral-950/95 backdrop-blur-2xl border border-neutral-800/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] rounded-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Efeito glassmorphism */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.08)_50%,transparent_100%)] pointer-events-none opacity-60" />

          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-800/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 flex items-center justify-center">
                  <Tag className="h-6 w-6 text-orange-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Criar Promoção</h2>
                  <p className="text-sm text-neutral-400">Adicione desconto aos produtos</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white border border-white/20 hover:border-white/30 transition-all duration-200 flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Seleção de Produto */}
              <div className="space-y-2">
                <Label className="text-neutral-300 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Selecionar Produto
                </Label>
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-full rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm px-3 py-3 text-sm text-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 flex items-center justify-between hover:bg-white/10 transition-colors"
                  >
                    {selectedProductId ? (
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {(() => {
                          const product = products.find(p => p.id === selectedProductId)
                          return product ? (
                            <>
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-700 flex-shrink-0">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0 text-left">
                                <p className="font-medium text-white truncate">{product.name}</p>
                                <p className="text-xs text-neutral-400">{formatPrice(product.price)}</p>
                              </div>
                            </>
                          ) : null
                        })()}
                      </div>
                    ) : (
                      <span className="text-neutral-400">Selecione um produto...</span>
                    )}
                    <ChevronDown className={`h-4 w-4 text-neutral-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute z-50 w-full mt-2 rounded-lg border border-white/10 bg-gradient-to-b from-neutral-900/95 to-neutral-950/95 backdrop-blur-xl shadow-2xl overflow-hidden max-h-96 overflow-y-auto">
                      {products.length === 0 ? (
                        <div className="p-4 text-center text-neutral-400 text-sm">
                          Nenhum produto disponível
                        </div>
                      ) : (
                        <div className="py-2">
                          {products.map((product) => {
                            const isSelected = selectedProductId === product.id
                            return (
                              <button
                                key={product.id}
                                type="button"
                                onClick={() => {
                                  setSelectedProductId(product.id)
                                  setDropdownOpen(false)
                                }}
                                className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors ${
                                  isSelected ? 'bg-orange-500/10 border-l-2 border-orange-500' : ''
                                }`}
                              >
                                {/* Imagem do Produto */}
                                <div className="w-14 h-14 rounded-lg overflow-hidden bg-neutral-700 flex-shrink-0 border border-neutral-600/50">
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                
                                {/* Informações do Produto */}
                                <div className="flex-1 min-w-0 text-left">
                                  <p className={`font-medium truncate ${isSelected ? 'text-white' : 'text-neutral-200'}`}>
                                    {product.name}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <p className={`text-sm font-semibold ${isSelected ? 'text-orange-400' : 'text-neutral-300'}`}>
                                      {formatPrice(product.price)}
                                    </p>
                                    {product.originalPrice && (
                                      <p className="text-xs text-neutral-500 line-through">
                                        {formatPrice(product.originalPrice)}
                                      </p>
                                    )}
                                    {product.stock !== undefined && (
                                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                                        product.stock > 10 
                                          ? 'bg-green-500/20 text-green-400' 
                                          : product.stock > 0 
                                          ? 'bg-yellow-500/20 text-yellow-400'
                                          : 'bg-red-500/20 text-red-400'
                                      }`}>
                                        {product.stock} em estoque
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Indicador de Seleção */}
                                {isSelected && (
                                  <div className="flex-shrink-0">
                                    <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                                      <Check className="h-4 w-4 text-white" />
                                    </div>
                                  </div>
                                )}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Preview do Produto Selecionado */}
              {selectedProduct && (
                <Card className="bg-gradient-to-br from-neutral-800/95 to-neutral-900/95 backdrop-blur-xl border border-neutral-700/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-neutral-700 flex-shrink-0">
                        <img
                          src={selectedProduct.image}
                          alt={selectedProduct.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1">{selectedProduct.name}</h3>
                        <p className="text-sm text-neutral-400 line-clamp-2">{selectedProduct.description}</p>
                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="text-lg font-bold text-white">
                            {formatPrice(selectedProduct.price)}
                          </span>
                          {selectedProduct.originalPrice && (
                            <span className="text-sm text-neutral-500 line-through">
                              {formatPrice(selectedProduct.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Tipo de Desconto */}
              <div className="space-y-3">
                <Label className="text-neutral-300">Tipo de Desconto</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDiscountType("percent")}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      discountType === "percent"
                        ? "border-orange-500/50 bg-orange-500/10"
                        : "border-neutral-700/50 bg-neutral-800/50 hover:border-neutral-600"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Percent className={`h-5 w-5 ${discountType === "percent" ? "text-orange-400" : "text-neutral-400"}`} />
                      <div className="text-left">
                        <p className={`font-semibold ${discountType === "percent" ? "text-white" : "text-neutral-300"}`}>
                          Porcentagem
                        </p>
                        <p className="text-xs text-neutral-500">Ex: 10% de desconto</p>
                      </div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiscountType("fixed")}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      discountType === "fixed"
                        ? "border-orange-500/50 bg-orange-500/10"
                        : "border-neutral-700/50 bg-neutral-800/50 hover:border-neutral-600"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <DollarSign className={`h-5 w-5 ${discountType === "fixed" ? "text-orange-400" : "text-neutral-400"}`} />
                      <div className="text-left">
                        <p className={`font-semibold ${discountType === "fixed" ? "text-white" : "text-neutral-300"}`}>
                          Valor Fixo
                        </p>
                        <p className="text-xs text-neutral-500">Ex: R$ 100 de desconto</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Valor do Desconto */}
              <div className="space-y-2">
                <Label htmlFor="discount" className="text-neutral-300 flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  {discountType === "percent" ? "Porcentagem de Desconto (%)" : "Valor do Desconto (R$)"}
                </Label>
                <Input
                  id="discount"
                  type="number"
                  step={discountType === "percent" ? "1" : "0.01"}
                  min="0"
                  max={discountType === "percent" ? "100" : undefined}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  placeholder={discountType === "percent" ? "Ex: 10" : "Ex: 100.00"}
                  className="bg-neutral-800/50 border-neutral-700 text-white text-lg font-semibold"
                  required
                />
              </div>

              {/* Preview do Desconto */}
              {selectedProduct && discountValue && discountedPrice !== null && (
                <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-neutral-400 mb-1">Preço Original</p>
                        <p className="text-xl font-bold text-white line-through">
                          {formatPrice(selectedProduct.price)}
                        </p>
                      </div>
                      <TrendingDown className="h-8 w-8 text-green-400" />
                      <div className="text-right">
                        <p className="text-sm text-neutral-400 mb-1">
                          {discountPercent.toFixed(1)}% OFF
                        </p>
                        <p className="text-2xl font-bold text-green-400">
                          {formatPrice(discountedPrice)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-green-500/20">
                      <p className="text-xs text-green-400">
                        Economia de {formatPrice(
                          (typeof selectedProduct.price === 'number' 
                            ? selectedProduct.price 
                            : parseFloat(String(selectedProduct.price).replace(/[^\d,]/g, '').replace(',', '.')) || 0
                          ) - discountedPrice
                        )}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Botões */}
              <div className="flex gap-3 pt-4 border-t border-neutral-800/50">
                <Button
                  type="button"
                  onClick={onClose}
                  variant="outline"
                  className="flex-1 border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={!selectedProductId || !discountValue || loading}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                >
                  {loading ? "Aplicando..." : "Aplicar Promoção"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

