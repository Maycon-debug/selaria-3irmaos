# 📋 Checklist de Autenticação Completa

## ✅ O que já existe

### 1. Schema do Banco
- ✅ Modelo `Usuario` criado
- ✅ Campos: email, password, name, role
- ⚠️ Password não está usando hash (bcrypt)
- ❌ Não tem campos para OAuth (googleId, facebookId, provider)

### 2. Autenticação Admin
- ✅ Sistema básico de login admin funcionando
- ✅ JWT tokens implementados
- ⚠️ Não usa bcrypt para senhas
- ❌ Apenas para admin, não para usuários normais

### 3. Páginas UI
- ✅ `/app/login/page.tsx` - UI pronta, mas sem lógica
- ✅ `/app/cadastro/page.tsx` - UI pronta, mas sem lógica
- ✅ Design bonito e responsivo

---

## ❌ O que precisa ser implementado

### 1. Dependências Necessárias

```bash
npm install next-auth@beta bcryptjs
npm install -D @types/bcryptjs
```

**Por que NextAuth.js?**
- Padrão da indústria para Next.js
- Suporte nativo a OAuth (Google, Facebook, etc)
- Gerenciamento de sessões seguro
- Múltiplos providers facilmente configuráveis
- TypeScript support completo

### 2. Atualização do Schema Prisma

**Campos que precisam ser adicionados ao modelo Usuario:**

```prisma
model Usuario {
  // ... campos existentes
  emailVerified DateTime?      // Para verificação de email
  image         String?         // Foto do perfil (OAuth)
  provider      String?         // "credentials" | "google" | "facebook"
  providerId    String?         // ID do provider OAuth
  // ... resto dos campos
}
```

**Migração necessária:**
- Adicionar campos OAuth
- Tornar password opcional (OAuth não precisa senha)
- Adicionar índices para busca

### 3. Configuração NextAuth.js

**Arquivos necessários:**
- `app/api/auth/[...nextauth]/route.ts` - Configuração principal
- `lib/auth.ts` - Helpers e configurações
- Adapter Prisma para NextAuth

### 4. Providers OAuth

**Google OAuth:**
- Criar projeto no Google Cloud Console
- Configurar OAuth 2.0 Client ID
- Adicionar URLs de callback
- Variáveis: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

**Facebook OAuth:**
- Criar app no Facebook Developers
- Configurar OAuth
- Adicionar URLs de callback
- Variáveis: `FACEBOOK_CLIENT_ID`, `FACEBOOK_CLIENT_SECRET`

### 5. APIs a Criar/Atualizar

**Novas APIs:**
- `POST /api/auth/register` - Registro com email/senha
- `POST /api/auth/login` - Login (atualizar para usuários normais)
- `GET /api/auth/session` - Verificar sessão atual
- `POST /api/auth/logout` - Logout

**Atualizar:**
- Sistema atual de admin precisa coexistir

### 6. Atualizar Páginas

**`/app/login/page.tsx`:**
- Integrar com NextAuth
- Adicionar botões Google/Facebook
- Implementar login com email/senha

**`/app/cadastro/page.tsx`:**
- Integrar registro real
- Validação de email
- Hash de senha no backend

### 7. Variáveis de Ambiente

**Adicionar ao `.env.local`:**

```env
# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=seu-secret-aqui

# Google OAuth
GOOGLE_CLIENT_ID=seu-google-client-id
GOOGLE_CLIENT_SECRET=seu-google-client-secret

# Facebook OAuth
FACEBOOK_CLIENT_ID=seu-facebook-app-id
FACEBOOK_CLIENT_SECRET=seu-facebook-app-secret
```

---

## 📝 Plano de Implementação

### Fase 1: Setup Base
1. ✅ Instalar dependências
2. ✅ Atualizar schema Prisma
3. ✅ Criar migration
4. ✅ Configurar NextAuth básico

### Fase 2: Autenticação Email/Senha
1. ✅ Implementar registro
2. ✅ Implementar login
3. ✅ Hash de senhas com bcrypt
4. ✅ Atualizar páginas de login/cadastro

### Fase 3: OAuth Google
1. ✅ Criar projeto Google Cloud
2. ✅ Configurar provider
3. ✅ Adicionar botão no login
4. ✅ Testar fluxo completo

### Fase 4: OAuth Facebook
1. ✅ Criar app Facebook
2. ✅ Configurar provider
3. ✅ Adicionar botão no login
4. ✅ Testar fluxo completo

### Fase 5: Integração
1. ✅ Unificar sistema admin com sistema usuário
2. ✅ Proteger rotas do usuário
3. ✅ Atualizar carrinho/favoritos para usar sessão
4. ✅ Testes finais

---

## 🔐 Segurança

### Implementações Necessárias

1. **Hash de Senhas:**
   - Usar bcrypt com salt rounds adequados
   - Nunca armazenar senhas em texto plano

2. **Validação:**
   - Validar email format
   - Senha forte (mínimo 8 caracteres)
   - Rate limiting em tentativas de login

3. **Sessões:**
   - Usar httpOnly cookies
   - CSRF protection
   - Expiração adequada de tokens

4. **OAuth:**
   - Verificar tokens dos providers
   - Validar callbacks
   - Tratar erros adequadamente

---

## 🎯 Próximos Passos

**Posso começar implementando:**

1. ✅ Instalar dependências
2. ✅ Atualizar schema Prisma
3. ✅ Configurar NextAuth.js
4. ✅ Implementar registro/login email/senha
5. ✅ Adicionar OAuth Google
6. ✅ Adicionar OAuth Facebook
7. ✅ Atualizar páginas de login/cadastro
8. ✅ Integrar com sistema existente

**Preciso de informações para OAuth:**

- Você já tem contas/configurações no Google Cloud Console e Facebook Developers?
- Ou prefere que eu te guie passo a passo para criar?

---

## 📚 Recursos Úteis

- [NextAuth.js Docs](https://next-auth.js.org/)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [Facebook OAuth Setup](https://developers.facebook.com/docs/facebook-login/web)
- [Prisma NextAuth Adapter](https://next-auth.js.org/v4/adapters/prisma)

---

**Posso começar a implementação agora? Ou prefere que eu te guie primeiro na configuração dos OAuth providers?**

