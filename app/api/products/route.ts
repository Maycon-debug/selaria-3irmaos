import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';
import { verifyToken } from '../auth/login/route';

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

// GET /api/products - Listar todos os produtos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');
    const search = searchParams.get('search');

    // Construir filtros
    const where: any = {};
    
    if (category) {
      where.category = category;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Buscar produtos
    const produtos = await prisma.produto.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json(produtos);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar produtos' },
      { status: 500 }
    );
  }
}

// POST /api/products - Criar novo produto (admin)
export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    const { name, description, price, originalPrice, category, rating, image, stock } = body;

    // Validação básica
    if (!name || !description || !price || !category || !image) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: name, description, price, category, image' },
        { status: 400 }
      );
    }

    const produto = await prisma.produto.create({
      data: {
        name,
        description,
        price: parseFloat(price.toString()),
        originalPrice: originalPrice ? parseFloat(originalPrice.toString()) : null,
        category,
        rating: rating ? parseFloat(rating.toString()) : 0,
        image,
        stock: stock || 0,
      },
    });

    return NextResponse.json(produto, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    return NextResponse.json(
      { error: 'Erro ao criar produto' },
      { status: 500 }
    );
  }
}

