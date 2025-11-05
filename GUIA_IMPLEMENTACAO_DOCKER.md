# 🐳 Guia de Implementação - Docker + PostgreSQL

## ✅ O que foi criado

Foram criados os seguintes arquivos:

1. **`docker-compose.yml`** - Configuração dos serviços (PostgreSQL + Redis)
2. **`Dockerfile.dev`** - Imagem Docker para desenvolvimento
3. **`.dockerignore`** - Arquivos ignorados pelo Docker
4. **`.env.example`** - Exemplo de variáveis de ambiente (referência)

---

## 📋 Passo a Passo para Começar

### Passo 1: Verificar se o Docker está instalado

**Windows:**
```powershell
docker --version
docker-compose --version
```

Se não estiver instalado, baixe o [Docker Desktop](https://www.docker.com/products/docker-desktop/)

**Linux/Mac:**
```bash
docker --version
docker-compose --version
```

### Passo 2: Criar arquivo de variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:

```env
# Banco de Dados PostgreSQL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/vaquejada_db"

# Variáveis do Docker Compose
DB_USER="postgres"
DB_PASSWORD="postgres"
DB_NAME="vaquejada_db"
```

**⚠️ Importante:** O arquivo `.env.local` já está no `.gitignore`, então não será commitado.

### Passo 3: Iniciar o PostgreSQL com Docker

Abra o terminal na raiz do projeto e execute:

```bash
docker-compose up -d postgres
```

Isso vai:
- ✅ Baixar a imagem do PostgreSQL 16
- ✅ Criar um container chamado `aplicativo-web-db`
- ✅ Criar o banco de dados `vaquejada_db`
- ✅ Expor a porta 5432 para conexão local

### Passo 4: Verificar se está funcionando

**Ver logs do container:**
```bash
docker-compose logs postgres
```

**Verificar se o container está rodando:**
```bash
docker-compose ps
```

Você deve ver algo como:
```
NAME                  STATUS          PORTS
aplicativo-web-db     Up (healthy)    0.0.0.0:5432->5432/tcp
```

**Testar conexão (opcional):**
```bash
docker-compose exec postgres psql -U postgres -d vaquejada_db -c "SELECT version();"
```

### Passo 5: Parar os serviços (quando necessário)

```bash
# Parar mas manter dados
docker-compose stop

# Parar e remover containers (dados permanecem no volume)
docker-compose down

# Parar e remover TUDO incluindo dados (cuidado!)
docker-compose down -v
```

---

## 🔍 Comandos Úteis

### Gerenciar containers

```bash
# Ver status dos containers
docker-compose ps

# Ver logs em tempo real
docker-compose logs -f postgres

# Reiniciar um serviço
docker-compose restart postgres

# Entrar no container PostgreSQL
docker-compose exec postgres psql -U postgres -d vaquejada_db
```

### Gerenciar volumes (dados)

```bash
# Ver volumes criados
docker volume ls

# Inspecionar um volume
docker volume inspect aplicativo-web_postgres_data

# Remover volumes (CUIDADO: apaga todos os dados!)
docker-compose down -v
```

### Backup do banco de dados

```bash
# Fazer backup
docker-compose exec postgres pg_dump -U postgres vaquejada_db > backup.sql

# Restaurar backup
docker-compose exec -T postgres psql -U postgres vaquejada_db < backup.sql
```

---

## 🎯 Próximos Passos

Agora que o PostgreSQL está rodando, você pode:

1. **Instalar Prisma** (próxima etapa)
   ```bash
   npm install prisma @prisma/client
   ```

2. **Inicializar Prisma**
   ```bash
   npx prisma init
   ```

3. **Criar o schema do banco de dados**

4. **Rodar migrations**

---

## ❓ Solução de Problemas

### Porta 5432 já está em uso

**Solução 1:** Parar PostgreSQL local se tiver instalado
```bash
# Windows (PowerShell como Admin)
Stop-Service postgresql-x64-16

# Linux
sudo systemctl stop postgresql
```

**Solução 2:** Mudar a porta no `docker-compose.yml`
```yaml
ports:
  - "5433:5432"  # Agora usa porta 5433 no host
```

E atualizar `DATABASE_URL`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/vaquejada_db"
```

### Container não inicia

```bash
# Ver logs detalhados
docker-compose logs postgres

# Remover e recriar
docker-compose down
docker-compose up -d postgres
```

### Erro de permissão (Linux)

```bash
# Adicionar seu usuário ao grupo docker
sudo usermod -aG docker $USER
# Fazer logout e login novamente
```

### Resetar tudo do zero

```bash
# Parar tudo
docker-compose down -v

# Remover imagens (opcional)
docker rmi postgres:16-alpine

# Iniciar novamente
docker-compose up -d postgres
```

---

## 📊 Verificação Final

Execute estes comandos para confirmar que tudo está funcionando:

```bash
# 1. Verificar containers
docker-compose ps
# Deve mostrar postgres como "Up (healthy)"

# 2. Testar conexão
docker-compose exec postgres psql -U postgres -d vaquejada_db -c "SELECT 1;"
# Deve retornar: 1

# 3. Ver banco de dados
docker-compose exec postgres psql -U postgres -c "\l"
# Deve listar vaquejada_db
```

---

## ✅ Checklist

- [ ] Docker e Docker Compose instalados
- [ ] Arquivo `.env.local` criado
- [ ] Container PostgreSQL rodando (`docker-compose ps`)
- [ ] Conexão testada com sucesso
- [ ] Pronto para próxima etapa (Prisma)

---

**Próxima etapa:** Instalar e configurar Prisma para criar o schema do banco de dados.

