# 🗄️ Guia de Implementação - Prisma + Banco de Dados

## ✅ O que foi criado

Foram criados os seguintes arquivos:

1. **`prisma/schema.prisma`** - Schema completo do banco de dados
2. **`prisma/seed.ts`** - Script para popular o banco com produtos
3. **`src/lib/prisma.ts`** - Cliente Prisma configurado
4. **`package.json`** - Scripts úteis adicionados

---

## 📋 Passo a Passo

### Passo 1: Gerar o Prisma Client

Primeiro, precisamos gerar o cliente Prisma baseado no schema:

```bash
npm run db:generate
```

Isso vai criar o cliente TypeScript que você vai usar para acessar o banco.

### Passo 2: Criar as tabelas no banco (Migration)

Agora vamos criar as tabelas no PostgreSQL:

```bash
npm run db:migrate
```

Quando executar, o Prisma vai perguntar:
- **Nome da migration:** Digite `init` (ou qualquer nome descritivo)

Isso vai:
- ✅ Criar todas as tabelas no banco
- ✅ Criar os relacionamentos
- ✅ Criar índices
- ✅ Criar os enums (Role, OrderStatus)

### Passo 3: Popular o banco com produtos (Seed)

Agora vamos popular o banco com os produtos que estavam hardcoded:

```bash
npm run db:seed
```

Isso vai:
- ✅ Criar todos os produtos da loja
- ✅ Criar o estoque de cada produto
- ✅ Mostrar o progresso no terminal

### Passo 4: Verificar no Prisma Studio (Opcional)

Você pode visualizar os dados no Prisma Studio:

```bash
npm run db:studio
```

Isso abre uma interface web em `http://localhost:5555` onde você pode:
- Ver todas as tabelas
- Ver os dados
- Editar dados manualmente
- Testar queries

---

## 🎯 Verificação

Execute estes comandos para confirmar que tudo está funcionando:

```bash
# 1. Verificar se o Prisma Client foi gerado
ls src/generated/prisma  # ou node_modules/.prisma/client

# 2. Verificar tabelas no banco
docker-compose exec postgres psql -U postgres -d vaquejada_db -c "\dt"

# 3. Ver produtos criados
docker-compose exec postgres psql -U postgres -d vaquejada_db -c "SELECT name, price FROM \"Product\" LIMIT 5;"
```

---

## 📊 Estrutura do Banco

O schema criado tem as seguintes tabelas:

### Tabelas Principais

- **`User`** - Usuários do sistema
- **`Product`** - Produtos da loja
- **`ProductImage`** - Imagens dos produtos
- **`Stock`** - Estoque de produtos
- **`CartItem`** - Itens no carrinho
- **`Favorite`** - Produtos favoritos
- **`Order`** - Pedidos
- **`OrderItem`** - Itens de pedidos

### Relacionamentos

- User → CartItem (um usuário tem muitos itens no carrinho)
- User → Favorite (um usuário tem muitos favoritos)
- User → Order (um usuário tem muitos pedidos)
- Product → CartItem (um produto pode estar em muitos carrinhos)
- Product → Favorite (um produto pode estar em muitos favoritos)
- Product → OrderItem (um produto pode estar em muitos pedidos)
- Product → Stock (um produto tem um estoque)
- Product → ProductImage (um produto tem muitas imagens)

---

## 🛠️ Scripts Disponíveis

Agora você tem estes comandos úteis no `package.json`:

```bash
# Gerar Prisma Client
npm run db:generate

# Criar migration (cria tabelas)
npm run db:migrate

# Aplicar schema sem migration (desenvolvimento)
npm run db:push

# Popular banco com dados iniciais
npm run db:seed

# Abrir Prisma Studio (interface visual)
npm run db:studio

# Resetar banco (apaga tudo e recria)
npm run db:reset
```

---

## ❓ Solução de Problemas

### Erro: "Prisma schema not found"

**Solução:** Certifique-se de estar na raiz do projeto:
```bash
cd c:\aplicativo-web
```

### Erro: "Connection refused" ou "Can't reach database"

**Solução:** Certifique-se de que o PostgreSQL está rodando:
```bash
docker-compose ps
# Se não estiver rodando:
docker-compose up -d postgres
```

### Erro: "Migration failed"

**Solução:** Se houver erro na migration, você pode resetar:
```bash
npm run db:reset
# Isso vai apagar tudo e recriar do zero
```

### Erro no seed: "Product already exists"

**Solução:** Normal! O seed verifica se o produto já existe antes de criar. Se quiser resetar:
```bash
npm run db:reset
npm run db:seed
```

### Quero ver os dados no banco

**Opção 1 - Prisma Studio (visual):**
```bash
npm run db:studio
```

**Opção 2 - Terminal:**
```bash
docker-compose exec postgres psql -U postgres -d vaquejada_db
```

Depois execute SQL:
```sql
SELECT * FROM "Product";
SELECT * FROM "Stock";
```

---

## ✅ Checklist

- [ ] Prisma Client gerado (`npm run db:generate`)
- [ ] Migration criada (`npm run db:migrate`)
- [ ] Tabelas criadas no banco
- [ ] Seed executado (`npm run db:seed`)
- [ ] Produtos aparecem no banco
- [ ] Prisma Studio funcionando (opcional)

---

## 🎯 Próximos Passos

Agora que o banco está configurado e populado:

1. ✅ **Prisma configurado** ← Você está aqui
2. ⏭️ **Criar API Routes** - Endpoints para produtos
3. ⏭️ **Atualizar Frontend** - Consumir API ao invés de dados hardcoded

---

**Próxima etapa:** Criar as API Routes (`/api/products`) para acessar os dados do banco.

