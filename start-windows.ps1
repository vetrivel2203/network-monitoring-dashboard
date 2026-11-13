# NetPulse Telemetry Dashboard - Windows PowerShell Quick Launcher
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  NETPULSE: Network Telemetry & FLAT Educational Dashboard" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

# Ensure .env files exist
if (-not (Test-Path "server/.env")) {
    Write-Host "[SETUP] Creating server/.env from template..." -ForegroundColor Yellow
    Copy-Item "server/.env.example" "server/.env"
}

if (-not (Test-Path "client/.env")) {
    Write-Host "[SETUP] Creating client/.env from template..." -ForegroundColor Yellow
    Copy-Item "client/.env.example" "client/.env"
}

Write-Host "[1/2] Starting Node.js / Express Telemetry Backend on Port 5000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot/server'; npm run dev"

Start-Sleep -Seconds 2

Write-Host "[2/2] Starting React (Vite) Frontend on Port 5173..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot/client'; npm run dev"

Write-Host ""
Write-Host "Dashboard will be live at: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Express API will be live at: http://localhost:5000/api" -ForegroundColor Cyan
Write-Host "Press any key to exit this launcher window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")