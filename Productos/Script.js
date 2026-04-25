// Variables globales
let products = [];
let firebaseProducts = [];
let currentCategory = 'alimentacion';
let isLoading = false; // Control de renderizado para evitar bucles infinitos
let searchQuery = '';

// Sistema de abortación para peticiones Firebase
let currentFirebaseRequest = null;
let requestAbortController = null;

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    loadProductsFromStorage();
    loadFirebaseProducts();
    renderProducts();
});


window.handleSearch = function(searchTerm) {
    searchQuery = searchTerm.toLowerCase();
    renderProducts();
};

window.showNewProductForm = showNewProductForm;
window.closeProductModal = closeProductModal;
window.handleProductSubmit = handleProductSubmit;

// Función para inicializar todos los event listeners
function initializeEventListeners() {
    // Botón de nuevo producto
    const newProductBtn = document.querySelector('.btn-new-product');
    if (newProductBtn) {
        newProductBtn.addEventListener('click', showNewProductForm);
    }
    
    // Búsqueda
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            window.handleSearch(e.target.value);
        });
    }
    
    // Categorías - usar onclick en HTML en lugar de addEventListener
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        const category = button.getAttribute('data-category');
        button.onclick = () => window.filterCategory(category);
    });
    
    // Botones de editar y eliminar
    document.addEventListener('click', function(event) {
        if (event.target.closest('.btn-edit')) {
            handleEditProduct(event.target.closest('.btn-edit'));
        }
        if (event.target.closest('.btn-delete')) {
            handleDeleteProduct(event.target.closest('.btn-delete'));
        }
    });
}

// Función para manejar el cambio de categoría
function handleCategoryChange(event) {
    const button = event.target;
    const category = button.getAttribute('data-category');
    
    // Actualizar botón activo
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    button.classList.add('active');
    
    // Actualizar categoría actual
    currentCategory = category;
    
    // Renderizar productos filtrados
    renderProducts();
}

// Función para manejar la búsqueda
function handleSearch(event) {
    searchQuery = event.target.value.toLowerCase();
    renderProducts();
}

// Función para mostrar formulario de nuevo producto
function showNewProductForm() {
    const modal = createProductModal();
    document.body.appendChild(modal);
    
    // Mostrar modal con animación
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

// Función para crear modal de producto
function createProductModal(product = null) {
    const modal = document.createElement('div');
    modal.className = 'product-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeProductModal()"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>${product ? 'Editar Producto' : 'Nuevo Producto'}</h2>
                <button class="modal-close" onclick="closeProductModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form class="product-form" onsubmit="handleProductSubmit(event, ${product ? product.id : 'null'})">
                <div class="form-group">
                    <label for="productName">Nombre del Producto</label>
                    <input type="text" id="productName" name="name" required
                           value="${product ? product.name : ''}" placeholder="Ej: Pasta Italiana">
                </div>
                <div class="form-group">
                    <label for="productCategory">Categoría</label>
                    <select id="productCategory" name="category" required>
                        <option value="alimentacion" ${product && product.category === 'alimentacion' ? 'selected' : ''}>ALIMENTACIÓN</option>
                        <option value="panaderia" ${product && product.category === 'panaderia' ? 'selected' : ''}>PANADERÍA</option>
                        <option value="limpieza" ${product && product.category === 'limpieza' ? 'selected' : ''}>LIMPIEZA</option>
                        <option value="higiene" ${product && product.category === 'higiene' ? 'selected' : ''}>HIGIENE</option>
                        <option value="bebidas" ${product && product.category === 'bebidas' ? 'selected' : ''}>BEBIDAS</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="productDescription">Descripción</label>
                    <textarea id="productDescription" name="description" required
                              placeholder="Ej: Pasta de sémola de trigo">${product ? product.description : ''}</textarea>
                </div>
                <div class="form-group">
                    <label for="productPrice">Precio (€)</label>
                    <input type="number" id="productPrice" name="price" step="0.01" min="0" required
                           value="${product ? product.price : ''}" placeholder="1.99">
                </div>
                <div class="form-group">
                    <label for="productUnit">Unidad</label>
                    <select id="productUnit" name="unit" required>
                        <option value="/kg" ${product && product.unit === '/kg' ? 'selected' : ''}>/kg</option>
                        <option value="/ud" ${product && product.unit === '/ud' ? 'selected' : ''}>/ud</option>
                        <option value="/l" ${product && product.unit === '/l' ? 'selected' : ''}>/l</option>
                        <option value="/bot" ${product && product.unit === '/bot' ? 'selected' : ''}>/bot</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="productImage">Imagen (URL)</label>
                    <input type="text" id="productImage" name="image" 
                           value="${product ? (product.imagen || product.image || '') : ''}" 
                           placeholder="https://ejemplo.com/imagen.jpg">
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-cancel" onclick="closeProductModal()">Cancelar</button>
                    <button type="submit" class="btn-save">${product ? 'Guardar Cambios' : 'Crear Producto'}</button>
                </div>
            </form>
        </div>
    `;
    
    // Agregar estilos CSS para el modal
    // addModalStyles(); // Comentado o eliminado si no se usa
    
    return modal;
}

// Función para manejar el envío del formulario
function handleProductSubmit(event, productId) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const productData = {
        name: formData.get('name'),
        category: formData.get('category'),
        description: formData.get('description'),
        price: parseFloat(formData.get('price')),
        unit: formData.get('unit'),
        image: formData.get('image') || '',
        id: productId || Date.now()
    };
    
    if (productId) {
        // Editar producto existente
        const index = products.findIndex(p => p.id === productId);
        if (index !== -1) {
            products[index] = productData;
            showNotification('Producto actualizado correctamente', '#27ae60');
        }
    } else {
        // Crear nuevo producto
        products.push(productData);
        showNotification('Producto creado correctamente', '#27ae60');
    }
    
    saveProductsToStorage();
    renderProducts();
    closeProductModal();
}

// Función para cerrar modal
function closeProductModal() {
    const modal = document.querySelector('.product-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Función para editar producto
function handleEditProduct(button) {
    const productCard = button.closest('.product-card');
    const productName = productCard.querySelector('.product-title').textContent;
    const product = products.find(p => p.name === productName);
    
    if (product) {
        const modal = createProductModal(product);
        document.body.appendChild(modal);
        
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }
}

// Función para eliminar producto
function handleDeleteProduct(button) {
    const productCard = button.closest('.product-card');
    const productName = productCard.querySelector('.product-title').textContent;
    
    if (confirm(`¿Estás seguro de que quieres eliminar "${productName}"?`)) {
        const index = products.findIndex(p => p.name === productName);
        if (index !== -1) {
            products.splice(index, 1);
            saveProductsToStorage();
            renderProducts();
            showNotification('Producto eliminado correctamente', '#e74c3c');
        }
    }
}

// Función para renderizar productos
function renderProducts() {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;
    
    // LIMPIAR: Ocultar TODOS los productos primero
    const allProducts = productsGrid.querySelectorAll('.product-card');
    allProducts.forEach(card => {
        card.style.display = 'none';
    });
    
    // MOSTRAR: Solo productos de la categoría seleccionada
    allProducts.forEach(card => {
        let cardCategory = '';
        
        // Detectar categoría del badge CSS
        const categoryBadge = card.querySelector('.category-badge');
        if (categoryBadge) {
            const classes = categoryBadge.className.split(' ');
            for (const cls of classes) {
                if (['alimentacion', 'panaderia', 'limpieza', 'higiene', 'bebidas'].includes(cls)) {
                    cardCategory = cls;
                    break;
                }
            }
        }
        
        // Para productos de Firebase, verificar data-category
        if (!cardCategory && card.getAttribute('data-category')) {
            cardCategory = card.getAttribute('data-category');
        }
        
        const cardTitle = card.querySelector('.product-title').textContent.toLowerCase();
        
        const matchesCategory = currentCategory === 'todos' || cardCategory === currentCategory;
        const matchesSearch = searchQuery === '' || cardTitle.includes(searchQuery);
        
        if (matchesCategory && matchesSearch) {
            card.style.display = 'flex';
        }
    });
    
    // Añadir productos de Firebase que faltan
    firebaseProducts.forEach(firebaseProduct => {
        const existingFirebaseCard = productsGrid.querySelector(`[data-firebase-id="${firebaseProduct.id}"]`);
        
        if (!existingFirebaseCard) {
            // VERIFICAR ANTES DE CREAR: Si el nombre es 'Sin nombre' o está vacío, NO crear tarjeta
            if (!firebaseProduct.nombre || 
                firebaseProduct.nombre.trim() === '' || 
                firebaseProduct.nombre === 'Sin nombre') {
                console.log(" BORRADO: Producto sin nombre válido - NO se creará tarjeta:", firebaseProduct.nombre);
                return; // No crear ni añadir nada
            }
            
            const firebaseCard = createFirebaseProductCard(firebaseProduct);
            // Solo añadir si la tarjeta fue creada (no es null)
            if (firebaseCard) {
                productsGrid.appendChild(firebaseCard);
                console.log(" AÑADIDO: Producto válido agregado a la pantalla:", firebaseProduct.nombre);
            }
        }
    });
}

// Función para crear tarjeta de producto
function createProductCard(product) {
    const categoryLabels = {
        alimentacion: 'ALIMENTACIÓN',
        panaderia: 'PANADERÍA',
        limpieza: 'LIMPIEZA',
        higiene: 'HIGIENE',
        bebidas: 'BEBIDAS'
    };
    
    // URLs de imágenes reales para cada producto
    const productImages = {
        'Pasta Italiana': 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=300&h=180&fit=crop&crop=center',
        'Pan Integral': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=180&fit=crop&crop=center',
        'Limpiador Multiuso': 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=180&fit=crop&crop=center',
        'Jabón de Manos': 'https://images.unsplash.com/photo-1584303299760-0f4f213d7ebb?w=300&h=180&fit=crop&crop=center',
        'Agua Mineral': 'https://images.unsplash.com/photo-1548839140-29a7262b5321?w=300&h=180&fit=crop&crop=center',
        'Tomates Frescos': 'https://images.unsplash.com/photo-1518977676601-b53f02bad675?w=400'
    };
    
    const imageUrl = productImages[product.name] || `https://via.placeholder.com/250x180/f0f0f0/333?text=${encodeURIComponent(product.name.substring(0, 10))}`;
    
    const card = document.createElement('article');
    card.className = `product-card ${product.category}`;
    card.innerHTML = `
        <img src="${imageUrl}" alt="${product.name}" class="product-image">
        <div class="product-content">
            <div class="product-header">
                <h3 class="product-title">${product.name}</h3>
                <span class="category-badge ${product.category}">${categoryLabels[product.category]}</span>
            </div>
            <p class="product-description">${product.description}</p>
            <p class="product-price">${product.price.toFixed(2)}<span class="currency">€</span></p>
        </div>
        <div class="product-actions">
            <button class="btn-edit" onclick="editProduct(${product.id})">
                <i class="fas fa-edit"></i>
                Editar
            </button>
            <button class="btn-delete" onclick="deleteProduct(${product.id}, '${product.name}')">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    return card;
}

// Función para crear tarjeta de producto de Firebase
function createFirebaseProductCard(product) {
    // Usar el nombre ya mapeado por mapProductFields
    const productName = product.nombre;
    
    // NO dibujar productos sin nombre o vacíos
    if (!productName || productName.trim() === '' || productName === 'Sin nombre') {
        console.log("⚠️ Ignorando producto sin nombre válido:", productName);
        return null;
    }
    
    // Usar la categoría ya normalizada por mapProductFields
    const normalizedCategory = product.categoria || 'alimentacion';
    
    console.log("Creando tarjeta para producto:", productName, "categoría:", normalizedCategory, "path:", product.path);
    
    const categoryNames = {
        'alimentacion': 'ALIMENTACIÓN',
        'panaderia': 'PANADERÍA',
        'limpieza': 'LIMPIEZA',
        'higiene': 'HIGIENE',
        'bebidas': 'BEBIDAS'
    };
    
    // Usar la imagen con fallback para imágenes vacías
    let imageUrl = product.img || product.imagen || getProductImage(normalizedCategory);
    
    // Fallback adicional si la imagen está vacía o es inválida
    if (!imageUrl || imageUrl.trim() === '') {
        imageUrl = getProductImage(normalizedCategory);
        console.log(`🖼️ Usando imagen por defecto para ${productName} (imagen vacía)`);
    }
    
    // Fallback final a una imagen genérica si getCategoryImage falla
    if (!imageUrl) {
        imageUrl = 'https://images.unsplash.com/photo-1542838132-92c5330e8850?w=300&h=200&fit=crop&crop=center';
        console.log(`🖼️ Usando imagen genérica para ${productName} (fallback final)`);
    }
    
    const card = document.createElement('article');
    card.className = `product-card ${product.categoria}`; // ✅ FIXED: Use product.categoria for CSS class
    card.classList.add(product.categoria.toLowerCase()); // ✅ FIXED: Add category as class for filtering
    card.setAttribute('data-category', product.categoria); // ✅ FIXED: Use product.categoria for data attribute
    card.setAttribute('data-firebase-id', product.id);
    card.setAttribute('data-path', product.route || product.path || ''); // ✅ FIXED: Ensure .route property is used
    card.innerHTML = `
        <img src="${imageUrl}" alt="${productName}" class="product-image">
        <div class="product-content">
            <div class="product-header">
                <h3 class="product-title">${productName}</h3>
                <span class="category-badge ${normalizedCategory}">${categoryNames[normalizedCategory]}</span>
            </div>
            <p class="product-price">${parseFloat(product.precio).toFixed(2)}€</p>
            <div class="product-actions">
                <button class="btn-edit" onclick="editProduct(${product.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-delete" onclick="deleteProduct(${product.id}, '${productName}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    
    console.log("✅ Tarjeta creada para:", productName, "desde:", product.path);
    return card;
}

// Función para mostrar notificaciones
function showNotification(message, color = '#3498db') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${color};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        max-width: 350px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Función para mostrar mensaje cuando no hay productos
function showEmptyMessage() {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;
    
    // Añadir mensaje de vacío sin borrar productos existentes
    const existingEmptyMessage = productsGrid.querySelector('.empty-firebase-message');
    if (existingEmptyMessage) return;
    
    const emptyMessage = document.createElement('div');
    emptyMessage.className = 'empty-firebase-message';
    emptyMessage.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: #666;">
            <i class="fas fa-box-open" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
            <p style="font-size: 1.2rem; margin: 0;">No hay productos en esta categoría</p>
        </div>
    `;
    
    productsGrid.appendChild(emptyMessage);
}

// Función para limpiar productos HTML hardcoded
function clearHTMLProducts() {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;
    
    console.log("🧹 Limpiando productos HTML hardcoded...");
    
    // Eliminar todos los productos que no tienen data-firebase-id (son los del HTML)
    const htmlProducts = productsGrid.querySelectorAll('.product-card:not([data-firebase-id])');
    htmlProducts.forEach(card => {
        console.log("🗑️ Eliminando producto HTML:", card.querySelector('.product-title')?.textContent);
        card.remove();
    });
    
    console.log(`✅ Se eliminaron ${htmlProducts.length} productos HTML hardcoded`);
}

// Función para añadir productos de Firebase al DOM
function addFirebaseProductsToDOM() {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;
    
    firebaseProducts.forEach(product => {
        const existingCard = productsGrid.querySelector(`[data-firebase-id="${product.id}"]`);
        if (!existingCard) {
            const card = createFirebaseProductCard(product);
            if (card) {
                productsGrid.appendChild(card);
                
                // Añadir listener funcional al botón de editar
                const editBtn = card.querySelector('.btn-edit');
                if (editBtn) {
                    editBtn.addEventListener('click', () => {
                        console.log(`🔧 Click en editar producto: ${product.nombre}`);
                        editProduct(product.id);
                    });
                }
                
                // Añadir listener funcional al botón de eliminar
                const deleteBtn = card.querySelector('.btn-delete');
                if (deleteBtn) {
                    deleteBtn.addEventListener('click', () => {
                        console.log(`�️ Click en eliminar producto: ${product.nombre}`);
                        deleteProduct(product.id, product.nombre);
                    });
                }
                
                console.log("✅ Producto añadido al DOM con listeners:", product.nombre);
            }
        }
    });
}

// Función para guardar productos en localStorage
function saveProductsToStorage() {
    localStorage.setItem('products', JSON.stringify(products));
}

// Función para cargar textos dinámicos en tiempo real desde Firebase
function loadDynamicTexts() {
    try {
        console.log("🔥 Configurando listener en tiempo real para ProductosPanel/textos");
        
        if (!window.db) {
            console.log("ERROR: window.db no está disponible para cargar textos");
            return;
        }
        
        // Configurar listener en tiempo real para textos (con limpieza de tabuladores)
        const unsubscribeTexts = window.db.collection('ProductosPanel').doc('textos').onSnapshot((docSnapshot) => {
            if (docSnapshot.exists) {
                const rawData = docSnapshot.data();
                console.log("📡 Datos crudos de Firebase:", rawData);
                
                // Limpiar claves con tabuladores y espacios invisibles
                const texts = {};
                Object.keys(rawData).forEach(key => {
                    const cleanKey = key.trim(); // Eliminar tabuladores y espacios
                    texts[cleanKey] = rawData[key];
                    console.log(`🔧 Limpieza de clave: "${key}" → "${cleanKey}"`);
                });
                
                console.log("📡 Textos limpios:", texts);
                
                // Actualizar título solo si cambió
                const titleElement = document.querySelector('.main-title');
                if (titleElement && texts.titulo) {
                    const newTitle = texts.titulo.trim();
                    if (titleElement.textContent !== newTitle) {
                        titleElement.textContent = newTitle;
                        console.log("✅ Título actualizado:", newTitle);
                    }
                }
                
                // Actualizar subtítulo solo si cambió
                const subtitleElement = document.querySelector('.subtitle');
                if (subtitleElement && texts.subtitulo) {
                    const newSubtitle = texts.subtitulo.trim();
                    if (subtitleElement.textContent !== newSubtitle) {
                        subtitleElement.textContent = newSubtitle;
                        console.log("✅ Subtítulo actualizado:", newSubtitle);
                    }
                }
                
                // Actualizar placeholder solo si cambió
                const searchInput = document.querySelector('.search-input');
                if (searchInput && texts.placeholderBusqueda) {
                    const newPlaceholder = texts.placeholderBusqueda.trim();
                    if (searchInput.placeholder !== newPlaceholder) {
                        searchInput.placeholder = newPlaceholder;
                        console.log("✅ Placeholder búsqueda actualizado:", newPlaceholder);
                    }
                }
                
                // Actualizar botón solo si cambió
                const newProductBtn = document.querySelector('.btn-new-product');
                if (newProductBtn && texts.botonNuevo) {
                    const newButtonText = texts.botonNuevo.trim();
                    const currentText = newProductBtn.textContent.replace('✕', '').trim();
                    if (currentText !== newButtonText) {
                        newProductBtn.innerHTML = `<i class="fas fa-plus"></i> ${newButtonText}`;
                        console.log("✅ Botón nuevo producto actualizado:", newButtonText);
                    }
                }
                
            } else {
                console.log("⚠️ No se encontró el documento 'textos' en ProductosPanel");
            }
        }, (error) => {
            console.log("❌ Error en listener de textos:", error);
        });
        
        // Guardar referencia para limpiar listener si es necesario
        window.textsUnsubscribe = unsubscribeTexts;
        
    } catch (error) {
        console.log("❌ Error al configurar listener de textos:", error);
    }
}

// Función para mapeo exacto de campos de Firebase
function mapProductFields(product, docId, categoryPath) {
    // Mapeo EXACTO de imagen: siempre 'img'
    const imageUrl = (product.img || '').trim();
    
    // Mapeo EXACTO de nombre: siempre 'nombre'
    const productName = (product.nombre || '').trim();
    
    // Mapeo EXACTO de precio: parseFloat(precio).toFixed(2)
    const price = parseFloat(product.precio) || 0;
    
    // Mapeo EXACTO de descripción: siempre 'desc'
    const description = (product.desc || '').trim();
    
    // Normalización de categoría
    let normalizedCategory = normalizeText(categoryPath);
    
    // Mapeo de categorías específicas
    const categoryMapping = {
        'bebidas': 'bebidas',
        'higiene': 'higiene', 
        'limpieza': 'limpieza',
        'panaderia': 'panaderia',
        'alimentacion': 'alimentacion',
        'alimentación': 'alimentacion' // Manejar tilde
    };
    
    normalizedCategory = categoryMapping[normalizedCategory] || 'alimentacion';
    
    return {
        id: docId,
        nombre: productName || 'Sin nombre',
        precio: price,
        categoria: normalizedCategory,
        imagen: imageUrl,
        descripcion: description,
        path: categoryPath,
        ...product // Mantener otros campos originales
    };
}

// Estructura exacta de Firebase con nombres reales y rutas anidadas
const FIREBASE_ROUTES = {
    'alimentacion': ['alimentacion'],
    'Bebidas': ['Acoholicas', 'NoAlcoholicas'],
    'Panaderia': ['Pan'],
    'Higiene': ['Higiene'], // ✅ Sincronizado: productos/Higiene/Higiene
    'Limpieza': ['Detergentes'],
    'Lacteos': ['Lacteos'], // ✅ Sincronizado: productos/Lacteos/Lacteos
    'Snacks': ['FrutosSecos'], // productos/Snacks/FrutosSecos
    'SnacksGeneral': ['Doritos', 'Gusanitos'] // productos/SnacksGeneral/Doritos/Doritos y productos/SnacksGeneral/Gusanitos/Gusanitos
};

// Estructura para rutas anidadas (colecciones profundas)
const NESTED_FIREBASE_ROUTES = {
    'Doritos': {
        collection: 'productos',
        document: 'SnacksGeneral',
        subcollection: 'Doritos',
        nestedSubcollection: 'Doritos' // productos/SnacksGeneral/Doritos/Doritos/Doritos
    },
    'Gusanitos': {
        collection: 'productos',
        document: 'SnacksGeneral',
        subcollection: 'Gusanitos',
        nestedSubcollection: 'Gusanitos' // productos/SnacksGeneral/Gusanitos/Gusanitos/Gusanitos
    }
};


// Función para búsqueda específica por categoría - BASE DE DATOS productos (ESPAÑA)
async function searchSpecificCategory(category) {
    const products = [];
    
    // ✅ LIMPIEZA DE MEMORIA: Limpiar array antes de cargar
    firebaseProducts = [];
    console.log("🧹 Memoria limpiada: firebaseProducts = []");
    
    // ✅ normalizedCategory bien definida al principio para evitar ReferenceError
    const normalizedCategory = category.toLowerCase();
    
    console.log(`🔍 Iniciando carga específica para categoría: ${category} (${normalizedCategory}) - BASE productos`);
    
    // ✅ ALIMENTACIÓN: SOLO productos/alimentacion/alimentacion (FILTRO ESTRICTO SIN LÁCTEOS)
    if (normalizedCategory === 'alimentacion') {
        console.log("🍽️ CARGA ALIMENTACIÓN - productos/alimentacion/alimentacion (FILTRO ESTRICTO SIN LÁCTEOS)");
        
        try {
            // ✅ Forzar ruta exacta: productos/alimentacion/alimentacion
            const alimentacionSnapshot = await window.db.collection('productos')
                .doc('alimentacion')                 // ✅ minúscula exacta
                .collection('alimentacion')          // ✅ Sin normalización
                .get();
            
            console.log(`📊 Documentos encontrados en productos/alimentacion/alimentacion: ${alimentacionSnapshot.docs.length}`);
            
            alimentacionSnapshot.forEach((doc) => {
                const docData = doc.data();
                
                // ✅ FILTRO ESTRICTO: Excluir productos que parezcan lácteos
                const productName = (docData.nombre || '').toLowerCase();
                const isLacteo = productName.includes('leche') || productName.includes('queso') || productName.includes('lacteo');
                
                if (isLacteo) {
                    console.warn(`⚠️ PRODUCTO LÁCTEO FILTRADO: ${docData.nombre} - NO incluido en alimentación`);
                    return; // Saltar este producto
                }
                
                console.log(`🔍 CAMPOS LEÍDOS DE ALIMENTACIÓN DOC ${doc.id}:`, {
                    nombre: docData.nombre,
                    precio: docData.precio,
                    desc: docData.desc,
                    img: docData.img,
                    todosLosCampos: Object.keys(docData)
                });
                
                const product = {
                    id: doc.id,
                    nombre: docData.nombre || 'Sin nombre',
                    precio: parseFloat(docData.precio) || 0,
                    desc: docData.desc || '',
                    img: docData.img || '',
                    categoria: 'alimentacion',  // ✅ Etiqueta estricta: alimentacion
                    route: 'productos/alimentacion/alimentacion'
                };
                products.push(product);
                console.log(`✅ Producto Alimentación encontrado: ${product.nombre} (productos/alimentacion/alimentacion)`);
            });
            
            console.log(`🍽️ ALIMENTACIÓN CARGADA: ${products.length} productos encontrados (SIN LÁCTEOS)`);
            return products;
            
        } catch (error) {
            console.error("❌ Error cargando Alimentación:", error);
            return products;
        }
    }
    
    if (normalizedCategory === 'lacteos') {
    console.log("🥛 CARGA LÁCTEOS - Ruta Real");
    try {
        // 1. CARGAR LECHES (Ruta: productos -> Lacteos -> Leches)
        const lechesSnap = await window.db.collection('productos')
            .doc('Lacteos')
            .collection('Leches')
            .get();
        
        lechesSnap.forEach(doc => {
            products.push({
                id: doc.id,
                nombre: doc.data().nombre,
                precio: doc.data().precio,
                desc: doc.data().desc,
                img: doc.data().img,
                categoria: 'lacteos'
            });
        });

        // 2. CARGAR QUESOS (Ruta: productos -> Queso -> Queso)
        console.log('Intentando acceder a: productos > Lacteos > Leches y Queso > Queso > Queso');
        
        try {
            const quesosSnap = await window.db.collection('productos')
                .doc('Lacteos')
                .collection('Queso')
                .get();
            
            quesosSnap.forEach(doc => {
                products.push({
                    id: doc.id,
                    nombre: doc.data().nombre,
                    precio: doc.data().precio,
                    desc: doc.data().desc,
                    img: doc.data().img,
                    categoria: 'lacteos'
                });
            });
        } catch (quesoError) {
            console.error('Error detallado al cargar queso:', quesoError.message);
        }

        console.log(`✅ Lácteos listos: ${products.length} productos`);
        return products;
    } catch (error) {
        console.error("❌ Error cargando Lácteos:", error);
        return products;
    }
}
    
    // ✅ PANADERÍA: RUTA EXACTA productos > Panaderia > Pan (collection)
    if (normalizedCategory === 'panaderia') {
        console.log("🥐 CARGA PANADERÍA - productos/Panaderia/Pan (RUTA EXACTA)");
        
        try {
            // ✅ RUTA EXACTA: productos (col) > Panaderia (doc) > Pan (col)
            const panaderiaSnapshot = await window.db.collection('productos')
                .doc('Panaderia')                    // ✅ Documento Panaderia
                .collection('Pan')                    // ✅ Colección Pan (donde está la Barra de pan)
                .get();
            
            console.log(`📊 Documentos encontrados en productos/Panaderia/Pan: ${panaderiaSnapshot.docs.length}`);
            
            panaderiaSnapshot.forEach((doc) => {
                const docData = doc.data();
                console.log(`🔍 CAMPOS LEÍDOS DE PANADERÍA DOC ${doc.id}:`, {
                    nombre: docData.nombre,
                    precio: docData.precio,  // ✅ Precio es string
                    desc: docData.desc,
                    img: docData.img,
                    todosLosCampos: Object.keys(docData)
                });
                
                const product = {
                    id: doc.id,
                    nombre: docData.nombre || 'Sin nombre',
                    precio: parseFloat(docData.precio) || 0,  // ✅ Convertir string a número
                    desc: docData.desc || '',
                    img: docData.img || '',
                    categoria: 'panaderia',
                    route: 'productos/Panaderia/Pan'
                };
                products.push(product);
                console.log(`✅ Producto Panadería encontrado: ${product.nombre} (productos/Panaderia/Pan)`);
            });
            
            console.log(`🥐 PANADERÍA CARGADA: ${products.length} productos encontrados`);
            return products;
            
        } catch (error) {
            console.error("❌ Error cargando Panadería:", error);
            return products;
        }
    }
    
    // ✅ HIGIENE: Cargar colecciones completas
    if (normalizedCategory === 'higiene') {
        console.log("🧼 CARGA HIGIENE - Colecciones: productos/Higiene/Champú y productos/Higiene/Geles");
        try {
            // ✅ Cargar colección productos/Higiene/Champú (todos los documentos)
            console.log("🧴 Cargando Champús desde productos/Higiene/Champú");
            const champusSnapshot = await window.db.collection('productos')
                .doc('Higiene')
                .collection('Champú')
                .get();
            
            console.log(`📊 Champús encontrados: ${champusSnapshot.docs.length}`);
            
            champusSnapshot.forEach((doc) => {
                const data = doc.data();
                console.log(`🔍 CAMPOS LEÍDOS DE CHAMPÚ DOC ${doc.id}:`, {
                    nombre: data.nombre,
                    precio: data.precio,
                    desc: data.desc,
                    img: data.img,
                    todosLosCampos: Object.keys(data)
                });
                
                const product = {
                    id: doc.id,
                    nombre: data.nombre || 'Sin nombre',
                    precio: parseFloat(data.precio) || 0,
                    desc: data.desc || '',
                    img: data.img || '',
                    categoria: 'higiene',
                    route: 'productos/Higiene/Champú'
                };
                products.push(product);
                console.log(`✅ Champú encontrado: ${product.nombre}`);
            });
            
            // ✅ Cargar colección productos/Higiene/Geles (todos los documentos)
            console.log("🧴 Cargando Geles desde productos/Higiene/Geles");
            const gelesSnapshot = await window.db.collection('productos')
                .doc('Higiene')
                .collection('Geles')
                .get();
            
            console.log(`📊 Geles encontrados: ${gelesSnapshot.docs.length}`);
            
            gelesSnapshot.forEach((doc) => {
                const data = doc.data();
                console.log(`🔍 CAMPOS LEÍDOS DE GEL DOC ${doc.id}:`, {
                    nombre: data.nombre,
                    precio: data.precio,
                    desc: data.desc,
                    img: data.img,
                    todosLosCampos: Object.keys(data)
                });
                
                const product = {
                    id: doc.id,
                    nombre: data.nombre || 'Sin nombre',
                    precio: parseFloat(data.precio) || 0,
                    desc: data.desc || '',
                    img: data.img || '',
                    categoria: 'higiene',
                    route: 'productos/Higiene/Geles'
                };
                products.push(product);
                console.log(`✅ Gel encontrado: ${product.nombre}`);
            });
            
            console.log(`🧼 HIGIENE CARGADA: ${products.length} productos totales (Champús + Geles)`);
            return products;
            
        } catch (error) {
            console.error("❌ Error cargando Higiene:", error);
            console.log("🔍 Verifica que las rutas en Firebase sean:");
            console.log("   - productos > Higiene (doc) > Champú (col)");
            console.log("   - productos > Higiene (doc) > Geles (col)");
            return products;
        }
    }
    
    // ✅ SNACKS (NORMALES): productos/Snacks/FrutosSecos + productos/SnacksGeneral routes
    if (normalizedCategory === 'snacks') {
        console.log("🍿 CARGA SNACKS NORMALES - BASE productos (NO LATINO)");
        
        // Ruta A: productos/Snacks/FrutosSecos
        try {
            console.log("🥜 Cargando FrutosSecos desde productos/Snacks/FrutosSecos...");
            const frutosSecosSnapshot = await window.db.collection('productos')
                .doc('Snacks')
                .collection('FrutosSecos')
                .get();
            
            console.log(`📊 FrutosSecos encontrados: ${frutosSecosSnapshot.docs.length} documentos`);
            
            frutosSecosSnapshot.forEach((doc) => {
                const product = {
                    id: doc.id,
                    nombre: doc.data().nombre || 'Sin nombre',
                    precio: parseFloat(doc.data().precio) || 0,
                    desc: doc.data().desc || '',
                    img: doc.data().img || '',
                    categoria: 'snacks',
                    route: 'productos/Snacks/FrutosSecos'
                };
                products.push(product);
                console.log(`✅ FrutoSeco encontrado: ${product.nombre} (productos/Snacks/FrutosSecos)`);
            });
        } catch (error) {
            console.error("❌ Error cargando FrutosSecos:", error);
        }
        
        // Ruta B: productos/Snacks/SnacksGeneral/Doritos/Doritos
        try {
            console.log("🍿 Cargando Doritos desde productos/Snacks/SnacksGeneral/Doritos/Doritos...");
            const doritosSnapshot = await window.db.collection('productos')
                .doc('Snacks')
                .collection('SnacksGeneral')
                .doc('Doritos')
                .collection('Doritos')
                .get();
            
            console.log(`📊 Doritos encontrados: ${doritosSnapshot.docs.length} documentos`);
            
            doritosSnapshot.forEach((doc) => {
                const product = {
                    id: doc.id,
                    nombre: doc.data().nombre || 'Sin nombre',
                    precio: parseFloat(doc.data().precio) || 0,
                    desc: doc.data().desc || '',
                    img: doc.data().img || '',
                    categoria: 'snacks',
                    route: 'productos/Snacks/SnacksGeneral/Doritos/Doritos'
                };
                products.push(product);
                console.log(`✅ Dorito encontrado: ${product.nombre} (productos/Snacks/SnacksGeneral/Doritos/Doritos)`);
            });
        } catch (error) {
            console.error("❌ Error cargando Doritos:", error);
        }
        
        // Ruta C: productos/Snacks/SnacksGeneral/Doritos/Gusanitos/Gusanitos (RUTA PROFUNDA)
        try {
            console.log("🐛 Cargando Gusanitos desde ruta profunda: productos/Snacks/SnacksGeneral/Doritos/Gusanitos/Gusanitos");
            const gusanitosDeepSnapshot = await window.db.collection('productos')
                .doc('Snacks')
                .collection('SnacksGeneral')
                .doc('Doritos')
                .collection('Gusanitos')
                .get();
            
            console.log(`📊 Gusanitos encontrados (ruta profunda): ${gusanitosDeepSnapshot.docs.length} documentos`);
            
            gusanitosDeepSnapshot.forEach((doc) => {
                const product = {
                    id: doc.id,
                    nombre: doc.data().nombre || 'Sin nombre',
                    precio: parseFloat(doc.data().precio) || 0,
                    desc: doc.data().desc || '',
                    img: doc.data().img || '',
                    categoria: 'snacks',
                    route: 'productos/Snacks/SnacksGeneral/Doritos/Gusanitos/Gusanitos'
                };
                products.push(product);
                console.log(`✅ Gusanito encontrado: ${product.nombre} (ruta profunda)`);
            });
        } catch (error) {
            console.error("❌ Error cargando Gusanitos (ruta profunda):", error);
        }
        
        // Ruta D: productos/Snacks/Gusanitos (simplificada)
        try {
            console.log("🐛 Intentando Gusanitos desde ruta simplificada: productos/Snacks/Gusanitos");
            const gusanitosSnapshot = await window.db.collection('productos')
                .doc('Snacks')
                .collection('Gusanitos')
                .get();
            
            console.log(`📊 Gusanitos encontrados (ruta simple): ${gusanitosSnapshot.docs.length} documentos`);
            
            gusanitosSnapshot.forEach((doc) => {
                const product = {
                    id: doc.id,
                    nombre: doc.data().nombre || 'Sin nombre',
                    precio: parseFloat(doc.data().precio) || 0,
                    desc: doc.data().desc || '',
                    img: doc.data().img || '',
                    categoria: 'snacks',
                    route: 'productos/Snacks/Gusanitos'
                };
                products.push(product);
                console.log(`✅ Gusanito encontrado: ${product.nombre} (ruta simplificada)`);
            });
        } catch (error) {
            console.log("🔍 Ruta simple falló, probando ruta profunda para Gusanitos...");
            
            // Si la ruta simple no funciona, probar la ruta profunda original
            try {
                console.log("🐛 Cargando Gusanitos desde ruta profunda: productos/Snacks/SnacksGeneral/Gusanitos/Gusanitos");
                const gusanitosDeepSnapshot = await window.db.collection('productos')
                    .doc('Snacks')
                    .collection('SnacksGeneral')
                    .doc('Gusanitos')
                    .collection('Gusanitos')
                    .get();
                
                console.log(`📊 Gusanitos encontrados (ruta profunda): ${gusanitosDeepSnapshot.docs.length} documentos`);
                
                gusanitosDeepSnapshot.forEach((doc) => {
                    const product = {
                        id: doc.id,
                        nombre: doc.data().nombre || 'Sin nombre',
                        precio: parseFloat(doc.data().precio) || 0,
                        desc: doc.data().desc || '',
                        img: doc.data().img || '',
                        categoria: 'snacks',
                        route: 'productos/Snacks/SnacksGeneral/Gusanitos/Gusanitos'
                    };
                    products.push(product);
                    console.log(`✅ Gusanito encontrado: ${product.nombre} (ruta profunda)`);
                });
            } catch (deepError) {
                console.error("❌ Error cargando Gusanitos (ambas rutas):", error, deepError);
            }
        }
        
        console.log(`🍿 SNACKS NORMALES CARGADOS: ${products.length} productos totales`);
        return products;
    }
    
    // ✅ BEBIDAS: productos/Bebidas/Alcoholicas + productos/Bebidas/NoAlcoholicas
    if (normalizedCategory === 'bebidas') {
        console.log("🥤 CARGA BEBIDAS - BASE productos");
        
        // productos/Bebidas/Alcoholicas
        try {
            console.log("🥤 Cargando Alcoholicas desde productos/Bebidas/Alcoholicas...");
            const alcoholicasSnapshot = await window.db.collection('productos')
                .doc('Bebidas')
                .collection('Alcoholicas')
                .get();
            
            console.log(`📊 Alcoholicas encontradas: ${alcoholicasSnapshot.docs.length} documentos`);
            
            alcoholicasSnapshot.forEach((doc) => {
                const product = {
                    id: doc.id,
                    nombre: doc.data().nombre || 'Sin nombre',
                    precio: parseFloat(doc.data().precio) || 0,
                    desc: doc.data().desc || '',
                    img: doc.data().img || '',
                    categoria: 'bebidas',
                    route: 'productos/Bebidas/Alcoholicas'
                };
                products.push(product);
                console.log(`✅ Bebida alcohólica encontrada: ${product.nombre} (productos/Bebidas/Alcoholicas)`);
            });
        } catch (error) {
            console.error("❌ Error cargando Alcoholicas:", error);
        }
        
        // productos/Bebidas/NoAlcoholicas
        try {
            console.log("🥤 Cargando NoAlcoholicas desde productos/Bebidas/NoAlcoholicas...");
            const noAlcoholicasSnapshot = await window.db.collection('productos')
                .doc('Bebidas')
                .collection('NoAlcoholicas')
                .get();
            
            console.log(`📊 NoAlcoholicas encontradas: ${noAlcoholicasSnapshot.docs.length} documentos`);
            
            noAlcoholicasSnapshot.forEach((doc) => {
                const product = {
                    id: doc.id,
                    nombre: doc.data().nombre || 'Sin nombre',
                    precio: parseFloat(doc.data().precio) || 0,
                    desc: doc.data().desc || '',
                    img: doc.data().img || '',
                    categoria: 'bebidas',
                    route: 'productos/Bebidas/NoAlcoholicas'
                };
                products.push(product);
                console.log(`✅ Bebida no alcohólica encontrada: ${product.nombre} (productos/Bebidas/NoAlcoholicas)`);
            });
        } catch (error) {
            console.error("❌ Error cargando NoAlcoholicas:", error);
        }
        
        console.log(`🥤 BEBIDAS CARGADAS: ${products.length} productos totales`);
        return products;
    }
    
    // ✅ LIMPIEZA: productos/Limpieza/Detergentes + productos/Limpieza/Lejias
    if (normalizedCategory === 'limpieza') {
        console.log("🧹 CARGA LIMPIEZA - BASE productos");
        
        // productos/Limpieza/Detergentes
        try {
            console.log("🧹 Cargando Detergentes desde productos/Limpieza/Detergentes...");
            const detergentesSnapshot = await window.db.collection('productos')
                .doc('Limpieza')
                .collection('Detergentes')
                .get();
            
            console.log(`📊 Detergentes encontrados: ${detergentesSnapshot.docs.length} documentos`);
            
            detergentesSnapshot.forEach((doc) => {
                const product = {
                    id: doc.id,
                    nombre: doc.data().nombre || 'Sin nombre',
                    precio: parseFloat(doc.data().precio) || 0,
                    desc: doc.data().desc || '',
                    img: doc.data().img || '',
                    categoria: 'limpieza',
                    route: 'productos/Limpieza/Detergentes'
                };
                products.push(product);
                console.log(`✅ Detergente encontrado: ${product.nombre} (productos/Limpieza/Detergentes)`);
            });
        } catch (error) {
            console.error("❌ Error cargando Detergentes:", error);
        }
        
        // productos/Limpieza/Lejias
        try {
            console.log("🧹 Cargando Lejias desde productos/Limpieza/Lejias...");
            const lejiasSnapshot = await window.db.collection('productos')
                .doc('Limpieza')
                .collection('Lejias')
                .get();
            
            console.log(`📊 Lejias encontradas: ${lejiasSnapshot.docs.length} documentos`);
            
            lejiasSnapshot.forEach((doc) => {
                const product = {
                    id: doc.id,
                    nombre: doc.data().nombre || 'Sin nombre',
                    precio: parseFloat(doc.data().precio) || 0,
                    desc: doc.data().desc || '',
                    img: doc.data().img || '',
                    categoria: 'limpieza',
                    route: 'productos/Limpieza/Lejias'
                };
                products.push(product);
                console.log(`✅ Lejia encontrada: ${product.nombre} (productos/Limpieza/Lejias)`);
            });
        } catch (error) {
            console.error("❌ Error cargando Lejias:", error);
        }
        
        console.log(`🧹 LIMPIEZA CARGADA: ${products.length} productos totales`);
        return products;
    }
    
    // ✅ PANADERÍA: RUTA FIJA productos/Panaderia/Panaderia (P mayúscula)
    if (normalizedCategory === 'panaderia') {
        console.log("🥐 CARGA PANADERÍA - productos/Panaderia/Panaderia (RUTA FIJA)");
        
        try {
            const panaderiaSnapshot = await window.db.collection('productos')
                .doc('Panaderia')                    // ✅ P mayúscula exacta
                .collection('Panaderia')             // ✅ Sin normalización
                .get();
            
            console.log(`📊 Documentos encontrados en productos/Panaderia/Panaderia: ${panaderiaSnapshot.docs.length}`);
            
            panaderiaSnapshot.forEach((doc) => {
                // ✅ Mapeo de campos exactos: doc.data().nombre, doc.data().precio, doc.data().desc, doc.data().img
                const product = {
                    id: doc.id,
                    nombre: doc.data().nombre || 'Sin nombre',
                    precio: parseFloat(doc.data().precio) || 0,
                    desc: doc.data().desc || '',
                    img: doc.data().img || '',
                    categoria: 'panaderia',
                    route: 'productos/Panaderia/Panaderia'
                };
                products.push(product);
                console.log(`✅ Producto Panadería encontrado: ${product.nombre} (productos/Panaderia/Panaderia)`);
            });
            
            console.log(`🥐 PANADERÍA CARGADA: ${products.length} productos encontrados`);
            return products;
            
        } catch (error) {
            console.error("❌ Error cargando Panadería:", error);
            return products;
        }
    }
    
    // ✅ HIGIENE: RUTA FIJA productos/Higiene/Higiene (H mayúscula)
    if (normalizedCategory === 'higiene') {
        console.log("🧼 CARGA HIGIENE - productos/Higiene/Higiene (RUTA FIJA)");
        
        try {
            const higieneSnapshot = await window.db.collection('productos')
                .doc('Higiene')                      // ✅ H mayúscula exacta
                .collection('Higiene')               // ✅ Sin normalización
                .get();
            
            console.log(`📊 Documentos encontrados en productos/Higiene/Higiene: ${higieneSnapshot.docs.length}`);
            
            higieneSnapshot.forEach((doc) => {
                // ✅ Mapeo de campos exactos: doc.data().nombre, doc.data().precio, doc.data().desc, doc.data().img
                const product = {
                    id: doc.id,
                    nombre: doc.data().nombre || 'Sin nombre',
                    precio: parseFloat(doc.data().precio) || 0,
                    desc: doc.data().desc || '',
                    img: doc.data().img || '',
                    categoria: 'higiene',
                    route: 'productos/Higiene/Higiene'
                };
                products.push(product);
                console.log(`✅ Producto Higiene encontrado: ${product.nombre} (productos/Higiene/Higiene)`);
            });
            
            console.log(`🧼 HIGIENE CARGADA: ${products.length} productos encontrados`);
            return products;
            
        } catch (error) {
            console.error("❌ Error cargando Higiene:", error);
            return products;
        }
    }
    
    // ✅ LÁCTEOS: RUTA FIJA productos/Lacteos/Lacteos (L mayúscula)
    if (normalizedCategory === 'lacteos') {
        console.log("🥛 CARGA LÁCTEOS - productos/Lacteos/Lacteos (RUTA FIJA)");
        
        try {
            const lacteosSnapshot = await window.db.collection('productos')
                .doc('Lacteos')                     // ✅ L mayúscula exacta
                .collection('Lacteos')              // ✅ Sin normalización
                .get();
            
            console.log(`📊 Documentos encontrados en productos/Lacteos/Lacteos: ${lacteosSnapshot.docs.length}`);
            
            lacteosSnapshot.forEach((doc) => {
                // ✅ Mapeo de campos exactos: doc.data().nombre, doc.data().precio, doc.data().desc, doc.data().img
                const product = {
                    id: doc.id,
                    nombre: doc.data().nombre || 'Sin nombre',
                    precio: parseFloat(doc.data().precio) || 0,
                    desc: doc.data().desc || '',
                    img: doc.data().img || '',
                    categoria: 'lacteos',
                    route: 'productos/Lacteos/Lacteos'
                };
                products.push(product);
                console.log(`✅ Producto Lácteo encontrado: ${product.nombre} (productos/Lacteos/Lacteos)`);
            });
            
            console.log(`🥛 LÁCTEOS CARGADOS: ${products.length} productos encontrados`);
            return products;
            
        } catch (error) {
            console.error("❌ Error cargando Lácteos:", error);
            return products;
        }
    }
    
    // ✅ CATEGORÍAS NO MANEJADAS - Return vacío
    console.log(`⚠️ Categoría ${normalizedCategory} no tiene ruta fija definida en BASE productos`);
    return products;
}


// Función para búsqueda exacta en rutas dobles de Firebase (todas las categorías)
async function searchProductsInSubcollections() {
    const allProducts = [];
    
    console.log("🔍 Iniciando búsqueda en TODAS las rutas dobles de Firebase...");
    
    for (const [category, subcollections] of Object.entries(FIREBASE_ROUTES)) {
        console.log(`📂 Buscando en productos/${category}...`);
        
        for (const subcollection of subcollections) {
            try {
                const routePath = `productos/${category}/${subcollection}`;
                console.log(`📁 Consultando ruta exacta: ${routePath}`);
                
                // Consulta directa a la ruta exacta con doble nivel
                const snapshot = await window.db.collection('productos')
                    .doc(category)
                    .collection(subcollection)
                    .get();
                
                snapshot.forEach((doc) => {
                    const product = mapProductFields(doc.data(), doc.id, category);
                    product.subcollection = subcollection;
                    product.route = routePath;
                    allProducts.push(product);
                    console.log(`✅ Producto encontrado: ${product.nombre} (${routePath})`);
                });
                
            } catch (error) {
                console.log(`⚠️ Error al consultar ${category}/${subcollection}:`, error);
            }
        }
    }
    
    return allProducts;
}

// Función para limpiar contenedor antes de recargar
function cleanupProductContainer() {
    const productsGrid = document.querySelector('.products-grid');
    if (productsGrid) {
        // Eliminar solo productos de Firebase antiguos
        const firebaseCards = productsGrid.querySelectorAll('[data-firebase-id]');
        firebaseCards.forEach(card => card.remove());
        console.log(`🧹 Contenedor limpiado: ${firebaseCards.length} productos eliminados`);
    }
}

// Función para cargar productos desde Firebase con limpieza total y carga específica
async function loadFirebaseProducts() {
    // Prevenir bucles infinitos
    if (isLoading) {
        console.log("⏸️ Carga ya en progreso, evitando bucle infinito");
        return;
    }
    
    // Abortar petición anterior si existe
    if (currentFirebaseRequest) {
        console.log("🚫 Abortando petición Firebase anterior...");
        if (requestAbortController) {
            requestAbortController.abort();
        }
        currentFirebaseRequest = null;
        requestAbortController = null;
    }
    
    // Crear nuevo AbortController para esta petición
    requestAbortController = new AbortController();
    const signal = requestAbortController.signal;
    
    isLoading = true;
    
    try {
        // Verificación mejorada de window.db
        console.log("🔍 Verificando inicialización de Firebase...");
        
        if (!window.db) {
            console.log("❌ ERROR CRÍTICO: window.db no está disponible");
            console.log("🔧 Solución: Verifica que firebaseConfig.js se cargue antes que Script.js");
            console.log("📋 Estado de Firebase:");
            console.log("   - firebase object:", typeof firebase !== 'undefined' ? '✅ Disponible' : '❌ No disponible');
            console.log("   - firebase.firestore():", typeof firebase !== 'undefined' && firebase.firestore ? '✅ Disponible' : '❌ No disponible');
            console.log("   - window.db:", typeof window.db !== 'undefined' ? '✅ Disponible' : '❌ No disponible');
            
            // Intentar inicialización de emergencia
            if (typeof firebase !== 'undefined' && firebase.firestore) {
                console.log("🚑 Intentando inicialización de emergencia...");
                window.db = firebase.firestore();
                console.log("✅ Inicialización de emergencia completada");
            } else {
                console.log("❌ No se puede inicializar Firebase - abortando carga");
                isLoading = false;
                showNotification('Error: Firebase no está disponible', '#e74c3c');
                return;
            }
        } else {
            console.log("✅ window.db disponible y funcional");
            
            // Verificación adicional de que Firestore está operativo
            try {
                await window.db.collection('_test').limit(1).get();
                console.log("✅ Conexión a Firestore verificada y operativa");
            } catch (firestoreError) {
                console.log("❌ Error de conexión a Firestore:", firestoreError);
                showNotification('Error de conexión a Firebase', '#e74c3c');
                isLoading = false;
                return;
            }
        }
        
        console.log("🔥 Iniciando carga con limpieza total del contenedor...");
        
        // ✅ LIMPIEZA DE MEMORIA: Limpiar productos anteriores antes de cargar
        firebaseProducts = [];
        console.log("🧹 Memoria limpiada: firebaseProducts = [] antes de nueva carga");
        
        // 1. LIMPIEZA TOTAL DEL CONTENEDOR - Primera acción
        const productsGrid = document.querySelector('.products-grid');
        if (productsGrid) {
            productsGrid.innerHTML = ''; // Limpieza completa
            console.log("🧹 Contenedor limpiado completamente con innerHTML = ''");
        }
        
        // 2. CARGA ESTRICTA POR CATEGORÍA - SOLO la ruta específica
        let products = [];
        if (currentCategory === 'todos') {
            // Cargar todas las categorías si es 'todos'
            products = await searchProductsInSubcollections();
        } else {
            // Cargar ÚNICAMENTE la ruta específica de la categoría seleccionada
            console.log(`🎯 FILTRADO ESTRICTO - Cargando solo categoría: ${currentCategory}`);
            products = await searchSpecificCategory(currentCategory);
        }
        
        console.log("✅ ¡Éxito! Datos recibidos de carga específica:", products);
        console.log('✅ Productos encontrados:', products.length);
        
        // Actualizar array de productos de Firebase
        firebaseProducts = products;
        
        // Mostrar productos
        if (products.length === 0) {
            console.log("⚠️ No se encontraron productos en la categoría");
            showEmptyMessage();
        } else {
            // Añadir productos de Firebase al DOM
            addFirebaseProductsToDOM();
        }
        
    } catch (error) {
        console.log("❌ Error en carga de productos:", error);
        showEmptyMessage();
    } finally {
        isLoading = false;
        
        // Limpiar variables de control de petición
        currentFirebaseRequest = null;
        requestAbortController = null;
        
        console.log("✅ Carga de productos completada");
    }
}

// Función para cargar productos desde localStorage
function loadProductsFromStorage() {
    const savedProducts = localStorage.getItem('products');
    
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    } else {
        // Productos de ejemplo si no hay datos guardados
        products = [
            {
                id: 1,
                name: 'Pasta Italiana',
                category: 'alimentacion',
                description: 'Pasta de sémola de trigo',
                price: 1.99
            },
            {
                id: 2,
                name: 'Pan Integral',
                category: 'panaderia',
                description: 'Pan fresco hecho con trigo integral',
                price: 2.50
            },
            {
                id: 3,
                name: 'Limpiador Multiuso',
                category: 'limpieza',
                description: 'Limpia todas las superficies del hogar',
                price: 3.99
            },
            {
                id: 4,
                name: 'Jabón de Manos',
                category: 'higiene',
                description: 'Jabón antibacterial con glicerina',
                price: 1.49
            },
            {
                id: 5,
                name: 'Agua Mineral',
                category: 'bebidas',
                description: 'Agua purificada 1.5L',
                price: 0.89
            },
            {
                id: 6,
                name: 'Tomates Frescos',
                category: 'alimentacion',
                description: 'Tomates de huerta ecológica',
                price: 2.29
            }
        ];
        saveProductsToStorage();
    }
}


// Función para editar producto con sincronización de IDs mejorada
function editProduct(productId) {
    console.log(`🔧 Editando producto con ID: ${productId} (tipo: ${typeof productId})`);
    
    // Diferenciar entre IDs locales (numéricos) y de Firebase (string)
    const isFirebaseId = typeof productId === 'string';
    
    if (isFirebaseId) {
        console.log("� Detectado ID de Firebase, buscando en productos Firebase...");
        
        // Buscar en productos de Firebase
        const firebaseProduct = firebaseProducts.find(p => p.id === productId);
        
        if (firebaseProduct) {
            console.log("✅ Producto de Firebase encontrado:", firebaseProduct);
            
            // Crear modal con datos del producto Firebase
            const modal = createProductModal({
                id: firebaseProduct.id,
                name: firebaseProduct.nombre,
                category: firebaseProduct.categoria,
                description: firebaseProduct.desc,
                price: firebaseProduct.precio,
                unit: firebaseProduct.unidad || '/ud',
                image: firebaseProduct.img
            });
            
            document.body.appendChild(modal);
            
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
            
            console.log("✅ Modal de edición Firebase abierto");
            return;
        }
        
        console.log("❌ Producto Firebase no encontrado");
    } else {
        console.log("📦 Detectado ID local, buscando en localStorage...");
        
        // Buscar en localStorage
        const localProduct = products.find(p => p.id === productId);
        
        if (localProduct) {
            console.log("✅ Producto local encontrado:", localProduct);
            const modal = createProductModal(localProduct);
            document.body.appendChild(modal);
            
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
            return;
        }
        
        console.log("❌ Producto local no encontrado");
    }
    
    // Si no se encuentra en ningún lugar
    console.log("❌ Producto no encontrado en ningún sistema");
    showNotification('Producto no encontrado', '#e74c3c');
}

// Función para eliminar producto con sincronización de IDs mejorada
function deleteProduct(productId, productName) {
    if (confirm(`¿Estás seguro de que quieres eliminar "${productName}"?`)) {
        console.log(`🗑️ Eliminando producto ID: ${productId} (tipo: ${typeof productId})`);
        
        // Diferenciar entre IDs locales (numéricos) y de Firebase (string)
        const isFirebaseId = typeof productId === 'string';
        
        if (isFirebaseId) {
            console.log("🔥 Eliminando producto de Firebase...");
            
            // Buscar el producto Firebase para obtener su ruta dinámica
            const firebaseProduct = firebaseProducts.find(p => p.id === productId);
            
            if (firebaseProduct && firebaseProduct.route) {
                console.log(`📍 Usando ruta dinámica: ${firebaseProduct.route}`);
                
                // Parsear la ruta para obtener colección y documento
                const routeParts = firebaseProduct.route.split('/');
                if (routeParts.length >= 3) {
                    const collection = routeParts[0];
                    const document = routeParts[1];
                    const subcollection = routeParts[2];
                    
                    // Para rutas anidadas como productos/SnacksGeneral/Doritos/Doritos
                    if (routeParts.length === 4) {
                        const nestedSubcollection = routeParts[3];
                        window.db.collection(collection)
                            .doc(document)
                            .collection(subcollection)
                            .doc(subcollection)
                            .collection(nestedSubcollection)
                            .doc(productId)
                            .delete()
                            .then(() => {
                                console.log('🗑️ Producto anidado eliminado de Firebase');
                                showNotification('Producto eliminado correctamente', '#e74c3c');
                                setTimeout(() => loadFirebaseProducts(), 1000);
                            })
                            .catch(error => {
                                console.error('❌ Error eliminando producto anidado:', error);
                                showNotification('Error al eliminar producto', '#e74c3c');
                            });
                    } else {
                        // Ruta normal: productos/Lacteos/Leches
                        window.db.collection(collection)
                            .doc(document)
                            .collection(subcollection)
                            .doc(productId)
                            .delete()
                            .then(() => {
                                console.log('🗑️ Producto Firebase eliminado');
                                showNotification('Producto eliminado correctamente', '#e74c3c');
                                setTimeout(() => loadFirebaseProducts(), 1000);
                            })
                            .catch(error => {
                                console.error('❌ Error eliminando producto Firebase:', error);
                                showNotification('Error al eliminar producto', '#e74c3c');
                            });
                    }
                }
            } else {
                // Fallback a eliminación simple
                window.db.collection('productos').doc(productId).delete()
                    .then(() => {
                        console.log('🗑️ Producto Firebase eliminado (fallback)');
                        showNotification('Producto eliminado correctamente', '#e74c3c');
                        setTimeout(() => loadFirebaseProducts(), 1000);
                    })
                    .catch(error => {
                        console.error('❌ Error eliminando producto Firebase:', error);
                        showNotification('Error al eliminar producto', '#e74c3c');
                    });
            }
            
            // Eliminar tarjeta del DOM inmediatamente
            const card = document.querySelector(`[data-firebase-id="${productId}"]`);
            if (card) {
                card.remove();
                console.log("🗑️ Tarjeta Firebase eliminada del DOM");
            }
            
        } else {
            console.log("📦 Eliminando producto local...");
            
            // Eliminar de localStorage
            const index = products.findIndex(p => p.id === productId);
            if (index !== -1) {
                products.splice(index, 1);
                saveProductsToStorage();
                renderProducts();
                showNotification('Producto eliminado correctamente', '#e74c3c');
                console.log("✅ Producto local eliminado");
            } else {
                console.log("❌ Producto local no encontrado");
            }
        }
    }
}

// Exponer funciones globalmente para el HTML
window.handleProductSubmit = handleProductSubmit;
window.closeProductModal = closeProductModal;
window.showNewProductForm = showNewProductForm;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM cargado - Iniciando carga de productos");
    
    // Primero cargar textos dinámicos
    loadDynamicTexts();
    
    // Luego cargar productos desde Firebase (solo una vez)
    loadFirebaseProducts();
    
    // Exponer funciones globalmente para el HTML
    window.handleProductSubmit = handleProductSubmit;
    window.closeProductModal = closeProductModal;
    window.showNewProductForm = showNewProductForm;
    window.editProduct = editProduct;
    window.deleteProduct = deleteProduct;
});

// Función para normalizar texto (quitar tildes, minúsculas, espacios)
function normalizeText(text) {
    return text
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Eliminar tildes
        .replace(/\s+/g, ''); // Eliminar espacios
}

// Función de filtrado al final del archivo con limpieza total y carga específica
window.filterCategory = function(category, event) {
    currentCategory = category;
    
    // Normalizar categoría del botón
    const normalizedCategory = normalizeText(category);
    
    console.log("🔥 FILTRADO ESPECÍFICO - Categoría:", category, "(normalizado:", normalizedCategory + ")");
    
    // ✅ LIMPIEZA CRUZADA: Limpiar firebaseProducts al cambiar de categoría
    firebaseProducts = [];
    console.log("🧹 firebaseProducts limpiado al cambiar de categoría");
    
    // 1. LIMPIEZA TOTAL DEL DOM - Prevenir duplicados
    const productsGrid = document.querySelector('.products-grid');
    if (productsGrid) {
        productsGrid.innerHTML = ''; // Limpieza completa y consistente
        console.log("🧹 Contenedor .products-grid limpiado completamente para evitar duplicados");
    }
    
    // 2. EL BOTÓN ACTIVO: Cambiar clase activa
    const allButtons = document.querySelectorAll('.category-btn');
    allButtons.forEach(btn => {
        btn.classList.remove('active'); // Quitar activo de todos
    });
    
    // Poner activo solo al botón pulsado
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
        console.log("✅ Botón activo cambiado a:", event.currentTarget.textContent);
    } else {
        // Fallback si no hay evento
        const targetButton = document.querySelector(`[data-category="${category}"]`);
        if (targetButton) {
            targetButton.classList.add('active');
            console.log("✅ Botón activo cambiado (fallback) a:", targetButton.textContent);
        }
    }
    
    // 3. CARGA ESPECÍFICA CON ABORTACIÓN: Recargar productos solo para esta categoría
    if (!isLoading) {
        console.log(`🎯 Iniciando carga específica para categoría: ${category}`);
        currentFirebaseRequest = loadFirebaseProducts(); // Guardar referencia para posible aborto
    } else {
        console.log("⏸️ Carga en progreso, esperando para recargar...");
        // Esperar y recargar cuando termine la carga actual
        setTimeout(() => {
            if (!isLoading) {
                console.log(`🎯 Recarga retrasada para categoría: ${category}`);
                currentFirebaseRequest = loadFirebaseProducts();
            }
        }, 500);
    }
    
    // 4. FILTRADO VISUAL (solo si hay productos ya cargados)
    const allCards = document.querySelectorAll('.product-card');
    console.log("📋 Total de productos encontrados:", allCards.length);
    
    if (allCards.length > 0) {
        // Ocultar TODOS los productos sin excepción
        allCards.forEach(card => {
            card.style.display = 'none';
        });
        console.log("🚫 Todos los productos ocultados (display: none)");
        
        // MOSTRAR solo los de la categoría correcta
        let mostrados = 0;
        
        allCards.forEach(card => {
        let cardCategory = '';
        
        // Obtener categoría del badge CSS (productos HTML)
        const categoryBadge = card.querySelector('.category-badge');
        if (categoryBadge) {
            const badgeText = categoryBadge.textContent.trim();
            cardCategory = normalizeText(badgeText);
        }
        
        // También verificar data-category para productos Firebase
        if (!cardCategory && card.dataset.category) {
            cardCategory = normalizeText(card.dataset.category);
        }
        
        // Verificar clases CSS también
        if (!cardCategory) {
            const classes = card.className.split(' ');
            for (const cls of classes) {
                if (['alimentacion', 'panaderia', 'limpieza', 'higiene', 'bebidas'].includes(cls)) {
                    cardCategory = normalizeText(cls);
                    break;
                }
            }
        }
        
        // 4. COMPROBAR: Mostrar solo si coincide la categoría
        const matches = normalizedCategory === 'todos' || cardCategory === normalizedCategory;
        
        if (matches) {
            card.style.display = 'flex'; // Mostrar solo los coincidentes
            mostrados++;
            console.log("✅ MOSTRADO:", card.querySelector('.product-title')?.textContent, "categoría:", cardCategory);
        }
    });
    
    console.log("🎯 FILTRADO COMPLETADO - Productos mostrados:", mostrados, "de", allCards.length);
    }
};
