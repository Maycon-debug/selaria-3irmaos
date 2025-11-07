import { NextRequest, NextResponse } from "next/server"
import prisma from "@/src/lib/prisma"
import { getAuth } from "@/lib/auth"

// Helper para obter userId da sessão
async function getUserIdFromSession() {
  try {
    const session = await getAuth()
    if (session?.user?.email) {
      const usuario = await prisma.usuario.findUnique({
        where: { email: session.user.email },
      })
      return usuario?.id || null
    }
  } catch (error) {
    console.error("Erro ao obter sessão:", error)
  }
  return null
}

// GET /api/favorites - Listar favoritos do usuário
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromSession()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Não autorizado. Faça login primeiro.' },
        { status: 401 }
      )
    }

    const favorites = await prisma.favorito.findMany({
      where: {
        userId: userId,
      },
      include: {
        produto: true,
      },
      orderBy: {
        id: 'desc',
      },
    })

    return NextResponse.json(favorites, { status: 200 })
  } catch (error) {
    console.error("Erro ao buscar favoritos:", error)
    return NextResponse.json(
      { error: "Erro ao buscar favoritos." },
      { status: 500 }
    )
  }
}

// POST /api/favorites - Adicionar favorito
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromSession()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Não autorizado. Faça login primeiro.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { productId } = body

    if (!productId) {
      return NextResponse.json(
        { error: "productId é obrigatório" },
        { status: 400 }
      )
    }

    // Verificar se produto existe
    const produto = await prisma.produto.findUnique({
      where: { id: productId },
    })

    if (!produto) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      )
    }

    // Verificar se já está favoritado
    const existing = await prisma.favorito.findUnique({
      where: {
        userId_productId: {
          userId: userId,
          productId: productId,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: "Produto já está nos favoritos" },
        { status: 400 }
      )
    }

    // Criar favorito
    const favorito = await prisma.favorito.create({
      data: {
        userId: userId,
        productId: productId,
      },
      include: {
        produto: true,
      },
    })

    return NextResponse.json(
      { 
        message: "Favorito adicionado com sucesso!",
        favorito 
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Erro ao adicionar favorito:", error)
    
    // Se já existe (erro de constraint única)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "Produto já está nos favoritos" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Erro ao adicionar favorito. Tente novamente mais tarde." },
      { status: 500 }
    )
  }
}

// DELETE /api/favorites - Remover favorito
export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserIdFromSession()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Não autorizado. Faça login primeiro.' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json(
        { error: "productId é obrigatório" },
        { status: 400 }
      )
    }

    // Verificar se favorito existe
    const existing = await prisma.favorito.findUnique({
      where: {
        userId_productId: {
          userId: userId,
          productId: productId,
        },
      },
    })

    if (!existing) {
      return NextResponse.json(
        { error: "Favorito não encontrado" },
        { status: 404 }
      )
    }

    // Deletar favorito
    await prisma.favorito.delete({
      where: {
        userId_productId: {
          userId: userId,
          productId: productId,
        },
      },
    })

    return NextResponse.json(
      { message: "Favorito removido com sucesso!" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Erro ao remover favorito:", error)
    return NextResponse.json(
      { error: "Erro ao remover favorito. Tente novamente mais tarde." },
      { status: 500 }
    )
  }
}
