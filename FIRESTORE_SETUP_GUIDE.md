# Guía Rápida - Configurar Firestore para Contacto.html

## 🚀 Pasos Inmediatos

### 1. **Corregir Permisos de Firestore**
Ve a Firebase Console > Firestore Database > Reglas y reemplaza con:

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

### 2. **Crear Documento Completo en Firestore**

**Colección:** `Contact`  
**Documento:** `contact_texts`

Copia y pega este JSON completo en tu documento:

```json
{
  "titulo_principal": "¡Contacta con Nosotros!",
  "desc_principal": "Estamos aquí para ayudarte. Envíanos tu mensaje y nuestro equipo te responderá en menos de 24 horas.",
  "form_title": "Envíanos un Mensaje",
  "faq_title": "Preguntas Frecuentes",
  "lbl_name": "Nombre Completo *",
  "lbl_email": "Email *",
  "lbl_phone": "Teléfono",
  "lbl_message": "Mensaje *",
  "btn_enviar": "Enviar Mensaje",
  "direccion": "C. Maíz, 11, Usera, 28026 Madrid",
  "tel_contacto": "+34 613 98 49 65",
  "email_contacto": "info@grandslammarket.com",
  "horario_tienda": "Lunes-Viernes 8:00-21:00",
  "ubicacion_mapa": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3038.563724361555!2d-3.69345!3d40.396!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd4226260a95e09f%3A0x6d9f3b1b1b1b1b1b!2sCalle%20del%20Ma%C3%ADz%2C%2011%2C%2028045%20Madrid!5e0!3m2!1ses!2ses!4v1700000000000!5m2!1ses!2ses",
  "faq_q1": "¿Hacéis entregas a domicilio?",
  "faq_a1": "Sí, realizamos entregas en toda la zona metropolitana de Madrid. Pedidos mínimos de 30€. ¡Gratis para compras superiores a 60€!",
  "faq_q2": "¿Tenéis productos orgánicos?",
  "faq_a2": "Contamos con una amplia selección de productos orgánicos y ecológicos certificados en todas las categorías.",
  "faq_q3": "¿Cómo me uno al programa de puntos?",
  "faq_a3": "Solo necesitas registrarte con tus datos y automáticamente empezarás a acumular puntos con cada compra. ¡Es gratis!",
  "faq_q4": "¿Aceptáis devoluciones?",
  "faq_a4": "Garantizamos la calidad de todos nuestros productos. Si no estás satisfecho, realizamos devoluciones sin preguntas."
}
```

### 3. **Verificar Conexión**

1. **Inicia el servidor local:**
   ```powershell
   cd c:\Users\USUARIO\Documents\webTienda1daw\webTienda1daw
   .\server.ps1
   ```

2. **Abre la página:** http://localhost:8080/Contacto/Contacto.html

3. **Abre la consola** (F12) y busca:
   - `"Intentando conectar a Firebase..."`
   - `"Documento contact_texts encontrado"`
   - `"DATOS CARGADOS: C. Maíz, 11, Usera, 28026 Madrid"`

## 📋 Checklist de Verificación

- [ ] **Permisos corregidos** en Firestore
- [ ] **Documento creado** con todos los campos
- [ ] **Servidor local** funcionando
- [ ] **Página carga** sin errores
- [ ] **Dirección completa** aparece en la web
- [ ] **Todos los textos** se actualizan dinámicamente

## 🔧 Si Hay Problemas

### **Error: "Missing or insufficient permissions"**
- **Causa:** Reglas de seguridad restrictivas
- **Solución:** Aplicar las reglas del paso 1

### **Error: "No se encontró el documento"**
- **Causa:** El documento no existe o está mal escrito
- **Solución:** Crear el documento exactamente como se indica

### **Error: "No se cargan los textos"**
- **Causa:** Firebase no se inicializa correctamente
- **Solución:** Verificar archivo firebase-config.js y ruta de importación

## 🎯 Resultado Esperado

Una vez configurado correctamente:
- ✅ **Título principal** desde Firestore
- ✅ **Descripción** desde Firestore  
- ✅ **Todos los labels** del formulario desde Firestore
- ✅ **Dirección completa** con "28026 Madrid"
- ✅ **FAQs dinámicas** desde Firestore
- ✅ **Botón personalizado** desde Firestore
- ✅ **100% responsivo** sin roturas de diseño

La página está lista para ser 100% dinámica. Solo falta configurar Firestore correctamente.
