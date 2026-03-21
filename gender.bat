@echo off
title AI Gender Detection System
color 0A

:MENU
cls
echo ========================================
echo      AI Gender Detection System
echo ========================================
echo.
echo [1] Start Server (npm start)
echo [2] Start Server (Node.js direct)
echo [3] Clean uploads folder
echo [4] Exit
echo.
set /p choice="Select option (1-4): "

if "%choice%"=="1" goto NPM_START
if "%choice%"=="2" goto NODE_START
if "%choice%"=="3" goto CLEAN_UPLOADS
if "%choice%"=="4" goto EXIT
goto MENU

:NPM_START
echo.
echo Starting server with npm...
npm start
pause
goto MENU

:NODE_START
echo.
echo Starting server with Node.js...
cd /d "C:\Users\karsh\Desktop\ai-gender"
if exist "backend\server.js" (
    node backend\server.js
) else if exist "server.js" (
    node server.js
) else (
    echo No server file found!
)
pause
goto MENU

:CLEAN_UPLOADS
echo.
echo Cleaning uploads folder...
if exist "uploads\*" (
    del /q "uploads\*" 2>nul
    for /d %%i in ("uploads\*") do rmdir /s /q "%%i" 2>nul
    echo Uploads folder cleaned successfully!
) else (
    echo Uploads folder is empty or does not exist
)
pause
goto MENU

:EXIT
exit