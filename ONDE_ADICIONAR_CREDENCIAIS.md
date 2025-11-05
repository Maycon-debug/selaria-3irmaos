# 🔐 Script para Adicionar Credenciais Google

## 📝 Instruções:

1. **Abra o arquivo `.env.local`** na raiz do projeto (mesma pasta onde está o `package.json`)

2. **Adicione estas 2 linhas** ao final do arquivo:

```env
# Google OAuth
GOOGLE_CLIENT_ID=seu-client-id-aqui
GOOGLE_CLIENT_SECRET=seu-client-secret-aqui
```

3. **Substitua:**
   - `seu-client-id-aqui` → Cole o Client ID completo (ex: `123456789-abc...apps.googleusercontent.com`)
   - `seu-client-secret-aqui` → Cole o Client Secret completo (ex: `GOCSPX-abc...`)

---

## 🎯 Onde encontrar o arquivo:

**Caminho completo:**
```
C:\aplicativo-web\.env.local
```

**No Cursor/VS Code:**
- Abra a pasta `aplicativo-web`
- Procure por `.env.local` na lista de arquivos
- Se não aparecer, pode estar oculto (arquivos começando com `.` são ocultos)
- Use `Ctrl+P` e digite `.env.local` para abrir diretamente

---

## 💡 Alternativa: Me passe os valores

Se preferir, me diga:
- **Client ID:** `seu-client-id`
- **Client Secret:** `seu-client-secret`

E eu adiciono automaticamente via comando!

---

**O arquivo já existe e tem essas variáveis:**
- DATABASE_URL
- NEXTAUTH_SECRET  
- NEXTAUTH_URL

**Só precisa adicionar as 2 linhas do Google!**

