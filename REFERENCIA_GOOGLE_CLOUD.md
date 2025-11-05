# 🎨 Referência Visual: Google Cloud Console

## 📍 Navegação Principal

```
Google Cloud Console
├── Seletor de Projetos (topo)
├── APIs e Serviços
│   ├── Tela de consentimento OAuth ← Passo 3
│   └── Credenciais ← Passo 4
└── Menu lateral (☰)
```

---

## 🔍 Onde Encontrar Cada Coisa

### 1. Criar Projeto
**Localização:** Topo da página → Seletor de projetos → "Novo Projeto"

### 2. Tela de Consentimento OAuth
**Localização:** Menu lateral → APIs e Serviços → Tela de consentimento OAuth

**Campos importantes:**
- Nome do aplicativo
- Email de suporte
- Escopos (Scopes)

### 3. Credenciais OAuth
**Localização:** Menu lateral → APIs e Serviços → Credenciais → + Criar Credenciais

**Tipo:** ID do cliente OAuth → Aplicativo da Web

**Campos obrigatórios:**
- Origens JavaScript: `http://localhost:3000`
- URIs de redirecionamento: `http://localhost:3000/api/auth/callback/google`

---

## ✅ Checklist Rápido

- [ ] Projeto criado no Google Cloud
- [ ] Tela de consentimento configurada
- [ ] Credenciais OAuth criadas
- [ ] Client ID copiado
- [ ] Client Secret copiado
- [ ] URLs configuradas corretamente
- [ ] Credenciais salvas em local seguro

---

## 🚨 Erros Comuns

### "redirect_uri_mismatch"
**Causa:** URL não está exatamente igual
**Solução:** 
- Copie e cole a URL exata
- Verifique `http://` vs `https://`
- Remova barras no final

### Credenciais não aparecem
**Causa:** Projeto errado selecionado
**Solução:** Verifique o projeto no seletor do topo

### Tela de consentimento bloqueada
**Causa:** Ainda em modo de teste
**Solução:** Adicione seu email como usuário de teste OU publique a tela

---

**Siga o guia passo a passo e me avise quando terminar!** 🚀

