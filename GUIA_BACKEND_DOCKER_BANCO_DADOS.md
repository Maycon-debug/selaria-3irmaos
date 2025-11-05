# 🚀 Guia: Backend, Docker e Banco de Dados

## 📋 Sumário

1. [Por que adicionar Backend?](#por-que-adicionar-backend)
2. [Arquitetura Recomendada](#arquitetura-recomendada)
3. [Implementação do Backend](#implementação-do-backend)
4. [Banco de Dados](#banco-de-dados)
5. [Docker](#docker)
6. [Passos de Implementação](#passos-de-implementação)

---

## 🎯 Por que adicionar Backend?

### Problemas Atuais do Projeto

Atualmente, o projeto tem as seguintes limitações:

1. **Dados Hardcoded**: Produtos estão codificados diretamente nos componentes React
2. **Sem Persistência Real**: Carrinho e favoritos apenas no `localStorage` (perdidos ao limpar cache)
3. **Sem Autenticação**: Não há sistema de usuários/autenticação real
4. **Sem Gerenciamento de Estoque**: Não há controle de estoque de produtos
5. **Sem Processamento de Pedidos**: Não há sistema de checkout ou pagamento
6. **Sem API**: Não há endpoint para consumo externo ou integração
7. **Sem Analytics**: Não há coleta de dados sobre vendas, produtos mais vendidos, etc.

### Benefícios de Adicionar Backend

#### 🔒 Segurança
- Autenticação e autorização robusta
- Validação de dados no servidor
- Proteção contra manipulação de dados no cliente
- Tokens JWT para sessões seguras

#### 💾 Persistência de Dados
- Banco de dados confiável
- Backup automático
- Histórico de pedidos e transações
- Sincronização entre dispositivos

#### 📊 Gerenciamento de Negócio
- CRUD completo de produtos (Create, Read, Update, Delete)
- Controle de estoque em tempo real
- Relatórios de vendas
- Gestão de usuários e permissões

#### 🔄 Sincronização
- Carrinho sincronizado entre dispositivos
- Favoritos salvos na nuvem
- Histórico de compras acessível de qualquer lugar

#### 📈 Escalabilidade
- Preparado para crescer
- Suporte a múltiplos usuários simultâneos
- Cache e otimizações de performance

#### 🛒 Funcionalidades de E-commerce
- Sistema de checkout completo
- Integração com gateways de pagamento
- Gestão de pedidos e status
- Notificações por email/SMS

---

## 🏗️ Arquitetura Recomendada

### Opção 1: Next.js API Routes (Recomendado para começar)

**Vantagens:**
- ✅ Tudo no mesmo projeto (menos complexidade)
- ✅ Deploy simplificado (Vercel/Netlify)
- ✅ Sem necessidade de servidor separado inicialmente
- ✅ TypeScript compartilhado entre frontend e backend
- ✅ Ideal para projetos pequenos/médios

**Estrutura:**
```
aplicativo-web/
├── app/
│   ├── api/              # API Routes do Next.js
│   │   ├── products/
│   │   ├── cart/
│   │   ├── orders/
│   │   └── auth/
│   └── ...
├── src/
│   ├── lib/
│   │   ├── db.ts         # Conexão com banco
│   │   └── auth.ts       # Autenticação
│   └── ...
└── prisma/               # Schema do banco (se usar Prisma)
```

### Opção 2: Backend Separado (Node.js/Express ou NestJS)

**Vantagens:**
- ✅ Separação clara de responsabilidades
- ✅ Escalabilidade independente
- ✅ Reutilização por múltiplos frontends
- ✅ Melhor para equipes grandes

**Desvantagens:**
- ❌ Mais complexo de configurar
- ❌ Requer deploy separado
- ❌ Mais custos iniciais

**Recomendação:** Começar com **Opção 1** (Next.js API Routes) e migrar para backend separado quando necessário.

---

## 💻 Implementação do Backend

### Stack Recomendada

#### Backend Framework
- **Next.js API Routes** (já está no projeto)
- **tRPC** (opcional, para type-safety end-to-end)
- **Zod** (validação de schemas)

#### ORM/Database Client
- **Prisma** (recomendado - moderno e type-safe)
- Alternativa: **Drizzle ORM** ou **TypeORM**

#### Autenticação
- **NextAuth.js** (v5) - Integração perfeita com Next.js
- Alternativa: **Clerk** ou **Auth0** (soluções gerenciadas)

#### Validação
- **Zod** - Schema validation

### Estrutura de API Routes Sugerida

```typescript
// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    const products = await prisma.product.findMany({
      where: category ? { category } : {},
      include: { images: true, stock: true }
    });
    
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar produtos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Validação com Zod
    const product = await prisma.product.create({ data: body });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao criar produto' },
      { status: 500 }
    );
  }
}
```

### Endpoints Sugeridos

```
GET    /api/products              # Listar produtos
GET    /api/products/[id]          # Detalhes do produto
POST   /api/products               # Criar produto (admin)
PUT    /api/products/[id]          # Atualizar produto (admin)
DELETE /api/products/[id]          # Deletar produto (admin)

GET    /api/cart                   # Carrinho do usuário
POST   /api/cart                   # Adicionar ao carrinho
PUT    /api/cart/[id]              # Atualizar quantidade
DELETE /api/cart/[id]              # Remover do carrinho

GET    /api/favorites              # Favoritos do usuário
POST   /api/favorites              # Adicionar favorito
DELETE /api/favorites/[id]         # Remover favorito

GET    /api/orders                 # Pedidos do usuário
POST   /api/orders                 # Criar pedido
GET    /api/orders/[id]            # Detalhes do pedido

POST   /api/auth/login             # Login
POST   /api/auth/register          # Registro
POST   /api/auth/logout            # Logout
GET    /api/auth/session           # Sessão atual
```

---

## 🗄️ Banco de Dados

### Recomendação: PostgreSQL + Prisma

### Por que PostgreSQL?

#### ✅ Vantagens para E-commerce

1. **ACID Completo**: Garante consistência de transações (crucial para pedidos e pagamentos)
2. **Relacionamentos Complexos**: Excelente para modelar produtos, categorias, pedidos, usuários
3. **Performance**: Otimizado para queries complexas e grandes volumes
4. **JSON Support**: Suporta campos JSON para flexibilidade (especificações de produtos)
5. **Full-Text Search**: Busca avançada de produtos nativa
6. **Ecosystem**: Muitas ferramentas e bibliotecas (Prisma, Drizzle, etc.)
7. **Confiabilidade**: Banco maduro e estável em produção
8. **Gratuito**: PostgreSQL é open-source

#### Comparação Rápida

| Banco | Melhor Para | Pontos Negativos |
|-------|-------------|------------------|
| **PostgreSQL** ⭐ | E-commerce, apps complexos | Pode ser overkill para apps simples |
| **MySQL** | Aplicações web tradicionais | Menos features modernas |
| **MongoDB** | Dados não estruturados | Não ideal para transações financeiras |
| **SQLite** | Apps pequenos/local | Não suporta concorrência alta |
| **Supabase/Neon** | Deploy rápido PostgreSQL | Vendor lock-in |

### Schema Sugerido (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String   // Hash bcrypt
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  cart      CartItem[]
  favorites Favorite[]
  orders    Order[]
}

model Product {
  id            String   @id @default(cuid())
  name          String
  description   String
  price         Decimal  @db.Decimal(10, 2)
  originalPrice Decimal? @db.Decimal(10, 2)
  category      String
  rating        Float    @default(0)
  image         String
  images        ProductImage[]
  stock         Stock?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  cartItems     CartItem[]
  favorites     Favorite[]
  orderItems    OrderItem[]
}

model ProductImage {
  id        String   @id @default(cuid())
  url       String
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
}

model Stock {
  id        String   @id @default(cuid())
  quantity  Int      @default(0)
  productId String   @unique
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
}

model CartItem {
  id        String   @id @default(cuid())
  userId    String
  productId String
  quantity  Int      @default(1)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  @@unique([userId, productId])
}

model Favorite {
  id        String   @id @default(cuid())
  userId    String
  productId String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  @@unique([userId, productId])
}

model Order {
  id          String      @id @default(cuid())
  userId      String
  status      OrderStatus @default(PENDING)
  total       Decimal     @db.Decimal(10, 2)
  paymentId   String?
  items       OrderItem[]
  shippingAddress Json
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  user        User        @relation(fields: [userId], references: [id])
}

model OrderItem {
  id        String   @id @default(cuid())
  orderId   String
  productId String
  quantity  Int
  price     Decimal  @db.Decimal(10, 2)
  order     Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product   Product  @relation(fields: [productId], references: [id])
  
  @@unique([orderId, productId])
}

enum Role {
  USER
  ADMIN
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}
```

### Provedores de Banco PostgreSQL

#### Opções Gratuitas para Desenvolvimento

1. **Supabase** (Recomendado)
   - PostgreSQL gerenciado
   - 500MB gratuitos
   - Dashboard incluído
   - API REST automática

2. **Neon**
   - Serverless PostgreSQL
   - 3GB gratuitos
   - Branching de banco de dados

3. **Railway**
   - PostgreSQL com 5GB gratuitos
   - Deploy fácil

4. **Local (Docker)**
   - Postgres rodando em container
   - Ideal para desenvolvimento

---

## 🐳 Docker

### Por que usar Docker?

1. **Ambiente Consistente**: Mesma configuração em dev, staging e produção
2. **Isolamento**: Banco de dados, aplicação e serviços separados
3. **Facilidade de Setup**: Novos desenvolvedores rodam tudo com `docker-compose up`
4. **Portabilidade**: Funciona em qualquer sistema operacional
5. **Produção**: Mesma imagem pode ir para produção

### Estrutura Docker Sugerida

```
aplicativo-web/
├── docker-compose.yml       # Orquestração de serviços
├── Dockerfile               # Imagem da aplicação Next.js
├── Dockerfile.dev           # Imagem para desenvolvimento
└── .dockerignore
```

### Arquivos Docker

#### docker-compose.yml

```yaml
version: '3.8'

services:
  # Banco de dados PostgreSQL
  postgres:
    image: postgres:16-alpine
    container_name: aplicativo-web-db
    environment:
      POSTGRES_USER: ${DB_USER:-postgres}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-postgres}
      POSTGRES_DB: ${DB_NAME:-vaquejada_db}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Aplicação Next.js
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    container_name: aplicativo-web-app
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://${DB_USER:-postgres}:${DB_PASSWORD:-postgres}@postgres:5432/${DB_NAME:-vaquejada_db}
      NODE_ENV: development
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next
    depends_on:
      postgres:
        condition: service_healthy
    command: npm run dev

  # Redis (opcional - para cache e sessões)
  redis:
    image: redis:7-alpine
    container_name: aplicativo-web-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

#### Dockerfile (Produção)

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

#### Dockerfile.dev (Desenvolvimento)

```dockerfile
# Dockerfile.dev
FROM node:20-alpine

WORKDIR /app

# Instalar dependências
COPY package.json package-lock.json ./
RUN npm ci

# Copiar código
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

#### .dockerignore

```
node_modules
.next
.env
.env.local
.git
.gitignore
README.md
*.md
.DS_Store
```

### Comandos Docker Úteis

```bash
# Iniciar todos os serviços
docker-compose up

# Iniciar em background
docker-compose up -d

# Parar serviços
docker-compose down

# Rebuild após mudanças
docker-compose up --build

# Ver logs
docker-compose logs -f app

# Executar comandos no container
docker-compose exec app npm run prisma:migrate
docker-compose exec postgres psql -U postgres -d vaquejada_db

# Limpar volumes (cuidado!)
docker-compose down -v
```

---

## 📝 Passos de Implementação

### Fase 1: Configuração Inicial (Semana 1)

1. **Instalar dependências**
```bash
npm install prisma @prisma/client
npm install zod
npm install bcryptjs @types/bcryptjs
npm install next-auth@beta
npm install @types/node
```

2. **Configurar Prisma**
```bash
npx prisma init
```

3. **Criar schema inicial** (usar schema sugerido acima)

4. **Configurar variáveis de ambiente**
```env
# .env.local
DATABASE_URL="postgresql://user:password@localhost:5432/vaquejada_db"
NEXTAUTH_SECRET="seu-secret-aqui"
NEXTAUTH_URL="http://localhost:3000"
```

### Fase 2: Docker Setup (Semana 1)

1. **Criar arquivos Docker** (usar exemplos acima)

2. **Iniciar serviços**
```bash
docker-compose up -d postgres
```

3. **Rodar migrations**
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### Fase 3: API Routes (Semana 2)

1. **Criar API de produtos**
   - `app/api/products/route.ts`
   - `app/api/products/[id]/route.ts`

2. **Criar API de autenticação**
   - `app/api/auth/[...nextauth]/route.ts`

3. **Criar API de carrinho**
   - `app/api/cart/route.ts`

### Fase 4: Migração de Dados (Semana 2-3)

1. **Criar script de seed**
```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Migrar produtos hardcoded para o banco
  const products = [
    {
      name: "Sela Vaquejada Premium",
      description: "...",
      price: 1899.00,
      category: "Selas",
      // ...
    },
    // ...
  ];
  
  await prisma.product.createMany({ data: products });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

2. **Executar seed**
```bash
npx prisma db seed
```

### Fase 5: Atualizar Frontend (Semana 3)

1. **Criar hooks para API**
```typescript
// src/hooks/use-products.ts
export function useProducts() {
  const { data, isLoading } = useSWR('/api/products', fetcher);
  return { products: data, isLoading };
}
```

2. **Substituir dados hardcoded** por chamadas à API

3. **Atualizar carrinho** para usar API

### Fase 6: Testes e Deploy (Semana 4)

1. **Testar todas as funcionalidades**

2. **Configurar produção**
   - Variáveis de ambiente
   - Banco de dados em produção (Supabase/Neon)

3. **Deploy**
   - Vercel para Next.js
   - Supabase para banco

---

## 🎯 Recomendações Finais

### Para Começar Agora

1. ✅ **PostgreSQL + Prisma** - Banco de dados recomendado
2. ✅ **Next.js API Routes** - Backend no mesmo projeto
3. ✅ **Docker Compose** - Ambiente local consistente
4. ✅ **Supabase** - Banco gerenciado gratuito para começar

### Prioridades

1. **Alta Prioridade**
   - Banco de dados PostgreSQL
   - API de produtos
   - Autenticação básica
   - Migração de carrinho para backend

2. **Média Prioridade**
   - Sistema de pedidos
   - Dashboard admin
   - Upload de imagens

3. **Baixa Prioridade**
   - Analytics avançado
   - Integração de pagamento
   - Sistema de notificações

### Próximos Passos

1. Configurar Docker e PostgreSQL
2. Criar schema Prisma
3. Implementar primeira API route (GET /api/products)
4. Migrar dados hardcoded para banco
5. Atualizar frontend para consumir API

---

**Criado em:** 2024  
**Projeto:** Aplicativo Web - E-commerce Vaquejada

