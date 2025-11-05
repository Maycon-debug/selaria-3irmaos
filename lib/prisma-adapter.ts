import type { Adapter } from 'next-auth/adapters';
import type { PrismaClient } from '@prisma/client';

export function PrismaAdapter(p: PrismaClient): Adapter {
  return {
    createUser: async (data) => {
      const user = await p.usuario.create({
        data: {
          email: data.email!,
          name: data.name,
          emailVerified: data.emailVerified,
          image: data.image,
        },
      });
      return {
        id: user.id,
        email: user.email!,
        name: user.name,
        emailVerified: user.emailVerified,
        image: user.image,
      } as any;
    },
    getUser: async (id) => {
      const user = await p.usuario.findUnique({ where: { id } });
      if (!user) return null;
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
        image: user.image,
      } as any;
    },
    getUserByEmail: async (email) => {
      const user = await p.usuario.findUnique({ where: { email } });
      if (!user) return null;
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
        image: user.image,
      } as any;
    },
    getUserByAccount: async ({ providerAccountId, provider }) => {
      const account = await p.account.findFirst({
        where: {
          provider,
          providerAccountId,
        },
        include: { usuario: true },
      });
      if (!account) return null;
      return {
        id: account.usuario.id,
        email: account.usuario.email,
        name: account.usuario.name,
        emailVerified: account.usuario.emailVerified,
        image: account.usuario.image,
      } as any;
    },
    updateUser: async ({ id, ...data }) => {
      const user = await p.usuario.update({
        where: { id },
        data,
      });
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
        image: user.image,
      } as any;
    },
    linkAccount: async (data) => {
      await p.account.create({
        data: {
          userId: data.userId,
          type: data.type,
          provider: data.provider,
          providerAccountId: data.providerAccountId,
          refresh_token: data.refresh_token,
          access_token: data.access_token,
          expires_at: data.expires_at,
          token_type: data.token_type,
          scope: data.scope,
          id_token: data.id_token,
          session_state: data.session_state,
        },
      });
      return data as any;
    },
    createSession: async (data) => {
      const session = await p.session.create({
        data: {
          sessionToken: data.sessionToken,
          userId: data.userId,
          expires: data.expires,
        },
      });
      return {
        sessionToken: session.sessionToken,
        userId: session.userId,
        expires: session.expires,
      } as any;
    },
    getSessionAndUser: async (sessionToken) => {
      const sessionAndUser = await p.session.findUnique({
        where: { sessionToken },
        include: { usuario: true },
      });
      if (!sessionAndUser) return null;
      return {
        session: {
          sessionToken: sessionAndUser.sessionToken,
          userId: sessionAndUser.userId,
          expires: sessionAndUser.expires,
        } as any,
        user: {
          id: sessionAndUser.usuario.id,
          email: sessionAndUser.usuario.email,
          name: sessionAndUser.usuario.name,
          emailVerified: sessionAndUser.usuario.emailVerified,
          image: sessionAndUser.usuario.image,
        } as any,
      };
    },
    updateSession: async ({ sessionToken, ...data }) => {
      const session = await p.session.update({
        where: { sessionToken },
        data,
      });
      return {
        sessionToken: session.sessionToken,
        userId: session.userId,
        expires: session.expires,
      } as any;
    },
    deleteSession: async (sessionToken) => {
      await p.session.delete({ where: { sessionToken } });
    },
  };
}

