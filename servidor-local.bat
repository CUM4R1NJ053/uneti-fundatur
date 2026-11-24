@echo off
chcp 65001 >nul
title Servidor Local UNETI - FUNDATUR (http://localhost:8080)
color 0B

echo =======================================================================
echo          SISTEMA DE SERVICIO LOCAL UNETI / FUNDATUR
echo =======================================================================
echo.
echo  Iniciando servidor web HTTP con soporte completo para modulos y MIME...
echo.

cd /d "%~dp0"

where node >nul 2>nul
if %errorlevel% equ 0 (
    echo  [OK] Entorno Node.js detectado. Iniciando server.js...
    start http://localhost:8080/
    node server.js
    goto :end
)

where python >nul 2>nul
if %errorlevel% equ 0 (
    echo  [OK] Entorno Python detectado. Iniciando servidor HTTP...
    start http://localhost:8080/
    python -m http.server 8080 --bind 127.0.0.1
    goto :end
)

echo [ERROR] No se encontro ni Node.js ni Python en el sistema.
echo Abriendo directamente el archivo index.html en el navegador...
start index.html

:end
pause
