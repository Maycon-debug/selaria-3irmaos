# ⚠️ IMPORTANTE: Credenciais Não Devem Estar no Código!

## Por que o GitHub bloqueou?

O GitHub tem proteção automática contra vazamento de secrets (credenciais). Ele detectou suas credenciais reais do Google OAuth nos arquivos de documentação e bloqueou o push por segurança.

## ✅ Solução:

1. **Credenciais reais APENAS no `.env.local`** (que está no `.gitignore`)
2. **Arquivos de documentação** devem usar apenas **exemplos genéricos**
3. **Nunca commite** arquivos com credenciais reais

## 🔒 Onde ficam as credenciais reais?

**APENAS no arquivo `.env.local`** (na raiz do projeto):

```env
# Este arquivo NÃO deve ser commitado
# Exemplo (NÃO use essas credenciais, são apenas exemplos):
GOOGLE_CLIENT_ID=seu-client-id-aqui.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu-client-secret-aqui
```

## 📝 Arquivos de documentação devem ter:

Apenas exemplos genéricos, como:
```env
GOOGLE_CLIENT_ID=seu-client-id-aqui.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu-client-secret-aqui
```

## 🚀 Como fazer push agora:

1. As credenciais já foram removidas dos arquivos de documentação
2. Faça commit das alterações
3. Push funcionará normalmente

**Nunca adicione credenciais reais em arquivos que serão commitados!**
