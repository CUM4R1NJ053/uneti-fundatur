@echo off
chcp 65001 >nul
title Asistente para Subir UNETI a GitHub
color 0A

echo =======================================================================
echo          ASISTENTE PARA PUBLICAR LA PLATAFORMA EN GITHUB
echo =======================================================================
echo.
echo Este asistente conectará tu proyecto local con tu repositorio de GitHub
echo para que puedas acceder a la plataforma desde internet con GitHub Pages.
echo.
echo PASO PREVIO:
echo 1. Ve a https://github.com/new
echo 2. Ponle un nombre (por ejemplo: uneti-fundatur)
echo 3. Déjalo como "Public" (Público) y NO marques "Add README"
echo 4. Haz clic en el botón verde "Create repository"
echo 5. Copia el enlace HTTPS del repositorio (termina en .git)
echo.
echo =======================================================================
set /p REPO_URL="Pega aquí la URL de tu repositorio de GitHub y presiona Enter: "

if "%REPO_URL%"=="" (
    echo.
    echo [ERROR] No ingresaste ninguna URL. Operación cancelada.
    pause
    exit /b
)

echo.
echo [1/3] Configurando repositorio remoto...
git remote remove origin 2>nul
git remote add origin %REPO_URL%

echo [2/3] Preparando rama principal (main)...
git branch -M main

echo [3/3] Subiendo proyecto a GitHub...
echo (Si GitHub te pide iniciar sesión en una ventana emergente, acéptala)
echo.
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo =======================================================================
    echo   ¡PROYECTO SUBIDO EXITOSAMENTE A GITHUB! 🚀
    echo =======================================================================
    echo.
    echo Ahora solo falta activar GitHub Pages para verlo en internet:
    echo 1. Entra a tu repositorio en GitHub.
    echo 2. Ve a la pestaña "Settings" (Configuración) arriba a la derecha.
    echo 3. En el menú de la izquierda, haz clic en "Pages".
    echo 4. En "Build and deployment" > "Branch", selecciona "main" y "/ (root)".
    echo 5. Haz clic en "Save" (Guardar).
    echo.
    echo En 1 o 2 minutos, GitHub te dará un enlace público HTTPS para entrar!
    echo =======================================================================
) else (
    echo.
    echo [AVISO] Hubo un problema al subir a GitHub. Verifica que la URL sea
    echo correcta y que tengas permisos de escritura en ese repositorio.
)

echo.
pause
