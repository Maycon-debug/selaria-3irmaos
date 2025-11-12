import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from '@/src/lib/prisma';

// VULN-002 CORRIGIDA: Falha imediatamente se NEXTAUTH_SECRET não estiver configurado
function getRequiredEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`🔴 ERRO CRÍTICO: Variável de ambiente ${name} não configurada! A aplicação não pode iniciar sem ela.`);
  }
  return value;
}

const secret = getRequiredEnvVar('NEXTAUTH_SECRET');

export const authOptions = {
  secret,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        try {
          const usuario = await prisma.usuario.findUnique({
            where: { email },
          });

          if (!usuario || !usuario.password) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            password,
            usuario.password
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: usuario.id,
            email: usuario.email,
            name: usuario.name,
            role: usuario.role,
          };
        } catch (error) {
          console.error('Erro ao autenticar:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    // @ts-ignore - NextAuth v5 beta tem tipos incompatíveis temporariamente
    async signIn({ user, account, profile }: any) {
      if (account?.provider === 'google' && user?.email) {
        try {
          let usuario = await prisma.usuario.findUnique({
            where: { email: user.email },
          });

          if (!usuario) {
            usuario = await prisma.usuario.create({
              data: {
                email: user.email,
                name: user.name || null,
                image: user.image || null,
                emailVerified: new Date(),
                role: 'USER',
              },
            });
          } else {
            await prisma.usuario.update({
              where: { id: usuario.id },
              data: {
                name: user.name || usuario.name,
                image: user.image || usuario.image,
                emailVerified: usuario.emailVerified || new Date(),
              },
            });
          }

          if (account.providerAccountId) {
            try {
              const existingAccount = await prisma.account.findFirst({
                where: {
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                },
              });

              if (existingAccount) {
                await prisma.account.update({
                  where: { id: existingAccount.id },
                  data: {
                    refresh_token: account.refresh_token || null,
                    access_token: account.access_token || null,
                    expires_at: account.expires_at || null,
                    token_type: account.token_type || null,
                    scope: account.scope || null,
                    id_token: account.id_token || null,
                    session_state: account.session_state || null,
                  },
                });
              } else {
                await prisma.account.create({
                  data: {
                    userId: usuario.id,
                    type: account.type || 'oauth',
                    provider: account.provider,
                    providerAccountId: account.providerAccountId,
                    refresh_token: account.refresh_token || null,
                    access_token: account.access_token || null,
                    expires_at: account.expires_at || null,
                    token_type: account.token_type || null,
                    scope: account.scope || null,
                    id_token: account.id_token || null,
                    session_state: account.session_state || null,
                  },
                });
              }
            } catch (accountError: any) {
              console.error('⚠️ Erro ao salvar conta OAuth:', accountError?.message);
            }
          }

          return true;
        } catch (error: any) {
          console.error('❌ Erro ao criar/atualizar usuário Google:', error?.message);
          return true;
        }
      }
      return true;
    },
    // @ts-ignore - NextAuth v5 beta tem tipos incompatíveis temporariamente
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        token.role = (user as any).role || 'USER';
      }

      if (token.email) {
        try {
          const usuario = await prisma.usuario.findUnique({
            where: { email: token.email as string },
          });
          
          if (!usuario) {
            return null;
          }
          
          token.role = usuario.role;
          token.id = usuario.id;
          token.name = usuario.name || token.name;
          token.image = usuario.image || token.image;
        } catch (error) {
          console.error('Erro ao buscar usuário:', error);
        }
      }

      return token;
    },
    // @ts-ignore - NextAuth v5 beta tem tipos incompatíveis temporariamente
    async session({ session, token }: any) {
      if (!token) {
        return null as any;
      }
      
      if (token && session.user) {
        if (token.id) (session.user as any).id = token.id as string;
        if (token.email) session.user.email = token.email as string;
        if (token.name) session.user.name = token.name as string;
        if (token.image) session.user.image = token.image as string;
        if (token.role) (session.user as any).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};

let authInstance: ReturnType<typeof NextAuth> | null = null;

export async function getAuth() {
  if (!authInstance) {
    // @ts-ignore - NextAuth v5 beta tem tipos incompatíveis temporariamente
    authInstance = NextAuth(authOptions);
  }
  return authInstance.auth();
}