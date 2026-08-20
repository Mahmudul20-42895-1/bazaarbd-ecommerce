@echo off
title BazaarBD Full Stack Launcher
echo ========================================================
echo    Starting BazaarBD E-Commerce Platform (Bangladesh)
echo ========================================================
echo.

echo [1/3] Starting REST API & Database Server (Port 8000)...
start "BazaarBD API Server" cmd /k "cd /d %~dp0server && node server.js"

timeout /t 2 /nobreak >nul

echo [2/3] Starting Customer Storefront (Port 3000)...
start "BazaarBD Customer Storefront" cmd /k "cd /d %~dp0frontend && npm run dev"

timeout /t 2 /nobreak >nul

echo [3/3] Starting Admin Dashboard (Port 3001)...
start "BazaarBD Admin Dashboard" cmd /k "cd /d %~dp0admin && npm run dev -- -p 3001"

echo.
echo ========================================================
echo    All 3 services are launching in separate windows!
echo.
echo    - Storefront: http://localhost:3000
echo    - Admin Panel: http://localhost:3001
echo    - API & DB:   http://localhost:8000/api/v1
echo ========================================================
pause
