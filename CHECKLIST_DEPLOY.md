# 📋 Checklist de Deploy - Aplicativo Web

## 🔴 CRÍTICO - Deve ser resolvido antes do deploy

### 1. Variáveis de Ambiente

**Status:** ⚠️ **PENDENTE** - Arquivo `.env.local` não existe no repositório (correto, mas precisa ser configurado na hospedagem)

#### Variáveis Obrigatórias:

- [ ] `DATABASE_URL` - URL de conexão do PostgreSQL (produção)
- [ ] `NEXTAUTH_SECRET` - Secret para NextAuth (gerar com: `openssl rand -base64 32`)
- [ ] `JWT_SECRET` - Secret para JWT (gerar com: `openssl rand -base64 32`)
- [ ] `NEXTAUTH_URL` - URL pública da aplicação (ex: `https://seu-dominio.com`)
- [ ] `NEXT_PUBLIC_APP_URL` - URL pública da aplicação (ex: `https://seu-dominio.com`)

#### Variáveis Opcionais (mas recomendadas):

- [ ] `GOOGLE_CLIENT_ID` - Para autenticação OAuth Google
- [ ] `GOOGLE_CLIENT_SECRET` - Para autenticação OAuth Google
- [ ] `CLOUDINARY_CLOUD_NAME` - Para upload de imagens
- [ ] `CLOUDINARY_API_KEY` - Para upload de imagens
- [ ] `CLOUDINARY_API_SECRET` - Para upload de imagens
- [ ] `FILESTACK_API_KEY` - Alternativa para upload de imagens
- [ ] `RESEND_API_KEY` - Para envio de emails (recomendado)
- [ ] `FROM_EMAIL` - Email remetente (ex: `noreply@seu-dominio.com`)
- [ ] `EMAIL_SERVICE` - Serviço de email (`resend` ou `none`)

### 2. Banco de Dados

**Status:** ⚠️ **PENDENTE** - Configurar PostgreSQL em produção

**📌 IMPORTANTE:** O banco está configurado LOCALMENTE (via docker-compose.yml), mas você precisa criar um banco PostgreSQL na nuvem para produção.

**O que fazer:**

1. Escolher um serviço de banco na nuvem:

   - **Railway** (recomendado - mais fácil): https://railway.app/
   - **Supabase** (gratuito): https://supabase.com/
   - **Neon** (gratuito): https://neon.tech/
   - **Render**: https://render.com/

2. Criar projeto PostgreSQL no serviço escolhido

3. Copiar a `DATABASE_URL` fornecida pelo serviço

4. Adicionar `DATABASE_URL` nas variáveis de ambiente da plataforma de hospedagem

5. Após deploy, executar migrations:

   ```bash
   npx prisma migrate deploy
   ```

6. Criar usuário admin:
   ```bash
   npm run db:create-admin
   ```

**📖 Veja o guia completo:** `GUIA_BANCO_DADOS.md`

- [ ] Criar banco de dados PostgreSQL em produção (Railway/Supabase/Neon)
- [ ] Copiar `DATABASE_URL` do serviço escolhido
- [ ] Configurar `DATABASE_URL` nas variáveis de ambiente da plataforma de hospedagem
- [ ] Executar migrations após deploy: `npx prisma migrate deploy`
- [ ] Criar usuário admin: `npm run db:create-admin`
- [ ] Verificar conexão testando a aplicação

### 3. Dockerfile de Produção

**Status:** 🔴 **CRÍTICO** - Apenas Dockerfile.dev existe

- [ ] Criar `Dockerfile` para produção (otimizado, multi-stage build)
- [ ] Configurar build do Next.js para produção
- [ ] Otimizar tamanho da imagem
- [ ] Configurar variáveis de ambiente no Docker

### 4. Configuração de Build

**Status:** ⚠️ **VERIFICAR** - Scripts existem, mas precisa testar build

- [ ] Testar build local: `npm run build`
- [ ] Verificar se não há erros de TypeScript
- [ ] Verificar se não há erros de lint: `npm run lint`
- [ ] Testar start em produção: `npm run start`

---

## 🟡 IMPORTANTE - Recomendado resolver antes do deploy

### 5. Documentação

**Status:** 🔴 **CRÍTICO** - README.md não existe

- [ ] Criar `README.md` com:
  - Descrição do projeto
  - Instruções de instalação
  - Variáveis de ambiente necessárias
  - Como executar migrations
  - Como criar usuário admin
  - Informações de deploy

### 6. Segurança

**Status:** ✅ **PARCIALMENTE OK** - Headers de segurança configurados, mas verificar:

- [ ] Verificar se todas as variáveis sensíveis estão em `.env` (não commitadas)
- [ ] Revisar CSP (Content Security Policy) no `next.config.ts`
- [ ] Configurar HTTPS obrigatório em produção
- [ ] Verificar rate limiting está funcionando
- [ ] Revisar permissões de upload de arquivos
- [ ] Configurar CORS adequadamente para produção

### 7. Serviço de Email

**Status:** ⚠️ **PENDENTE** - Email não está configurado

- [ ] Configurar serviço de email (Resend recomendado)
- [ ] Adicionar `RESEND_API_KEY` nas variáveis de ambiente
- [ ] Configurar `FROM_EMAIL` com domínio verificado
- [ ] Testar envio de emails

### 8. Upload de Imagens

**Status:** ⚠️ **PENDENTE** - Cloudinary ou Filestack precisa estar configurado

- [ ] Escolher serviço: Cloudinary ou Filestack
- [ ] Configurar credenciais do serviço escolhido
- [ ] Testar upload de imagens
- [ ] Migrar imagens locais para o serviço (se necessário)

### 9. OAuth Google

**Status:** ⚠️ **OPCIONAL** - Se não usar, pode desabilitar

- [ ] Criar projeto no Google Cloud Console
- [ ] Configurar OAuth 2.0 credentials
- [ ] Adicionar URLs de callback autorizadas
- [ ] Configurar `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`

---

## 🟢 OPCIONAL - Pode ser feito após deploy

### 10. Testes

**Status:** 🔴 **AUSENTE** - Nenhum teste encontrado

- [ ] Criar testes unitários para funções críticas
- [ ] Criar testes de integração para APIs
- [ ] Configurar CI/CD para rodar testes automaticamente

### 11. Monitoramento e Logs

**Status:** ⚠️ **BÁSICO** - Apenas console.log

- [ ] Configurar serviço de logging (ex: Sentry, LogRocket)
- [ ] Configurar monitoramento de erros
- [ ] Configurar métricas de performance
- [ ] Configurar alertas para erros críticos

### 12. Performance

**Status:** ⚠️ **VERIFICAR**

- [ ] Otimizar imagens (já configurado Cloudinary)
- [ ] Configurar cache adequadamente
- [ ] Verificar bundle size
- [ ] Configurar CDN se necessário

### 13. CI/CD

**Status:** 🔴 **AUSENTE**

- [ ] Configurar pipeline de CI/CD (GitHub Actions, GitLab CI, etc)
- [ ] Configurar deploy automático
- [ ] Configurar testes automáticos no pipeline

### 14. Backup do Banco de Dados

**Status:** ⚠️ **VERIFICAR COM HOSPEDAGEM**

- [ ] Configurar backup automático do PostgreSQL
- [ ] Testar restauração de backup
- [ ] Documentar processo de backup

---

## 📝 Passos para Deploy

### Preparação:

1. ✅ Criar conta na plataforma de hospedagem (Vercel, Railway, Render, etc)
2. ✅ Criar banco de dados PostgreSQL (ex: Supabase, Railway, Neon)
3. ✅ Configurar todas as variáveis de ambiente na plataforma
4. ✅ Criar Dockerfile de produção (se usar Docker)

### Deploy:

1. ✅ Conectar repositório Git à plataforma
2. ✅ Configurar build command: `npm run build`
3. ✅ Configurar start command: `npm run start`
4. ✅ Executar migrations após deploy: `npx prisma migrate deploy`
5. ✅ Criar usuário admin: `npm run db:create-admin`
6. ✅ Verificar se aplicação está funcionando

### Pós-Deploy:

1. ✅ Testar todas as funcionalidades principais
2. ✅ Verificar logs de erro
3. ✅ Configurar domínio personalizado (se necessário)
4. ✅ Configurar SSL/HTTPS
5. ✅ Testar performance

---

## 🔧 Comandos Úteis

```bash
# Gerar segredos
openssl rand -base64 32  # Para NEXTAUTH_SECRET
openssl rand -base64 32  # Para JWT_SECRET

# Build local para testar
npm run build
npm run start

# Migrations
npm run db:migrate          # Desenvolvimento
npx prisma migrate deploy    # Produção

# Criar admin
npm run db:create-admin

# Verificar banco
npm run db:studio
```

---

## 📌 Notas Importantes

1. **Nunca commitar** arquivos `.env` ou `.env.local` no Git
2. **Sempre usar HTTPS** em produção
3. **Testar build localmente** antes de fazer deploy
4. **Backup do banco** antes de migrations importantes
5. **Monitorar logs** após deploy para identificar problemas

---

## 🎯 Prioridade de Resolução

1. **URGENTE:** Variáveis de ambiente, Banco de dados, Dockerfile produção
2. **IMPORTANTE:** Documentação, Email, Upload de imagens
3. **DESEJÁVEL:** Testes, Monitoramento, CI/CD

---

**Última atualização:** $(date)
