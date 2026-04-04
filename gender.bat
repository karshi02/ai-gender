@echo off
title AI Gender Detection System
color 0A

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] ไมพบ Node.js ในระบบ
    pause
    exit /b 1
)

:MENU
cls
echo ========================================
echo      AI Gender Detection System
echo ========================================
echo.
echo [1] Start Server (npm start)
echo [2] Start Server (Node.js direct)
echo [3] Check Environment (.env)
echo [4] Install Dependencies
echo [5] Clean uploads folder
echo [6] Exit
echo.
set /p choice="Select option (1-6): "

if "%choice%"=="1" goto NPM_START
if "%choice%"=="2" goto NODE_START
if "%choice%"=="3" goto CHECK_ENV
if "%choice%"=="4" goto INSTALL_DEPS
if "%choice%"=="5" goto CLEAN_UPLOADS
if "%choice%"=="6" goto EXIT
goto MENU

:NPM_START
echo.
echo [INFO] Starting server with npm...
cd /d "%~dp0backend"

if not exist "package.json" (
    echo [ERROR] No package.json found!
    echo Please run option [4] to create package.json and install dependencies first.
    pause
    goto MENU
)

if not exist "node_modules" (
    echo [WARNING] node_modules not found!
    echo Running npm install...
    call npm install
)

if not exist ".env" (
    echo [WARNING] .env not found!
    echo Creating .env template...
    echo GEMINI_API_KEY=your_api_key_here > .env
    echo PORT=3001 >> .env
    echo Please edit backend\.env with your actual API key!
    pause
    goto MENU
)

echo Starting server...
npm start
pause
goto MENU

:NODE_START
echo.
echo [INFO] Starting server with Node.js...
cd /d "%~dp0backend"

if not exist "server.js" (
    echo [ERROR] server.js not found in backend folder!
    pause
    goto MENU
)

if not exist "node_modules" (
    echo [WARNING] node_modules not found!
    echo Running npm install...
    call npm install
)

if not exist ".env" (
    echo [WARNING] .env not found!
    echo Creating .env template...
    echo GEMINI_API_KEY=your_api_key_here > .env
    echo PORT=3001 >> .env
    echo Please edit backend\.env with your actual API key!
    pause
    goto MENU
)

echo Starting server on port 3001...
node server.js
pause
goto MENU

:CHECK_ENV
echo.
echo [INFO] Checking environment...
cd /d "%~dp0"

if exist "backend\.env" (
    echo [OK] backend\.env exists
    echo.
    echo Content:
    type backend\.env
) else (
    echo [WARNING] backend\.env not found!
)

echo.
if exist "backend\package.json" (
    echo [OK] backend\package.json exists
) else (
    echo [WARNING] backend\package.json not found!
)

if exist "backend\server.js" (
    echo [OK] backend\server.js exists
) else (
    echo [WARNING] backend\server.js not found!
)

pause
goto MENU

:INSTALL_DEPS
echo.
echo [INFO] Installing dependencies...
cd /d "%~dp0backend"

if not exist "package.json" (
    echo Creating package.json...
    npm init -y
)

echo Installing dependencies...
call npm install express cors dotenv multer

echo.
echo [OK] Installation complete!
echo.
echo Next steps:
echo 1. Create backend\.env with your GEMINI_API_KEY
echo 2. Run option [1] or [2] to start the server

pause
goto MENU

:CLEAN_UPLOADS
echo.
echo [INFO] Cleaning uploads folder...
cd /d "%~dp0"
if exist "uploads\*" (
    del /q "uploads\*" 2>nul
    echo [OK] Uploads folder cleaned
) else (
    mkdir uploads 2>nul
    echo [OK] Uploads folder created
)
pause
goto MENU

:EXIT
exit