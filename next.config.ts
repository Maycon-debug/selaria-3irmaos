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
};

export default nextConfig;
