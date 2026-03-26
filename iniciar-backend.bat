@echo off
REM ========================================
REM  CYBER RANKING - Iniciar Backend
REM  Windows Batch Script
REM ========================================

setlocal enabledelayedexpansion

cls
echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║                                                               ║
echo ║        🚀 CYBER RANKING - Backend (Port 5000) 🚀             ║
echo ║                                                               ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%backend"

if not exist "node_modules" (
    echo ⏳ Instalando dependências...
    call npm install
)

echo.
echo ✅ Iniciando Backend...
echo 📡 Acesso: http://localhost:5000/api
echo.
echo ⚠️  Deixe esta janela aberta enquanto usa o sistema
echo.

npm start

pause
