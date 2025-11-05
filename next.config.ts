import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // Permitir carregar imagens da pasta public
    unoptimized: false,
    // Configurações para garantir que imagens sejam carregadas corretamente
    remotePatterns: [],
    // Garantir que imagens locais sejam carregadas
    domains: [],
  },
};

export default nextConfig;
