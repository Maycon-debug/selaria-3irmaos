import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';
import { verifyToken } from '../auth/login/route';

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

// GET - Buscar todas as configurações ou uma específica
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (key) {
      const config = await prisma.siteConfig.findUnique({
        where: { key },
      });
      
      if (!config) {
        return NextResponse.json({ value: null }, { status: 200 });
      }
      
      return NextResponse.json({ value: config.value }, { status: 200 });
    }

    const configs = await prisma.siteConfig.findMany();
    console.log('🔍 Configs encontradas no banco:', configs);
    const configMap = configs.reduce((acc, config) => {
      acc[config.key] = config.value;
      return acc;
    }, {} as Record<string, string>);
    console.log('📤 Retornando configMap:', configMap);

    return NextResponse.json(configMap, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar configurações' },
      { status: 500 }
    );
  }
}

// POST/PUT - Criar ou atualizar configuração
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
    const { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: 'key e value são obrigatórios' },
        { status: 400 }
      );
    }

    const config = await prisma.siteConfig.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    return NextResponse.json(config, { status: 200 });
  } catch (error) {
    console.error('Erro ao salvar configuração:', error);
    return NextResponse.json(
      { error: 'Erro ao salvar configuração', requestId },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  return POST(request);
}

