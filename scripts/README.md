# Scripts PowerShell

## Scripts Disponíveis

### 1. `start-dev.ps1`
Script inteligente para iniciar o servidor Next.js garantindo que a porta 3000 esteja livre.

**Uso:**
```powershell
.\scripts\start-dev.ps1
```

Ou via npm:
```bash
npm run dev:safe
```

**O que faz:**
- Verifica se há processos usando a porta 3000
- Encerra automaticamente processos Node.js que estão bloqueando a porta
- Inicia o servidor Next.js normalmente

### 2. `kill-port.ps1`
Script utilitário para encerrar processos usando uma porta específica.

**Uso:**
```powershell
# Encerrar processos na porta 3000 (padrão)
.\scripts\kill-port.ps1

# Encerrar processos em outra porta
.\scripts\kill-port.ps1 8080
```

**Parâmetros:**
- `Port` (opcional): Número da porta. Padrão: 3000

## Solução Permanente

Para evitar sempre o erro de porta em uso, use:

```bash
npm run dev:safe
```

Ao invés de:

```bash
npm run dev
```

## Permissões PowerShell

Se você receber um erro de política de execução, execute:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Isso permite que scripts locais sejam executados sem precisar de permissões de administrador.






