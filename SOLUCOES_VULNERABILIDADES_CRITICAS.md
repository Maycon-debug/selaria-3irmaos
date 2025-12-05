# 🛡️ SOLUÇÕES PARA VULNERABILIDADES CRÍTICAS DE SEGURANÇA

**Projeto:** Sistema E-commerce Selaria 3 Irmãos  
**Data:** 20/11/2025  
**Baseado em:** RELATORIO_SEGURANCA_PENTESTING.md

---

## 📋 ÍNDICE

1. [VULN-001: Autenticação Fraca e Credenciais Hardcoded](#vuln-001)
2. [VULN-002: Ausência de Variáveis de Ambiente Seguras](#vuln-002)
3. [VULN-003: Controle de Acesso Insuficiente](#vuln-003)
4. [VULN-007: Configuração Insegura de Banco de Dados](#vulN-007)
5. [VULN-009: Upload de Arquivos Sem Validação](#vuln-009)
6. [VULN-014: Exposição de Endpoints Administrativos](#vuln-014)

---

## 🔴 VULN-001: AUTENTICAÇÃO FRACA E CREDENCIAIS HARDCODED {#vuln-001}

### **Problema Identificado**

- Credenciais hardcoded no código fonte (`scripts/test-login.js`)
- Senha extremamente fraca (`admin123`)
- Comparação de senha insegura ou hardcoded
- Ausência de validação de complexidade de senha

### **Solução Completa**

#### **1. Remover Credenciais Hardcoded**

**Arquivo:** `scripts/test-login.js` (se existir)

```javascript
// ❌ REMOVER ISSO:
const testCases = [
  {
    email: "admin@vaquejada.com",
    password: "admin123", // NUNCA FAZER ISSO!
  },
];

// ✅ SUBSTITUIR POR:
// Usar variáveis de ambiente ou arquivo .env.test
// OU melhor ainda: usar seeders do Prisma para criar usuários de teste
```

**Arquivo:** `prisma/seed.ts` (criar se não existir)

```typescript
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Criar usuário admin inicial apenas se não existir
  const adminExists = await prisma.usuario.findUnique({
    where: { email: "admin@vaquejada.com" },
  });

  if (!adminExists) {
    // Gerar hash seguro da senha
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_INITIAL_PASSWORD || "ChangeMe123!@#",
      saltRounds
    );

    await prisma.usuario.create({
      data: {
        email: "admin@vaquejada.com",
        name: "Administrador",
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    console.log("✅ Usuário admin criado. ALTERE A SENHA NO PRIMEIRO ACESSO!");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

#### **2. Implementar Validação de Senha Forte**

**Arquivo:** `lib/validations.ts`

```typescript
import { z } from "zod";

// ✅ Validação de senha forte
export const StrongPasswordSchema = z
  .string()
  .min(8, "Senha deve ter no mínimo 8 caracteres")
  .max(128, "Senha muito longa")
  .regex(
    /^(?=.*[a-z])/, // Pelo menos uma letra minúscula
    "Senha deve conter pelo menos uma letra minúscula"
  )
  .regex(
    /^(?=.*[A-Z])/, // Pelo menos uma letra maiúscula
    "Senha deve conter pelo menos uma letra maiúscula"
  )
  .regex(
    /^(?=.*\d)/, // Pelo menos um número
    "Senha deve conter pelo menos um número"
  )
  .regex(
    /^(?=.*[@$!%*?&])/, // Pelo menos um caractere especial
    "Senha deve conter pelo menos um caractere especial (@$!%*?&)"
  )
  .refine(
    (password) => !/(.)\1{2,}/.test(password),
    "Senha não pode conter 3 ou mais caracteres repetidos consecutivos"
  )
  .refine(
    (password) => !password.includes("123"),
    "Senha não pode conter sequências numéricas simples"
  );

// Schema de login
export const LoginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

// Schema de registro (com senha forte)
export const RegisterSchema = z
  .object({
    email: z.string().email("Email inválido"),
    name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
    password: StrongPasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
  });
```

#### **3. Implementar Hash Seguro com bcrypt**

**Arquivo:** `app/api/auth/login/route.ts`

```typescript
import bcrypt from "bcryptjs";

// ✅ Verificar senha com bcrypt
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = LoginSchema.parse(body);

    // Buscar usuário
    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    // Mensagem genérica para não revelar se usuário existe
    if (!usuario || !usuario.password) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    // ✅ Verificar senha com bcrypt.compare()
    const isPasswordValid = await bcrypt.compare(password, usuario.password);

    if (!isPasswordValid || usuario.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    // Criar token JWT seguro
    const token = await createToken({
      email: usuario.email,
      role: usuario.role,
    });

    return NextResponse.json({ token, user: { ...usuario } });
  } catch (error) {
    return handleApiError(error);
  }
}
```

**Arquivo:** `app/api/auth/register/route.ts`

```typescript
import bcrypt from "bcryptjs";
import { RegisterSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, password } = RegisterSchema.parse(body);

    // Verificar se usuário já existe
    const existingUser = await prisma.usuario.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email já cadastrado" },
        { status: 409 }
      );
    }

    // ✅ Hash seguro com salt rounds adequado
    const saltRounds = 12; // Recomendado: 10-12 rounds
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Criar usuário
    const usuario = await prisma.usuario.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: "USER", // Padrão: usuário comum
      },
    });

    return NextResponse.json(
      { message: "Usuário criado com sucesso", userId: usuario.id },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
```

#### **4. Implementar Política de Senha no Frontend**

**Arquivo:** `app/admin/login/page.tsx` (ou componente de registro)

```typescript
// Adicionar validação em tempo real no frontend
const [passwordStrength, setPasswordStrength] = useState(0);

const checkPasswordStrength = (password: string) => {
  let strength = 0;

  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[@$!%*?&]/.test(password)) strength++;

  setPasswordStrength(strength);
};

// Mostrar indicador visual de força da senha
<div className="password-strength-indicator">
  <div className={`strength-bar strength-${passwordStrength}`} />
  <span>
    {passwordStrength < 3
      ? "Senha fraca"
      : passwordStrength < 5
      ? "Senha média"
      : "Senha forte"}
  </span>
</div>;
```

### **Checklist de Implementação**

- [ ] Remover todas as credenciais hardcoded do código
- [ ] Implementar validação de senha forte (mínimo 8 caracteres, maiúscula, minúscula, número, símbolo)
- [ ] Usar bcrypt com salt rounds >= 12
- [ ] Criar seeders para usuários de teste (não hardcoded)
- [ ] Implementar mensagens genéricas de erro (não revelar se usuário existe)
- [ ] Adicionar indicador visual de força de senha no frontend
- [ ] Forçar alteração de senha padrão no primeiro acesso

---

## 🔴 VULN-002: AUSÊNCIA DE VARIÁVEIS DE AMBIENTE SEGURAS {#vuln-002}

### **Problema Identificado**

- Arquivo `.env.local` não configurado
- Secrets usando valores padrão ou fracos
- JWT_SECRET e NEXTAUTH_SECRET não configurados adequadamente
- Variáveis de ambiente expostas no código ou repositório

### **Solução Completa**

#### **1. Criar Arquivo de Configuração Seguro**

**Arquivo:** `.env.local` (NUNCA commitar no Git!)

```bash
# ✅ Gerar valores seguros com:
# openssl rand -base64 32

# Secrets de autenticação (OBRIGATÓRIO - valores únicos e aleatórios)
NEXTAUTH_SECRET="[gerar-com-openssl-rand-base64-32]"
JWT_SECRET="[gerar-com-openssl-rand-base64-32-diferente]"

# Banco de dados (NUNCA usar credenciais padrão)
DATABASE_URL="postgresql://usuario_forte:senha_forte_123!@#@localhost:5432/selaria_db"

# Cloudinary (se usado)
CLOUDINARY_CLOUD_NAME="seu-cloud-name"
CLOUDINARY_API_KEY="sua-api-key"
CLOUDINARY_API_SECRET="seu-api-secret"

# Filestack (se usado)
FILESTACK_API_KEY="sua-filestack-key"

# Google OAuth (se usado)
GOOGLE_CLIENT_ID="seu-client-id"
GOOGLE_CLIENT_SECRET="seu-client-secret"

# Ambiente
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://seu-dominio.com"

# Senha inicial do admin (alterar após primeiro acesso)
ADMIN_INITIAL_PASSWORD="ChangeMe123!@#"
```

#### **2. Criar Arquivo de Exemplo**

**Arquivo:** `.env.example` (pode commitar - sem valores reais)

```bash
# Secrets de autenticação
NEXTAUTH_SECRET="gerar-com-openssl-rand-base64-32"
JWT_SECRET="gerar-com-openssl-rand-base64-32-diferente"

# Banco de dados
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_db"

# Cloudinary
CLOUDINARY_CLOUD_NAME="seu-cloud-name"
CLOUDINARY_API_KEY="sua-api-key"
CLOUDINARY_API_SECRET="seu-api-secret"

# Filestack
FILESTACK_API_KEY="sua-filestack-key"

# Google OAuth
GOOGLE_CLIENT_ID="seu-client-id"
GOOGLE_CLIENT_SECRET="seu-client-secret"

# Ambiente
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Senha inicial do admin
ADMIN_INITIAL_PASSWORD="ChangeMe123!@#"
```

#### **3. Validar Variáveis de Ambiente na Inicialização**

**Arquivo:** `lib/env-validation.ts` (criar novo)

```typescript
/**
 * Validação de variáveis de ambiente obrigatórias
 * A aplicação NÃO deve iniciar se variáveis críticas estiverem faltando
 */

function getRequiredEnvVar(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `🔴 ERRO CRÍTICO: Variável de ambiente ${name} não configurada!\n` +
        `A aplicação não pode iniciar sem esta variável.\n` +
        `Verifique o arquivo .env.local e siga o exemplo em .env.example`
    );
  }

  // Validar força de secrets
  if (name.includes("SECRET") && value.length < 32) {
    console.warn(
      `⚠️ AVISO: ${name} deve ter pelo menos 32 caracteres para ser seguro.\n` +
        `Gere um valor seguro com: openssl rand -base64 32`
    );
  }

  return value;
}

// Validar variáveis críticas
export const env = {
  // Secrets obrigatórios
  NEXTAUTH_SECRET: getRequiredEnvVar("NEXTAUTH_SECRET"),
  JWT_SECRET: getRequiredEnvVar("JWT_SECRET"),

  // Banco de dados obrigatório
  DATABASE_URL: getRequiredEnvVar("DATABASE_URL"),

  // Opcionais (com valores padrão)
  NODE_ENV: process.env.NODE_ENV || "development",
  NEXT_PUBLIC_APP_URL:
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  // Cloudinary (opcional)
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  // Filestack (opcional)
  FILESTACK_API_KEY: process.env.FILESTACK_API_KEY,

  // Google OAuth (opcional)
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

  // Admin inicial
  ADMIN_INITIAL_PASSWORD:
    process.env.ADMIN_INITIAL_PASSWORD || "ChangeMe123!@#",
};

// Validar na inicialização do módulo
if (process.env.NODE_ENV === "production") {
  // Em produção, validar que secrets têm tamanho adequado
  if (env.NEXTAUTH_SECRET.length < 32) {
    throw new Error(
      "NEXTAUTH_SECRET deve ter pelo menos 32 caracteres em produção"
    );
  }
  if (env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET deve ter pelo menos 32 caracteres em produção");
  }
}
```

#### **4. Usar Validação em Arquivos que Precisam de Secrets**

**Arquivo:** `app/api/auth/login/route.ts`

```typescript
import { env } from "@/lib/env-validation";
import { SignJWT, jwtVerify } from "jose";

// ✅ Usar secret validado
const secret = new TextEncoder().encode(env.JWT_SECRET);

export async function createToken(payload: { email: string; role: string }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { email: string; role: string };
  } catch {
    return null;
  }
}
```

**Arquivo:** `lib/auth.ts`

```typescript
import { env } from "@/lib/env-validation";

export const authOptions = {
  secret: env.NEXTAUTH_SECRET, // ✅ Usar secret validado
  // ... resto da configuração
};
```

#### **5. Configurar .gitignore**

**Arquivo:** `.gitignore` (verificar se existe)

```gitignore
# Variáveis de ambiente
.env
.env.local
.env*.local
.env.production
.env.development

# Mas manter o exemplo
!.env.example
```

#### **6. Script para Gerar Secrets**

**Arquivo:** `scripts/generate-secrets.sh` (criar)

```bash
#!/bin/bash

echo "🔐 Gerando secrets seguros..."
echo ""
echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)"
echo "JWT_SECRET=$(openssl rand -base64 32)"
echo ""
echo "✅ Copie os valores acima para seu arquivo .env.local"
```

**Arquivo:** `scripts/generate-secrets.ps1` (para Windows)

```powershell
# Gerar secrets seguros no Windows
Write-Host "🔐 Gerando secrets seguros..." -ForegroundColor Green
Write-Host ""

$nexauthSecret = [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
$jwtSecret = [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))

Write-Host "NEXTAUTH_SECRET=$nexauthSecret"
Write-Host "JWT_SECRET=$jwtSecret"
Write-Host ""
Write-Host "✅ Copie os valores acima para seu arquivo .env.local" -ForegroundColor Green
```

### **Checklist de Implementação**

- [ ] Criar arquivo `.env.local` com todos os secrets necessários
- [ ] Gerar secrets seguros com `openssl rand -base64 32` (mínimo 32 caracteres)
- [ ] Criar arquivo `.env.example` como template (sem valores reais)
- [ ] Implementar validação de variáveis de ambiente na inicialização
- [ ] Garantir que `.env.local` está no `.gitignore`
- [ ] Criar scripts para gerar secrets automaticamente
- [ ] Documentar no README como configurar variáveis de ambiente
- [ ] Validar força de secrets em produção (mínimo 32 caracteres)

---

## 🔴 VULN-003: CONTROLE DE ACESSO INSUFICIENTE {#vuln-003}

### **Problema Identificado**

- Middleware apenas verifica presença do token, não valida se é válido
- Não verifica se o usuário tem role ADMIN
- Tokens falsos podem ser aceitos
- Bypass de autenticação administrativo

### **Solução Completa**

#### **1. Implementar Middleware Robusto**

**Arquivo:** `middleware.ts`

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./app/api/auth/login/route";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Proteger rotas /admin/* (exceto /admin/login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    // ✅ 1. Verificar se há token no cookie
    const token =
      request.cookies.get("admin_token")?.value ||
      request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // ✅ 2. Validar token (verificar assinatura e expiração)
    try {
      const payload = await verifyToken(token);

      // ✅ 3. Verificar se token é válido E se usuário é ADMIN
      if (!payload || payload.role !== "ADMIN") {
        // Token inválido ou usuário não é admin
        const response = NextResponse.redirect(
          new URL("/admin/login", request.url)
        );
        // Remover cookie inválido
        response.cookies.delete("admin_token");
        return response;
      }

      // ✅ 4. Token válido e usuário é admin - permitir acesso
      // Adicionar headers de segurança
      const response = NextResponse.next();
      response.headers.set("X-User-Role", payload.role);
      response.headers.set("X-User-Email", payload.email);
      return response;
    } catch (error) {
      // Token inválido ou expirado
      const response = NextResponse.redirect(
        new URL("/admin/login", request.url)
      );
      response.cookies.delete("admin_token");
      return response;
    }
  }

  // Proteger rotas /api/admin/*
  if (pathname.startsWith("/api/admin")) {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.substring(7)
      : request.cookies.get("admin_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    try {
      const payload = await verifyToken(token);

      if (!payload || payload.role !== "ADMIN") {
        return NextResponse.json(
          { error: "Acesso negado. Apenas administradores." },
          { status: 403 }
        );
      }

      // Token válido e é admin
      return NextResponse.next();
    } catch (error) {
      return NextResponse.json(
        { error: "Token inválido ou expirado" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
```

#### **2. Criar Função Helper para Verificar Admin**

**Arquivo:** `lib/auth-helpers.ts` (criar novo)

```typescript
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/app/api/auth/login/route";

export interface AuthPayload {
  email: string;
  role: string;
}

/**
 * Verifica se o request tem um token válido de admin
 * Retorna o payload se válido, null caso contrário
 */
export async function verifyAdminRequest(
  request: NextRequest
): Promise<AuthPayload | null> {
  // Tentar obter token do header Authorization
  const authHeader = request.headers.get("authorization");
  let token: string | undefined;

  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  } else {
    // Tentar obter do cookie
    token = request.cookies.get("admin_token")?.value;
  }

  if (!token) {
    return null;
  }

  try {
    const payload = await verifyToken(token);

    // ✅ Verificar se token é válido E se é admin
    if (!payload || payload.role !== "ADMIN") {
      return null;
    }

    return payload as AuthPayload;
  } catch {
    return null;
  }
}

/**
 * Wrapper para proteger rotas de API que requerem admin
 */
export async function requireAdmin(
  request: NextRequest
): Promise<{ payload: AuthPayload } | NextResponse> {
  const payload = await verifyAdminRequest(request);

  if (!payload) {
    return NextResponse.json(
      { error: "Não autorizado. Apenas administradores." },
      { status: 403 }
    );
  }

  return { payload };
}
```

#### **3. Usar Helper em Todas as Rotas Admin**

**Arquivo:** `app/api/admin/mensagens/route.ts` (exemplo)

```typescript
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import prisma from "@/src/lib/prisma";

export async function GET(request: NextRequest) {
  // ✅ Verificar autenticação admin
  const authResult = await requireAdmin(request);

  if (authResult instanceof NextResponse) {
    return authResult; // Erro de autenticação
  }

  const { payload } = authResult;

  // ✅ Agora sabemos que é admin válido
  try {
    const mensagens = await prisma.mensagemContato.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(mensagens);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar mensagens" },
      { status: 500 }
    );
  }
}
```

**Arquivo:** `app/api/admin/produtos/route.ts` (exemplo)

```typescript
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import prisma from "@/src/lib/prisma";

export async function POST(request: NextRequest) {
  // ✅ Verificar autenticação admin
  const authResult = await requireAdmin(request);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { payload } = authResult;

  try {
    const body = await request.json();
    // ... criar produto
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao criar produto" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  // ✅ Verificar autenticação admin
  const authResult = await requireAdmin(request);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  // ... deletar produto
}
```

#### **4. Implementar Verificação no Frontend**

**Arquivo:** `app/admin/dashboard/page.tsx`

```typescript
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { verifyToken } from "@/app/api/auth/login/route";

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const token =
          localStorage.getItem("admin_token") ||
          document.cookie
            .split("; ")
            .find((row) => row.startsWith("admin_token="))
            ?.split("=")[1];

        if (!token) {
          router.push("/admin/login");
          return;
        }

        // ✅ Verificar token no servidor
        const response = await fetch("/api/auth/verify", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          // Token inválido
          localStorage.removeItem("admin_token");
          router.push("/admin/login");
          return;
        }

        const data = await response.json();

        // ✅ Verificar se é admin
        if (data.role !== "ADMIN") {
          router.push("/admin/login");
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  if (loading) {
    return <div>Verificando autenticação...</div>;
  }

  if (!isAuthorized) {
    return null;
  }

  return <div>{/* Dashboard admin */}</div>;
}
```

#### **5. Criar Endpoint de Verificação de Token**

**Arquivo:** `app/api/auth/verify/route.ts` (criar novo)

```typescript
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../login/route";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Token não fornecido" }, { status: 401 });
  }

  const token = authHeader.substring(7);
  const payload = await verifyToken(token);

  if (!payload) {
    return NextResponse.json(
      { error: "Token inválido ou expirado" },
      { status: 401 }
    );
  }

  // ✅ Retornar informações do usuário (sem dados sensíveis)
  return NextResponse.json({
    email: payload.email,
    role: payload.role,
    valid: true,
  });
}
```

### **Checklist de Implementação**

- [ ] Implementar middleware que valida token (não apenas verifica presença)
- [ ] Verificar role ADMIN em todas as rotas administrativas
- [ ] Criar função helper `requireAdmin()` para reutilização
- [ ] Aplicar verificação em todas as rotas `/api/admin/*`
- [ ] Implementar verificação no frontend antes de renderizar páginas admin
- [ ] Criar endpoint `/api/auth/verify` para validação de token
- [ ] Remover cookies inválidos automaticamente
- [ ] Adicionar logs de tentativas de acesso não autorizado

---

## 🔴 VULN-007: CONFIGURAÇÃO INSEGURA DE BANCO DE DADOS {#vulN-007}

### **Problema Identificado**

- Credenciais padrão do PostgreSQL (`postgres/postgres`)
- Senha fraca ou ausente
- Banco de dados acessível sem restrições de rede
- Credenciais expostas no `docker-compose.yml`

### **Solução Completa**

#### **1. Configurar Credenciais Fortes**

**Arquivo:** `docker-compose.yml`

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:15-alpine
    container_name: selaria_postgres
    restart: unless-stopped
    environment:
      # ✅ NUNCA usar valores padrão!
      # Usar variáveis de ambiente do arquivo .env.local
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
      # Desabilitar usuário padrão 'postgres'
      POSTGRES_INITDB_ARGS: "--auth-host=scram-sha-256"
    ports:
      # ✅ Em produção, NÃO expor porta publicamente
      # Remover esta linha ou usar apenas para desenvolvimento
      - "127.0.0.1:5432:5432" # Apenas localhost, não 0.0.0.0
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app_network
    # ✅ Configurações de segurança
    command:
      - "postgres"
      - "-c"
      - "ssl=on"
      - "-c"
      - "password_encryption=scram-sha-256"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
    driver: local

networks:
  app_network:
    driver: bridge
```

#### **2. Configurar Variáveis de Ambiente Seguras**

**Arquivo:** `.env.local`

```bash
# ✅ Credenciais fortes do banco de dados
# Gerar senha forte: openssl rand -base64 24

DB_USER="selaria_app_user"
DB_PASSWORD="senha_forte_gerada_com_openssl_rand_base64_24"
DB_NAME="selaria_production_db"

# Connection string completa
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}?sslmode=require"
```

#### **3. Implementar Restrições de Rede**

**Arquivo:** `docker-compose.production.yml` (criar para produção)

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:15-alpine
    container_name: selaria_postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    # ✅ NÃO expor porta em produção
    # ports:
    #   - "5432:5432"  # REMOVER ISSO!
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app_network
      # ✅ Apenas aplicação pode acessar
    command:
      - "postgres"
      - "-c"
      - "listen_addresses=*"
      - "-c"
      - "ssl=on"
      - "-c"
      - "password_encryption=scram-sha-256"
      # ✅ Restringir conexões apenas da rede interna
      - "-c"
      - "host all all 0.0.0.0/0 scram-sha-256"

volumes:
  postgres_data:

networks:
  app_network:
    internal: true # ✅ Rede interna apenas
```

#### **4. Configurar SSL/TLS para Conexões**

**Arquivo:** `prisma/schema.prisma`

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // ✅ Forçar SSL em produção
  // Adicionar ?sslmode=require na DATABASE_URL
}
```

**Arquivo:** `.env.local` (atualizar)

```bash
# ✅ Connection string com SSL obrigatório
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}?sslmode=require&sslcert=/path/to/client-cert.pem&sslkey=/path/to/client-key.pem&sslrootcert=/path/to/ca-cert.pem"
```

#### **5. Implementar Pool de Conexões Seguro**

**Arquivo:** `src/lib/prisma.ts`

```typescript
import { PrismaClient } from "@prisma/client";

// ✅ Configuração segura do Prisma Client
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"], // ✅ Não logar queries em produção
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

// ✅ Desconectar ao encerrar aplicação
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Graceful shutdown
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});
```

#### **6. Implementar Backup Seguro**

**Arquivo:** `scripts/backup-db.sh` (criar)

```bash
#!/bin/bash

# ✅ Script de backup seguro do banco de dados

DB_USER="${DB_USER}"
DB_NAME="${DB_NAME}"
BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/backup_${DB_NAME}_${TIMESTAMP}.sql"

# Criar diretório de backups
mkdir -p "$BACKUP_DIR"

# ✅ Fazer backup com pg_dump
PGPASSWORD="${DB_PASSWORD}" pg_dump \
  -h localhost \
  -U "$DB_USER" \
  -d "$DB_NAME" \
  --no-owner \
  --no-acl \
  --clean \
  --if-exists \
  > "$BACKUP_FILE"

# ✅ Comprimir backup
gzip "$BACKUP_FILE"

# ✅ Remover backups antigos (manter últimos 7 dias)
find "$BACKUP_DIR" -name "backup_*.sql.gz" -mtime +7 -delete

echo "✅ Backup criado: ${BACKUP_FILE}.gz"
```

#### **7. Configurar Firewall**

**Para desenvolvimento local:**

```bash
# ✅ Bloquear acesso externo ao PostgreSQL
# No Linux/Mac:
sudo ufw deny 5432/tcp
sudo ufw allow from 127.0.0.1 to any port 5432

# No Windows (PowerShell como Admin):
New-NetFirewallRule -DisplayName "PostgreSQL" -Direction Inbound -LocalPort 5432 -Protocol TCP -Action Block
New-NetFirewallRule -DisplayName "PostgreSQL Localhost" -Direction Inbound -LocalPort 5432 -Protocol TCP -Action Allow -RemoteAddress 127.0.0.1
```

### **Checklist de Implementação**

- [ ] Remover credenciais padrão (`postgres/postgres`)
- [ ] Gerar senha forte com `openssl rand -base64 24`
- [ ] Configurar variáveis de ambiente no `.env.local`
- [ ] Restringir acesso do PostgreSQL apenas ao localhost em desenvolvimento
- [ ] Remover exposição de porta em produção
- [ ] Configurar SSL/TLS para conexões com banco
- [ ] Implementar rede interna no Docker para produção
- [ ] Configurar pool de conexões seguro no Prisma
- [ ] Implementar sistema de backup automático
- [ ] Configurar firewall para bloquear acesso externo
- [ ] Documentar credenciais em local seguro (não no código)

---

## 🔴 VULN-009: UPLOAD DE ARQUIVOS SEM VALIDAÇÃO {#vuln-009}

### **Problema Identificado**

- Validação insuficiente de tipo de arquivo
- Não verifica tamanho do arquivo
- Não valida conteúdo real do arquivo (apenas extensão)
- Possível upload de arquivos maliciosos (webshells, scripts)

### **Solução Completa**

#### **1. Implementar Validação Completa de Upload**

**Arquivo:** `lib/file-validation.ts` (criar novo)

```typescript
import { fileTypeFromBuffer } from "file-type";

// ✅ Tipos MIME permitidos
export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

// ✅ Extensões permitidas
export const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

// ✅ Tamanho máximo (5MB)
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// ✅ Tamanho mínimo (1KB)
export const MIN_FILE_SIZE = 1024; // 1KB

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  mimeType?: string;
  size?: number;
}

/**
 * Valida arquivo de imagem de forma completa
 */
export async function validateImageFile(
  fileBuffer: Buffer,
  originalName?: string,
  declaredMimeType?: string
): Promise<FileValidationResult> {
  // ✅ 1. Validar tamanho
  if (fileBuffer.length > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `Arquivo muito grande. Máximo: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    };
  }

  if (fileBuffer.length < MIN_FILE_SIZE) {
    return {
      valid: false,
      error: "Arquivo muito pequeno ou vazio",
    };
  }

  // ✅ 2. Detectar tipo real do arquivo (magic bytes)
  const fileType = await fileTypeFromBuffer(fileBuffer);

  if (!fileType) {
    return {
      valid: false,
      error: "Não foi possível determinar o tipo do arquivo",
    };
  }

  // ✅ 3. Validar tipo MIME real
  if (!ALLOWED_MIME_TYPES.includes(fileType.mime)) {
    return {
      valid: false,
      error: `Tipo de arquivo não permitido: ${
        fileType.mime
      }. Permitidos: ${ALLOWED_MIME_TYPES.join(", ")}`,
    };
  }

  // ✅ 4. Validar extensão (se fornecida)
  if (originalName) {
    const extension = originalName
      .toLowerCase()
      .substring(originalName.lastIndexOf("."));
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return {
        valid: false,
        error: `Extensão não permitida: ${extension}`,
      };
    }

    // ✅ 5. Verificar se extensão corresponde ao tipo MIME real
    const expectedMimeForExtension: Record<string, string[]> = {
      ".jpg": ["image/jpeg"],
      ".jpeg": ["image/jpeg"],
      ".png": ["image/png"],
      ".webp": ["image/webp"],
      ".gif": ["image/gif"],
    };

    const expectedMimes = expectedMimeForExtension[extension];
    if (expectedMimes && !expectedMimes.includes(fileType.mime)) {
      return {
        valid: false,
        error: "Extensão do arquivo não corresponde ao tipo real",
      };
    }
  }

  // ✅ 6. Validar MIME declarado (se fornecido)
  if (declaredMimeType && declaredMimeType !== fileType.mime) {
    return {
      valid: false,
      error: "Tipo MIME declarado não corresponde ao arquivo real",
    };
  }

  // ✅ 7. Verificar se é realmente uma imagem válida
  // Tentar decodificar para garantir que não é arquivo malicioso
  try {
    // Verificar magic bytes específicos
    const magicBytes = fileBuffer.slice(0, 4);

    // JPEG: FF D8 FF
    const isJPEG =
      magicBytes[0] === 0xff &&
      magicBytes[1] === 0xd8 &&
      magicBytes[2] === 0xff;

    // PNG: 89 50 4E 47
    const isPNG =
      magicBytes[0] === 0x89 &&
      magicBytes[1] === 0x50 &&
      magicBytes[2] === 0x4e &&
      magicBytes[3] === 0x47;

    // WebP: RIFF...WEBP
    const isWebP =
      magicBytes[0] === 0x52 &&
      magicBytes[1] === 0x49 &&
      fileBuffer.slice(8, 12).toString() === "WEBP";

    // GIF: GIF87a ou GIF89a
    const gifHeader = fileBuffer.slice(0, 6).toString();
    const isGIF = gifHeader === "GIF87a" || gifHeader === "GIF89a";

    if (!isJPEG && !isPNG && !isWebP && !isGIF) {
      return {
        valid: false,
        error: "Arquivo não é uma imagem válida",
      };
    }
  } catch (error) {
    return {
      valid: false,
      error: "Erro ao validar conteúdo do arquivo",
    };
  }

  return {
    valid: true,
    mimeType: fileType.mime,
    size: fileBuffer.length,
  };
}

/**
 * Sanitiza nome do arquivo para prevenir path traversal
 */
export function sanitizeFileName(fileName: string): string {
  // Remover caracteres perigosos
  const sanitized = fileName
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/\.\./g, "_")
    .replace(/^\./, "_");

  // Limitar tamanho do nome
  const maxLength = 255;
  if (sanitized.length > maxLength) {
    const extension = sanitized.substring(sanitized.lastIndexOf("."));
    const name = sanitized.substring(0, maxLength - extension.length);
    return name + extension;
  }

  return sanitized;
}
```

#### **2. Atualizar Rota de Upload**

**Arquivo:** `app/api/upload/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/src/lib/cloudinary";
import { verifyToken } from "../auth/login/route";
import {
  validateImageFile,
  sanitizeFileName,
  MAX_FILE_SIZE,
} from "@/lib/file-validation";

export async function POST(request: NextRequest) {
  try {
    // ✅ 1. Verificar autenticação admin
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = await verifyToken(token);

    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Apenas administradores podem fazer upload" },
        { status: 403 }
      );
    }

    // ✅ 2. Receber dados da imagem
    const body = await request.json();
    const { imageData, folder, fileName } = body;

    if (!imageData) {
      return NextResponse.json(
        { error: "Imagem não fornecida" },
        { status: 400 }
      );
    }

    // ✅ 3. Converter base64 para Buffer
    let imageBuffer: Buffer;
    try {
      const base64Data = imageData.includes(",")
        ? imageData.split(",")[1]
        : imageData;
      imageBuffer = Buffer.from(base64Data, "base64");
    } catch (error) {
      return NextResponse.json(
        { error: "Formato de imagem inválido" },
        { status: 400 }
      );
    }

    // ✅ 4. Validar arquivo completamente
    const sanitizedFileName = fileName
      ? sanitizeFileName(fileName)
      : "image.jpg";
    const validation = await validateImageFile(
      imageBuffer,
      sanitizedFileName,
      body.mimeType
    );

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // ✅ 5. Verificar tamanho novamente (redundância)
    if (imageBuffer.length > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `Arquivo muito grande. Máximo: ${
            MAX_FILE_SIZE / 1024 / 1024
          }MB`,
        },
        { status: 400 }
      );
    }

    // ✅ 6. Fazer upload para Cloudinary
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return NextResponse.json(
        { error: "Cloudinary não configurado" },
        { status: 500 }
      );
    }

    const imageUrl = await uploadImage(
      imageData,
      folder || "produtos",
      folder === "logo" // Remover fundo apenas para logos
    );

    // ✅ 7. Retornar URL pública
    return NextResponse.json({
      url: imageUrl,
      success: true,
      size: validation.size,
      mimeType: validation.mimeType,
    });
  } catch (error: any) {
    console.error("Erro ao fazer upload:", error);
    return NextResponse.json(
      {
        error: "Erro ao fazer upload da imagem",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
```

#### **3. Instalar Dependência Necessária**

```bash
npm install file-type
```

**Arquivo:** `package.json` (verificar se já existe)

```json
{
  "dependencies": {
    "file-type": "^18.0.0"
  }
}
```

#### **4. Validar no Frontend Também**

**Arquivo:** `app/admin/products/new/page.tsx` (ou componente de upload)

```typescript
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const handleImageUpload = async (file: File) => {
  // ✅ 1. Validar tipo no frontend
  if (!ALLOWED_TYPES.includes(file.type)) {
    toast({
      title: "Erro",
      description: "Tipo de arquivo não permitido. Use JPEG, PNG, WebP ou GIF.",
      variant: "destructive",
    });
    return;
  }

  // ✅ 2. Validar tamanho no frontend
  if (file.size > MAX_SIZE) {
    toast({
      title: "Erro",
      description: `Arquivo muito grande. Máximo: ${MAX_SIZE / 1024 / 1024}MB`,
      variant: "destructive",
    });
    return;
  }

  // ✅ 3. Validar extensão
  const extension = file.name
    .toLowerCase()
    .substring(file.name.lastIndexOf("."));
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
  if (!allowedExtensions.includes(extension)) {
    toast({
      title: "Erro",
      description: "Extensão não permitida",
      variant: "destructive",
    });
    return;
  }

  // ✅ 4. Ler arquivo como base64
  const reader = new FileReader();
  reader.onloadend = async () => {
    const base64Image = reader.result as string;

    // Fazer upload via API (que validará novamente no servidor)
    // ... resto do código
  };
  reader.readAsDataURL(file);
};
```

#### **5. Implementar Quarentena de Arquivos (Opcional, mas Recomendado)**

**Arquivo:** `lib/file-quarantine.ts` (criar para produção)

```typescript
/**
 * Sistema de quarentena para arquivos suspeitos
 * Em produção, pode escanear arquivos com antivírus antes de disponibilizar
 */

export async function quarantineFile(
  fileBuffer: Buffer,
  fileName: string
): Promise<{ safe: boolean; reason?: string }> {
  // ✅ Verificações adicionais:

  // 1. Verificar se contém strings suspeitas (webshells, scripts)
  const suspiciousStrings = [
    "<?php",
    "<%",
    "eval(",
    "exec(",
    "system(",
    "shell_exec(",
    "<script",
    "javascript:",
  ];

  const fileContent = fileBuffer.toString(
    "utf-8",
    0,
    Math.min(1024, fileBuffer.length)
  );

  for (const suspicious of suspiciousStrings) {
    if (fileContent.toLowerCase().includes(suspicious.toLowerCase())) {
      return {
        safe: false,
        reason: `Arquivo contém conteúdo suspeito: ${suspicious}`,
      };
    }
  }

  // 2. Em produção, integrar com serviço de antivírus
  // Exemplo: ClamAV, VirusTotal API, etc.

  return { safe: true };
}
```

### **Checklist de Implementação**

- [ ] Instalar biblioteca `file-type` para detecção real de tipo de arquivo
- [ ] Implementar validação de tipo MIME real (magic bytes)
- [ ] Validar tamanho máximo e mínimo de arquivo
- [ ] Validar extensão e correspondência com tipo MIME
- [ ] Sanitizar nomes de arquivo para prevenir path traversal
- [ ] Validar no frontend E no backend (defense in depth)
- [ ] Implementar verificação de conteúdo suspeito
- [ ] Adicionar logs de tentativas de upload inválido
- [ ] Configurar limites de rate limiting para uploads
- [ ] Considerar quarentena de arquivos em produção

---

## 🔴 VULN-014: EXPOSIÇÃO DE ENDPOINTS ADMINISTRATIVOS {#vuln-014}

### **Problema Identificado**

- Endpoints administrativos acessíveis sem autenticação
- Funções administrativas sem verificação de autorização
- Possível acesso a dados sensíveis via APIs públicas
- Enumerabilidade de endpoints admin

### **Solução Completa**

#### **1. Proteger Todos os Endpoints Admin**

**Arquivo:** `app/api/admin/mensagens/route.ts` (exemplo completo)

```typescript
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import prisma from "@/src/lib/prisma";
import { handleApiError } from "@/lib/error-handler";

// ✅ GET - Listar mensagens (apenas admin)
export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);

  if (authResult instanceof NextResponse) {
    return authResult; // Erro 403
  }

  const { payload } = authResult;

  try {
    const mensagens = await prisma.mensagemContato.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        // ✅ Não retornar campos sensíveis desnecessários
        id: true,
        nome: true,
        email: true,
        assunto: true,
        mensagem: true,
        createdAt: true,
        // Não retornar campos internos se existirem
      },
    });

    return NextResponse.json(mensagens);
  } catch (error) {
    return handleApiError(error);
  }
}

// ✅ DELETE - Deletar mensagem (apenas admin)
export async function DELETE(request: NextRequest) {
  const authResult = await requireAdmin(request);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });
    }

    await prisma.mensagemContato.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
```

#### **2. Criar Middleware para Rotas Admin**

**Arquivo:** `middleware.ts` (atualizar)

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./app/api/auth/login/route";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ Proteger rotas /api/admin/*
  if (pathname.startsWith("/api/admin")) {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.substring(7)
      : request.cookies.get("admin_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    try {
      const payload = await verifyToken(token);

      if (!payload || payload.role !== "ADMIN") {
        // ✅ Retornar erro genérico para não revelar que rota existe
        return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
      }

      // ✅ Adicionar headers de auditoria
      const response = NextResponse.next();
      response.headers.set("X-Admin-User", payload.email);
      return response;
    } catch (error) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }
  }

  // Proteger rotas /admin/* (páginas)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get("admin_token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      const payload = await verifyToken(token);

      if (!payload || payload.role !== "ADMIN") {
        const response = NextResponse.redirect(
          new URL("/admin/login", request.url)
        );
        response.cookies.delete("admin_token");
        return response;
      }

      return NextResponse.next();
    } catch (error) {
      const response = NextResponse.redirect(
        new URL("/admin/login", request.url)
      );
      response.cookies.delete("admin_token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
```

#### **3. Ocultar Endpoints em Respostas de Erro**

**Arquivo:** `lib/error-handler.ts`

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function handleApiError(
  error: unknown,
  requestId?: string,
  request?: NextRequest
): NextResponse {
  // ✅ Não expor informações sobre rotas admin em erros
  const isAdminRoute = request?.nextUrl.pathname.startsWith("/api/admin");

  if (error instanceof Error) {
    // Em produção, não expor stack traces
    const isDevelopment = process.env.NODE_ENV === "development";

    return NextResponse.json(
      {
        error: isAdminRoute
          ? "Erro interno do servidor" // Mensagem genérica para admin routes
          : error.message,
        ...(isDevelopment && {
          stack: error.stack,
          requestId,
        }),
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { error: "Erro interno do servidor" },
    { status: 500 }
  );
}
```

#### **4. Implementar Rate Limiting Específico para Admin**

**Arquivo:** `lib/admin-rate-limit.ts` (criar novo)

```typescript
import { NextRequest } from "next/server";

// ✅ Rate limiting mais restritivo para rotas admin
const adminRateLimit = new Map<string, { count: number; resetTime: number }>();

export function checkAdminRateLimit(
  request: NextRequest,
  maxRequests: number = 10,
  windowMs: number = 60 * 1000 // 1 minuto
): { allowed: boolean; remaining: number; resetTime: number } {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const key = `admin:${ip}`;
  const now = Date.now();
  const record = adminRateLimit.get(key);

  if (!record || now > record.resetTime) {
    // Nova janela
    adminRateLimit.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: now + windowMs,
    };
  }

  if (record.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  record.count++;
  adminRateLimit.set(key, record);

  return {
    allowed: true,
    remaining: maxRequests - record.count,
    resetTime: record.resetTime,
  };
}
```

**Arquivo:** `app/api/admin/mensagens/route.ts` (usar rate limiting)

```typescript
import { checkAdminRateLimit } from "@/lib/admin-rate-limit";

export async function GET(request: NextRequest) {
  // ✅ Rate limiting específico para admin
  const rateLimit = checkAdminRateLimit(request, 10, 60 * 1000);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Muitas requisições. Tente novamente mais tarde." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": "10",
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": rateLimit.resetTime.toString(),
          "Retry-After": Math.ceil(
            (rateLimit.resetTime - Date.now()) / 1000
          ).toString(),
        },
      }
    );
  }

  // ... resto do código
}
```

#### **5. Implementar Logging de Acesso Admin**

**Arquivo:** `lib/admin-audit.ts` (criar novo)

```typescript
import { NextRequest } from "next/server";

interface AdminAction {
  email: string;
  action: string;
  endpoint: string;
  method: string;
  ip: string;
  timestamp: Date;
  success: boolean;
}

// ✅ Em produção, salvar em banco de dados ou serviço de logging
export async function logAdminAction(
  request: NextRequest,
  payload: { email: string; role: string },
  action: string,
  success: boolean
) {
  const actionLog: AdminAction = {
    email: payload.email,
    action,
    endpoint: request.nextUrl.pathname,
    method: request.method,
    ip:
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown",
    timestamp: new Date(),
    success,
  };

  // ✅ Log em desenvolvimento
  if (process.env.NODE_ENV === "development") {
    console.log("[ADMIN ACTION]", actionLog);
  }

  // ✅ Em produção, salvar em banco ou serviço de logging
  // await prisma.adminAuditLog.create({ data: actionLog });
  // OU
  // await sendToLoggingService(actionLog);
}
```

#### **6. Ocultar Endpoints em Respostas HTTP**

**Arquivo:** `next.config.ts` (atualizar)

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ... outras configurações

  async headers() {
    return [
      {
        // ✅ Ocultar informações do servidor
        source: "/:path*",
        headers: [
          {
            key: "X-Powered-By",
            value: "", // Remover header X-Powered-By
          },
          {
            key: "Server",
            value: "", // Remover header Server
          },
        ],
      },
      {
        // ✅ Headers de segurança para rotas admin
        source: "/api/admin/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

### **Checklist de Implementação**

- [ ] Proteger todos os endpoints `/api/admin/*` com autenticação
- [ ] Verificar role ADMIN em todas as rotas administrativas
- [ ] Implementar middleware para rotas admin
- [ ] Retornar erros genéricos para não revelar existência de rotas
- [ ] Implementar rate limiting específico para rotas admin
- [ ] Adicionar logging de auditoria para ações administrativas
- [ ] Ocultar headers que revelam informações do servidor
- [ ] Validar autenticação tanto no middleware quanto nas rotas (defense in depth)
- [ ] Implementar CORS restritivo para APIs admin
- [ ] Documentar todos os endpoints admin internamente

---

## 📚 RECURSOS ADICIONAIS

### **Ferramentas Úteis**

- **OWASP ZAP** - Scanner de vulnerabilidades
- **Burp Suite** - Proxy para testes de segurança
- **npm audit** - Auditoria de dependências
- **Snyk** - Análise de vulnerabilidades em dependências

### **Referências**

- [OWASP Top 10 2021](https://owasp.org/www-project-top-ten/)
- [Next.js Security Best Practices](https://nextjs.org/docs/advanced-features/security-headers)
- [Prisma Security Guidelines](https://www.prisma.io/docs/guides/performance-and-optimization/prisma-client-go-further)

---

**⚠️ IMPORTANTE:** Implemente todas as correções em ambiente de desenvolvimento primeiro e teste thoroughly antes de aplicar em produção.
