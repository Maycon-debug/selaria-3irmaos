"use client"

import { useState } from "react"
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
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Lógica de login aqui
    console.log("Login:", { email, password })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background com mesmo estilo do site */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.02)_50%,transparent_100%)]" />
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

        {/* Card de Login */}
        <Card className="relative overflow-hidden">
          {/* Efeito espelho/glassmorphism */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-transparent pointer-events-none rounded-2xl" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.08)_50%,transparent_100%)] pointer-events-none opacity-60 rounded-2xl" />
          
          <div className="relative z-10">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-3xl font-bold text-white mb-2">
                Bem-vindo de volta
              </CardTitle>
              <CardDescription className="text-neutral-400">
                Entre com suas credenciais para acessar sua conta
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
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

                {/* Esqueceu a senha */}
                <div className="flex items-center justify-end">
                  <Link
                    href="/esqueci-senha"
                    className="text-sm text-neutral-400 hover:text-neutral-200 transition-colors duration-200 underline-offset-4 hover:underline"
                  >
                    Esqueceu sua senha?
                  </Link>
                </div>

                {/* Botão Entrar */}
                <Button
                  type="submit"
                  variant="default"
                  className="w-full bg-white/10 hover:bg-white/15 text-white border-white/20 hover:border-white/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Entrar
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
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 text-neutral-200 hover:text-white backdrop-blur-sm"
                >
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 text-neutral-200 hover:text-white backdrop-blur-sm"
                >
                  Facebook
                </Button>
              </div>

              {/* Link para cadastro */}
              <p className="text-center text-sm text-neutral-400">
                Não tem uma conta?{" "}
                <Link
                  href="/cadastro"
                  className="text-white hover:text-neutral-200 font-medium underline-offset-4 hover:underline transition-colors duration-200"
                >
                  Cadastre-se
                </Link>
              </p>
            </CardFooter>
          </div>
        </Card>
      </div>
    </div>
  )
}
