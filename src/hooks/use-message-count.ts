"use client"

import { useState, useEffect } from 'react'

interface MessageCount {
  pending: number
  total: number
}

export function useMessageCount() {
  const [count, setCount] = useState<MessageCount>({ pending: 0, total: 0 })
  const [loading, setLoading] = useState(true)

  const fetchCount = async () => {
    try {
      const res = await fetch('/api/contact')
      if (res.ok) {
        const messages = await res.json()
        const pending = messages.filter((m: any) => m.status === 'PENDING').length
        setCount({
          pending,
          total: messages.length,
        })
      }
    } catch (error) {
      console.error('Erro ao buscar contagem de mensagens:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Buscar imediatamente
    fetchCount()

    // Atualizar a cada 30 segundos (polling)
    const interval = setInterval(fetchCount, 30000)

    return () => clearInterval(interval)
  }, [])

  return { count, loading, refresh: fetchCount }
}

