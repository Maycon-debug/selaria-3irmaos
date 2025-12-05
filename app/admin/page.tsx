"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Verificar se há token de autenticação
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    
    if (token) {
      // Se autenticado, redirecionar para o dashboard
      router.replace('/admin/dashboard');
    } else {
      // Se não autenticado, redirecionar para o login
      router.replace('/admin/login');
    }
  }, [router]);

  // Mostrar loading enquanto redireciona
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-neutral-400">Redirecionando...</p>
      </div>
    </div>
  );
}





