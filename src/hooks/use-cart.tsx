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

  const loadCart = React.useCallback(async () => {
    if (typeof window !== "undefined") {
      let localItems: CartItem[] = []
      
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

      if (session?.user) {
        try {
          const res = await fetch('/api/cart')
          if (res.ok) {
            const dbItems = await res.json()
            const formattedItems: CartItem[] = dbItems.map((item: any) => ({
              id: item.produto.id,
              name: item.produto.name,
              price: parseFloat(item.produto.price.toString()),
              image: item.produto.image,
              quantity: item.quantity,
            }))
            
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

  React.useEffect(() => {
    loadCart()
    
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

    setCartItems((prev) => {
      const newCart = prev.filter((item) => item.id !== id)
      
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

    setCartItems((prev) => {
      const newCart = prev.map((item) =>
        item.id === id ? { ...item, quantity: finalQuantity } : item
      )

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
    if (session?.user && cartItems.length > 0) {
      try {
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

