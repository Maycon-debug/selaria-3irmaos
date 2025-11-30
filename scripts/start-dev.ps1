# Script para iniciar o servidor Next.js garantindo que a porta 3000 esteja livre
# Uso: .\scripts\start-dev.ps1

Write-Host "Verificando processos usando a porta 3000..." -ForegroundColor Cyan

# Encontrar e encerrar processos usando a porta 3000
$processes = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Where-Object { $_.OwningProcess -ne 0 } | Select-Object -Property OwningProcess -Unique

if ($processes) {
    Write-Host "Encontrados processos usando a porta 3000. Encerrando..." -ForegroundColor Yellow
    
    foreach ($proc in $processes) {
        $processId = $proc.OwningProcess
        $procInfo = Get-Process -Id $processId -ErrorAction SilentlyContinue
        
        if ($procInfo) {
            Write-Host "   Encerrando processo: $($procInfo.ProcessName) (PID: $processId)" -ForegroundColor Gray
            Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
        }
    }
    
    # Aguardar um pouco para garantir que os processos foram encerrados
    Start-Sleep -Seconds 2
    
    # Verificar novamente
    $remaining = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Where-Object { $_.OwningProcess -ne 0 }
    
    if ($remaining) {
        Write-Host "Ainda ha processos usando a porta 3000. Tentando metodo alternativo..." -ForegroundColor Yellow
        
        # Tentar encerrar todos os processos Node.js
        Get-Process -Name node -ErrorAction SilentlyContinue | ForEach-Object {
            Write-Host "   Encerrando processo Node.js: PID $($_.Id)" -ForegroundColor Gray
            Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
        }
        
        Start-Sleep -Seconds 2
    }
    
    Write-Host "Processos encerrados!" -ForegroundColor Green
} else {
    Write-Host "Porta 3000 esta livre!" -ForegroundColor Green
}

Write-Host ""
Write-Host "Iniciando servidor Next.js..." -ForegroundColor Cyan
Write-Host ""

# Verificar se a porta ainda está livre antes de iniciar
Start-Sleep -Seconds 1
$finalCheck = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue

if ($finalCheck) {
    Write-Host "Erro: A porta 3000 ainda esta em uso apos tentativas de liberacao." -ForegroundColor Red
    Write-Host "   Tente executar manualmente: .\scripts\kill-port.ps1" -ForegroundColor Yellow
    exit 1
}

# Iniciar o servidor diretamente (sem chamar npm run dev para evitar loop)
Write-Host "Porta 3000 confirmada livre. Iniciando servidor..." -ForegroundColor Green
Write-Host ""
& npx next dev -p 3000
