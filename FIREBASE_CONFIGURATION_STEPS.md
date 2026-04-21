# Configuración Firebase y Firestore - Guía Paso a Paso

## Estado Actual
Tu proyecto ya tiene las credenciales configuradas en `firebase-config.js` con el proyecto `web-tienda-14323`.

## Paso 1: Acceder a Firebase Console

1. **Abre:** https://console.firebase.google.com/
2. **Inicia sesión** con tu cuenta de Google
3. **Selecciona tu proyecto:** `web-tienda-14323`

## Paso 2: Configurar Firestore Database

1. **En el menú izquierdo**, haz clic en **"Firestore Database"**
2. **Haz clic en "Crear base de datos"**
3. **Selecciona "Iniciar en modo de prueba"** (para desarrollo)
4. **Elige una ubicación** (recomiendo: `europe-west1`)
5. **Haz clic en "Habilitar"**

## Paso 3: Configurar Reglas de Seguridad

1. **En Firestore Database**, haz clic en la pestaña **"Reglas"**
2. **Reemplaza todo el contenido** con:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. **Haz clic en "Publicar"**

## Paso 4: Crear Estructura de Datos

1. **Vuelve a la pestaña "Datos"**
2. **Haz clic en "Iniciar colección"**
3. **ID de la colección:** `Contact`
4. **Haz clic en "Siguiente"**

## Paso 5: Crear Documento Principal

1. **ID del documento:** `contact_texts`
2. **Añade estos campos:**

| Campo | Tipo | Valor |
|-------|------|-------|
| titulo_principal | string | ¡Contacta con Nosotros! |
| desc_principal | string | Estamos aquí para ayudarte. Envíanos tu mensaje y nuestro equipo te responderá en menos de 24 horas. |
| form_title | string | Envíanos un Mensaje |
| faq_title | string | Preguntas Frecuentes |
| lbl_name | string | Nombre Completo * |
| lbl_email | string | Email * |
| lbl_phone | string | Teléfono |
| lbl_message | string | Mensaje * |
| btn_enviar | string | Enviar Mensaje |
| direccion | string | C. Maíz, 11, Usera, 28026 Madrid |
| tel_contacto | string | +34 613 98 49 65 |
| email_contacto | string | info@grandslammarket.com |
| horario_tienda | string | Lunes-Viernes 8:00-21:00 |
| ubicacion_mapa | string | https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3038.563724361555!2d-3.69345!3d40.396!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd4226260a95e09f%3A0x6d9f3b1b1b1b1b1b!2sCalle%20del%20Ma%C3%ADz%2C%2011%2C%2028045%20Madrid!5e0!3m2!1ses!2ses!4v1700000000000!5m2!1ses!2ses |
| faq_q1 | string | ¿Hacéis entregas a domicilio? |
| faq_a1 | string | Sí, realizamos entregas en toda la zona metropolitana de Madrid. Pedidos mínimos de 30¡. ¡Gratis para compras superiores a 60¡! |
| faq_q2 | string | ¿Tenéis productos orgánicos? |
| faq_a2 | string | Contamos con una amplia selección de productos orgánicos y ecológicos certificados en todas las categorías. |
| faq_q3 | string | ¿Cómo me uno al programa de puntos? |
| faq_a3 | string | Solo necesitas registrarte con tus datos y automáticamente empezarás a acumular puntos con cada compra. ¡Es gratis! |
| faq_q4 | string | ¿Aceptáis devoluciones? |
| faq_a4 | string | Garantizamos la calidad de todos nuestros productos. Si no estás satisfecho, realizamos devoluciones sin preguntas. |

3. **Haz clic en "Guardar"**

## Paso 6: Probar la Conexión

1. **Inicia el servidor local:**
   ```powershell
   cd c:\Users\USUARIO\Documents\webTienda1daw\webTienda1daw
   .\server.ps1
   ```

2. **Abre:** http://localhost:8080/Contacto/Contacto.html

3. **Abre la consola del navegador** (F12)

4. **Deberías ver:**
   - `"Intentando conectar a Firebase..."`
   - `"Documento contact_texts encontrado"`
   - `"DATOS CARGADOS: C. Maíz, 11, Usera, 28026 Madrid"`

## Paso 7: Verificar que Todo Funciona

La página debería mostrar:
- [ ] **Título principal** desde Firestore
- [ ] **Descripción** desde Firestore
- [ ] **Labels del formulario** desde Firestore
- [ ] **Dirección completa** con "28026 Madrid"
- [ ] **FAQs dinámicas** desde Firestore

## Si Hay Problemas

### **Error: "Missing or insufficient permissions"**
- **Solución:** Repite el Paso 3 para configurar las reglas

### **Error: "No se encontró el documento"**
- **Solución:** Verifica que el documento se llame exactamente `contact_texts`

### **Error: "Firebase no se inicializa"**
- **Solución:** Verifica que `firebase-config.js` tenga las credenciales correctas

## Checklist Final

- [ ] Firestore Database creada
- [ ] Reglas de seguridad configuradas
- [ ] Colección `Contact` creada
- [ ] Documento `contact_texts` creado con todos los campos
- [ ] Página carga sin errores
- [ ] Contenido dinámico funciona

Una vez completados estos pasos, tu página Contacto.html será 100% dinámica desde Firebase.
