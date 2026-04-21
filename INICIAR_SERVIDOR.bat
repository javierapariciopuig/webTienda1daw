@echo off
echo 🚀 Iniciando servidor local para el Footer...
echo 📍 Abriendo: http://localhost:5500/Footer/footer.html
echo 🔥 Esto soluciona el error de CORS con Firebase
echo.

REM Cambiar al directorio del proyecto
cd /d "C:\Users\USUARIO\Documents\webTienda1daw\webTienda1daw"

REM Iniciar servidor con Node.js si está disponible
where node >nul 2>&1
if %ERRORLEVEL% == 0 (
    echo ✅ Node.js encontrado. Iniciando servidor...
    npx live-server --port=5500 --open=/Footer/footer.html
) else (
    echo ❌ Node.js no encontrado. Intentando con Python...
    where python >nul 2>&1
    if %ERRORLEVEL% == 0 (
        echo ✅ Python encontrado. Iniciando servidor...
        python -m http.server 8080
        echo 📍 Abre manualmente: http://localhost:8080/Footer/footer.html
    ) else (
        echo ❌ Ni Node.js ni Python encontrados.
        echo 📋 Instala Node.js desde: https://nodejs.org/
        echo 📋 O instala Python desde: https://www.python.org/downloads/
        echo 📋 O usa la extensión Live Server en VS Code
    )
)

pause
