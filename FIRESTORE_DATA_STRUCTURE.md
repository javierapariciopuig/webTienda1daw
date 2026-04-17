# Estructura de Datos en Firestore - Grand Slam Market

## Colección: Contacto

### Documento: "textos de contacto"
```javascript
{
  "corrido electrónico": "info@grandslammarket.com",
  "email_ventas": "ventas@grandslammarket.com",
  "tele contacto": "+34 613 98 49 65",
  "dirección contacto": "C. Maiz, 11, Usera",
  "dirección_contacto_linea2": "28026 Madrid, España",
  "ubicacion_mapa": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3038.563724361555!2d-3.69345!3d40.396!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd4226260a95e09f%3A0x6d9f3b1b1b1b1b1b!2sCalle%20del%20Ma%C3%ADz%2C%2011%2C%2028045%20Madrid!5e0!3m2!1ses!2ses!4v1700000000000!5m2!1ses!2ses"
}
```

### Documento: "imágenes_de_contacto"
```javascript
{
  "imagen1": "https://example.com/imagen-tienda.jpg",
  "imagen2": "https://example.com/logo-grandslam.png"
}
```

## Mapeo de IDs HTML con Campos de Firestore

| Elemento HTML | ID | Campo Firestore | Documento |
|---------------|----|-----------------|-----------|
| Email principal | `info-email` | `corrido electrónico` | textos de contacto |
| Email ventas | `info-email-ventas` | `email_ventas` | textos de contacto |
| Teléfono | `info-tel` | `tele contacto` | textos de contacto |
| Dirección línea 1 | `info-direccion-line1` | `dirección contacto` | textos de contacto |
| Dirección línea 2 | `info-direccion-line2` | `dirección_contacto_linea2` | textos de contacto |
| Mapa | `db-map` | `ubicacion_mapa` | textos de contacto |
| Imagen principal | `img-firebase` | `imagen1` | imágenes_de_contacto |

## Pasos para Configurar los Datos en Firestore

### 1. Accede a Firebase Console
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: "web-tienda-14323"

### 2. Crea la Colección "Contacto"
1. En el menú izquierdo, haz clic en "Firestore Database"
2. Haz clic en "Iniciar colección"
3. Nombre de la colección: `Contacto`
4. Haz clic en "Siguiente"

### 3. Crea el Documento "textos de contacto"
1. ID del documento: `textos de contacto`
2. Agrega los siguientes campos:
   - **corrido electrónico** (string): `info@grandslammarket.com`
   - **email_ventas** (string): `ventas@grandslammarket.com`
   - **tele contacto** (string): `+34 613 98 49 65`
   - **dirección contacto** (string): `C. Maiz, 11, Usera`
   - **dirección_contacto_linea2** (string): `28026 Madrid, España`
   - **ubicacion_mapa** (string): `[URL del mapa de Google]`

### 4. Crea el Documento "imágenes_de_contacto"
1. Haz clic en "Añadir documento"
2. ID del documento: `imágenes_de_contacto`
3. Agrega los siguientes campos:
   - **imagen1** (string): `[URL de la imagen principal]`

## Características Implementadas

### Firebase v9 Modular SDK
- Usa la sintaxis moderna de Firebase v9
- Importaciones específicas para optimizar el bundle
- Manejo de errores mejorado
- Console logging para depuración

### Actualización Dinámica del DOM
- Los elementos HTML se actualizan automáticamente desde Firestore
- Manejo de elementos faltantes (no causa errores si un ID no existe)
- Múltiples intentos de carga para asegurar inicialización correcta

### Manejo de Errores
- Console logging detallado para depuración
- Mensajes de ayuda para verificar configuración
- No interrumpe la funcionalidad si Firebase no está disponible

## Pruebas y Verificación

### 1. Console Logging
Abre la consola del navegador y busca:
- `Cargando datos dinámicos desde Firestore...`
- `Datos de textos encontrados: [objeto]`
- `Datos de imágenes encontrados: [objeto]`

### 2. Verificación Visual
- Los textos en la página deben coincidir con los datos en Firestore
- La imagen principal debe cargarse desde la URL en Firestore
- El mapa debe mostrar la URL configurada

### 3. Errores Comunes
- **"No se encontró el documento"**: Verifica que los documentos existan en Firestore
- **"Firebase no está inicializado"**: Verifica la configuración de Firebase
- **"Error de permisos"**: Revisa las reglas de seguridad de Firestore

## Notas Importantes

1. **Nombres de Campos**: Los nombres de campos en Firestore deben coincidir exactamente con los usados en el código JavaScript
2. **Tipos de Datos**: Todos los campos son strings (texto)
3. **URLs**: Las URLs deben ser completas y accesibles públicamente
4. **Actualización en Tiempo Real**: Para actualizaciones en tiempo real, considera usar `onSnapshot` en lugar de `getDoc`
