@echo off
REM ========================================
REM  CYBER RANKING - Iniciar Frontend
REM  Windows Batch Script
REM ========================================

setlocal enabledelayedexpansion

cls
echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║                                                               ║
echo ║       🎨 CYBER RANKING - Frontend (Port 3000) 🎨             ║
echo ║                                                               ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%frontend"

if not exist "node_modules" (
    echo ⏳ Instalando dependências...
    call npm install
)

echo.
echo ✅ Iniciando Frontend...
echo 🎨 Acesso: http://localhost:3000
echo.
echo ⚠️  Deixe esta janela aberta enquanto usa o sistema
echo.

npm start

pause
