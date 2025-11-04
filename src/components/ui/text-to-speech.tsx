"use client"

import * as React from "react"
import { Play, Pause, Volume2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface TextToSpeechProps {
  text: string
  className?: string
  buttonClassName?: string
}

export function TextToSpeech({ text, className, buttonClassName }: TextToSpeechProps) {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const synthRef = React.useRef<SpeechSynthesis | null>(null)
  const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null)

  React.useEffect(() => {
    // Verifica se a API está disponível
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis
    }

    // Limpa quando o componente desmonta
    return () => {
      if (synthRef.current && utteranceRef.current) {
        synthRef.current.cancel()
      }
    }
  }, [])

  const handleToggle = () => {
    if (!synthRef.current) {
      alert("Seu navegador não suporta leitura de voz. Tente usar Chrome, Edge ou Safari.")
      return
    }

    if (isPlaying) {
      // Pausar
      synthRef.current.pause()
      setIsPlaying(false)
    } else {
      // Se estava pausado, retomar
      if (synthRef.current.paused) {
        synthRef.current.resume()
        setIsPlaying(true)
      } else {
        // Iniciar nova leitura
        if (utteranceRef.current) {
          synthRef.current.cancel()
        }

        const utterance = new SpeechSynthesisUtterance(text)
        
        // Configurações da voz em português
        utterance.lang = "pt-BR"
        utterance.rate = 0.9 // Velocidade ligeiramente mais lenta
        utterance.pitch = 1.0
        utterance.volume = 1.0

        // Tenta selecionar uma voz em português
        const voices = synthRef.current.getVoices()
        const portugueseVoice = voices.find(
          (voice) => voice.lang.startsWith("pt")
        )
        if (portugueseVoice) {
          utterance.voice = portugueseVoice
        }

        utterance.onend = () => {
          setIsPlaying(false)
          utteranceRef.current = null
        }

        utterance.onerror = () => {
          setIsPlaying(false)
          utteranceRef.current = null
        }

        utteranceRef.current = utterance
        synthRef.current.speak(utterance)
        setIsPlaying(true)
      }
    }
  }

  // Carrega as vozes disponíveis quando o componente monta
  React.useEffect(() => {
    if (synthRef.current) {
      // Chrome precisa de um pequeno delay para carregar as vozes
      const loadVoices = () => {
        synthRef.current?.getVoices()
      }
      loadVoices()
      if (synthRef.current.onvoiceschanged !== undefined) {
        synthRef.current.onvoiceschanged = loadVoices
      }
    }
  }, [])

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        onClick={handleToggle}
        className={cn(
          "inline-flex items-center justify-center gap-2 h-9 w-9 rounded-lg bg-white/5 backdrop-blur-sm text-neutral-300 hover:text-white hover:bg-white/15 hover:backdrop-blur-md border border-white/10 hover:border-white/30 transition-all duration-300 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900",
          isPlaying && "bg-white/15 text-white border-white/30",
          buttonClassName
        )}
        aria-label={isPlaying ? "Pausar leitura" : "Ouvir descrição"}
        title={isPlaying ? "Pausar leitura" : "Ouvir descrição do produto"}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </button>
      <span className="text-xs text-neutral-400 hidden lg:inline-flex items-center gap-1">
        <Volume2 className="h-3 w-3" />
        Ouvir
      </span>
    </div>
  )
}

