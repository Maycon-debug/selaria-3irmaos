import { NextRequest, NextResponse } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';
import prisma from '@/src/lib/prisma';
import bcrypt from 'bcryptjs';
import { LoginSchema } from '@/lib/validations';
import { checkRateLimit } from '@/lib/simple-rate-limit';
import { handleApiError } from '@/lib/error-handler';
import { z } from 'zod';

// VULN-002 CORRIGIDA: Falha imediatamente se JWT_SECRET não estiver configurado
function getRequiredEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`🔴 ERRO CRÍTICO: Variável de ambiente ${name} não configurada! A aplicação não pode iniciar sem ela.`);
  }
  return value;
}

const secret = new TextEncoder().encode(getRequiredEnvVar('JWT_SECRET'));

// Criar token JWT
export async function createToken(payload: { email: string; role: string }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);
}

// Verificar token JWT
export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

// POST /api/auth/login - Login do admin
export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();
  
  try {
    // VULN-004 CORRIGIDA: Rate limiting para prevenir brute-force
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    const rateLimit = checkRateLimit(`login:${ip}`, 5, 15 * 60 * 1000); // 5 tentativas por 15 minutos
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Muitas tentativas de login. Tente novamente mais tarde.',
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000),
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimit.resetTime.toString(),
          }
        }
      );
    }

    const body = await request.json();
    
    // VULN-005 CORRIGIDA: Validar com Zod
    const { email, password } = LoginSchema.parse(body);

    // Buscar usuário admin no banco
    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    // VULN-001 CORRIGIDA: Usar bcrypt.compare() em vez de comparação hardcoded
    // Mensagem genérica para não revelar se usuário existe ou se é admin
    if (!usuario.password) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    // Verificar senha com bcrypt
    const isPasswordValid = await bcrypt.compare(password, usuario.password);

    // Verificar senha E role em um único if (mensagem genérica)
    if (!isPasswordValid || usuario.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    // Criar token
    const token = await createToken({
      email: usuario.email,
      role: usuario.role,
    });

    // Retornar token
    return NextResponse.json({
      token,
      user: {
        id: usuario.id,
        email: usuario.email,
        name: usuario.name,
        role: usuario.role,
      },
    });
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

