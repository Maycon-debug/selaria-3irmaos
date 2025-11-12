import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // Permitir carregar imagens da pasta public
    unoptimized: false,
    // Configurações para garantir que imagens sejam carregadas corretamente
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
    // Garantir que imagens locais sejam carregadas
    domains: [],
  },
  // VULN-010/011 CORRIGIDA: Configurar CORS e Security Headers
  async headers() {
    return [
      {
        // Aplicar headers de segurança em todas as rotas
        source: '/:path*',
        headers: [
          // Prevenir clickjacking
          { key: 'X-Frame-Options', value: 'DENY' },
          
          // Forçar HTTPS (apenas em produção)
          ...(process.env.NODE_ENV === 'production' 
            ? [{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' }]
            : []
          ),
          
          // Prevenir MIME sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          
          // XSS Protection (navegadores antigos)
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          
          // Referrer Policy
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          
          // Permissions Policy
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Ajustar conforme necessidade
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https://res.cloudinary.com https://cdn.filestackapi.com https://lh3.googleusercontent.com",
              "font-src 'self'",
              "connect-src 'self'",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
      {
        // CORS para rotas de API
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { 
            key: 'Access-Control-Allow-Origin', 
            value: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000' 
          },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};

export default nextConfig;
