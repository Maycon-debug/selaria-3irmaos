# Script helper para executar comandos Prisma com Session Pooler
# Uso: .\scripts\prisma-admin.ps1 migrate status
#      .\scripts\prisma-admin.ps1 migrate deploy
#      .\scripts\prisma-admin.ps1 db pull

param(
    [Parameter(Mandatory=$true)]
    [string]$Command
)

# Carregar variáveis de ambiente do .env.local
$envFile = ".env.local"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]*)=(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim().Trim('"').Trim("'")
            [Environment]::SetEnvironmentVariable($key, $value, "Process")
        }
    }
}

# Usar DATABASE_URL_DIRECT se existir, senão usar DATABASE_URL
if ($env:DATABASE_URL_DIRECT) {
    Write-Host "🔗 Usando Session Pooler (porta 6543) para comando administrativo..." -ForegroundColor Cyan
    $env:DATABASE_URL = $env:DATABASE_URL_DIRECT
} else {
    Write-Host "⚠️  DATABASE_URL_DIRECT não encontrada, usando DATABASE_URL padrão..." -ForegroundColor Yellow
}

# Executar comando Prisma
Write-Host "🚀 Executando: prisma $Command`n" -ForegroundColor Green
npx prisma $Command

