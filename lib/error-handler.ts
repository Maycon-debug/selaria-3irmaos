import { NextResponse } from 'next/server';

// VULN-007 CORRIGIDA: Handler centralizado de erros que não expõe informações sensíveis

// Tipos de erro com mensagens seguras
const ERROR_MESSAGES: Record<string, string> = {
  P2002: 'Este registro já existe no sistema',
  P2025: 'Registro não encontrado',
  P2003: 'Operação inválida: dados relacionados não existem',
  VALIDATION_ERROR: 'Dados fornecidos são inválidos',
  AUTH_ERROR: 'Credenciais inválidas',
  PERMISSION_ERROR: 'Você não tem permissão para esta operação',
  RATE_LIMIT: 'Muitas requisições. Tente novamente mais tarde',
  UNKNOWN_ERROR: 'Ocorreu um erro inesperado',
};

interface ErrorResponse {
  error: string;
  code?: string;
  requestId?: string;
}

export function handleApiError(error: any, requestId?: string): NextResponse<ErrorResponse> {
  // 1. LOG COMPLETO NO SERVIDOR (não enviar ao cliente!)
  console.error('[API ERROR]', {
    requestId,
    timestamp: new Date().toISOString(),
    message: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    code: error.code,
    meta: error.meta,
  });

  // 2. Determinar tipo de erro
  let statusCode = 500;
  let errorMessage = ERROR_MESSAGES.UNKNOWN_ERROR;
  let errorCode = 'UNKNOWN_ERROR';

  // Erros do Prisma
  if (error.code?.startsWith('P')) {
    errorCode = error.code;
    errorMessage = ERROR_MESSAGES[error.code] || ERROR_MESSAGES.UNKNOWN_ERROR;
    statusCode = 400;
  }

  // Erros customizados
  if (error.name === 'ValidationError' || error.name === 'ZodError') {
    errorCode = 'VALIDATION_ERROR';
    errorMessage = ERROR_MESSAGES.VALIDATION_ERROR;
    statusCode = 400;
  }

  if (error.name === 'UnauthorizedError' || error.message?.includes('Não autorizado')) {
    errorCode = 'AUTH_ERROR';
    errorMessage = ERROR_MESSAGES.AUTH_ERROR;
    statusCode = 401;
  }

  if (error.message?.includes('permissão') || error.message?.includes('Permission')) {
    errorCode = 'PERMISSION_ERROR';
    errorMessage = ERROR_MESSAGES.PERMISSION_ERROR;
    statusCode = 403;
  }

  // 3. Retornar resposta GENÉRICA ao cliente
  return NextResponse.json(
    {
      error: errorMessage,
      code: errorCode,
      requestId, // Para correlacionar com logs
    },
    { status: statusCode }
  );
}

