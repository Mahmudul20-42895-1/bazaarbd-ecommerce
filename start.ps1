Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "   Starting BazaarBD E-Commerce Platform (Bangladesh)" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "[1/3] Starting REST API & Database Server (Port 8000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\server'; node server.js"

Start-Sleep -Seconds 2

Write-Host "[2/3] Starting Customer Storefront (Port 3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\frontend'; npm run dev"

Start-Sleep -Seconds 2

Write-Host "[3/3] Starting Admin Dashboard (Port 3001)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\admin'; npm run dev -- -p 3001"

Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "   All 3 services are launching in separate windows!" -ForegroundColor Green
Write-Host ""
Write-Host "   - Storefront:  http://localhost:3000" -ForegroundColor White
Write-Host "   - Admin Panel: http://localhost:3001" -ForegroundColor White
Write-Host "   - API & DB:    http://localhost:8000/api/v1" -ForegroundColor White
Write-Host "========================================================" -ForegroundColor Cyan
