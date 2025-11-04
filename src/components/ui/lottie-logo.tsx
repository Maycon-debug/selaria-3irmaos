"use client"

import * as React from "react"
import Lottie from "lottie-react"

interface LottieLogoProps {
  className?: string
  width?: number
  height?: number
  loop?: boolean
  autoplay?: boolean
  animationUrl?: string
}

export function LottieLogo({ 
  className, 
  width = 200, 
  height = 200,
  loop = false,
  autoplay = true,
  animationUrl
}: LottieLogoProps) {
  const [animationData, setAnimationData] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    // URLs para animação do LottieFiles
    const urls = [
      animationUrl,
    ].filter(Boolean)

    const loadAnimation = async () => {
      for (const url of urls) {
        try {
          const response = await fetch(url)
          if (response.ok) {
            const data = await response.json()
            setAnimationData(data)
            setLoading(false)
            return
          }
        } catch (error) {
          console.warn(`Falha ao carregar animação de ${url}`, error)
        }
      }
      setLoading(false)
    }

    loadAnimation()
  }, [animationUrl])

  if (loading) {
    return (
      <div 
        className={className}
        style={{ width, height }}
      >
        <div className="w-full h-full bg-neutral-900/20 rounded-lg animate-pulse" />
      </div>
    )
  }

  if (!animationData) {
    return (
      <div 
        className={className}
        style={{ width, height }}
      >
        <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm">
          Logo
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <Lottie
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
        style={{ width, height }}
      />
    </div>
  )
}

