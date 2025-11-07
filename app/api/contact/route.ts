import { NextRequest, NextResponse } from "next/server"
import prisma from "@/src/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    // Validação dos campos obrigatórios
    if (!name || !email || !phone || !subject || !message) {
      return NextResponse.json(
        { error: "Campos obrigatórios: nome, email, telefone, assunto e mensagem" },
        { status: 400 }
      )
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "E-mail inválido" },
        { status: 400 }
      )
    }

    // Validação de telefone
    const cleanedPhone = phone.replace(/\D/g, '')
    if (cleanedPhone.length < 10 || cleanedPhone.length > 11) {
      return NextResponse.json(
        { error: "Telefone inválido. Digite um número válido (ex: (81) 99999-9999)" },
        { status: 400 }
      )
    }

    // Salvar mensagem no banco de dados
    const mensagem = await prisma.mensagemContato.create({
      data: {
        name,
        email,
        phone: phone,
        subject,
        message,
      },
    })

    return NextResponse.json(
      { 
        message: "Mensagem enviada com sucesso!",
        id: mensagem.id 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Erro ao salvar mensagem de contato:", error)
    return NextResponse.json(
      { error: "Erro ao enviar mensagem. Tente novamente mais tarde." },
      { status: 500 }
    )
  }
}

// GET para listar mensagens (apenas para admin)
export async function GET(request: NextRequest) {
  try {
    // Aqui você pode adicionar verificação de autenticação/admin
    // Por enquanto, retorna todas as mensagens
    
    const mensagens = await prisma.mensagemContato.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(mensagens, { status: 200 })
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error)
    return NextResponse.json(
      { error: "Erro ao buscar mensagens." },
      { status: 500 }
    )
  }
}

