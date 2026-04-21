# 🚀 Guía Paso a Paso: Activar Live Server en VS Code

## 📋 ¿Por qué necesitas un servidor local?
El error `CORS policy` ocurre porque estás abriendo el HTML directamente con `file://` y Firebase requiere `http://` o `https://` para funcionar correctamente.

---

## 🔧 Método 1: Usar Live Server (Recomendado)

### Paso 1: Instalar la extensión
1. Abre VS Code
2. Ve a la pestaña **Extensiones** (Ctrl+Shift+X)
3. Busca: **"Live Server"**
4. Instala la extensión de **Ritwick Dey**
5. Recarga VS Code cuando te lo pida

### Paso 2: Iniciar el servidor
1. Abre tu archivo: `Footer/footer.html`
2. Haz clic derecho en cualquier parte del código
3. Selecciona **"Open with Live Server"** o **"Abrir con Live Server"**
4. O usa el atajo: **Alt+L + Alt+O**

### Paso 3: Acceder al footer
1. Se abrirá automáticamente tu navegador en: `http://127.0.0.1:5500/Footer/footer.html`
2. Si no se abre, manualmente ve a: `http://localhost:5500/Footer/footer.html`

---

## 🔧 Método 2: Usar el script que creé

### Paso 1: Ejecutar el script
1. Ve a la carpeta del proyecto
2. Doble clic en `start-server.bat`
3. Espera a que inicie el servidor

### Paso 2: Acceder al footer
1. Abre tu navegador
2. Ve a: `http://localhost:8080/Footer/footer.html`

---

## 🔧 Método 3: Python (si tienes instalado)

### Paso 1: Abrir terminal
1. En VS Code: **Ctrl+`** (terminal integrada)
2. Navega a la carpeta: `cd Footer`

### Paso 2: Iniciar servidor
```bash
python -m http.server 8080
```

### Paso 3: Acceder
Abre: `http://localhost:8080/footer.html`

---

## ✅ Verificación

Una vez que tengas el servidor corriendo, deberías ver en la consola:

```
✅ Conectando Footer a Firebase...
✅ Documento Footer/Texto encontrado: {...}
🔄 Intentando cargar icono trofeo: https://...
✅ Icono trofeo cargado y emoji oculto
```

## 🚨 Si sigues viendo errores CORS

1. **Asegúrate** de usar `http://` y no `file://`
2. **Reinicia** el servidor después de cambios
3. **Limpia** la caché del navegador (Ctrl+F5)
4. **Verifica** que el puerto no esté en uso

---

## 🎯 URL Final

Usa **UNA** de estas URLs en tu navegador:

- **Live Server:** `http://127.0.0.1:5500/Footer/footer.html`
- **Script BAT:** `http://localhost:8080/Footer/footer.html`
- **Python:** `http://localhost:8080/footer.html`

¡Listo! Ahora tu footer debería cargarse dinámicamente desde Firebase sin errores CORS. 🎉
