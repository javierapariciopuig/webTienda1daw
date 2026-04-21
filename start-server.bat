@echo off
echo 🚀 Iniciando servidor local para el Footer...
echo 📍 URL: http://localhost:8080
echo 🔥 Esto soluciona el problema de CORS con Firebase
echo.

REM Verificar si Python está instalado
python --version >nul 2>&1
if %ERRORLEVEL% == 0 (
    echo ✅ Python encontrado. Iniciando servidor con Python...
    echo Presiona Ctrl+C para detener el servidor
    echo.
    
    REM Cambiar al directorio del proyecto
    cd /d "C:\Users\USUARIO\Documents\webTienda1daw\webTienda1daw"
    
    REM Iniciar servidor HTTP
    python -m http.server 8080
) else (
    echo ❌ Python no encontrado. Por favor instala Python o usa la extensión Live Server en VS Code
    echo.
    echo Alternativas:
    echo 1. Instala Python desde: https://www.python.org/downloads/
    echo 2. Usa la extensión 'Live Server' en VS Code
    echo 3. Usa Node.js: npx http-server
)

echo.
echo Una vez iniciado, abre tu navegador en: http://localhost:8080/Footer/footer.html
pause
