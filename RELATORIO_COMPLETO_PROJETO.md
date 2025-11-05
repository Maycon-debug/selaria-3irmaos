# 📊 Relatório Completo do Projeto - Selaria 3 Irmãos

**Data de Geração:** 05 de Novembro de 2025  
**Versão do Projeto:** 0.1.0  
**Status:** Em Desenvolvimento Ativo

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Banco de Dados](#banco-de-dados)
4. [Backend e APIs](#backend-e-apis)
5. [Frontend](#frontend)
6. [Autenticação](#autenticação)
7. [Estrutura de Arquivos](#estrutura-de-arquivos)
8. [Localização de Componentes](#localização-de-componentes)
9. [Configuração e Deploy](#configuração-e-deploy)
10. [Scripts Disponíveis](#scripts-disponíveis)

---

## 🎯 Visão Geral

**Nome do Projeto:** Selaria 3 Irmãos  
**Tipo:** E-commerce de Equipamentos de Vaquejada  
**Arquitetura:** Full-Stack com Next.js (App Router)  
**Banco de Dados:** PostgreSQL (via Docker)  
**ORM:** Prisma  
**Autenticação:** NextAuth.js v5 (Email/Password + Google OAuth)

---

## 🛠️ Stack Tecnológico

### **Frontend Framework**
- **Next.js:** 16.0.1 (App Router)
- **React:** 19.2.0
- **React DOM:** 19.2.0
- **TypeScript:** 5.x

### **Estilização**
- **Tailwind CSS:** 4.x (com PostCSS)
- **tw-animate-css:** 1.4.0 (animações)
- **tailwind-merge:** 3.3.1 (merge de classes)
- **clsx:** 2.1.1 (condicionais de classes)
- **Radix UI:** Componentes acessíveis
  - @radix-ui/react-label: 2.1.8
  - @radix-ui/react-navigation-menu: 1.2.14
  - @radix-ui/react-slot: 1.2.4

### **Backend & Banco de Dados**
- **Prisma:** 6.18.0 (ORM)
- **@prisma/client:** 6.18.0
- **PostgreSQL:** 16-alpine (via Docker)
- **Docker & Docker Compose:** Containerização

### **Autenticação & Segurança**
- **NextAuth.js:** 5.0.0-beta.30
- **bcryptjs:** 3.0.3 (hash de senhas)
- **jose:** 6.1.0 (JWT)
- **Google OAuth 2.0:** Integrado

### **Utilitários**
- **dotenv:** 17.2.3 (variáveis de ambiente)
- **lottie-react:** 2.4.1 (animações Lottie)
- **lucide-react:** 0.552.0 (ícones)
- **class-variance-authority:** 0.7.1 (variantes de componentes)

### **Desenvolvimento**
- **tsx:** 4.20.6 (executar TypeScript)
- **ESLint:** 9.x
- **eslint-config-next:** 16.0.1

---

## 🗄️ Banco de Dados

### **Tipo:** PostgreSQL 16-alpine

### **Localização:**
- **Container Docker:** `aplicativo-web-db`
- **Porta:** 5432
- **Host:** localhost (desenvolvimento)
- **URL de Conexão:** `postgresql://postgres:postgres@localhost:5432/vaquejada_db`

### **Configuração (docker-compose.yml):**
```yaml
POSTGRES_USER: postgres
POSTGRES_PASSWORD: postgres
POSTGRES_DB: vaquejada_db
```

### **Schema do Banco (Prisma):**

#### **Tabelas Principais:**

1. **usuarios** (Usuario)
   - Campos: id, email, name, password, emailVerified, image, role, createdAt, updatedAt
   - Roles: USER, ADMIN

2. **produtos** (Produto)
   - Campos: id, name, description, price, originalPrice, category, rating, image, stock, createdAt, updatedAt

3. **produtos_IMG** (ProdutoImagem)
   - Campos: id, url, productId
   - Relacionamento: N produtos podem ter N imagens

4. **Carrinho_item** (CarrinhoItem)
   - Campos: id, userId, productId, quantity
   - Relacionamento: Usuario ↔ Produto

5. **favoritos** (Favorito)
   - Campos: id, userId, productId
   - Relacionamento: Usuario ↔ Produto

6. **pedidos** (Pedido)
   - Campos: id, userId, status, total, paymentId, shippingAddress (JSON), createdAt, updatedAt
   - Status: PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED

7. **ordem_item** (PedidoItem)
   - Campos: id, orderId, productId, quantity, price

8. **order** (Order)
   - Campos: id, userId, status, total, paymentId, shippingAddress (JSON), createdAt, updatedAt

#### **Tabelas de Autenticação (NextAuth.js):**

9. **accounts** (Account)
   - Campos: id, userId, type, provider, providerAccountId, refresh_token, access_token, expires_at, token_type, scope, id_token, session_state

10. **sessions** (Session)
    - Campos: id, sessionToken, userId, expires

11. **verification_tokens** (VerificationToken)
    - Campos: identifier, token, expires

### **Localização do Schema:**
```
prisma/schema.prisma
```

### **Migrations:**
```
prisma/migrations/
```

---

## 🔧 Backend e APIs

### **Arquitetura:** Next.js API Routes (App Router)

### **Localização das APIs:**
```
app/api/
```

### **Endpoints Disponíveis:**

#### **Autenticação (`/app/api/auth/`):**

1. **`/api/auth/[...nextauth]`** (route.ts)
   - **Método:** GET, POST
   - **Descrição:** Handler do NextAuth.js
   - **Funcionalidades:** Login, logout, sessões, OAuth

2. **`/api/auth/login`** (route.ts)
   - **Método:** POST
   - **Descrição:** Login administrativo (JWT)
   - **Body:** `{ email, password }`
   - **Response:** `{ token, user }`

3. **`/api/auth/register`** (route.ts)
   - **Método:** POST
   - **Descrição:** Registro de novos usuários
   - **Body:** `{ name, email, password }`
   - **Response:** Usuário criado (sem senha)

4. **`/api/auth/me`** (route.ts)
   - **Método:** GET
   - **Descrição:** Verificar autenticação atual
   - **Headers:** `Authorization: Bearer <token>`
   - **Response:** `{ user }`

5. **`/api/auth/sync-user`** (route.ts)
   - **Método:** POST
   - **Descrição:** Sincronizar dados do usuário OAuth

#### **Produtos (`/app/api/products/`):**

6. **`/api/products`** (route.ts)
   - **Método:** GET, POST
   - **GET:** Listar produtos (query params: category, search, limit)
   - **POST:** Criar produto (requer autenticação ADMIN)
   - **Body:** `{ name, description, price, originalPrice, category, rating, image, stock }`

7. **`/api/products/[id]`** (route.ts)
   - **Método:** GET, PUT, DELETE
   - **GET:** Buscar produto específico
   - **PUT:** Atualizar produto (requer autenticação ADMIN)
   - **DELETE:** Deletar produto (requer autenticação ADMIN)

### **Configuração de Autenticação:**
```
lib/auth.ts
```

### **Prisma Client:**
```
src/lib/prisma.ts
```

---

## 🎨 Frontend

### **Estrutura de Páginas:**

#### **Páginas Públicas:**
- **`/`** (app/page.tsx) - Homepage
- **`/produtos`** (app/produtos/page.tsx) - Listagem de produtos
- **`/produtos/[categoria]`** (app/produtos/[categoria]/page.tsx) - Produtos por categoria
- **`/produtos/[id]`** (app/produtos/[id]/page.tsx) - Detalhes do produto
- **`/login`** (app/login/page.tsx) - Login de usuário
- **`/cadastro`** (app/cadastro/page.tsx) - Registro de usuário
- **`/favoritos`** (app/favoritos/page.tsx) - Lista de favoritos
- **`/carrinho`** (app/carrinho/page.tsx) - Carrinho de compras
- **`/sobre`** (app/sobre/page.tsx) - Sobre nós
- **`/contato`** (app/contato/page.tsx) - Contato

#### **Páginas Administrativas:**
- **`/admin/login`** (app/admin/login/page.tsx) - Login administrativo
- **`/admin/dashboard`** (app/admin/dashboard/page.tsx) - Dashboard administrativo
- **`/admin/products/new`** (app/admin/products/new/page.tsx) - Criar produto
- **`/admin/products/[id]/edit`** (app/admin/products/[id]/edit/page.tsx) - Editar produto

### **Componentes UI:**
```
src/components/ui/
```
- `add-to-cart-modal.tsx` - Modal de adicionar ao carrinho
- `brands-section.tsx` - Seção de marcas
- `button.tsx` - Botão reutilizável
- `card.tsx` - Card component
- `input.tsx` - Input field
- `label.tsx` - Label component
- `lottie-logo.tsx` - Logo animado Lottie
- `main-nav.tsx` - Navegação principal
- `navigation-menu.tsx` - Menu de navegação
- `product-carousel.tsx` - Carrossel de produtos
- `product-grid.tsx` - Grid de produtos
- `sidebar.tsx` - Sidebar lateral
- `text-to-speech.tsx` - Text-to-speech
- `toast.tsx` - Sistema de notificações
- `welcome-modal.tsx` - Modal de boas-vindas

### **Componentes de Layout:**
```
src/components/layout/
```
- `header.tsx` - Cabeçalho principal
- `footer.tsx` - Rodapé
- `conditional-header.tsx` - Header condicional
- `conditional-footer.tsx` - Footer condicional

### **Providers:**
```
src/components/providers/
```
- `session-provider.tsx` - Provider de sessão (NextAuth)

### **Hooks Customizados:**
```
src/hooks/
```
- `use-products.ts` - Hook para buscar produtos
- `use-cart.ts` - Hook para gerenciar carrinho

### **Utilitários:**
```
src/lib/
```
- `prisma.ts` - Cliente Prisma
- `product-utils.ts` - Funções utilitárias de produtos
- `utils.ts` - Utilitários gerais (cn function)

---

## 🔐 Autenticação

### **Provedores:**
1. **Email/Password** (Credentials)
   - Hash com bcryptjs
   - Validação de senha
   - Registro via `/api/auth/register`

2. **Google OAuth 2.0**
   - Configuração em `lib/auth.ts`
   - Credenciais: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
   - Criação automática de usuário no primeiro login

### **Sessões:**
- **Estratégia:** JWT (JSON Web Tokens)
- **Duração:** Configurável (padrão: 24h)
- **Armazenamento:** Cookies (httpOnly)

### **Roles:**
- **USER:** Usuário comum
- **ADMIN:** Administrador (acesso ao painel admin)

### **Proteção de Rotas:**
- **Admin:** Verificação de JWT + role ADMIN
- **Páginas protegidas:** Middleware do NextAuth.js

---

## 📁 Estrutura de Arquivos

```
aplicativo-web/
├── app/                          # Next.js App Router
│   ├── admin/                    # Painel administrativo
│   │   ├── dashboard/
│   │   ├── login/
│   │   └── products/
│   ├── api/                      # API Routes
│   │   ├── auth/
│   │   └── products/
│   ├── cadastro/
│   ├── carrinho/
│   ├── contato/
│   ├── favoritos/
│   ├── login/
│   ├── produtos/
│   ├── sobre/
│   ├── globals.css              # Estilos globais
│   ├── layout.tsx               # Layout raiz
│   └── page.tsx                 # Homepage
├── src/
│   ├── components/
│   │   ├── layout/             # Componentes de layout
│   │   ├── providers/          # Providers React
│   │   └── ui/                 # Componentes UI
│   ├── hooks/                  # Hooks customizados
│   └── lib/                    # Bibliotecas e utilitários
├── prisma/
│   ├── migrations/             # Migrations do banco
│   ├── schema.prisma          # Schema do banco
│   ├── seed.ts               # Seed do banco
│   └── create-admin.ts       # Script criar admin
├── lib/
│   └── auth.ts               # Configuração NextAuth
├── public/                   # Arquivos estáticos
├── docker-compose.yml        # Configuração Docker
├── .env.local               # Variáveis de ambiente (não commitado)
├── .gitignore              # Arquivos ignorados
├── package.json            # Dependências e scripts
├── tsconfig.json          # Configuração TypeScript
└── postcss.config.mjs     # Configuração PostCSS
```

---

## 📍 Localização de Componentes Importantes

### **Backend:**
- **APIs:** `app/api/`
- **Autenticação:** `lib/auth.ts`
- **Prisma Client:** `src/lib/prisma.ts`
- **Schema DB:** `prisma/schema.prisma`

### **Frontend:**
- **Páginas:** `app/`
- **Componentes UI:** `src/components/ui/`
- **Layout:** `src/components/layout/`
- **Hooks:** `src/hooks/`

### **Configuração:**
- **Docker:** `docker-compose.yml`
- **Variáveis de Ambiente:** `.env.local` (não commitado)
- **TypeScript:** `tsconfig.json`
- **Tailwind:** `app/globals.css`, `postcss.config.mjs`

### **Banco de Dados:**
- **Schema:** `prisma/schema.prisma`
- **Migrations:** `prisma/migrations/`
- **Seed:** `prisma/seed.ts`
- **Scripts:** `prisma/create-admin.ts`

---

## ⚙️ Configuração e Deploy

### **Variáveis de Ambiente (.env.local):**

```env
# Banco de Dados PostgreSQL
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/vaquejada_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=vaquejada_db

# NextAuth.js
NEXTAUTH_SECRET=change-this-to-a-random-secret-key-in-production
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=seu-client-id-aqui
GOOGLE_CLIENT_SECRET=seu-client-secret-aqui

# JWT (para admin)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Redis (opcional)
REDIS_URL=redis://localhost:6379
```

### **Docker Compose:**

**Serviços:**
1. **PostgreSQL** (porta 5432)
2. **Redis** (porta 6379) - Opcional

**Comandos:**
```bash
docker-compose up -d        # Iniciar serviços
docker-compose down         # Parar serviços
docker-compose logs         # Ver logs
```

---

## 📜 Scripts Disponíveis

### **Desenvolvimento:**
```bash
npm run dev                 # Iniciar servidor de desenvolvimento (porta 3000)
npm run build              # Build de produção
npm run start              # Iniciar servidor de produção
npm run lint               # Executar ESLint
```

### **Banco de Dados:**
```bash
npm run db:generate        # Gerar Prisma Client
npm run db:migrate         # Criar migration
npm run db:push            # Sincronizar schema com banco
npm run db:seed            # Popular banco com dados iniciais
npm run db:studio          # Abrir Prisma Studio (GUI)
npm run db:reset           # Resetar banco (apagar tudo)
npm run db:create-admin    # Criar usuário admin padrão
```

---

## 🔒 Segurança

### **Implementado:**
- ✅ Hash de senhas com bcryptjs
- ✅ JWT para autenticação admin
- ✅ Proteção de rotas administrativas
- ✅ Validação de entrada nas APIs
- ✅ Variáveis de ambiente protegidas (.gitignore)
- ✅ Credenciais removidas do código

### **Recomendações:**
- ⚠️ Alterar `NEXTAUTH_SECRET` em produção
- ⚠️ Alterar `JWT_SECRET` em produção
- ⚠️ Usar HTTPS em produção
- ⚠️ Configurar CORS adequadamente
- ⚠️ Implementar rate limiting nas APIs

---

## 📊 Estatísticas do Projeto

- **Total de Páginas:** 11+
- **Total de APIs:** 7 endpoints
- **Total de Componentes UI:** 15+
- **Tabelas no Banco:** 11
- **Tecnologias Principais:** 20+

---

## 🚀 Próximos Passos Sugeridos

1. Implementar sistema de pagamento
2. Adicionar OAuth Facebook
3. Implementar cache com Redis
4. Adicionar testes (Jest/Vitest)
5. Configurar CI/CD
6. Implementar upload de imagens
7. Adicionar sistema de reviews/avaliações
8. Implementar busca avançada
9. Adicionar filtros de produtos
10. Criar sistema de notificações

---

## 📝 Notas Importantes

- **Credenciais:** Nunca commitar arquivos `.env.local` ou com credenciais reais
- **Banco de Dados:** Usar Docker para desenvolvimento local
- **Migrations:** Sempre criar migrations antes de fazer push do schema
- **Admin:** Usuário admin padrão criado via script `db:create-admin`

---

**Gerado em:** 05/11/2025  
**Última Atualização:** Merge Pull Request #1 - Feature Autenticação e Produtos

