import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

/**
 * API Route para buscar todas as categorias únicas de produtos
 * 
 * Retorna uma lista de categorias que já existem no banco de dados
 */
export async function GET(request: NextRequest) {
  try {
    // Buscar todas as categorias únicas do banco
    const produtos = await prisma.produto.findMany({
      select: {
        category: true,
      },
      distinct: ['category'],
      orderBy: {
        category: 'asc',
      },
    });

    // Extrair apenas os nomes das categorias
    const categories = produtos.map((p) => p.category);

    // Se não houver categorias no banco, retornar categorias padrão
    if (categories.length === 0) {
      return NextResponse.json([
        'Selas',
        'Equipamentos',
        'Segurança',
        'Botas',
        'Arreios',
      ]);
    }

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    // Em caso de erro, retornar categorias padrão
    return NextResponse.json([
      'Selas',
      'Equipamentos',
      'Segurança',
      'Botas',
      'Arreios',
    ]);
  }
}

