"use client"

import * as React from "react"
import { useSession } from "next-auth/react"

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

interface CartContextType {
  cartItems: CartItem[]
  cartCount: number
  addToCart: (item: Omit<CartItem, "quantity">) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  loadCart: () => void
}

const CartContext = React.createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = React.useState<CartItem[]>([])
  const { data: session } = useSession()

  // Carregar carrinho do localStorage e do banco
  const loadCart = React.useCallback(async () => {
    if (typeof window !== "undefined") {
      let localItems: CartItem[] = []
      
      // Carregar do localStorage primeiro (para usuários não logados)
      try {
        const saved = localStorage.getItem("cart")
        if (saved) {
          localItems = JSON.parse(saved)
          setCartItems(localItems)
        } else {
          setCartItems([])
        }
      } catch (error) {
        console.error("Erro ao carregar carrinho:", error)
        setCartItems([])
      }

      // Se usuário estiver logado, carregar do banco também
      if (session?.user) {
        try {
          const res = await fetch('/api/cart')
          if (res.ok) {
            const dbItems = await res.json()
            // Converter formato do banco para formato do carrinho
            const formattedItems: CartItem[] = dbItems.map((item: any) => ({
              id: item.produto.id,
              name: item.produto.name,
              price: parseFloat(item.produto.price.toString()),
              image: item.produto.image,
              quantity: item.quantity,
            }))
            
            // Combinar com localStorage (banco tem prioridade)
            const allItems = [...formattedItems]
            setCartItems(allItems)
            localStorage.setItem("cart", JSON.stringify(allItems))
          }
        } catch (error) {
          console.error("Erro ao carregar carrinho do banco:", error)
        }
      }
    }
  }, [session])

  // Carregar carrinho ao montar e quando a janela recebe foco ou sessão muda
  React.useEffect(() => {
    loadCart()
    
    // Escutar mudanças no localStorage de outras abas
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cart") {
        loadCart()
      }
    }
    
    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("focus", loadCart)
    
    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("focus", loadCart)
    }
  }, [loadCart])

  const addToCart = React.useCallback(async (item: Omit<CartItem, "quantity">) => {
    const existingItem = cartItems.find((i) => i.id === item.id)
    const newQuantity = existingItem ? existingItem.quantity + 1 : 1
    
    // Tentar salvar no banco se usuário estiver logado
    if (session?.user) {
      try {
        const res = await fetch('/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            productId: item.id, 
            quantity: 1 
          }),
        })
        
        if (!res.ok) {
          console.warn('Erro ao salvar carrinho no banco, usando localStorage')
        }
      } catch (error) {
        console.error('Erro ao salvar carrinho no banco:', error)
      }
    }

    // Atualizar estado local e localStorage (sempre, como fallback)
    setCartItems((prev) => {
      const existingItem = prev.find((i) => i.id === item.id)
      
      let newCart: CartItem[]
      if (existingItem) {
        newCart = prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      } else {
        newCart = [...prev, { ...item, quantity: 1 }]
      }

      // Salvar no localStorage (fallback ou para usuários não logados)
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("cart", JSON.stringify(newCart))
        } catch (error) {
          console.error("Erro ao salvar carrinho:", error)
        }
      }

      return newCart
    })
  }, [cartItems, session])

  const removeFromCart = React.useCallback(async (id: string) => {
    // Tentar remover do banco se usuário estiver logado
    if (session?.user) {
      try {
        const res = await fetch(`/api/cart?productId=${id}`, {
          method: 'DELETE',
        })
        
        if (!res.ok) {
          console.warn('Erro ao remover item do banco, usando localStorage')
        }
      } catch (error) {
        console.error('Erro ao remover item do banco:', error)
      }
    }

    // Atualizar estado local e localStorage (sempre, como fallback)
    setCartItems((prev) => {
      const newCart = prev.filter((item) => item.id !== id)
      
      // Salvar no localStorage (fallback ou para usuários não logados)
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("cart", JSON.stringify(newCart))
        } catch (error) {
          console.error("Erro ao salvar carrinho:", error)
        }
      }

      return newCart
    })
  }, [session])

  const updateQuantity = React.useCallback(async (id: string, quantity: number) => {
    const finalQuantity = Math.max(1, quantity)
    
    // Tentar atualizar no banco se usuário estiver logado
    if (session?.user) {
      try {
        const res = await fetch('/api/cart', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            productId: id, 
            quantity: finalQuantity 
          }),
        })
        
        if (!res.ok) {
          console.warn('Erro ao atualizar quantidade no banco, usando localStorage')
        }
      } catch (error) {
        console.error('Erro ao atualizar quantidade no banco:', error)
      }
    }

    // Atualizar estado local e localStorage (sempre, como fallback)
    setCartItems((prev) => {
      const newCart = prev.map((item) =>
        item.id === id ? { ...item, quantity: finalQuantity } : item
      )

      // Salvar no localStorage (fallback ou para usuários não logados)
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("cart", JSON.stringify(newCart))
        } catch (error) {
          console.error("Erro ao salvar carrinho:", error)
        }
      }

      return newCart
    })
  }, [session])

  const clearCart = React.useCallback(async () => {
    // Limpar do banco se usuário estiver logado
    if (session?.user && cartItems.length > 0) {
      try {
        // Remover cada item do banco
        await Promise.all(
          cartItems.map(item =>
            fetch(`/api/cart?productId=${item.id}`, {
              method: 'DELETE',
            })
          )
        )
      } catch (error) {
        console.error('Erro ao limpar carrinho do banco:', error)
      }
    }

    // Limpar estado local e localStorage
    setCartItems([])
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("cart")
      } catch (error) {
        console.error("Erro ao limpar carrinho:", error)
      }
    }
  }, [session, cartItems])

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = React.useContext(CartContext)
  if (!context) {
    throw new Error("useCart deve ser usado dentro de CartProvider")
  }
  return context
}

