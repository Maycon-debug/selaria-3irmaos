import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';
import { verifyToken } from '../auth/login/route';
import { ProductSchema } from '@/lib/validations';
import { sanitizeHtml } from '@/lib/sanitize';
import { handleApiError } from '@/lib/error-handler';
import { z } from 'zod';

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');
    const search = searchParams.get('search');

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

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();
  
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // VULN-005 CORRIGIDA: Validar com Zod
    const validatedData = ProductSchema.parse(body);
    
    // VULN-005 CORRIGIDA: Sanitizar strings para prevenir XSS
    const sanitizedData = {
      ...validatedData,
      name: sanitizeHtml(validatedData.name),
      description: sanitizeHtml(validatedData.description),
    };

    const produto = await prisma.produto.create({
      data: sanitizedData,
    });

    return NextResponse.json(produto, { status: 201 });
  } catch (error) {
    // VULN-007 CORRIGIDA: Usar handler de erros centralizado
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Dados inválidos',
          details: error.issues.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        },
        { status: 400 }
      );
    }
    return handleApiError(error, requestId);
  }
}

