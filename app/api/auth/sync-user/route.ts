import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

// POST /api/auth/sync-user - Sincronizar usuário OAuth com banco
export async function POST(request: NextRequest) {
  try {
    const { email, name, image, provider, providerAccountId, ...accountData } = await request.json();

    if (!email || !provider || !providerAccountId) {
      return NextResponse.json(
        { error: 'Email, provider e providerAccountId são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar ou criar usuário
    let usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      usuario = await prisma.usuario.create({
        data: {
          email,
          name: name || null,
          image: image || null,
          emailVerified: new Date(),
          role: 'USER',
        },
      });
    } else {
      usuario = await prisma.usuario.update({
        where: { id: usuario.id },
        data: {
          name: name || usuario.name,
          image: image || usuario.image,
          emailVerified: usuario.emailVerified || new Date(),
        },
      });
    }

    // Criar ou atualizar conta OAuth
    const existingAccount = await prisma.account.findFirst({
      where: {
        provider,
        providerAccountId,
      },
    });

    if (existingAccount) {
      await prisma.account.update({
        where: { id: existingAccount.id },
        data: {
          refresh_token: accountData.refresh_token || null,
          access_token: accountData.access_token || null,
          expires_at: accountData.expires_at || null,
          token_type: accountData.token_type || null,
          scope: accountData.scope || null,
          id_token: accountData.id_token || null,
          session_state: accountData.session_state || null,
        },
      });
    } else {
      await prisma.account.create({
        data: {
          userId: usuario.id,
          type: accountData.type || 'oauth',
          provider,
          providerAccountId,
          refresh_token: accountData.refresh_token || null,
          access_token: accountData.access_token || null,
          expires_at: accountData.expires_at || null,
          token_type: accountData.token_type || null,
          scope: accountData.scope || null,
          id_token: accountData.id_token || null,
          session_state: accountData.session_state || null,
        },
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: usuario.id,
        email: usuario.email,
        name: usuario.name,
        role: usuario.role,
      },
    });
  } catch (error: any) {
    console.error('Erro ao sincronizar usuário:', error);
    return NextResponse.json(
      { error: 'Erro ao sincronizar usuário', details: error.message },
      { status: 500 }
    );
  }
}

