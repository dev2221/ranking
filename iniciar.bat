@echo off
REM ========================================
REM  CYBER RANKING - Iniciar Projeto
REM  Windows Batch Script
REM ========================================

setlocal enabledelayedexpansion

cls
echo.
echo ╔══════════════════════════════════════════════════════════════════╗
echo ║                                                                  ║
echo ║           🚀 CYBER RANKING - Sistema de Ranking 🚀              ║
echo ║                                                                  ║
echo ║              Iniciando Backend e Frontend...                     ║
echo ║                                                                  ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.

REM Get the directory where the script is located
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

echo [1/4] Verificando estrutura do projeto...
if not exist "backend\package.json" (
    echo ❌ Erro: pasta backend não encontrada!
    echo.
    pause
    exit /b 1
)

if not exist "frontend\package.json" (
    echo ❌ Erro: pasta frontend não encontrada!
    echo.
    pause
    exit /b 1
)

echo ✅ Estrutura do projeto OK
echo.

REM Check and install backend dependencies
echo [2/4] Verificando dependências do Backend...
if not exist "backend\node_modules" (
    echo ⏳ Instalando dependências do Backend (primeira vez)...
    cd /d "%SCRIPT_DIR%backend"
    call npm install
    if errorlevel 1 (
        echo ❌ Erro ao instalar dependências do Backend
        pause
        exit /b 1
    )
    cd /d "%SCRIPT_DIR%"
)
echo ✅ Backend pronto
echo.

REM Check and install frontend dependencies
echo [3/4] Verificando dependências do Frontend...
if not exist "frontend\node_modules" (
    echo ⏳ Instalando dependências do Frontend (primeira vez)...
    cd /d "%SCRIPT_DIR%frontend"
    call npm install
    if errorlevel 1 (
        echo ❌ Erro ao instalar dependências do Frontend
        pause
        exit /b 1
    )
    cd /d "%SCRIPT_DIR%"
)
echo ✅ Frontend pronto
echo.

echo [4/4] Iniciando servidores...
echo.
echo ╔══════════════════════════════════════════════════════════════════╗
echo ║                                                                  ║
echo ║  🔵 Backend:  http://localhost:5000/api                         ║
echo ║  🔷 Frontend: http://localhost:3000                             ║
echo ║                                                                  ║
echo ║  ⚠️  NÃO FECHE ESTAS JANELAS (deixe rodando)                    ║
echo ║                                                                  ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.

REM Start Backend in a new window
echo 📡 Iniciando Backend...
start "CYBER RANKING - Backend (5000)" cmd /k "cd /d "%SCRIPT_DIR%backend" && npm start"

REM Wait a few seconds to let backend start
timeout /t 3 /nobreak

REM Start Frontend in a new window
echo 🎨 Iniciando Frontend...
start "CYBER RANKING - Frontend (3000)" cmd /k "cd /d "%SCRIPT_DIR%frontend" && npm start"

echo.
echo ✅ Projeto iniciado com sucesso!
echo.
echo 📖 Aguarde a abertura do navegador...
echo.
echo Se o navegador não abrir automaticamente, acesse:
echo 👉 http://localhost:3000
echo.

timeout /t 5 /nobreak

echo Script finalizado. As janelas dos servidores permanecem abertas.
pause
