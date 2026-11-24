@echo off
setlocal
chcp 65001 >nul
title Asistente para Subir UNETI a GitHub
color 0A

set "PATH=C:\Git\cmd;%PATH%"

echo =======================================================================
echo          ASISTENTE PARA PUBLICAR LA PLATAFORMA EN GITHUB
echo =======================================================================
echo.
echo Este asistente conectara tu proyecto local con tu repositorio de GitHub
echo para que puedas acceder a la plataforma desde internet con GitHub Pages.
echo.
echo PASOS PREVIOS:
echo 1. Entra en tu navegador a: https://github.com/new
echo 2. Escribe el nombre del repositorio: uneti-fundatur
echo 3. Selecciona 'Public' (Publico)
echo 4. NO marques 'Add README', ni .gitignore, ni licencia
echo 5. Haz clic en el boton verde 'Create repository'
echo 6. Copia el enlace HTTPS (ejemplo: https://github.com/usuario/uneti-fundatur.git)
echo.
echo =======================================================================
echo.

set "REPO_URL="
set /p "REPO_URL=Pega aqui la URL de tu repositorio de GitHub y presiona Enter: "

if not defined REPO_URL goto :no_url
if "%REPO_URL%"=="" goto :no_url

echo.
echo [1/3] Configurando repositorio remoto origin...
git remote remove origin 2>nul
git remote add origin %REPO_URL%

echo [2/3] Configurando rama principal main...
git branch -M main

echo [3/3] Subiendo proyecto a GitHub...
echo Nota: Si se abre una ventana del navegador, autoriza el acceso a Git.
echo.
git push -u origin main

if %errorlevel% equ 0 goto :success
goto :error_push

:success
echo.
echo =======================================================================
echo   PROYECTO SUBIDO EXITOSAMENTE A GITHUB!
echo =======================================================================
echo.
echo Ultimo paso para tener tu pagina en internet:
echo 1. Entra a tu repositorio en GitHub.
echo 2. Ve a la pestana 'Settings' (arriba a la derecha).
echo 3. En el menu de la izquierda, haz clic en 'Pages'.
echo 4. En 'Branch', selecciona 'main' y deja '/ (root)'.
echo 5. Haz clic en 'Save'.
echo.
echo En 1 a 2 minutos tu pagina estara disponible en la URL que te dara GitHub.
echo =======================================================================
goto :end

:no_url
echo.
echo [ERROR] No ingresaste ninguna URL.
echo Por favor ejecuta nuevamente este archivo e ingresa la URL de GitHub.
goto :end

:error_push
echo.
echo [AVISO] Hubo un problema al subir a GitHub.
echo Verifica que la URL sea correcta y que tengas permisos en el repositorio.
goto :end

:end
echo.
pause
