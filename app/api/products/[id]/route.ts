import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';
import { verifyToken } from '../../auth/login/route';

// Verificar autenticação admin
async function verifyAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  const payload = await verifyToken(token);

  if (!payload || payload.role !== 'ADMIN') {
    return null;
  }

  return payload;
}

// GET /api/products/[id] - Buscar produto específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const produto = await prisma.produto.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });

    if (!produto) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(produto);
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar produto' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Atualizar produto (admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Verificar se produto existe
    const existing = await prisma.produto.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    // Preparar dados para atualização
    const updateData: any = {};
    
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.price !== undefined) updateData.price = parseFloat(body.price.toString());
    if (body.originalPrice !== undefined) {
      updateData.originalPrice = body.originalPrice 
        ? parseFloat(body.originalPrice.toString()) 
        : null;
    }
    if (body.category !== undefined) updateData.category = body.category;
    if (body.rating !== undefined) updateData.rating = parseFloat(body.rating.toString());
    if (body.image !== undefined) updateData.image = body.image;
    if (body.stock !== undefined) updateData.stock = parseInt(body.stock.toString());

    const produto = await prisma.produto.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(produto);
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar produto' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Deletar produto (admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Verificar se produto existe
    const existing = await prisma.produto.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    await prisma.produto.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Produto deletado com sucesso' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar produto' },
      { status: 500 }
    );
  }
}

