"use client"

import * as React from "react"
import { X, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Toast {
  id: string
  title: string
  description?: string
  duration?: number
}

interface ToastContextType {
  toast: (toast: Omit<Toast, "id">) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const toast = React.useCallback((newToast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    const toastWithId = { ...newToast, id }
    
    setToasts((prev) => [...prev, toastWithId])

    // Remover automaticamente após a duração
    const duration = newToast.duration || 5000
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, duration)
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-0 right-0 z-[100] flex flex-col gap-2 w-full sm:w-auto p-4 pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    // Animação de entrada
    setTimeout(() => setIsVisible(true), 10)
  }, [])

  return (
    <div
      className={cn(
        "pointer-events-auto relative w-full sm:w-[356px] flex items-start gap-3 p-4 rounded-lg border bg-gradient-to-b from-neutral-900/95 via-neutral-900/90 to-neutral-950/95 backdrop-blur-2xl border-neutral-800/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] transition-all duration-300",
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}
      onClick={() => onRemove(toast.id)}
    >
      {/* Efeito espelho/glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-transparent pointer-events-none rounded-lg" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.08)_50%,transparent_100%)] pointer-events-none opacity-60 rounded-lg" />

      <div className="relative z-10 flex items-start gap-3 w-full">
        {/* Ícone */}
        <div className="flex-shrink-0 mt-0.5">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-500/20 border border-green-500/30">
            <CheckCircle2 className="h-5 w-5 text-green-400" />
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-white leading-none mb-1">
            {toast.title}
          </div>
          {toast.description && (
            <div className="text-xs text-neutral-300 mt-1 leading-relaxed">
              {toast.description}
            </div>
          )}
        </div>

        {/* Botão fechar */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsVisible(false)
            setTimeout(() => onRemove(toast.id), 200)
          }}
          className="flex-shrink-0 w-6 h-6 rounded-md bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/10 hover:border-white/20 transition-all duration-200 flex items-center justify-center"
          aria-label="Fechar notificação"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast deve ser usado dentro de ToastProvider")
  }
  return context
}

