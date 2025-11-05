import { type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from '@/src/lib/prisma';

const secret = process.env.NEXTAUTH_SECRET || 'change-this-to-a-random-secret-key-in-production';

export const authOptions: NextAuthOptions = {
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

        try {
          const usuario = await prisma.usuario.findUnique({
            where: { email: credentials.email },
          });

          if (!usuario || !usuario.password) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
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
    async signIn({ user, account }) {
      // Quando login com Google, criar ou atualizar usuário no banco
      if (account?.provider === 'google' && user?.email) {
        try {
          let usuario = await prisma.usuario.findUnique({
            where: { email: user.email },
          });

          if (!usuario) {
            // Criar novo usuário
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
            // Atualizar dados do usuário existente
            await prisma.usuario.update({
              where: { id: usuario.id },
              data: {
                name: user.name || usuario.name,
                image: user.image || usuario.image,
                emailVerified: usuario.emailVerified || new Date(),
              },
            });
          }

          // Criar ou atualizar conta OAuth
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
          // Retornar true para não bloquear o login
          return true;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        token.role = (user as any).role || 'USER';
      }

      // Se houver email no token, buscar role do banco
      if (token.email && !token.role) {
        try {
          const usuario = await prisma.usuario.findUnique({
            where: { email: token.email as string },
          });
          if (usuario) {
            token.role = usuario.role;
            token.id = usuario.id;
          }
        } catch (error) {
          console.error('Erro ao buscar usuário:', error);
        }
      }

      return token;
    },
    async session({ session, token }) {
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
