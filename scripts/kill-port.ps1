# Script para encerrar processos usando uma porta específica
# Uso: .\scripts\kill-port.ps1 [porta]
# Exemplo: .\scripts\kill-port.ps1 3000

param(
    [Parameter(Mandatory=$false)]
    [int]$Port = 3000
)

Write-Host "🔍 Procurando processos usando a porta $Port..." -ForegroundColor Cyan

$connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | Where-Object { $_.OwningProcess -ne 0 }

if ($connections) {
    $processes = $connections | Select-Object -Property OwningProcess -Unique
    
    Write-Host "⚠️  Encontrados $($processes.Count) processo(s) usando a porta $Port" -ForegroundColor Yellow
    
    foreach ($proc in $processes) {
        $pid = $proc.OwningProcess
        $procInfo = Get-Process -Id $pid -ErrorAction SilentlyContinue
        
        if ($procInfo) {
            Write-Host "   Processo: $($procInfo.ProcessName) (PID: $pid)" -ForegroundColor Gray
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
            Write-Host "   ✅ Processo $pid encerrado" -ForegroundColor Green
        }
    }
    
    Write-Host ""
    Write-Host "✅ Todos os processos foram encerrados!" -ForegroundColor Green
} else {
    Write-Host "✅ Nenhum processo encontrado usando a porta $Port" -ForegroundColor Green
}





