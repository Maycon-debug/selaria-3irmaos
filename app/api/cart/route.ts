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

// GET /api/cart - Listar itens do carrinho do usuário
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromSession()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Não autorizado. Faça login primeiro.' },
        { status: 401 }
      )
    }

    const cartItems = await prisma.carrinhoItem.findMany({
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

    return NextResponse.json(cartItems, { status: 200 })
  } catch (error) {
    console.error("Erro ao buscar itens do carrinho:", error)
    return NextResponse.json(
      { error: "Erro ao buscar itens do carrinho." },
      { status: 500 }
    )
  }
}

// POST /api/cart - Adicionar item ao carrinho
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
    const { productId, quantity = 1 } = body

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

    // Verificar se já está no carrinho
    const existing = await prisma.carrinhoItem.findUnique({
      where: {
        userId_productId: {
          userId: userId,
          productId: productId,
        },
      },
    })

    if (existing) {
      // Atualizar quantidade
      const updated = await prisma.carrinhoItem.update({
        where: {
          userId_productId: {
            userId: userId,
            productId: productId,
          },
        },
        data: {
          quantity: existing.quantity + quantity,
        },
        include: {
          produto: true,
        },
      })

      return NextResponse.json(
        { 
          message: "Quantidade atualizada no carrinho!",
          item: updated 
        },
        { status: 200 }
      )
    }

    // Criar novo item no carrinho
    const cartItem = await prisma.carrinhoItem.create({
      data: {
        userId: userId,
        productId: productId,
        quantity: quantity,
      },
      include: {
        produto: true,
      },
    })

    return NextResponse.json(
      { 
        message: "Item adicionado ao carrinho!",
        item: cartItem 
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Erro ao adicionar item ao carrinho:", error)
    
    // Se já existe (erro de constraint única)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "Item já está no carrinho" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Erro ao adicionar item ao carrinho. Tente novamente mais tarde." },
      { status: 500 }
    )
  }
}

// PUT /api/cart - Atualizar quantidade de um item
export async function PUT(request: NextRequest) {
  try {
    const userId = await getUserIdFromSession()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Não autorizado. Faça login primeiro.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { productId, quantity } = body

    if (!productId || quantity === undefined) {
      return NextResponse.json(
        { error: "productId e quantity são obrigatórios" },
        { status: 400 }
      )
    }

    if (quantity < 1) {
      return NextResponse.json(
        { error: "Quantidade deve ser maior que zero" },
        { status: 400 }
      )
    }

    // Verificar se item existe
    const existing = await prisma.carrinhoItem.findUnique({
      where: {
        userId_productId: {
          userId: userId,
          productId: productId,
        },
      },
    })

    if (!existing) {
      return NextResponse.json(
        { error: "Item não encontrado no carrinho" },
        { status: 404 }
      )
    }

    // Atualizar quantidade
    const updated = await prisma.carrinhoItem.update({
      where: {
        userId_productId: {
          userId: userId,
          productId: productId,
        },
      },
      data: {
        quantity: quantity,
      },
      include: {
        produto: true,
      },
    })

    return NextResponse.json(
      { 
        message: "Quantidade atualizada!",
        item: updated 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Erro ao atualizar item do carrinho:", error)
    return NextResponse.json(
      { error: "Erro ao atualizar item do carrinho. Tente novamente mais tarde." },
      { status: 500 }
    )
  }
}

// DELETE /api/cart - Remover item do carrinho
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

    // Verificar se item existe
    const existing = await prisma.carrinhoItem.findUnique({
      where: {
        userId_productId: {
          userId: userId,
          productId: productId,
        },
      },
    })

    if (!existing) {
      return NextResponse.json(
        { error: "Item não encontrado no carrinho" },
        { status: 404 }
      )
    }

    // Deletar item
    await prisma.carrinhoItem.delete({
      where: {
        userId_productId: {
          userId: userId,
          productId: productId,
        },
      },
    })

    return NextResponse.json(
      { message: "Item removido do carrinho!" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Erro ao remover item do carrinho:", error)
    return NextResponse.json(
      { error: "Erro ao remover item do carrinho. Tente novamente mais tarde." },
      { status: 500 }
    )
  }
}

