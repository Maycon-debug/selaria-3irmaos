import { NextRequest, NextResponse } from "next/server"
import prisma from "@/src/lib/prisma"

// Atualizar status de uma mensagem
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status } = body

    if (!id || !status) {
      return NextResponse.json(
        { error: "ID e status são obrigatórios" },
        { status: 400 }
      )
    }

    // Validar status
    const validStatuses = ["PENDING", "READ", "REPLIED", "ARCHIVED"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Status inválido" },
        { status: 400 }
      )
    }

    const mensagem = await prisma.mensagemContato.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json(mensagem, { status: 200 })
  } catch (error) {
    console.error("Erro ao atualizar mensagem:", error)
    return NextResponse.json(
      { error: "Erro ao atualizar mensagem." },
      { status: 500 }
    )
  }
}

// Deletar uma mensagem
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: "ID é obrigatório" },
        { status: 400 }
      )
    }

    // Verificar se mensagem existe
    const existing = await prisma.mensagemContato.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: "Mensagem não encontrada" },
        { status: 404 }
      )
    }

    await prisma.mensagemContato.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: "Mensagem deletada com sucesso" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Erro ao deletar mensagem:", error)
    return NextResponse.json(
      { error: "Erro ao deletar mensagem." },
      { status: 500 }
    )
  }
}

