"use client"

import * as React from "react"

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

  // Carregar carrinho do localStorage
  const loadCart = React.useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("cart")
        if (saved) {
          const items = JSON.parse(saved)
          setCartItems(items)
        } else {
          setCartItems([])
        }
      } catch (error) {
        console.error("Erro ao carregar carrinho:", error)
        setCartItems([])
      }
    }
  }, [])

  // Carregar carrinho ao montar e quando a janela recebe foco
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

  const addToCart = React.useCallback((item: Omit<CartItem, "quantity">) => {
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

      // Salvar no localStorage
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("cart", JSON.stringify(newCart))
        } catch (error) {
          console.error("Erro ao salvar carrinho:", error)
        }
      }

      return newCart
    })
  }, [])

  const removeFromCart = React.useCallback((id: string) => {
    setCartItems((prev) => {
      const newCart = prev.filter((item) => item.id !== id)
      
      // Salvar no localStorage
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("cart", JSON.stringify(newCart))
        } catch (error) {
          console.error("Erro ao salvar carrinho:", error)
        }
      }

      return newCart
    })
  }, [])

  const updateQuantity = React.useCallback((id: string, quantity: number) => {
    setCartItems((prev) => {
      const newCart = prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )

      // Salvar no localStorage
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("cart", JSON.stringify(newCart))
        } catch (error) {
          console.error("Erro ao salvar carrinho:", error)
        }
      }

      return newCart
    })
  }, [])

  const clearCart = React.useCallback(() => {
    setCartItems([])
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("cart")
      } catch (error) {
        console.error("Erro ao limpar carrinho:", error)
      }
    }
  }, [])

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

