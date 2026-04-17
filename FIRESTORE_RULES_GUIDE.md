# Guía de Reglas de Firestore - Grand Slam Market

## Problemas Comunes y Soluciones

### 1. Error de Permisos (permission-denied)

Si ves en la consola el error `permission-denied`, significa que las reglas de seguridad de Firestore no permiten leer los datos.

#### Solución - Reglas para Desarrollo:
Ve a Firebase Console > Firestore Database > Reglas y reemplaza con:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura y escritura a todos durante el desarrollo
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

#### Solución - Reglas para Producción:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Solo permitir lectura de datos públicos de contacto
    match /Contact/{document} {
      allow read: if true;
      allow write: if false; // No permitir escritura pública
    }
    
    // Permitir escritura en formularios de contacto
    match /contacts/{document} {
      allow read: if false; // No permitir lectura pública
      allow write: if true;
    }
  }
}
```

### 2. Verificación de Documentos

Abre la consola del navegador y busca estos mensajes:

```
=== INICIANDO CARGA DE DATOS DESDE FIRESTORE ===
Firebase inicializado: true
Proyecto Firebase: web-tienda-14323
Buscando documento: Contact/contact_texts
Referencia creada: Contact/contact_texts
Snapshot obtenido, existe: true/false
```

### 3. Posibles Problemas con Nombres de Campos

El código ahora mostrará todos los campos disponibles:

```
=== DATOS DE TEXTOS ENCONTRADOS ===
Todos los campos: {email_contacto: "...", tel_contacto: "...", ...}
```

Si el campo "Dirección" no existe, mostrará:
```
Posibles nombres de campo para dirección: ["direccion", "direccion_contacto", ...]
```

### 4. Pasos para Depurar

1. **Abre la consola del navegador** (F12)
2. **Recarga la página** Contacto.html
3. **Busca los mensajes que empiezan con ===**
4. **Verifica estos puntos clave:**

   - `Firebase inicializado: true` - Firebase funciona
   - `Snapshot obtenido, existe: true` - Documentos encontrados
   - `Elemento info-direccion existe: true` - HTML correcto
   - `Actualizando dirección de: ... a: ...` - Datos actualizados

### 5. Problema Específico: Dirección Incompleta

Si solo muestra "C. Maiz, 11, Usera" en lugar de "C. Maiz, 11, Usera, 28026 Madrid":

**Verifica en Firestore Console:**
- El campo `Dirección` debe contener el texto completo
- Revisa que no haya caracteres especiales o saltos de línea
- Confirma que el nombre del campo es exactamente "Dirección" (con D mayúscula)

**En la consola del navegador deberías ver:**
```
- Dirección: "C. Maiz, 11, Usera, 28026 Madrid"
Actualizando dirección de: C. Maiz, 11,Usera a: C. Maiz, 11, Usera, 28026 Madrid
```

### 6. Problema Específico: Imagen No Carga

Si la imagen no aparece:

**Verifica en Firestore Console:**
- El campo `imagen1` debe tener una URL completa y válida
- La URL debe ser accesible públicamente (https://...)

**En la consola del navegador deberías ver:**
```
- imagen1: "https://ejemplo.com/imagen.jpg"
Actualizando imagen de:  a: https://ejemplo.com/imagen.jpg
Imagen actualizada y mostrada
```

### 7. Verificación de Estructura en Firestore

Asegúrate que tu estructura en Firestore Console sea exactamente:

```
Colección: Contact
  Documento: contact_texts
    Campos:
      - email_contacto (string)
      - tel_contacto (string)
      - Dirección (string) - ¡Con D mayúscula!
      - horario_tienda (string)
      - ubicacion_mapa (string)
  
  Documento: contact_images
    Campos:
      - imagen1 (string)
```

### 8. Si Todo Falla

1. **Verifica el proyecto Firebase:** Asegúrate que `firebaseConfig.projectId` coincida con tu proyecto
2. **Revisa las reglas:** Copia y pega las reglas de desarrollo
3. **Verifica los nombres:** Los nombres de colección, documento y campos deben ser exactos
4. **Limpia la caché:** Recarga la página con Ctrl+F5

### 9. Comandos Útiles para Consola

Puedes ejecutar estos comandos directamente en la consola del navegador:

```javascript
// Verificar Firebase inicializado
console.log('DB:', window.db);

// Forzar recarga de datos
cargarDatosDesdeFirebase();

// Verificar elementos HTML
console.log('Elementos:', {
  email: !!document.getElementById("info-email"),
  tel: !!document.getElementById("info-tel"),
  direccion: !!document.getElementById("info-direccion"),
  horario: !!document.getElementById("info-horario"),
  mapa: !!document.getElementById("db-map"),
  imagen: !!document.getElementById("img-firebase")
});
```

Con esta guía detallada y el logging mejorado, podrás identificar exactamente dónde está el problema y solucionarlo rápidamente.
