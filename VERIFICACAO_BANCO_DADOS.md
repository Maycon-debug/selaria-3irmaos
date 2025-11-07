# 📊 Verificação de Funcionalidades do Banco de Dados

## ✅ Rotas que SALVAM dados no banco:

### 1. **Mensagens de Contato** (`/api/contact`)
- **POST**: Salva mensagens na tabela `mensagens_contato`
- **Status**: ✅ Funcional
- **Tabela**: `mensagens_contato`
- **Campos salvos**: name, email, phone, subject, message, status, createdAt

### 2. **Produtos** (`/api/products`)
- **POST**: Cria produtos na tabela `produtos` (requer autenticação admin)
- **PUT**: Atualiza produtos existentes
- **Status**: ✅ Funcional
- **Tabela**: `produtos`
- **Campos salvos**: name, description, price, originalPrice, category, rating, image, stock

### 3. **Usuários** (`/api/auth/register`)
- **POST**: Cria usuários na tabela `usuarios`
- **Status**: ✅ Funcional
- **Tabela**: `usuarios`
- **Campos salvos**: email, name, password (hash), role

### 4. **OAuth** (`/api/auth/sync-user`)
- **POST**: Sincroniza usuários OAuth nas tabelas `usuarios` e `accounts`
- **Status**: ✅ Funcional
- **Tabelas**: `usuarios`, `accounts`

### 5. **Carrinho** ⚠️
- **Status**: ⚠️ Atualmente usando **localStorage** (não salva no banco)
- **Tabela disponível**: `Carrinho_item` (não está sendo usada)
- **Recomendação**: Implementar API para salvar carrinho no banco quando usuário estiver logado

### 6. **Favoritos** ⚠️
- **Status**: ⚠️ Precisa verificar se há API implementada
- **Tabela disponível**: `favoritos`

### 7. **Pedidos** (`/api/orders` - se existir)
- **Tabelas disponíveis**: `pedidos`, `order`, `ordem_item`
- **Status**: ⚠️ Precisa verificar se há API implementada

## 🔍 Como Verificar no Prisma Studio:

1. **Abra o Prisma Studio:**
   ```bash
   npm run db:studio
   ```

2. **Acesse:** http://localhost:5555

3. **Verifique cada tabela:**
   - Clique em cada tabela no menu lateral
   - Veja os registros salvos
   - Verifique os campos e datas

## 📋 Tabelas do Banco:

| Tabela | Descrição | Status |
|--------|-----------|--------|
| `usuarios` | Usuários do sistema | ✅ Funcional |
| `produtos` | Produtos cadastrados | ✅ Funcional |
| `mensagens_contato` | Mensagens de suporte | ✅ Funcional |
| `Carrinho_item` | Itens no carrinho | ⚠️ Não usado (usa localStorage) |
| `favoritos` | Produtos favoritos | ⚠️ Verificar |
| `pedidos` | Pedidos antigos | ⚠️ Verificar |
| `order` | Pedidos novos | ⚠️ Verificar |
| `ordem_item` | Itens dos pedidos | ⚠️ Verificar |
| `accounts` | Contas OAuth | ✅ Funcional |
| `sessions` | Sessões de usuários | ✅ Funcional |
| `verification_tokens` | Tokens de verificação | ✅ Funcional |
| `produtos_IMG` | Imagens dos produtos | ✅ Funcional |

## 🧪 Testes Rápidos:

### Testar Mensagem de Contato:
1. Vá para `/contato`
2. Preencha o formulário
3. Envie
4. Verifique em Prisma Studio → `mensagens_contato`

### Testar Cadastro de Usuário:
1. Vá para `/cadastro`
2. Crie uma conta
3. Verifique em Prisma Studio → `usuarios`

### Testar Produto (Admin):
1. Faça login como admin
2. Vá para `/admin/products/new`
3. Crie um produto
4. Verifique em Prisma Studio → `produtos`

## ⚠️ Observações:

- **Carrinho**: Atualmente salva apenas no `localStorage` do navegador
- **Favoritos**: Precisa verificar se há API implementada
- **Pedidos**: Precisa verificar se há API implementada

## 💡 Próximos Passos:

1. Implementar API para salvar carrinho no banco quando usuário estiver logado
2. Verificar e implementar API de favoritos
3. Verificar e implementar API de pedidos

