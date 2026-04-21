# GUÍA COMPLETA - Configurar Footer con Firebase Firestore

## 📋 ESTRUCTURA REQUERIDA EN FIRESTORE

### Colección: `Footer`
- **Documento 1:** `Texto` (para todo el contenido de texto)
- **Documento 2:** `Imagénes` (para todas las imágenes)

---

## 📝 DOCUMENTO `Texto` - Campos Exactos

```javascript
{
  "TituloPrincipal": "ElChiringuitoDeMaríaYJosé",
  "Slogan": "La tienda de alimentación donde cada compra es un home run",
  "Frase_destacada": "¡Calidad de campeones!",
  "TituloHorario": "Horario",
  "DetalleHorario": "Lunes - Domingo: 10:00 - 00:00",
  "TituloContacto": "Contacto",
  "Dirección ": "C.Maíz, 11, Usera, 28026 Madrid",
  "Telefono": "+34 613 98 49 65",
  "Email": "info@ChiringuitoDeMaríaYJosé.com"
}
```

### ⚠️ IMPORTANTE:
- `Dirección` tiene un espacio al final: `"Dirección "`
- `Frase_destacada` va con F mayúscula
- Los nombres deben ser EXACTOS como aparecen arriba

---

## 🖼️ DOCUMENTO `Imagénes` - Campos Exactos

```javascript
{
  "icono-trofeo": "URL_DE_LA_IMAGEN_DEL_TROFEO",
  "icono-lugar": "URL_DE_LA_IMAGEN_DE_UBICACIÓN",
  "icono-tel": "URL_DE_LA_IMAGEN_DE_TELÉFONO",
  "icono-email": "URL_DE_LA_IMAGEN_DE_EMAIL",
  "Fondo_Footer": "URL_DE_LA_IMAGEN_DE_FONDO"
}
```

### ⚠️ IMPORTANTE:
- `Imagénes` va con tilde en la `e`
- Los nombres de iconos usan guion medio: `icono-trofeo`, `icono-lugar`, etc.

---

## 🔧 CÓMO AGREGAR DATOS EN FIREBASE

### Paso 1: Ir a Firebase Console
1. Ve a: https://console.firebase.google.com
2. Selecciona tu proyecto: `web-tienda-14323`
3. En el menú izquierdo, ve a **Firestore Database**

### Paso 2: Crear Colección y Documentos
1. Haz clic en **"Iniciar colección"**
2. Nombre de la colección: `Footer`
3. Crea el primer documento:
   - ID del documento: `Texto`
   - Agrega todos los campos del documento `Texto`
4. Crea el segundo documento:
   - ID del documento: `Imagénes`
   - Agrega todos los campos del documento `Imagénes`

### Paso 3: Subir Imágenes a Storage (Opcional)
1. Ve a **Storage** en el menú izquierdo
2. Sube las imágenes del footer
3. Copia las URLs y pégalas en el documento `Imagénes`

---

## 🌐 PROBAR EL FOOTER

### Iniciar Servidor Local:
```bash
# Si tienes Python:
python -m http.server 8080

# Si tienes Node.js:
npx live-server --port=8080
```

### Acceder al Footer:
```
http://localhost:8080/Footer/footer.html
```

### Verificar en Consola:
1. Abre el footer en el navegador
2. Presiona F12 para abrir herramientas de desarrollador
3. Ve a la pestaña **Console**
4. Deberías ver mensajes como:
   - "Conectando Footer a Firebase..."
   - "Cargando datos dinámicos del Footer desde Firestore..."
   - "Documento Footer/Texto encontrado: {...}"

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Si no carga el contenido:
1. **Verifica configuración Firebase:**
   - Revisa que `firebase-config.js` tenga tus credenciales correctas
   - Asegúrate que el proyecto ID sea correcto

2. **Verifica nombres de campos:**
   - Los nombres deben ser EXACTOS (mayúsculas/minúsculas)
   - `Dirección` debe tener espacio al final
   - `Imagénes` debe tener tilde

3. **Verifica reglas de Firestore:**
   - Ve a Firestore → Reglas
   - Asegúrate que permitan lectura:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```

---

## 📱 RESULTADO ESPERADO

Una vez configurado correctamente, el footer mostrará:
- ✅ Título principal desde Firestore
- ✅ Slogan y frase destacada desde Firestore  
- ✅ Horario desde Firestore
- ✅ Contacto (dirección, teléfono, email) desde Firestore
- ✅ Iconos dinámicos desde Firestore
- ✅ Fondo de imagen desde Firestore
- ✅ Fallbacks con emojis si las imágenes fallan

---

## 🔄 ACTUALIZAR CONTENIDO

Para cambiar el contenido del footer:
1. Ve a Firebase Console → Firestore Database
2. Busca la colección `Footer`
3. Edita el documento `Texto` o `Imagénes`
4. Guarda los cambios
5. Refresca la página del footer

Los cambios se reflejarán inmediatamente sin necesidad de modificar código.
