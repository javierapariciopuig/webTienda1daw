# Firestore Fields Mapping - Contacto.html

## Estructura Completa en Firestore

```
Colección: Contact
  Documento: contact_texts
    Campos (fields) listados abajo
```

## Campos Requeridos en Firestore

### **Contenido Principal (Header)**
| Campo HTML | Campo Firestore | Valor por Defecto | Descripción |
|------------|----------------|-------------------|-------------|
| `db-titulo-principal` | `titulo_principal` | "¡Contacta con Nosotros!" | Título principal de la página |
| `db-descripcion-principal` | `desc_principal` | "Estamos aquí para ayudarte. Envíanos tu mensaje y nuestro equipo te responderá en menos de 24 horas." | Descripción principal |

### **Títulos de Sección**
| Campo HTML | Campo Firestore | Valor por Defecto | Descripción |
|------------|----------------|-------------------|-------------|
| `db-form-title` | `form_title` | "Envíanos un Mensaje" | Título del formulario de contacto |
| `db-faq-title` | `faq_title` | "Preguntas Frecuentes" | Título de la sección de FAQs |

### **Labels del Formulario**
| Campo HTML | Campo Firestore | Valor por Defecto | Descripción |
|------------|----------------|-------------------|-------------|
| `lbl-name` | `lbl_name` | "Nombre Completo *" | Label del campo nombre |
| `lbl-email` | `lbl_email` | "Email *" | Label del campo email |
| `lbl-phone` | `lbl_phone` | "Teléfono" | Label del campo teléfono |
| `lbl-message` | `lbl_message` | "Mensaje *" | Label del campo mensaje |

### **Emojis**
| Campo HTML | Campo Firestore | Valor por Defecto | Descripción |
|------------|----------------|-------------------|-------------|
| `db-emoji-header` | `emoji_header` | "⚾" | Emoji del header |
| `db-emoji-faq` | `emoji_faq` | "⚾" | Emoji de las FAQs |

### **Botones**
| Campo HTML | Campo Firestore | Valor por Defecto | Descripción |
|------------|----------------|-------------------|-------------|
| `db-btn-text` | `btn_enviar` | "Enviar Mensaje" | Texto del botón de envío |
| `db-btn-enviar` | (contenedor) | - | Contenedor del botón (SVG + texto) |

### **Placeholders de Inputs**
| Campo HTML | Campo Firestore | Valor por Defecto | Descripción |
|------------|----------------|-------------------|-------------|
| `input-name` | `placeholder_name` | "Tu nombre" | Placeholder del campo nombre |
| `input-email` | `placeholder_email` | "tu@email.com" | Placeholder del campo email |
| `input-phone` | `placeholder_phone` | "+34 600 000 000" | Placeholder del campo teléfono |
| `input-message` | `placeholder_message` | "¿En qué podemos ayudarte?" | Placeholder del campo mensaje |

### **Títulos de Tarjetas de Información**
| Campo HTML | Campo Firestore | Valor por Defecto | Descripción |
|------------|----------------|-------------------|-------------|
| `title-direccion` | `title_direccion` | "Dirección" | Título de la tarjeta de dirección |
| `title-tel` | `title_tel` | "Teléfono" | Título de la tarjeta de teléfono |
| `title-email` | `title_email` | "Email" | Título de la tarjeta de email |
| `title-horario` | `title_horario` | "Horario" | Título de la tarjeta de horario |

### **Información de Contacto**
| Campo HTML | Campo Firestore | Valor por Defecto | Descripción |
|------------|----------------|-------------------|-------------|
| `info-direccion` | `direccion` | "C. Maíz, 11, Usera, 28026 Madrid" | Dirección completa |
| `info-tel` | `tel_contacto` | "+34 613 98 49 65" | Teléfono de contacto |
| `info-email` | `email_contacto` | "info@grandslammarket.com" | Email de contacto |
| `info-horario` | `horario_tienda` | "Lunes-Viernes 8:00-21:00" | Horario de atención |
| `db-map` | `ubicacion_mapa` | "URL del mapa de Google" | URL del iframe del mapa |

### **FAQs (Preguntas y Respuestas)**
| Campo HTML | Campo Firestore | Valor por Defecto | Descripción |
|------------|----------------|-------------------|-------------|
| `faq-q1` | `faq_q1` | "¿Hacéis entregas a domicilio?" | Pregunta 1 |
| `faq-a1` | `faq_a1` | "Sí, realizamos entregas en toda la zona metropolitana de Madrid. Pedidos mínimos de 30¡. ¡Gratis para compras superiores a 60¡!" | Respuesta 1 |
| `faq-q2` | `faq_q2` | "¿Tenéis productos orgánicos?" | Pregunta 2 |
| `faq-a2` | `faq_a2` | "Contamos con una amplia selección de productos orgánicos y ecológicos certificados en todas las categorías." | Respuesta 2 |
| `faq-q3` | `faq_q3` | "¿Cómo me uno al programa de puntos?" | Pregunta 3 |
| `faq-a3` | `faq_a3` | "Solo necesitas registrarte con tus datos y automáticamente empezarás a acumular puntos con cada compra. ¡Es gratis!" | Respuesta 3 |
| `faq-q4` | `faq_q4` | "¿Aceptáis devoluciones?" | Pregunta 4 |
| `faq-a4` | `faq_a4` | "Garantizamos la calidad de todos nuestros productos. Si no estás satisfecho, realizamos devoluciones sin preguntas." | Respuesta 4 |

## Ejemplo Completo de Documento en Firestore

```javascript
// Documento: Contact/contact_texts
{
  // Contenido Principal
  "titulo_principal": "¡Contacta con Nosotros!",
  "desc_principal": "Estamos aquí para ayudarte. Envíanos tu mensaje y nuestro equipo te responderá en menos de 24 horas.",
  
  // Títulos de Sección
  "form_title": "Envíanos un Mensaje",
  "faq_title": "Preguntas Frecuentes",
  
  // Labels del Formulario
  "lbl_name": "Nombre Completo *",
  "lbl_email": "Email *",
  "lbl_phone": "Teléfono",
  "lbl_message": "Mensaje *",
  
  // Botones
  "btn_enviar": "Enviar Mensaje",
  
  // Información de Contacto
  "direccion": "C. Maíz, 11, Usera, 28026 Madrid",
  "tel_contacto": "+34 613 98 49 65",
  "email_contacto": "info@grandslammarket.com",
  "horario_tienda": "Lunes-Viernes 8:00-21:00",
  "ubicacion_mapa": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3038.563724361555!2d-3.69345!3d40.396!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd4226260a95e09f%3A0x6d9f3b1b1b1b1b1b!2sCalle%20del%20Ma%C3%ADz%2C%2011%2C%2028045%20Madrid!5e0!3m2!1ses!2ses!4v1700000000000!5m2!1ses!2ses",
  
  // FAQs
  "faq_q1": "¿Hacéis entregas a domicilio?",
  "faq_a1": "Sí, realizamos entregas en toda la zona metropolitana de Madrid. Pedidos mínimos de 30¡. ¡Gratis para compras superiores a 60¡!",
  "faq_q2": "¿Tenéis productos orgánicos?",
  "faq_a2": "Contamos con una amplia selección de productos orgánicos y ecológicos certificados en todas las categorías.",
  "faq_q3": "¿Cómo me uno al programa de puntos?",
  "faq_a3": "Solo necesitas registrarte con tus datos y automáticamente empezarás a acumular puntos con cada compra. ¡Es gratis!",
  "faq_q4": "¿Aceptáis devoluciones?",
  "faq_a4": "Garantizamos la calidad de todos nuestros productos. Si no estás satisfecho, realizamos devoluciones sin preguntas."
}
```

## Características del Sistema

### **Fallback Automático**
- Si un campo no existe en Firestore, el HTML mantiene su valor por defecto
- No se rompe la página si faltan campos
- Todos los campos son opcionales excepto los básicos de contacto

### **Responsive Design**
- Los textos largos se ajustan automáticamente con `word-wrap: break-word`
- Diseño adaptado para móviles con `clamp()` para tamaños de fuente
- Animaciones suaves al actualizar textos

### **Logging y Depuración**
- Cada campo actualizado se registra en la consola
- Errores específicos para problemas de conexión
- Mensajes de confirmación para datos cargados correctamente

## Pasos para Configurar

1. **Ve a Firebase Console** > Firestore Database
2. **Crea la colección** "Contact"
3. **Crea el documento** "contact_texts"
4. **Añade los campos** según la tabla anterior
5. **Actualiza las reglas** de seguridad si es necesario
6. **Prueba la página** en http://localhost:8080/Contacto/Contacto.html

## Notas Importantes

- **Todos los nombres de campos son en minúsculas** y usan guiones bajos
- **Los campos son opcionales** - la página funciona con los valores por defecto
- **Los textos pueden ser multilingües** - simplemente cambia los valores en Firestore
- **El sistema es 100% dinámico** - cualquier cambio en Firestore se refleja inmediatamente
