# 🔐 Guia Completo: Configurar Google OAuth

## 📋 Passo a Passo para Configurar Google OAuth

### Pré-requisitos
- Conta Google (Gmail)
- Acesso ao Google Cloud Console
- ~15 minutos

---

## 🚀 Passo 1: Acessar Google Cloud Console

1. Acesse: https://console.cloud.google.com/
2. Faça login com sua conta Google
3. Se for a primeira vez, aceite os termos de serviço

---

## 📦 Passo 2: Criar um Novo Projeto

1. No topo da página, clique no **seletor de projetos** (ao lado do logo Google Cloud)
2. Clique em **"Novo Projeto"** (ou "New Project")
3. Preencha:
   - **Nome do Projeto:** `Vaquejada E-commerce` (ou qualquer nome)
   - **Organização:** Deixe padrão (se não tiver)
4. Clique em **"Criar"** (ou "Create")
5. Aguarde alguns segundos enquanto o projeto é criado
6. **Selecione o projeto** no seletor de projetos

---

## 🔑 Passo 3: Configurar Tela de Consentimento OAuth

1. No menu lateral esquerdo, vá em **"APIs e Serviços"** → **"Tela de consentimento OAuth"**
2. Escolha **"Externo"** (External) e clique em **"Criar"** (Create)
3. Preencha os dados:

   **Informações do aplicativo:**
   - **Nome do aplicativo:** `Selaria III Irmãos` (ou o nome do seu site)
   - **Email de suporte do usuário:** Seu email
   - **Logo do aplicativo:** (Opcional) Faça upload de um logo se tiver
   - **Domínio de autorização do aplicativo:** (Pode deixar vazio por enquanto)

   **Informações de contato:**
   - **Email de contato do desenvolvedor:** Seu email

4. Clique em **"Salvar e Continuar"** (Save and Continue)

5. **Escopos** (Scopes):
   - Clique em **"Adicionar ou remover escopos"**
   - Selecione:
     - ✅ `.../auth/userinfo.email`
     - ✅ `.../auth/userinfo.profile`
   - Clique em **"Atualizar"** → **"Salvar e Continuar"**

6. **Usuários de teste** (Test users):
   - Se estiver em modo de teste, adicione seu email
   - Ou clique em **"Salvar e Continuar"** (depois você pode publicar para todos)

7. **Resumo:**
   - Revise as informações
   - Clique em **"Voltar ao Painel"**

---

## 🔐 Passo 4: Criar Credenciais OAuth 2.0

1. No menu lateral, vá em **"APIs e Serviços"** → **"Credenciais"** (Credentials)
2. No topo, clique em **"+ Criar Credenciais"** → **"ID do cliente OAuth"** (OAuth client ID)
3. Se aparecer um aviso sobre configuração, clique em **"Configurar tela de consentimento"** e volte depois

4. **Tipo de aplicativo:**
   - Escolha **"Aplicativo da Web"** (Web application)

5. **Nome:**
   - Dê um nome: `Vaquejada Web App`

6. **Origens JavaScript autorizadas:**
   - Adicione:
     ```
     http://localhost:3000
     ```
   - Em produção, adicione também:
     ```
     https://seudominio.com
     ```

7. **URIs de redirecionamento autorizados:**
   - Adicione:
     ```
     http://localhost:3000/api/auth/callback/google
     ```
   - Em produção, adicione também:
     ```
     https://seudominio.com/api/auth/callback/google
     ```

8. Clique em **"Criar"** (Create)

9. **IMPORTANTE:** Uma janela aparecerá com:
   - **ID do cliente** (Client ID)
   - **Segredo do cliente** (Client secret)
   
   ⚠️ **COPIE ESSES VALORES AGORA!** Você não conseguirá ver o secret novamente!
   
   - Clique em **"OK"**

---

## 📝 Passo 5: Copiar Credenciais

Você terá algo assim:

```
ID do cliente:
123456789-abcdefghijklmnop.apps.googleusercontent.com

Segredo do cliente:
GOCSPX-abcdefghijklmnopqrstuvwxyz
```

**Guarde esses valores em local seguro!**

---

## ✅ Passo 6: Verificar Se Está Tudo OK

1. Volte para **"Credenciais"**
2. Você deve ver seu **"ID do cliente OAuth"** listado
3. Clique no nome para editar se precisar ajustar URLs

---

## 🎯 Próximos Passos

Agora que você tem as credenciais:

1. **Adicione ao `.env.local`:**
   ```env
   GOOGLE_CLIENT_ID=seu-client-id-aqui
   GOOGLE_CLIENT_SECRET=seu-client-secret-aqui
   ```

2. **Vou configurar o código** para usar essas credenciais

---

## 🔒 Segurança

### Em Desenvolvimento:
- ✅ Use `http://localhost:3000`
- ✅ Credenciais podem ficar no `.env.local`

### Em Produção:
- ⚠️ Use HTTPS obrigatório
- ⚠️ Adicione seu domínio real nas URLs autorizadas
- ⚠️ Publique a tela de consentimento OAuth
- ⚠️ Configure domínio verificado no Google

---

## ❓ Troubleshooting

### Erro: "redirect_uri_mismatch"
- Verifique se a URL está EXATAMENTE igual nas configurações
- Inclua `http://` ou `https://`
- Verifique se não tem `/` no final

### Erro: "access_denied"
- Verifique se a tela de consentimento está configurada
- Adicione seu email como usuário de teste
- Publique a tela de consentimento se necessário

### Não consigo ver o Client Secret
- O secret só aparece uma vez
- Se perder, crie uma nova credencial

---

## 📸 Screenshots de Referência

**Tela de Consentimento:**
- Nome do app
- Email de suporte
- Logo (opcional)

**Credenciais:**
- Tipo: Aplicativo da Web
- Origens JavaScript: `http://localhost:3000`
- URIs de redirecionamento: `http://localhost:3000/api/auth/callback/google`

---

## 🎉 Pronto!

Quando terminar, me avise e eu:
1. ✅ Configuro o código para usar essas credenciais
2. ✅ Implemento o login com Google
3. ✅ Testo tudo funcionando

**Precisa de ajuda em algum passo específico?**

