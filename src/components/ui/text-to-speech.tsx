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
          "inline-flex items-center justify-center gap-2 h-11 w-11 rounded-lg bg-green-500/10 backdrop-blur-sm text-green-400 hover:text-green-300 hover:bg-green-500/20 hover:backdrop-blur-md border-2 border-green-500/50 hover:border-green-500 transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-green-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900",
          isPlaying && "bg-green-500/20 text-green-300 border-green-500 shadow-md shadow-green-500/40",
          buttonClassName
        )}
        aria-label={isPlaying ? "Pausar leitura" : "Ouvir descrição"}
        title={isPlaying ? "Pausar leitura" : "Ouvir descrição do produto"}
      >
        {isPlaying ? (
          <Pause className="h-5 w-5" />
        ) : (
          <Play className="h-5 w-5" />
        )}
      </button>
      <span className="text-xs text-green-400 hidden lg:inline-flex items-center gap-1">
        <Volume2 className="h-3 w-3" />
        Ouvir
      </span>
    </div>
  )
}

