import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';
import bcrypt from 'bcryptjs';

// POST /api/auth/register - Registrar novo usuário
export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    // Validação
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Verificar se email já existe
    const existing = await prisma.usuario.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Email já está em uso' },
        { status: 400 }
      );
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const usuario = await prisma.usuario.create({
      data: {
        email,
        name: name || null,
        password: hashedPassword,
        role: 'USER',
      },
    });

    return NextResponse.json(
      {
        message: 'Usuário criado com sucesso',
        user: {
          id: usuario.id,
          email: usuario.email,
          name: usuario.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return NextResponse.json(
      { error: 'Erro ao registrar usuário' },
      { status: 500 }
    );
  }
}

