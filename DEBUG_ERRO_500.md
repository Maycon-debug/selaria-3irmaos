# 🔍 Debug: Erro 500 no Login Google

## O que verificar:

### 1. **Console do Servidor**
Olhe o terminal onde está rodando `npm run dev` e veja se há erros específicos.

### 2. **Possíveis Causas:**

#### A) Prisma Client não regenerado
```bash
# Pare o servidor (Ctrl+C)
npm run db:generate
npm run dev
```

#### B) Tabelas não sincronizadas
```bash
npm run db:push
```

#### C) Erro nas credenciais
Verifique se `.env.local` tem:
```env
GOOGLE_CLIENT_ID=seu-client-id-aqui.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu-client-secret-aqui
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=qualquer-valor-aqui
```

---

## 🛠️ Teste Simplificado:

Tente primeiro sem salvar no banco, apenas autenticar:

1. Comente o callback `signIn` temporariamente
2. Teste se o Google OAuth funciona
3. Depois adicionamos o salvamento no banco

---

**Me diga qual erro aparece no console do servidor quando você tenta fazer login!**

Isso vai ajudar a identificar o problema exato.

