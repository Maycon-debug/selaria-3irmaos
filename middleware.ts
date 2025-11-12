// VULN-003 CORRIGIDA: Middleware de autenticação server-side para proteger rotas admin
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Proteger rotas /admin/* (exceto /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // Para páginas admin, verificar autenticação via cookie ou header
    // O middleware redireciona, mas a validação real deve ser feita no servidor
    // Verificar se há token no cookie (setado pelo frontend após login)
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      // Redirecionar para login se não autenticado
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Verificar token (importação dinâmica para evitar problemas de inicialização)
    try {
      const { verifyToken } = await import('./app/api/auth/login/route');
      const payload = await verifyToken(token);

      if (!payload || payload.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }

      // Token válido, permitir acesso
      return NextResponse.next();
    } catch (error) {
      // Token inválido, redirecionar para login
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

// Configurar quais rotas aplicar o middleware
export const config = {
  matcher: [
    // Aplicar apenas em rotas admin (exceto login)
    '/admin/:path*',
  ],
};

