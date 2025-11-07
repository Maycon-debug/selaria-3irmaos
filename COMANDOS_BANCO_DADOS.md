# Guia de Comandos para Testar o Banco de Dados

## 📊 Opções para Visualizar e Testar o Banco

### 1. **Prisma Studio (Interface Gráfica) - RECOMENDADO**

```bash
npm run db:studio
```

- Abre uma interface web em: `http://localhost:5555`
- Permite visualizar e editar todas as tabelas graficamente
- Mais fácil para iniciantes

### 2. **Ver Schema do Banco (Estrutura das Tabelas)**

```bash
# Ver o schema atual do Prisma
type prisma\schema.prisma

# Ou no Linux/Mac:
cat prisma/schema.prisma
```

### 3. **Conectar via psql (PostgreSQL)**

```bash
# Primeiro, pegue a URL do banco do arquivo .env.local
# Depois conecte:
psql "postgresql://usuario:senha@host:porta/database"

# Exemplo:
psql "postgresql://postgres:senha@localhost:5432/vaqapp"
```

### 4. **Comandos SQL Úteis no psql**

```sql
-- Listar todas as tabelas
\dt

-- Ver estrutura de uma tabela específica
\d nome_da_tabela

-- Ver todas as tabelas com detalhes
\dt+

-- Ver dados de uma tabela
SELECT * FROM usuarios;
SELECT * FROM produtos;
SELECT * FROM mensagens_contato;

-- Contar registros em cada tabela
SELECT 'usuarios' as tabela, COUNT(*) as total FROM usuarios
UNION ALL
SELECT 'produtos', COUNT(*) FROM produtos
UNION ALL
SELECT 'mensagens_contato', COUNT(*) FROM mensagens_contato
UNION ALL
SELECT 'pedidos', COUNT(*) FROM pedidos
UNION ALL
SELECT 'favoritos', COUNT(*) FROM favoritos;

-- Ver últimas mensagens de contato
SELECT id, name, email, subject, status, "createdAt"
FROM mensagens_contato
ORDER BY "createdAt" DESC
LIMIT 10;

-- Ver produtos com estoque
SELECT id, name, price, stock, category
FROM produtos
ORDER BY stock DESC;

-- Sair do psql
\q
```

### 5. **Comandos Prisma CLI**

```bash
# Gerar o Prisma Client (após mudanças no schema)
npm run db:generate

# Criar uma nova migration
npm run db:migrate

# Aplicar migrations pendentes
npx prisma migrate deploy

# Resetar o banco (CUIDADO: apaga todos os dados!)
npm run db:reset

# Ver status das migrations
npx prisma migrate status

# Ver dados formatados no terminal
npx prisma db seed
```

### 6. **Script Node.js para Testar**

Crie um arquivo `test-db.js`:

```javascript
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Contar registros em cada tabela
  const usuarios = await prisma.usuario.count();
  const produtos = await prisma.produto.count();
  const mensagens = await prisma.mensagemContato.count();

  console.log("📊 Estatísticas do Banco:");
  console.log(`Usuários: ${usuarios}`);
  console.log(`Produtos: ${produtos}`);
  console.log(`Mensagens de Contato: ${mensagens}`);

  // Listar últimos produtos
  const ultimosProdutos = await prisma.produto.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  console.log("\n📦 Últimos 5 Produtos:");
  ultimosProdutos.forEach((p) => {
    console.log(`- ${p.name} (R$ ${p.price})`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Execute com:

```bash
node test-db.js
```

## 📋 Tabelas do Banco de Dados

Baseado no schema, você tem estas tabelas:

1. **usuarios** - Usuários do sistema
2. **accounts** - Contas OAuth
3. **sessions** - Sessões de usuários
4. **verification_tokens** - Tokens de verificação
5. **produtos** - Produtos cadastrados
6. **produtos_IMG** - Imagens dos produtos
7. **Carrinho_item** - Itens no carrinho
8. **favoritos** - Produtos favoritos
9. **pedidos** - Pedidos antigos
10. **ordem_item** - Itens dos pedidos
11. **order** - Pedidos novos
12. **mensagens_contato** - Mensagens de contato/suporte

## 🔍 Dicas Rápidas

- Use **Prisma Studio** para visualização gráfica (mais fácil)
- Use **psql** para queries SQL avançadas
- Use **scripts Node.js** para automação e testes
