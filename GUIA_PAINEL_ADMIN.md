# 🎛️ Painel Administrativo - Guia Completo

## 📋 Visão Geral

Painel administrativo completo e interativo para gerenciar produtos, estoque, e outras funcionalidades importantes do e-commerce.

## 🚀 Configuração Inicial

### 1. Criar Usuário Admin

Primeiro, crie um usuário administrador:

```bash
npm run db:create-admin
```

Isso criará um admin padrão:
- **Email:** `admin@vaquejada.com`
- **Senha:** `admin123`

⚠️ **IMPORTANTE:** Altere a senha em produção!

### 2. Acessar o Painel

1. Acesse: http://localhost:3000/admin/login
2. Faça login com as credenciais do admin
3. Você será redirecionado para o dashboard

---

## 🎨 Funcionalidades

### ✅ Dashboard Principal (`/admin/dashboard`)

- **Estatísticas em Tempo Real:**
  - Total de produtos
  - Estoque total
  - Produtos com estoque baixo
  - Valor total do inventário

- **Tabela de Produtos:**
  - Lista todos os produtos
  - Busca em tempo real
  - Visualização de imagens
  - Status de estoque (verde/amarelo/vermelho)
  - Ações rápidas (editar/deletar)

### ✅ Criar Produto (`/admin/products/new`)

- **Upload de Imagens:**
  - Upload direto de arquivo
  - Ou cole URL da imagem
  - Preview em tempo real

- **Formulário Completo:**
  - Nome e descrição
  - Preço e preço original
  - Categoria
  - Estoque
  - Avaliação (rating)

### ✅ Editar Produto (`/admin/products/[id]/edit`)

- Mesmas funcionalidades do criar
- Carrega dados existentes
- Atualiza em tempo real

### ✅ Deletar Produto

- Confirmação antes de deletar
- Feedback visual
- Atualização automática da lista

---

## 🔐 Autenticação

### Sistema de Segurança

- **JWT Tokens:** Autenticação via tokens JWT
- **Role-based:** Apenas usuários ADMIN podem acessar
- **Proteção de Rotas:** Todas as rotas admin são protegidas
- **Sessão:** Tokens salvos no localStorage

### Como Funciona

1. Login gera um JWT token
2. Token é salvo no localStorage
3. Todas as requisições incluem o token no header
4. APIs verificam o token antes de executar ações

---

## 📁 Estrutura de Arquivos

```
app/
├── admin/
│   ├── login/
│   │   └── page.tsx          # Página de login
│   ├── dashboard/
│   │   └── page.tsx          # Dashboard principal
│   └── products/
│       ├── new/
│       │   └── page.tsx       # Criar produto
│       └── [id]/
│           └── edit/
│               └── page.tsx  # Editar produto
├── api/
│   ├── auth/
│   │   ├── login/
│   │   │   └── route.ts      # API de login
│   │   └── me/
│   │       └── route.ts      # Verificar autenticação
│   └── products/
│       ├── route.ts           # Listar/Criar produtos
│       └── [id]/
│           └── route.ts      # Buscar/Editar/Deletar
```

---

## 🎯 Recursos do Dashboard

### Design Moderno

- **Sidebar Fixa:** Navegação sempre visível
- **Cards de Estatísticas:** Métricas importantes em destaque
- **Tabela Responsiva:** Funciona em todos os dispositivos
- **Feedback Visual:** Toasts e confirmações
- **Loading States:** Indicadores de carregamento

### Interatividade

- **Busca em Tempo Real:** Filtra produtos enquanto digita
- **Preview de Imagens:** Visualização antes de salvar
- **Status de Estoque:** Cores indicam nível de estoque
- **Ações Rápidas:** Editar/deletar com um clique

---

## 🔧 APIs Disponíveis

### Autenticação

- `POST /api/auth/login` - Login do admin
- `GET /api/auth/me` - Verificar autenticação atual

### Produtos (Protegidas)

- `GET /api/products` - Listar produtos (público)
- `POST /api/products` - Criar produto (admin)
- `GET /api/products/[id]` - Buscar produto (público)
- `PUT /api/products/[id]` - Atualizar produto (admin)
- `DELETE /api/products/[id]` - Deletar produto (admin)

---

## 📝 Exemplos de Uso

### Criar um Produto

1. Acesse `/admin/products/new`
2. Faça upload da imagem ou cole URL
3. Preencha os dados:
   - Nome: "Sela Vaquejada Premium"
   - Categoria: "Selas"
   - Preço: 1899.00
   - Estoque: 10
4. Clique em "Criar Produto"

### Editar um Produto

1. No dashboard, clique no ícone de editar
2. Modifique os campos desejados
3. Clique em "Atualizar Produto"

### Deletar um Produto

1. No dashboard, clique no ícone de deletar
2. Confirme a ação
3. Produto é removido imediatamente

---

## 🚨 Segurança em Produção

### Checklist de Segurança

- [ ] Implementar bcrypt para hash de senhas
- [ ] Alterar senha padrão do admin
- [ ] Configurar HTTPS
- [ ] Adicionar rate limiting nas APIs
- [ ] Implementar CSRF protection
- [ ] Configurar variáveis de ambiente seguras
- [ ] Adicionar logging de ações admin
- [ ] Configurar backup automático do banco

### Melhorias Futuras

- Upload de imagens para Cloudinary/AWS S3
- Sistema de permissões mais granular
- Histórico de alterações
- Exportação de relatórios
- Dashboard de analytics

---

## 🎨 Personalização

O dashboard segue o mesmo estilo visual do site principal:
- Cores: Gradientes laranja/laranja escuro
- Tipografia: Consistente com o site
- Componentes: Reutiliza componentes UI existentes
- Responsividade: Funciona em mobile e desktop

---

## 💡 Dicas

1. **Backup:** Sempre faça backup antes de deletar produtos
2. **Imagens:** Use URLs de imagens hospedadas (Cloudinary, Imgur, etc.)
3. **Estoque:** Mantenha o estoque atualizado para melhor experiência
4. **Categorias:** Use categorias consistentes para melhor organização

---

## 🐛 Troubleshooting

### Não consigo fazer login

- Verifique se o admin foi criado: `npm run db:create-admin`
- Confirme que o email/senha estão corretos
- Verifique o console do navegador para erros

### Erro ao criar produto

- Verifique se está autenticado
- Confirme que todos os campos obrigatórios estão preenchidos
- Verifique a URL da imagem

### Token expirado

- Faça logout e login novamente
- Tokens expiram após 24 horas

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do console
2. Verifique os logs do servidor
3. Consulte a documentação do Prisma/Next.js

---

**Painel Administrativo criado com ❤️ seguindo as melhores práticas do mercado!**

