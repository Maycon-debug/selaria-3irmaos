# 📝 Como Adicionar Credenciais Google OAuth

## 🎯 Passo a Passo Simples

### Opção 1: Usar o Cursor/VS Code

1. **Na raiz do projeto** (pasta `aplicativo-web`), procure pelo arquivo `.env.local`
2. Se não existir, **crie um novo arquivo** chamado `.env.local`
3. **Abra o arquivo** e adicione as linhas abaixo

### Opção 2: Usar o Terminal

Vou criar um comando para você adicionar facilmente!

---

## 📋 O que adicionar

Cole essas linhas no arquivo `.env.local`:

```env
# Google OAuth
GOOGLE_CLIENT_ID=cole-seu-client-id-aqui
GOOGLE_CLIENT_SECRET=cole-seu-client-secret-aqui

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=qualquer-string-aleatoria-aqui-123456789
```

---

## 💡 Substitua:

- `cole-seu-client-id-aqui` → Cole o **Client ID** completo do Google
- `cole-seu-client-secret-aqui` → Cole o **Client Secret** completo do Google  
- `qualquer-string-aleatoria-aqui-123456789` → Qualquer texto aleatório longo (ex: `meu-secret-super-seguro-2024`)

---

**Me diga qual é seu Client ID e Client Secret que eu adiciono para você automaticamente!**

Ou se preferir, edite manualmente o arquivo `.env.local` na raiz do projeto.

