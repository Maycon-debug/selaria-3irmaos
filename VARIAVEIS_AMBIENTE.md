# 🔐 Variáveis de Ambiente

Este documento lista todas as variáveis de ambiente necessárias para o projeto.

## 📋 Como Configurar

1. Crie um arquivo `.env.local` na raiz do projeto
2. Copie as variáveis abaixo e preencha com seus valores
3. **NUNCA** commite o arquivo `.env.local` no Git

## ✅ Variáveis Obrigatórias

### Banco de Dados

```env
DATABASE_URL="postgresql://usuario:senha@host:porta/database"
```

- URL de conexão do PostgreSQL
- Formato: `postgresql://usuario:senha@host:porta/database`
- Exemplo: `postgresql://postgres:senha123@localhost:5432/vaquejada_db`

### Autenticação

```env
NEXTAUTH_SECRET="seu-secret-aqui"
JWT_SECRET="seu-jwt-secret-aqui"
```

- Secrets para autenticação
- **Como gerar:** `openssl rand -base64 32`
- Mínimo de 32 caracteres
- **IMPORTANTE:** Use valores diferentes para cada secret

### URLs da Aplicação

```env
NEXTAUTH_URL="https://seu-dominio.com"
NEXT_PUBLIC_APP_URL="https://seu-dominio.com"
```

- URL pública da aplicação
- Em desenvolvimento: `http://localhost:3000`
- Em produção: `https://seu-dominio.com`

## 🔧 Variáveis Opcionais

### OAuth Google (Opcional)

```env
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

- Se não usar OAuth Google, deixe vazio ou remova
- Para configurar:
  1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
  2. Crie um projeto
  3. Configure OAuth 2.0 credentials
  4. Adicione URLs de callback autorizadas

### Cloudinary (Recomendado para Upload)

```env
CLOUDINARY_CLOUD_NAME="seu-cloud-name"
CLOUDINARY_API_KEY="sua-api-key"
CLOUDINARY_API_SECRET="seu-api-secret"
```

- Serviço de hospedagem de imagens
- Crie conta em [Cloudinary](https://cloudinary.com/)
- Obtém as credenciais no dashboard

### Filestack (Alternativa para Upload)

```env
FILESTACK_API_KEY=""
```

- Alternativa ao Cloudinary
- Se usar Cloudinary, deixe vazio

### Resend (Email)

```env
EMAIL_SERVICE="resend"
RESEND_API_KEY="sua-api-key"
FROM_EMAIL="noreply@seu-dominio.com"
```

- Serviço de envio de emails
- Crie conta em [Resend](https://resend.com/)
- Verifique seu domínio no Resend
- Se não usar, defina `EMAIL_SERVICE="none"`

### Ambiente

```env
NODE_ENV="development"
```

- `development` - Desenvolvimento
- `production` - Produção
- `test` - Testes

## 📝 Exemplo Completo (.env.local)

```env
# ============================================
# OBRIGATÓRIAS
# ============================================
DATABASE_URL="postgresql://postgres:senha@localhost:5432/vaquejada_db"
NEXTAUTH_SECRET="gerar-com-openssl-rand-base64-32"
JWT_SECRET="gerar-com-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# ============================================
# OPCIONAIS
# ============================================
# OAuth Google
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Cloudinary
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# Filestack (alternativa)
FILESTACK_API_KEY=""

# Email
EMAIL_SERVICE="resend"
RESEND_API_KEY=""
FROM_EMAIL="noreply@exemplo.com"

# Ambiente
NODE_ENV="development"
```

## 🔑 Como Gerar Secrets

### No Linux/Mac:

```bash
openssl rand -base64 32
```

### No Windows (PowerShell):

```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### Online:

Use um gerador seguro como: https://generate-secret.vercel.app/32

## ⚠️ Importante

1. **Nunca commite** arquivos `.env` ou `.env.local` no Git
2. **Use valores diferentes** para cada secret em cada ambiente
3. **Regenere secrets** se suspeitar de comprometimento
4. **Mantenha backups seguros** das variáveis de produção
5. **Use variáveis de ambiente** da plataforma de hospedagem em produção

## 🚀 Configuração em Produção

Na plataforma de hospedagem (Vercel, Railway, Render, etc):

1. Acesse as configurações do projeto
2. Vá em "Environment Variables" ou "Variáveis de Ambiente"
3. Adicione cada variável uma por uma
4. Certifique-se de usar valores de produção (não os de desenvolvimento)
5. Reinicie a aplicação após adicionar novas variáveis

## 🔍 Verificação

Para verificar se todas as variáveis estão configuradas:

```bash
# No Node.js
node -e "console.log(process.env.DATABASE_URL ? '✅ DATABASE_URL' : '❌ DATABASE_URL')"
```

Ou use o script de setup:

```bash
node scripts/setup-env.js
```
