"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card"
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, CheckCircle2 } from "lucide-react"
import { LottieLogo } from "@/src/components/ui/lottie-logo"

export default function CadastroPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const [isEntering, setIsEntering] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Animação de entrada suave
    setIsEntering(false)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Validação básica
    if (password !== confirmPassword) {
      alert("As senhas não coincidem!")
      return
    }
    if (password.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres!")
      return
    }
    // Simular cadastro bem-sucedido
    console.log("Cadastro:", { name, email, password })
    setIsSuccess(true)
    
    // Redirecionar após 3 segundos
    setTimeout(() => {
      router.push("/")
    }, 3000)
  }

  const handleLoginClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setIsEntering(true)
    
    // Aguardar animação de saída antes de navegar
    setTimeout(() => {
      router.push("/login")
    }, 400)
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background com mesmo estilo do site */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_50%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.02)_50%,transparent_100%)]" />
        </div>

        {/* Animação de Ondas Elegantes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.05)_0%,transparent_50%)] animate-pulse-slow" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.03)_0%,transparent_50%)] animate-pulse-slow" style={{ animationDelay: '2s' }} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.04)_0%,transparent_50%)] animate-pulse-slow" style={{ animationDelay: '4s' }} />
          
          {/* Ondas suaves */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-orange-500/5 via-transparent to-transparent animate-wave" />
          <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-white/3 via-transparent to-transparent animate-wave" style={{ animationDelay: '1s' }} />
        </div>

        {/* Conteúdo de Sucesso */}
        <div className="relative z-10 w-full max-w-md text-center">
          <div className="flex flex-col items-center space-y-6">
            {/* Animação Lottie */}
            <div className="relative">
              <LottieLogo 
                width={200} 
                height={200} 
                loop={true} 
                autoplay={true}
              />
            </div>

            {/* Mensagem de Bem-vindo */}
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
                <h1 className="text-4xl font-bold text-white drop-shadow-lg">
                  Bem-vindo!
                </h1>
              </div>
              <p className="text-xl text-neutral-300">
                Seu cadastro foi realizado com sucesso
              </p>
              <p className="text-sm text-neutral-400">
                Redirecionando para a página inicial...
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background com mesmo estilo do site */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.02)_50%,transparent_100%)]" />
      </div>

      {/* Animação de Ondas Elegantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.05)_0%,transparent_50%)] animate-pulse-slow" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.03)_0%,transparent_50%)] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.04)_0%,transparent_50%)] animate-pulse-slow" style={{ animationDelay: '4s' }} />
        
        {/* Ondas suaves */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-orange-500/5 via-transparent to-transparent animate-wave" />
        <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-white/3 via-transparent to-transparent animate-wave" style={{ animationDelay: '1s' }} />
      </div>

      {/* Conteúdo */}
      <div className="relative z-10 w-full max-w-md">
        {/* Botão Voltar */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-neutral-200 mb-6 transition-colors duration-200 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="text-sm font-medium">Voltar ao site</span>
        </Link>

        {/* Card de Cadastro */}
        <Card className={`relative overflow-hidden transition-all duration-500 ease-in-out ${isEntering ? 'opacity-0 scale-90 translate-x-[30px] rotate-[2deg]' : 'opacity-100 scale-100 translate-x-0 rotate-0'}`}>
          {/* Efeito espelho/glassmorphism */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-transparent pointer-events-none rounded-2xl" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.08)_50%,transparent_100%)] pointer-events-none opacity-60 rounded-2xl" />
          
          <div className="relative z-10">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-3xl font-bold text-white mb-2">
                Criar conta
              </CardTitle>
              <CardDescription className="text-neutral-400">
                Preencha os dados abaixo para criar sua conta
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Campo Nome */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Nome completo
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>

                {/* Campo Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>

                {/* Campo Senha */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200 transition-colors duration-200"
                      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Campo Confirmar Senha */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Confirmar Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200 transition-colors duration-200"
                      aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Botão Cadastrar */}
                <Button
                  type="submit"
                  variant="default"
                  className="w-full bg-white/10 hover:bg-white/15 text-white border-white/20 hover:border-white/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Cadastrar
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gradient-to-b from-neutral-900/95 via-neutral-900/90 to-neutral-950/95 px-2 text-neutral-500">
                    Ou continue com
                  </span>
                </div>
              </div>

              {/* Botões de login social */}
              <div className="grid grid-cols-2 gap-3 w-full">
                <button
                  type="button"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-white/5 backdrop-blur-sm px-4 py-2.5 text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/15 hover:backdrop-blur-md focus:bg-white/15 focus:text-white disabled:pointer-events-none disabled:opacity-40 disabled:cursor-not-allowed border border-white/10 hover:border-white/30 focus:border-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 transition-all duration-300 shadow-sm hover:shadow-md"
                  style={{
                    backgroundColor: "#ffffff",
                    borderColor: "#dadce0",
                    color: "#3c4043",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f8f9fa"
                    e.currentTarget.style.borderColor = "#dadce0"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#ffffff"
                    e.currentTarget.style.borderColor = "#dadce0"
                  }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-white/5 backdrop-blur-sm px-4 py-2.5 text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/15 hover:backdrop-blur-md focus:bg-white/15 focus:text-white disabled:pointer-events-none disabled:opacity-40 disabled:cursor-not-allowed border border-white/10 hover:border-white/30 focus:border-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 transition-all duration-300 shadow-sm hover:shadow-md"
                  style={{
                    backgroundColor: "#1877F2",
                    borderColor: "#1877F2",
                    color: "#ffffff",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#166FE5"
                    e.currentTarget.style.borderColor = "#166FE5"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#1877F2"
                    e.currentTarget.style.borderColor = "#1877F2"
                  }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </button>
              </div>

              {/* Link para login */}
              <p className="text-center text-sm text-neutral-400">
                Já tem uma conta?{" "}
                <Link
                  href="/login"
                  onClick={handleLoginClick}
                  className="text-white hover:text-neutral-200 font-medium underline-offset-4 hover:underline transition-all duration-300 relative group"
                >
                  <span className="relative z-10">Entrar</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300 ease-out"></span>
                </Link>
              </p>
            </CardFooter>
          </div>
        </Card>
      </div>
    </div>
  )
}
