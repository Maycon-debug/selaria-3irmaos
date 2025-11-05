import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

// NextAuth v5 beta retorna um objeto com métodos handlers
const { handlers } = NextAuth(authOptions);

export const { GET, POST } = handlers;
