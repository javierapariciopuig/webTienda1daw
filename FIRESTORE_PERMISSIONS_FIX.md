# Solución Inmediata: Error de Permisos Firestore

## Problema Detectado
```
FirebaseError: Missing or insufficient permissions.
Código: permission-denied
```

## Causa
Las reglas de seguridad de Firestore están impidiendo la lectura de datos.

## Solución Inmediata (Para Desarrollo)

Ve a Firebase Console > Firestore Database > Reglas y reemplaza TODO el contenido con:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir todo durante el desarrollo
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## Pasos Exactos:

1. **Abre Firebase Console:** https://console.firebase.google.com/
2. **Selecciona tu proyecto:** web-tienda-14323
3. **Ve a Firestore Database** (menú izquierdo)
4. **Haz clic en "Reglas"** (pestaña superior)
5. **Borra todo el contenido actual**
6. **Pega las reglas de arriba**
7. **Haz clic en "Publicar"**

## Verificación

Después de publicar las reglas:

1. **Recarga la página:** http://localhost:8080/Contacto/Contacto.html
2. **Abre la consola** (F12)
3. **Deberías ver:**
   - `"Intentando conectar a Firebase..."`
   - `"DATOS CARGADOS: C. Maíz, 11, Usera, 28026 Madrid"`

## Si Sigue Fallando

Si después de cambiar las reglas sigue dando error:

1. **Espera 1-2 minutos** para que las reglas se propaguen
2. **Recarga la página** con Ctrl+F5
3. **Verifica que la colección "Contact" exista** en Firestore
4. **Verifica que el documento "contact_texts" exista**

## Estructura Requerida en Firestore

```
Colección: Contact
  Documento: contact_texts
    Campos:
      - direccion: "C. Maíz, 11, Usera, 28026 Madrid"
      - email_contacto: "info@grandslammarket.com"
      - tel_contacto: "+34 613 98 49 65"
      - horario_tienda: "Lunes-Viernes 8:00-21:00"
      - ubicacion_mapa: "URL del mapa"
```

## Para Producción (Más Tarde)

Cuando la web esté en producción, usa reglas más seguras:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Solo lectura pública de contacto
    match /Contact/{document} {
      allow read: if true;
      allow write: if false;
    }
    
    // Formularios de contacto (solo escritura)
    match /contacts/{document} {
      allow read: if false;
      allow write: if true;
    }
  }
}
```

## Importante

- **Las reglas de desarrollo** (`allow read, write: if true`) son solo para pruebas
- **No uses en producción** sin restricciones adecuadas
- **Después de solucionar**, la dirección debería aparecer completa en la web
