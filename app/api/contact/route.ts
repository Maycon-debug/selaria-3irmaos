import { NextRequest, NextResponse } from "next/server"
import prisma from "@/src/lib/prisma"
import { ContactSchema } from '@/lib/validations';
import { sanitizeHtml } from '@/lib/sanitize';
import { checkRateLimit } from '@/lib/simple-rate-limit';
import { handleApiError } from '@/lib/error-handler';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();
  
  try {
    // VULN-004 CORRIGIDA: Rate limiting para prevenir spam
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    const rateLimit = checkRateLimit(`contact:${ip}`, 5, 60 * 60 * 1000); // 5 mensagens por hora
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Muitas mensagens enviadas. Tente novamente mais tarde.',
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
    const validatedData = ContactSchema.parse(body);
    
    // VULN-005 CORRIGIDA: Sanitizar strings para prevenir XSS
    const sanitizedData = {
      ...validatedData,
      name: sanitizeHtml(validatedData.name),
      subject: sanitizeHtml(validatedData.subject),
      message: sanitizeHtml(validatedData.message),
    };

    // Salvar mensagem no banco de dados
    const mensagem = await prisma.mensagemContato.create({
      data: sanitizedData,
    })

    return NextResponse.json(
      { 
        message: "Mensagem enviada com sucesso!",
        id: mensagem.id 
      },
      { status: 201 }
    )
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

// GET para listar mensagens (apenas para admin)
// VULN-013 CORRIGIDA: Adicionada verificação de autenticação admin
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação admin
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    // Importar função de verificação de token
    const { verifyToken } = await import('../auth/login/route');
    const payload = await verifyToken(token);

    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }
    
    const mensagens = await prisma.mensagemContato.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(mensagens, { status: 200 })
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error)
    return NextResponse.json(
      { error: "Erro ao buscar mensagens." },
      { status: 500 }
    )
  }
}

