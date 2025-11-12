import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

// NextAuth v5 beta retorna um objeto com métodos handlers
// @ts-ignore - NextAuth v5 beta tem tipos incompatíveis temporariamente
const { handlers } = NextAuth(authOptions);

export const { GET, POST } = handlers;
