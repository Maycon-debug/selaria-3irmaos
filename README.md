# 🐂 Aplicativo Web - Selaria III Irmãos

E-commerce de equipamentos de vaquejada desenvolvido com Next.js 16, TypeScript, Prisma e PostgreSQL.

## 🚀 Tecnologias

- **Framework:** Next.js 16
- **Linguagem:** TypeScript
- **Banco de Dados:** PostgreSQL com Prisma ORM
- **Autenticação:** NextAuth.js (Credentials + OAuth Google)
- **Estilização:** Tailwind CSS
- **Upload de Imagens:** Cloudinary / Filestack
- **Validação:** Zod

## 📋 Pré-requisitos

- Node.js 20 ou superior
- PostgreSQL 16 ou superior
- npm ou yarn

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd aplicativo-web
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Preencha todas as variáveis obrigatórias no arquivo `.env.local`:

- `DATABASE_URL` - URL de conexão do PostgreSQL
- `NEXTAUTH_SECRET` - Gerar com: `openssl rand -base64 32`
- `JWT_SECRET` - Gerar com: `openssl rand -base64 32`
- `NEXTAUTH_URL` - URL da aplicação (ex: `http://localhost:3000`)
- `NEXT_PUBLIC_APP_URL` - URL da aplicação (ex: `http://localhost:3000`)

### 4. Configure o banco de dados

#### Opção A: Usando Docker Compose (recomendado para desenvolvimento)

```bash
docker-compose up -d
```

#### Opção B: PostgreSQL local

Certifique-se de que o PostgreSQL está rodando e crie um banco de dados:

```sql
CREATE DATABASE vaquejada_db;
```

### 5. Execute as migrations

```bash
npm run db:migrate
```

### 6. Execute o seed (opcional)

```bash
npm run db:seed
```

### 7. Crie um usuário admin

```bash
npm run db:create-admin
```

### 8. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run start` - Inicia servidor de produção
- `npm run lint` - Executa ESLint
- `npm run db:generate` - Gera Prisma Client
- `npm run db:migrate` - Executa migrations (desenvolvimento)
- `npm run db:push` - Sincroniza schema com banco (desenvolvimento)
- `npm run db:seed` - Popula banco com dados iniciais
- `npm run db:studio` - Abre Prisma Studio
- `npm run db:create-admin` - Cria usuário administrador

## 🗄️ Estrutura do Banco de Dados

O projeto usa Prisma como ORM. O schema está em `prisma/schema.prisma`.

### Principais modelos:

- **Usuario** - Usuários do sistema (USER/ADMIN)
- **Produto** - Produtos do e-commerce
- **CarrinhoItem** - Itens no carrinho
- **Favorito** - Produtos favoritados
- **Pedido** - Pedidos realizados
- **MensagemContato** - Mensagens de contato

## 🔐 Autenticação

O sistema suporta dois métodos de autenticação:

1. **Credentials** - Email e senha
2. **OAuth Google** - Login com Google (opcional)

Para habilitar OAuth Google:

1. Crie um projeto no [Google Cloud Console](https://console.cloud.google.com/)
2. Configure OAuth 2.0 credentials
3. Adicione as URLs de callback autorizadas
4. Configure `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` no `.env.local`

## 📧 Configuração de Email

O sistema suporta envio de emails através do Resend. Para configurar:

1. Crie uma conta no [Resend](https://resend.com/)
2. Obtenha sua API Key
3. Configure `RESEND_API_KEY` e `FROM_EMAIL` no `.env.local`
4. Verifique seu domínio no Resend

## 🖼️ Upload de Imagens

O sistema suporta dois serviços de upload:

1. **Cloudinary** (recomendado)
2. **Filestack**

Configure as credenciais no `.env.local` conforme o serviço escolhido.

## 🐳 Deploy com Docker

### Build da imagem

```bash
docker build -t aplicativo-web .
```

### Executar container

```bash
docker run -p 3000:3000 --env-file .env.local aplicativo-web
```

## 🚀 Deploy em Produção

### Checklist antes do deploy:

1. ✅ Configurar todas as variáveis de ambiente na plataforma
2. ✅ Criar banco de dados PostgreSQL em produção
3. ✅ Executar migrations: `npx prisma migrate deploy`
4. ✅ Criar usuário admin: `npm run db:create-admin`
5. ✅ Configurar domínio e SSL/HTTPS
6. ✅ Testar todas as funcionalidades

### Plataformas recomendadas:

- **Vercel** - Deploy automático do Next.js
- **Railway** - Simples e com PostgreSQL incluído
- **Render** - Boa opção com suporte a Docker
- **DigitalOcean App Platform** - Flexível e escalável

Veja o arquivo `CHECKLIST_DEPLOY.md` para uma lista completa de pendências.

## 🔒 Segurança

O projeto implementa várias medidas de segurança:

- Headers de segurança configurados (CSP, HSTS, etc)
- Rate limiting em endpoints críticos
- Validação de dados com Zod
- Sanitização de HTML para prevenir XSS
- Autenticação e autorização adequadas
- Variáveis sensíveis em arquivos de ambiente

## 📄 Licença

Este projeto é privado e proprietário.

## 👥 Contato

Para dúvidas ou suporte, entre em contato através do sistema de mensagens da aplicação.

---

**Desenvolvido com ❤️ para Selaria III Irmãos**


