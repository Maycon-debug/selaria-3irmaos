# 🔐 Adicionar Credenciais Google OAuth

Adicione as seguintes variáveis ao seu arquivo `.env.local`:

```env
# Google OAuth
GOOGLE_CLIENT_ID=seu-client-id-aqui
GOOGLE_CLIENT_SECRET=seu-client-secret-aqui

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=seu-secret-aqui-gere-um-valor-aleatorio
```

## 📝 Instruções:

1. **Abra o arquivo `.env.local`** na raiz do projeto

2. **Adicione as variáveis:**
   - Cole o **Client ID** que você copiou do Google Cloud
   - Cole o **Client Secret** que você copiou do Google Cloud
   - Para `NEXTAUTH_SECRET`, gere um valor aleatório (pode usar qualquer string longa e aleatória)

3. **Exemplo:**
   ```env
   GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz123456
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=meu-secret-super-seguro-aleatorio-123456789
   ```

## ⚠️ Importante:

- Não compartilhe essas credenciais publicamente
- Não commite o `.env.local` no Git (já está no .gitignore)
- Em produção, use variáveis de ambiente seguras

---

**Depois de adicionar, me avise que continuo configurando o código!**

