// Variables globales
let products = [];
let currentEditId = null;
let firebaseProducts = [];
let isLoading = false; // Control de carga para evitar bucles

// ✅ LIMPIEZA CRUZADA: Resetear productos al cargar ProductosLatinos para evitar contaminación
console.log("🧹 ProductosLatinos: Inicializando con firebaseProducts = [] para evitar productos pegados");
firebaseProducts = [];

// Estructura exacta de Firebase para Productos Latinos
const FIREBASE_ROUTES_LATINOS = {
    'Alimentacion': ['Arveja', 'Buñuelos'], // productoslatinos/Alimentacion/Arveja
    'Bebida': ['NoAlcoholicas'], // productoslatinos/Bebida/NoAlcoholicas (Bebida en singular)
    'Casero': ['Casero'], // productoslatinos/Casero/Casero (con 'o' al final)
    'Dulce': ['Dulce'], // productoslatinos/Dulce/Dulce (documento: Dulce, subcolección: Dulce)
    'Snacks': ['Snacks'] // productoslatinos/Snacks/Snacks (documento: Snacks, subcolección: Snacks)
};

// Estructura para Productos Generales - SOLO REFERENCIA (NO USAR EN PRODUCTOS LATINOS)
const FIREBASE_ROUTES_GENERALES = {
    'alimentacion': ['alimentacion'], // productos/alimentacion/alimentacion
    'bebida': ['bebida'], // productos/bebida/bebida
    'casero': ['casero'], // productos/casero/casero
    'dulce': ['dulce'], // productos/dulce/dulce
    'snacks': ['FrutosSecos', 'Doritos', 'Gusanitos'] // Estructura compleja de Snacks
};

// Estructura especial para Snacks (subcolecciones anidadas)
const SNACKS_COMPLEX_ROUTES = {
    'FrutosSecos': {
        collection: 'productos',
        document: 'Snacks',
        subcollection: 'FrutosSecos'
    },
    'Doritos': {
        collection: 'productos',
        document: 'SnacksGeneral',
        subcollection: 'Doritos',
        nestedSubcollection: 'Doritos' // productos/SnacksGeneral/Doritos/Doritos
    },
    'Gusanitos': {
        collection: 'productos',
        document: 'SnacksGeneral',
        subcollection: 'Gusanitos',
        nestedSubcollection: 'Gusanitos' // productos/SnacksGeneral/Gusanitos/Gusanitos
    }
};

console.log("🔍 Verificando rutas de Productos Latinos...");
console.log("📋 Ruta Casero:", FIREBASE_ROUTES_LATINOS['Casero']);
console.log("📋 Subcolección Casero:", FIREBASE_ROUTES_LATINOS['Casero'][0]);
console.log("📋 Ruta completa Casero: productoslatinos/Casero/Casero");
console.log("📋 Ruta completa Dulce: productoslatinos/Dulce/Dulce (documento: Dulce, subcolección: Dulce)");
console.log("📋 Ruta completa Snacks: productoslatinos/Snacks/Snacks (documento: Snacks, subcolección: Snacks)");

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    initializeProducts();
    initializeEventListeners();
    loadFirebaseProducts();
});


// Función para mapeo exacto de campos de Productos Latinos
function mapProductFieldsLatino(product, docId, categoryPath) {
    // Mapeo EXACTO de imagen: siempre 'img'
    const imageUrl = (product.img || '').trim();
    
    // Mapeo EXACTO de nombre: siempre 'nombre'
    const productName = (product.nombre || '').trim();
    
    // Mapeo EXACTO de precio: parseFloat(precio).toFixed(2)
    const price = parseFloat(product.precio) || 0;
    
    // Mapeo EXACTO de descripción: siempre 'desc'
    const description = (product.desc || '').trim();
    
    // Normalización de categoría para Productos Latinos
    let normalizedCategory = normalizeText(categoryPath);
    
    // Mapeo de categorías específicas para Productos Latinos - SIN EMOJIS
    const categoryMapping = {
        'alimentacion': 'alimentacion',
        'bebida': 'bebida',     // Firebase usa 'bebida' (singular)
        'bebidas': 'bebida',    // Botón usa 'bebidas' (plural) -> mapear a 'bebida'
        'casero': 'casero',
        'dulce': 'dulce',
        'snacks': 'snacks'
    };
    
    normalizedCategory = categoryMapping[normalizedCategory] || 'alimentacion';
    
    console.log("🔍 Mapeo de campos latinos - img:", imageUrl, "desc:", description, "nombre:", productName, "precio:", price);
    
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

// Función para normalizar texto para Productos Latinos
function normalizeTextLatino(text) {
    return text
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Eliminar tildes
        .replace(/\s+/g, ''); // Eliminar espacios
}

// Función para búsqueda específica por categoría en Productos Latinos
async function searchSpecificCategoryLatino(category) {
    const products = [];
    
    // Mapeo de categoría normalizada a ruta exacta de Firebase para Productos Latinos
    const categoryToRoute = {
        'alimentacion': 'Alimentacion',
        'bebidas': 'Bebida', // Bebida en singular
        'casero': 'Casero',
        'dulce': 'Dulce',
        'snacks': 'Snacks'
    };
    
    const firebaseRoute = categoryToRoute[category];
    if (!firebaseRoute) {
        console.log(`⚠️ Categoría no encontrada en Productos Latinos: ${category}`);
        return products;
    }
    
    const subcollections = FIREBASE_ROUTES_LATINOS[firebaseRoute];
    if (!subcollections) {
        console.log(`⚠️ No hay subcolecciones para ${firebaseRoute} en Productos Latinos`);
        return products;
    }
    
    console.log(`🎯 CARGA ESPECÍFICA LATINA - Buscando solo en ${category} → ${firebaseRoute}`);
    console.log(`📋 Subcolecciones encontradas: ${JSON.stringify(subcollections)}`);
    
    // Logging especial para categorías específicas
    if (category === 'casero') {
        console.log("🔍 DEPURACIÓN ESPECIAL CASERO:");
        console.log("📋 Categoría solicitada:", category);
        console.log("📋 FirebaseRoute:", firebaseRoute);
        console.log("📋 Subcolecciones:", subcollections);
        console.log("📋 Ruta completa esperada: productoslatinos/Casero/Casero");
    } else if (category === 'dulce') {
        console.log("🍫 DEPURACIÓN ESPECIAL DULCE:");
        console.log("📋 Categoría solicitada:", category);
        console.log("📋 FirebaseRoute:", firebaseRoute);
        console.log("📋 Subcolecciones:", subcollections);
        console.log("📋 Ruta completa esperada: productoslatinos/Dulce/Dulce (documento: Dulce, subcolección: Dulce)");
        console.log("📋 Productos esperados: 'Chocolate Corona', 'Toddy Choco', etc.");
    } else if (category === 'snacks') {
        console.log("🥨 DEPURACIÓN ESPECIAL SNACKS:");
        console.log("📋 Categoría solicitada:", category);
        console.log("📋 FirebaseRoute:", firebaseRoute);
        console.log("📋 Subcolecciones:", subcollections);
        console.log("📋 Ruta completa esperada: productoslatinos/Snacks/Snacks (documento: Snacks, subcolección: Snacks)");
        console.log("📋 Productos esperados: 'Belvita Kraker', etc.");
    }
    
    for (const subcollection of subcollections) {
        try {
            const routePath = `productoslatinos/${firebaseRoute}/${subcollection}`;
            console.log(`📁 Consultando ruta específica latina: ${routePath}`);
            console.log(`🔍 Ejecutando: window.db.collection('productoslatinos').doc('${firebaseRoute}').collection('${subcollection}').get()`);
            
            // Consulta directa solo a la categoría seleccionada en productoslatinos
            const snapshot = await window.db.collection('productoslatinos')
                .doc(firebaseRoute)
                .collection(subcollection)
                .get();
            
            console.log(`📊 Resultados de ${routePath}: ${snapshot.docs.length} documentos encontrados`);
            
            // Logging especial para Casero si no hay resultados
            if (category === 'casero' && snapshot.docs.length === 0) {
                console.log("⚠️ CASERO: No se encontraron documentos en la ruta");
                console.log("🔍 Verifica que la ruta productoslatinos/Casero/Casero exista en Firebase");
                console.log("🔍 Verifica que haya documentos dentro de esa subcolección");
            }
            
            snapshot.forEach((doc) => {
                const product = mapProductFieldsLatino(doc.data(), doc.id, firebaseRoute);
                product.subcollection = subcollection;
                product.route = routePath;
                products.push(product);
                console.log(`✅ Producto latino encontrado: ${product.nombre} (${routePath})`);
            });
            
        } catch (error) {
            console.log(`❌ Error al consultar productoslatinos/${firebaseRoute}/${subcollection}:`, error);
            console.log(`🔍 Ruta fallida exacta: productoslatinos/${firebaseRoute}/${subcollection}`);
            
            // Logging especial para Casero
            if (category === 'casero') {
                console.log("🔍 ERROR ESPECIAL CASERO:");
                console.log("📋 Revisa que el documento 'Casero' exista en productoslatinos");
                console.log("📋 Revisa que la subcolección 'Casero' exista dentro de Casero");
            }
        }
    }
    
    console.log(`🎯 Carga específica latina completada: ${products.length} productos en ${category}`);
    return products;
}

// Función para búsqueda en todas las subcolecciones de Productos Latinos
async function searchAllProductosLatinos() {
    const allProducts = [];
    
    console.log("🔍 Iniciando búsqueda en TODAS las rutas de Productos Latinos...");
    
    for (const [category, subcollections] of Object.entries(FIREBASE_ROUTES_LATINOS)) {
        console.log(`📂 Buscando en productoslatinos/${category}...`);
        
        for (const subcollection of subcollections) {
            try {
                const routePath = `productoslatinos/${category}/${subcollection}`;
                console.log(`📁 Consultando ruta latina: ${routePath}`);
                
                // Consulta directa a la ruta exacta con doble nivel
                const snapshot = await window.db.collection('productoslatinos')
                    .doc(category)
                    .collection(subcollection)
                    .get();
                
                snapshot.forEach((doc) => {
                    const product = mapProductFieldsLatino(doc.data(), doc.id, category);
                    product.subcollection = subcollection;
                    product.route = routePath;
                    allProducts.push(product);
                    console.log(`✅ Producto latino encontrado: ${product.nombre} (${routePath})`);
                });
                
            } catch (error) {
                console.log(`⚠️ Error al consultar productoslatinos/${category}/${subcollection}:`, error);
            }
        }
    }
    
    return allProducts;
}

// Función de filtrado por categoría para Productos Latinos
window.filterCategoryLatino = function(category, event) {
    console.log("🔥 FILTRADO LATINO - Categoría:", category);
    
    // 1. EL BOTÓN ACTIVO: Cambiar clase activa
    const allButtons = document.querySelectorAll('.category-btn');
    allButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Poner activo solo al botón pulsado
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
        console.log("✅ Botón activo latino cambiado a:", event.currentTarget.textContent);
    }
    
    // 2. CARGA ESPECÍFICA: Recargar productos latinos solo para esta categoría
    if (!isLoading) {
        console.log(`🎯 Iniciando carga específica latina para categoría: ${category}`);
        loadSpecificLatinoCategory(category);
    } else {
        console.log("⏸️ Carga latina en progreso, esperando para recargar...");
        setTimeout(() => {
            if (!isLoading) {
                console.log(`🎯 Recarga retrasada latina para categoría: ${category}`);
                loadSpecificLatinoCategory(category);
            }
        }, 500);
    }
};

// Función para cargar categoría específica de Productos Latinos
async function loadSpecificLatinoCategory(category) {
    // Prevenir bucles infinitos
    if (isLoading) {
        console.log("⏸️ Carga latina ya en progreso, evitando bucle");
        return;
    }
    
    isLoading = true;
    
    try {
        // Verificar conexión actual
        console.log("Conexión actual:", window.db);
        
        if (!window.db) {
            console.log("ERROR: window.db no está disponible para Productos Latinos");
            isLoading = false;
            return;
        }
        
        console.log("🔥 Iniciando carga específica latina con limpieza total...");
        
        // 1. LIMPIEZA TOTAL DEL CONTENEDOR - Primera acción (evita mezclar snacks con dulces)
        const productsGrid = document.getElementById('productsGrid');
        if (productsGrid) {
            productsGrid.innerHTML = ''; // Limpieza completa antes de cargar nueva categoría
            console.log("🧹 Contenedor latinos limpiado completamente con innerHTML = '' para evitar mezclas");
            console.log("🔄 Cambiando de categoría - contenedor vaciado para:", category);
        }
        
        // 2. CARGA ESPECÍFICA POR CATEGORÍA LATINA
        let products = [];
        
        if (category === 'todos') {
            // Cargar todas las categorías de productoslatinos
            console.log("🎯 CARGA LATINA TOTAL - Cargando todas las categorías");
            products = await searchAllProductosLatinos();
        } else {
            // Cargar ÚNICAMENTE la categoría seleccionada de productoslatinos
            console.log(`🎯 FILTRADO ESTRICTO LATINO - Cargando solo categoría: ${category}`);
            products = await searchSpecificCategoryLatino(category);
        }
        
        console.log("✅ ¡Éxito! Datos recibidos de carga específica latina:", products);
        console.log('✅ Productos latinos encontrados:', products.length);
        
        // Actualizar array de productos de Firebase
        firebaseProducts = products;
        
        // Mostrar productos
        if (products.length === 0) {
            console.log("⚠️ No se encontraron productos latinos en esta categoría");
            showEmptyMessage();
        } else {
            // Añadir productos latinos al DOM
            addFirebaseProductsToDOM();
        }
        
    } catch (error) {
        console.log("❌ Error en carga específica latina:", error);
        showEmptyMessage();
    } finally {
        isLoading = false;
        console.log("✅ Carga específica latina completada");
    }
}

window.handleSearchLatino = function(searchTerm) {
    const productCards = document.querySelectorAll('.product-card');
    const searchLower = searchTerm.toLowerCase();
    
    productCards.forEach(card => {
        const title = card.querySelector('.product-title').textContent.toLowerCase();
        if (title.includes(searchLower)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
};

window.showNewProductModal = showNewProductModal;
window.closeModal = closeModal;
window.saveProduct = saveProduct;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;

// Función para inicializar los productos
function initializeProducts() {
    // Cargar productos desde localStorage o usar productos de ejemplo
    const savedProducts = localStorage.getItem('productosLatinos');
    
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    } else {
        // Productos de ejemplo
        products = [
            {
                id: 1,
                nombre: 'Tacos Mexicanos',
                categoria: 'alimentacion',
                precio: 3.99
            },
            {
                id: 2,
                nombre: 'Café Colombiano',
                categoria: 'bebidas',
                precio: 8.99
            },
            {
                id: 3,
                nombre: 'Dulce de Leche',
                categoria: 'dulce',
                precio: 4.75
            },
            {
                id: 4,
                nombre: 'Arepas Venezolanas',
                categoria: 'casero',
                precio: 2.50
            },
            {
                id: 5,
                nombre: 'Chips de Plátano',
                categoria: 'snacks',
                precio: 1.99
            },
            {
                id: 6,
                nombre: 'Empanadas Argentinas',
                categoria: 'alimentacion',
                precio: 5.25
            }
        ];
        saveProductsToStorage();
    }
}

// Función para inicializar event listeners
function initializeEventListeners() {
    // Buscador
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            window.handleSearchLatino(e.target.value);
        });
    }
    
    // Categorías - usar onclick en HTML en lugar de addEventListener
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        const category = btn.getAttribute('data-category');
        btn.onclick = () => window.filterCategoryLatino(category);
    });
}

// Función para manejar búsqueda
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const title = card.querySelector('.product-title').textContent.toLowerCase();
        if (title.includes(searchTerm)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// Función para manejar filtro de categorías
function handleCategoryFilter(e) {
    const category = e.target.dataset.category;
    const productCards = document.querySelectorAll('.product-card');
    
    // Actualizar botón activo
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    e.target.classList.add('active');
    
    // Filtrar productos
    productCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// Función para mostrar modal de nuevo producto
function showNewProductModal() {
    currentEditId = null;
    document.getElementById('modalTitle').textContent = 'Nuevo Producto';
    document.getElementById('productForm').reset();
    document.getElementById('productModal').classList.add('show');
}

// Función para editar un producto
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    
    if (product) {
        currentEditId = productId;
        document.getElementById('modalTitle').textContent = 'Editar Producto';
        document.getElementById('productName').value = product.nombre;
        document.getElementById('productCategory').value = product.categoria;
        document.getElementById('productPrice').value = product.precio;
        document.getElementById('productImage').value = product.imagen || '';
        document.getElementById('productModal').classList.add('show');
    } else {
        showNotification('Producto no encontrado', 'error');
    }
}

// Función para eliminar un producto
function deleteProduct(productId, productName) {
    if (confirm(`¿Estás seguro de que quieres eliminar "${productName}"?\n\nEsta acción no se puede deshacer.`)) {
        // Eliminar producto del array
        const index = products.findIndex(p => p.id === productId);
        if (index !== -1) {
            products.splice(index, 1);
            saveProductsToStorage();
            
            // Eliminar tarjeta del DOM con animación
            const card = document.querySelector(`.product-card[data-id="${productId}"]`);
            if (card) {
                card.style.transition = 'all 0.3s ease';
                card.style.opacity = '0';
                card.style.transform = 'translateX(-100%)';
                
                setTimeout(() => {
                    card.remove();
                    showNotification(`Producto "${productName}" eliminado correctamente`, 'success');
                }, 300);
            }
        } else {
            showNotification('Error al eliminar el producto', 'error');
        }
    }
}

// Función para guardar producto
function saveProduct(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const productData = {
        nombre: formData.get('nombre'),
        categoria: formData.get('categoria'),
        precio: parseFloat(formData.get('precio')),
        imagen: formData.get('imagen') || ''
    };
    
    if (currentEditId) {
        // Editar producto existente
        const index = products.findIndex(p => p.id === currentEditId);
        if (index !== -1) {
            products[index] = { ...products[index], ...productData };
            updateProductCard(currentEditId, products[index]);
            showNotification('Producto actualizado correctamente', 'success');
        }
    } else {
        // Crear nuevo producto
        const newProduct = {
            id: Date.now(),
            ...productData
        };
        products.push(newProduct);
        addProductCard(newProduct);
        showNotification('Producto creado correctamente', 'success');
    }
    
    saveProductsToStorage();
    closeModal();
}

// Función para actualizar tarjeta de producto
function updateProductCard(productId, product) {
    const card = document.querySelector(`.product-card[data-id="${productId}"]`);
    if (card) {
        card.querySelector('.product-title').textContent = product.nombre;
        card.querySelector('.product-price').textContent = product.precio.toFixed(2) + '€';
        card.dataset.category = product.categoria;
        
        // Actualizar etiqueta de categoría
        const categoryBadge = card.querySelector('.category-badge');
        if (categoryBadge) {
            const categoryNames = {
                'alimentacion': 'ALIMENTACIÓN',
                'bebidas': 'BEBIDAS',
                'casero': 'CASERO',
                'dulce': 'DULCE',
                'snacks': 'SNACKS'
            };
            categoryBadge.textContent = categoryNames[product.categoria] || product.categoria.toUpperCase();
        }
        
        // Actualizar botón de eliminar
        const deleteBtn = card.querySelector('.btn-delete');
        deleteBtn.setAttribute('onclick', `deleteProduct(${productId}, '${product.nombre}')`);
    }
}

// Función para agregar nueva tarjeta de producto
function addProductCard(product) {
    const productsGrid = document.getElementById('productsGrid');
    const card = document.createElement('article');
    card.className = 'product-card';
    card.dataset.category = product.categoria;
    card.dataset.id = product.id;
    
    // Imagen aleatoria basada en la categoría
    const imageUrl = getProductImage(product.categoria);
    
    // Nombre de categoría para mostrar
    const categoryNames = {
        'alimentacion': 'ALIMENTACIÓN',
        'bebidas': 'BEBIDAS',
        'casero': 'CASERO',
        'dulce': 'DULCE',
        'snacks': 'SNACKS'
    };
    const categoryName = categoryNames[product.categoria] || product.categoria.toUpperCase();
    
    card.innerHTML = `
        <img src="${imageUrl}" alt="${product.nombre}" class="product-image">
        <div class="product-content">
            <div class="product-header">
                <h3 class="product-title">${product.nombre}</h3>
                <span class="category-badge">${categoryName}</span>
            </div>
            <div class="product-actions">
                <button class="btn-edit" onclick="editProduct(${product.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-delete" onclick="deleteProduct(${product.id}, '${product.nombre}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    
    // Agregar precio como elemento separado
    const p = document.createElement('p');
    p.className = 'product-price';
    p.textContent = product.precio.toFixed(2) + '€';
    
    // Insertar el precio antes de los botones de acción
    const productContent = card.querySelector('.product-content');
    const productActions = card.querySelector('.product-actions');
    productContent.insertBefore(p, productActions);
    
    // Agregar con animación
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    productsGrid.appendChild(card);
    
    setTimeout(() => {
        card.style.transition = 'all 0.3s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, 10);
}

// Función para obtener imagen según categoría
function getProductImage(category) {
    const images = {
        alimentacion: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=200&fit=crop&crop=center',
        bebidas: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&h=200&fit=crop&crop=center',
        dulce: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop&crop=center',
        casero: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=200&fit=crop&crop=center',
        snacks: 'https://images.unsplash.com/photo-1565958011703-38f3e0b4b7c6?w=300&h=200&fit=crop&crop=center'
    };
    return images[category] || images.alimentacion;
}

// Función para cerrar modal
function closeModal() {
    const modal = document.getElementById('productModal');
    modal.classList.remove('show');
}

// Función para cargar textos dinámicos desde Firebase
async function loadDynamicTexts() {
    try {
        console.log("Cargando textos dinámicos desde ProductosLatinosPanel/textos");
        
        if (!window.db) {
            console.log("ERROR: window.db no está disponible para cargar textos");
            return;
        }
        
        const docSnapshot = await window.db.collection('ProductosLatinosPanel').doc('textos').get();
        
        if (docSnapshot.exists) {
            const texts = docSnapshot.data();
            console.log("✅ Textos cargados:", texts);
            
            // Actualizar título
            const titleElement = document.querySelector('.main-title');
            if (titleElement && texts.titulo) {
                titleElement.textContent = texts.titulo;
                console.log("✅ Título actualizado:", texts.titulo);
            }
            
            // Actualizar subtítulo
            const subtitleElement = document.querySelector('.subtitle');
            if (subtitleElement && texts.subtitulo) {
                subtitleElement.textContent = texts.subtitulo;
                console.log("✅ Subtítulo actualizado:", texts.subtitulo);
            }
            
            // Actualizar placeholder de búsqueda
            const searchInput = document.getElementById('searchInput');
            if (searchInput && texts.placeholderBusqueda) {
                searchInput.placeholder = texts.placeholderBusqueda;
                console.log("✅ Placeholder búsqueda actualizado:", texts.placeholderBusqueda);
            }
            
            // Actualizar botón nuevo producto (manteniendo icono)
            const newProductBtn = document.querySelector('.btn-new-product');
            if (newProductBtn && texts.botonNuevo) {
                newProductBtn.innerHTML = `<i class="fas fa-plus"></i> ${texts.botonNuevo}`;
                console.log("✅ Botón nuevo producto actualizado:", texts.botonNuevo);
            }
            
        } else {
            console.log("⚠️ No se encontró el documento 'textos' en ProductosLatinosPanel");
        }
    } catch (error) {
        console.log("❌ Error al cargar textos dinámicos:", error);
    }
}

// Función para cargar productos latinos desde Firebase con limpieza total y carga específica
async function loadFirebaseProducts() {
    // Prevenir bucles infinitos
    if (isLoading) {
        console.log("⏸️ Carga ya en progreso en Productos Latinos, evitando bucle");
        return;
    }
    
    isLoading = true;
    
    try {
        // Verificar conexión actual
        console.log("Conexión actual:", window.db);
        
        if (!window.db) {
            console.log("ERROR: window.db no está disponible para Productos Latinos");
            console.log("Verifica que firebaseConfig.js se cargue antes que Lógica.js");
            isLoading = false;
            return;
        }
        
        console.log("🔥 Iniciando carga de Productos Latinos - EMERGENCIA ACTIVADA");
        console.log("📍 RUTAS EXACTAS A VERIFICAR:");
        console.log("   - productoslatinos/Alimentacion/Arveja");
        console.log("   - productoslatinos/Bebida/NoAlcoholicas");
        console.log("   - productoslatinos/Casero/Casero");
        console.log("   - productoslatinos/Dulce/Dulce");
        console.log("   - productoslatinos/Snacks/Snacks");
        
        // 1. VERIFICAR CONTENEDOR - No limpiar todavía
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) {
            console.log("❌ No se encontró el contenedor #productsGrid");
            return;
        }
        console.log("✅ Contenedor encontrado, esperando productos para limpiar");
        
        // 2. CARGA EMERGENCIA - Verificar cada ruta exacta
        let products = [];
        let totalEncontrados = 0;
        
        console.log("🚨 CARGA EMERGENCIA - Verificando cada ruta exacta...");
        
        // Verificar cada ruta exacta
        for (const [categoria, subcolecciones] of Object.entries(FIREBASE_ROUTES_LATINOS)) {
            console.log(`🔍 Verificando categoría: ${categoria}`);
            
            for (const subcollection of subcolecciones) {
                const rutaCompleta = `productoslatinos/${categoria}/${subcollection}`;
                console.log(`📍 Consultando ruta exacta: ${rutaCompleta}`);
                
                // Verificación especial para Bebida
                if (categoria === 'Bebida') {
                    console.log("🥤 VERIFICACIÓN ESPECIAL BEBIDA:");
                    console.log("   - Categoría Firebase:", categoria);
                    console.log("   - Subcolección:", subcollection);
                    console.log("   - Ruta completa:", rutaCompleta);
                    console.log("   - Esperando encontrar: America Kola, El Chichero, etc.");
                }
                
                try {
                    const snapshot = await window.db.collection('productoslatinos')
                        .doc(categoria)
                        .collection(subcollection)
                        .get();
                    
                    console.log(`📊 Resultados de ${rutaCompleta}: ${snapshot.docs.length} documentos`);
                    
                    if (snapshot.docs.length > 0) {
                        snapshot.forEach((doc) => {
                            const product = mapProductFieldsLatino(doc.data(), doc.id, categoria);
                            product.subcollection = subcollection;
                            product.route = rutaCompleta;
                            products.push(product);
                            totalEncontrados++;
                            console.log(`✅ Producto encontrado: ${product.nombre} (${rutaCompleta})`);
                        });
                    } else {
                        console.log(`⚠️ Sin documentos en: ${rutaCompleta}`);
                    }
                } catch (error) {
                    console.error(`❌ Error en ruta ${rutaCompleta}:`, error);
                }
            }
        }
        
        console.log(`🎯 RESULTADO FINAL: ${totalEncontrados} productos latinos encontrados`);
        console.log("✅ ¡Éxito! Datos recibidos de carga latina:", products);
        console.log('✅ Productos latinos encontrados:', products.length);
        
        // Actualizar array de productos de Firebase
        firebaseProducts = products;
        
        // Mostrar productos
        if (products.length === 0) {
            console.log("⚠️ No se encontraron productos latinos - mostrando mensaje de emergencia");
            showEmptyMessage();
        } else {
            console.log("🎉 Productos encontrados - añadiendo al DOM");
            // Añadir productos latinos al DOM usando función universal
            addFirebaseProductsToDOM();
        }
        
    } catch (error) {
        console.log("❌ Error en carga de productos latinos:", error);
        showEmptyMessage();
    } finally {
        isLoading = false;
        console.log("✅ Carga de productos latinos completada");
    }
}

// Función para cargar productos generales desde Firebase (SOLO SNACKS COMPLEJOS)
async function loadGeneralProducts() {
    if (isLoading) {
        console.log("⏸️ Carga ya en progreso en Productos Generales, evitando bucle");
        return;
    }
    
    isLoading = true;
    
    try {
        console.log("🔥 Iniciando carga de Productos Generales - SOLO SNACKS COMPLEJOS");
        console.log("📍 RUTAS DE SNACKS A VERIFICAR:");
        console.log("   - productos/Snacks/FrutosSecos");
        console.log("   - productos/SnacksGeneral/Doritos/Doritos");
        console.log("   - productos/SnacksGeneral/Gusanitos/Gusanitos");
        
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) {
            console.log("❌ No se encontró el contenedor #productsGrid");
            return;
        }
        
        // Limpiar contenedor antes de cargar
        productsGrid.innerHTML = '';
        console.log("🧹 Contenedor de productos generales limpiado");
        
        let products = [];
        let totalEncontrados = 0;
        
        // Cargar desde FIREBASE_ROUTES_GENERALES
        for (const [categoria, subcolecciones] of Object.entries(FIREBASE_ROUTES_GENERALES)) {
            console.log(`🔍 Verificando categoría general: ${categoria}`);
            
            for (const subcollection of subcolecciones) {
                // IMPORTANTE: Usar exactamente el nombre de la colección como está en Firestore
                const nombreColeccion = categoria;
                const rutaCompleta = `productos/${nombreColeccion}/${subcollection}`;
                console.log(`📍 Consultando ruta general: ${rutaCompleta}`);
                
                // Verificación especial para Snacks
                if (categoria === 'snacks') {
                    console.log("🍿 VERIFICACIÓN ESPECIAL SNACKS:");
                    console.log("   - Categoría:", categoria);
                    console.log("   - Subcolección:", subcollection);
                    console.log("   - Ruta completa:", rutaCompleta);
                    console.log("   - Esperando encontrar: FrutosSecos, Doritos, Gusanitos");
                }
                
                try {
                    const snapshot = await window.db.collection('productos')
                        .doc(nombreColeccion) // Usar nombreColección
                        .collection(subcollection)
                        .get();
                    
                    console.log(`📊 Resultados de ${rutaCompleta}: ${snapshot.docs.length} documentos`);
                    
                    if (snapshot.docs.length > 0) {
                        snapshot.forEach((doc) => {
                            const product = mapProductFieldsGeneral(doc.data(), doc.id, categoria);
                            product.subcollection = subcollection;
                            product.route = rutaCompleta;
                            product.category = categoria; // Asignar categoría 'snacks'
                            products.push(product);
                            totalEncontrados++;
                            console.log(`✅ Producto general encontrado: ${product.nombre} (${rutaCompleta})`);
                        });
                    } else {
                        console.log(`⚠️ Sin documentos en: ${rutaCompleta}`);
                    }
                } catch (error) {
                    console.error(`❌ Error en ruta ${rutaCompleta}:`, error);
                }
            }
        }
        
        console.log(`🎯 RESULTADO FINAL: ${totalEncontrados} productos generales encontrados`);
        
        // Actualizar array de productos
        firebaseProducts = products;
        
        // Mostrar productos
        if (products.length === 0) {
            console.log("⚠️ No se encontraron productos generales");
            showEmptyMessage();
        } else {
            console.log("🎉 Productos generales encontrados - añadiendo al DOM");
            addFirebaseProductsToDOM();
        }
        
    } catch (error) {
        console.log("❌ Error en carga de productos generales:", error);
        showEmptyMessage();
    } finally {
        isLoading = false;
        console.log("✅ Carga de productos generales completada");
    }
}

// Función para mapear campos de productos generales
function mapProductFieldsGeneral(product, docId, categoryPath) {
    console.log("🔍 Mapeo de campos generales");
    
    // Mapeo EXACTO de campos
    const imageUrl = (product.img || '').trim();
    const productName = (product.nombre || '').trim();
    const price = parseFloat(product.precio) || 0; // parseFloat para evitar errores
    const description = (product.desc || '').trim();
    
    // Normalizar categoría
    let normalizedCategory = normalizeText(categoryPath);
    
    // Mapeo de categorías para productos generales
    const categoryMapping = {
        'alimentacion': 'alimentacion',
        'bebida': 'bebida',
        'casero': 'casero',
        'dulce': 'dulce',
        'snacks': 'snacks'
    };
    
    normalizedCategory = categoryMapping[normalizedCategory] || categoryPath;
    
    console.log("🔍 Mapeo de campos generales - img:", imageUrl, "desc:", description, "nombre:", productName, "precio:", price, "categoría:", normalizedCategory);
    
    return {
        id: docId,
        nombre: productName || 'Sin nombre',
        precio: price,
        categoria: normalizedCategory,
        img: imageUrl,
        desc: description,
        route: `productos/${categoryPath}/${subcollection}`,
        ...product // Mantener otros campos originales
    };
}

// Función para cargar Snacks con estructura compleja (subcolecciones anidadas)
async function loadSnacksComplex() {
    if (isLoading) {
        console.log("⏸️ Carga ya en progreso en Snacks, evitando bucle");
        return;
    }
    
    isLoading = true;
    
    try {
        console.log("🍿 INICIANDO CARGA COMPLEJA DE SNACKS");
        console.log("📍 RUTAS ANIDADAS A VERIFICAR:");
        console.log("   - productos/Snacks/FrutosSecos (FrutosSecos, FrutosSecosGrefusa, Kikos)");
        console.log("   - productos/SnacksGeneral/Doritos/Doritos (Doritosclassic, Doritossweetchili)");
        console.log("   - productos/SnacksGeneral/Gusanitos/Gusanitos (Gusanitos)");
        
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) {
            console.log("❌ No se encontró el contenedor #productsGrid");
            return;
        }
        
        let products = [];
        let totalEncontrados = 0;
        
        // 1. CARGAR FRUTOS SECOS (productos/Snacks/FrutosSecos)
        try {
            console.log("🥜 CARGANDO FRUTOS SECOS...");
            const frutosSecosSnapshot = await window.db.collection('productos')
                .doc('Snacks')
                .collection('FrutosSecos')
                .get();
            
            console.log(`📊 Frutos Secos encontrados: ${frutosSecosSnapshot.docs.length} documentos`);
            
            frutosSecosSnapshot.forEach((doc) => {
                const product = mapProductFieldsGeneral(doc.data(), doc.id, 'snacks');
                product.subcollection = 'FrutosSecos';
                product.route = 'productos/Snacks/FrutosSecos';
                product.category = 'snacks';
                products.push(product);
                totalEncontrados++;
                console.log(`✅ Fruto Seco encontrado: ${product.nombre}`);
            });
        } catch (error) {
            console.error("❌ Error cargando Frutos Secos:", error);
        }
        
        // 2. CARGAR DORITOS (productos/SnacksGeneral/Doritos/Doritos)
        try {
            console.log("🍿 CARGANDO DORITOS ANIDADOS...");
            const doritosSnapshot = await window.db.collection('productos')
                .doc('SnacksGeneral')
                .collection('Doritos')
                .doc('Doritos')
                .collection('Doritos')
                .get();
            
            console.log(`📊 Doritos encontrados: ${doritosSnapshot.docs.length} documentos`);
            
            doritosSnapshot.forEach((doc) => {
                const product = mapProductFieldsGeneral(doc.data(), doc.id, 'snacks');
                product.subcollection = 'Doritos';
                product.route = 'productos/SnacksGeneral/Doritos/Doritos';
                product.category = 'snacks';
                products.push(product);
                totalEncontrados++;
                console.log(`✅ Dorito encontrado: ${product.nombre}`);
            });
        } catch (error) {
            console.error("❌ Error cargando Doritos:", error);
        }
        
        // 3. CARGAR GUSANITOS (productos/SnacksGeneral/Gusanitos/Gusanitos)
        try {
            console.log("🐛 CARGANDO GUSANITOS ANIDADOS...");
            const gusanitosSnapshot = await window.db.collection('productos')
                .doc('SnacksGeneral')
                .collection('Gusanitos')
                .doc('Gusanitos')
                .collection('Gusanitos')
                .get();
            
            console.log(`📊 Gusanitos encontrados: ${gusanitosSnapshot.docs.length} documentos`);
            
            gusanitosSnapshot.forEach((doc) => {
                const product = mapProductFieldsGeneral(doc.data(), doc.id, 'snacks');
                product.subcollection = 'Gusanitos';
                product.route = 'productos/SnacksGeneral/Gusanitos/Gusanitos';
                product.category = 'snacks';
                products.push(product);
                totalEncontrados++;
                console.log(`✅ Gusanito encontrado: ${product.nombre}`);
            });
        } catch (error) {
            console.error("❌ Error cargando Gusanitos:", error);
        }
        
        console.log(`🎯 RESULTADO FINAL SNACKS: ${totalEncontrados} productos encontrados`);
        
        // Actualizar array de productos
        firebaseProducts = products;
        
        // Mostrar productos
        if (products.length === 0) {
            console.log("⚠️ No se encontraron snacks");
            showEmptyMessage();
        } else {
            console.log("🎉 Snacks encontrados - añadiendo al DOM");
            addFirebaseProductsToDOM();
        }
        
    } catch (error) {
        console.log("❌ Error en carga de snacks complejos:", error);
        showEmptyMessage();
    } finally {
        isLoading = false;
        console.log("✅ Carga de snacks complejos completada");
    }
}


// Función DIRECTA para SNACKS - RUTAS EXACTAS ESPECIFICADAS
async function loadSnacksDirect() {
    if (isLoading) {
        console.log("⏸️ Carga ya en progreso en Snacks, evitando bucle");
        return;
    }
    
    isLoading = true;
    
    try {
        console.log("🍿 CARGA DIRECTA SNACKS - RUTAS LITERALES");
        console.log("📍 RUTAS EXACTAS:");
        console.log("   - productos/Snacks/FrutosSecos");
        console.log("   - productos/SnacksGeneral/Doritos/Doritos");
        console.log("   - productos/SnacksGeneral/Gusanitos/Gusanitos");
        
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) {
            console.log("❌ No se encontró el contenedor #productsGrid");
            return;
        }
        
        // Limpiar contenedor
        productsGrid.innerHTML = '';
        console.log("🧹 Contenedor limpiado para Snacks");
        
        let products = [];
        let totalEncontrados = 0;
        
        // 1. FRUTOS SECOS - productos/Snacks/FrutosSecos
        console.log("🥜 CARGANDO FRUTOS SECOS...");
        const frutosSecosSnapshot = await window.db.collection('productos')
            .doc('Snacks')
            .collection('FrutosSecos')
            .get();
        
        console.log(`📊 Frutos Secos: ${frutosSecosSnapshot.docs.length} documentos`);
        
        frutosSecosSnapshot.forEach((doc) => {
            const product = {
                id: doc.id,
                nombre: doc.data().nombre || 'Sin nombre',
                precio: parseFloat(doc.data().precio) || 0,
                desc: doc.data().desc || '',
                img: doc.data().img || '',
                categoria: 'snacks',
                route: 'productos/Snacks/FrutosSecos',
                subcollection: 'FrutosSecos'
            };
            products.push(product);
            totalEncontrados++;
            console.log(`✅ Fruto Seco: ${product.nombre}`);
        });
        
        // 2. DORITOS - productos/SnacksGeneral/Doritos/Doritos
        console.log("🍿 CARGANDO DORITOS...");
        const doritosSnapshot = await window.db.collection('productos')
            .doc('SnacksGeneral')
            .collection('Doritos')
            .doc('Doritos')
            .collection('Doritos')
            .get();
        
        console.log(`📊 Doritos: ${doritosSnapshot.docs.length} documentos`);
        
        doritosSnapshot.forEach((doc) => {
            const product = {
                id: doc.id,
                nombre: doc.data().nombre || 'Sin nombre',
                precio: parseFloat(doc.data().precio) || 0,
                desc: doc.data().desc || '',
                img: doc.data().img || '',
                categoria: 'snacks',
                route: 'productos/SnacksGeneral/Doritos/Doritos',
                subcollection: 'Doritos'
            };
            products.push(product);
            totalEncontrados++;
            console.log(`✅ Dorito: ${product.nombre}`);
        });
        
        // 3. GUSANITOS - productos/SnacksGeneral/Gusanitos/Gusanitos
        console.log("🐛 CARGANDO GUSANITOS...");
        const gusanitosSnapshot = await window.db.collection('productos')
            .doc('SnacksGeneral')
            .collection('Gusanitos')
            .doc('Gusanitos')
            .collection('Gusanitos')
            .get();
        
        console.log(`📊 Gusanitos: ${gusanitosSnapshot.docs.length} documentos`);
        
        gusanitosSnapshot.forEach((doc) => {
            const product = {
                id: doc.id,
                nombre: doc.data().nombre || 'Sin nombre',
                precio: parseFloat(doc.data().precio) || 0,
                desc: doc.data().desc || '',
                img: doc.data().img || '',
                categoria: 'snacks',
                route: 'productos/SnacksGeneral/Gusanitos/Gusanitos',
                subcollection: 'Gusanitos'
            };
            products.push(product);
            totalEncontrados++;
            console.log(`✅ Gusanito: ${product.nombre}`);
        });
        
        console.log(`🎯 SNACKS CARGADOS: ${totalEncontrados} productos`);
        
        // Actualizar array y mostrar
        firebaseProducts = products;
        
        if (products.length === 0) {
            console.log("⚠️ No se encontraron snacks");
            showEmptyMessage();
        } else {
            console.log("🎉 Snacks encontrados - añadiendo al DOM");
            addFirebaseProductsToDOM();
        }
        
    } catch (error) {
        console.log("❌ Error en carga directa de snacks:", error);
        showEmptyMessage();
    } finally {
        isLoading = false;
        console.log("✅ Carga directa de snacks completada");
    }
}

// Función para añadir productos de Firebase al DOM (SIMPLIFICADO - Solo mostrar productos)
function addFirebaseProductsToDOM() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) {
        console.log("❌ No se encontró el contenedor #productsGrid");
        return;
    }
    
    console.log("📦 Añadiendo productos de Firebase al DOM - SIMPLIFICADO");
    console.log("📋 Total de productos a añadir:", firebaseProducts.length);
    
    // NO limpiar contenedor si no hay productos - solo limpiar si hay productos nuevos
    if (firebaseProducts.length > 0) {
        productsGrid.innerHTML = '';
        
        // Añadir cada producto al DOM
        firebaseProducts.forEach((product) => {
            console.log(`🔄 Creando tarjeta para: ${product.nombre} (${product.route})`);
            console.log(`📍 Imagen: ${product.img}`);
            console.log(`📍 Nombre: ${product.nombre}`);
            
            // Crear tarjeta simple
            const card = crearTarjetaUniversal(product, product.route);
            
            // Solo añadir si la tarjeta fue creada
            if (card) {
                productsGrid.appendChild(card);
                console.log("✅ AÑADIDO: Producto visible:", product.nombre);
            } else {
                console.log("⚠️ Producto omitido (tarjeta null):", product.nombre);
            }
        });
        
        console.log("🎉 Productos latinos visibles en pantalla");
    } else {
        console.log("⚠️ No hay productos para mostrar - contenedor intacto");
    }
}

// FUNCIÓN UNIVERSAL LIMPIA - Crear tarjetas para TODOS los productos
function crearTarjetaUniversal(producto, rutaFirebase) {
    console.log("🌍 Creando tarjeta UNIVERSAL para:", producto.nombre);
    console.log("📍 Ruta Firebase:", rutaFirebase);
    
    // NO dibujar productos sin nombre o vacíos
    if (!producto.nombre || producto.nombre.trim() === '' || producto.nombre === 'Sin nombre') {
        console.log("⚠️ Producto sin nombre válido, omitiendo:", producto);
        return null;
    }
    
    // Guardar ruta en el producto para uso posterior
    producto.route = rutaFirebase;
    
    // Normalizar categoría para clases CSS
    let category = 'general'; // por defecto
    if (rutaFirebase.includes('productoslatinos')) {
        // Extraer categoría de la ruta latina
        const parts = rutaFirebase.split('/');
        category = parts[1] || 'latino'; // Alimentacion, Dulce, etc.
    } else {
        // Para productos generales, usar la categoría existente o inferir
        category = producto.category || 'general';
    }
    
    const normalizedCategory = normalizeText(category);
    
    const categoryNames = {
        'alimentacion': 'ALIMENTACIÓN',
        'bebida': 'BEBIDA',
        'casero': 'CASERO',
        'dulce': 'DULCE',
        'snacks': 'SNACKS',
        'general': 'GENERAL'
    };
    
    const imageUrl = producto.img || getProductImage(normalizedCategory);
    const esLatino = rutaFirebase.includes('productoslatinos');
    
    const card = document.createElement('article');
    card.className = `product-card ${normalizedCategory} ${esLatino ? 'latino-product' : 'general-product'}`;
    card.setAttribute('data-category', normalizedCategory);
    card.setAttribute('data-firebase-id', producto.id);
    card.setAttribute('data-route', rutaFirebase);
    card.setAttribute('data-product-type', esLatino ? 'latino' : 'general');
    
    card.innerHTML = `
        <img src="${imageUrl}" alt="${producto.nombre}" class="product-image">
        <div class="product-content">
            <div class="product-header">
                <h3 class="product-title">${producto.nombre}</h3>
                <span class="category-badge ${normalizedCategory} ${esLatino ? 'latino-badge' : ''}">
                    ${categoryNames[normalizedCategory] || 'GENERAL'}
                </span>
            </div>
            <p class="product-price">${parseFloat(producto.precio || 0).toFixed(2)}€</p>
            <div class="product-actions">
                <!-- Botones desactivados temporalmente para evitar errores -->
                <button class="btn-edit" data-product-id="${producto.id}" disabled>
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-delete" data-product-id="${producto.id}" data-product-name="${producto.nombre}" disabled>
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    
    // BOTONES DESACTIVADOS - Sin event listeners para evitar errores
    console.log("✅ Tarjeta SIMPLE creada para:", producto.nombre);
    console.log("📍 Imagen:", imageUrl);
    console.log("� Nombre:", producto.nombre);
    console.log("📍 Ruta:", rutaFirebase);
    return card;
}

// FORMULARIO COMPLETO CON 6 CAMPOS - Para Nuevo y Editar
function crearFormularioCompleto(producto = null, esEdicion = false) {
    console.log("📝 Creando formulario completo con 6 campos");
    
    const categorias = [
        'Alimentacion', 'Bebida', 'Casero', 'Dulce', 'Snacks'
    ];
    
    const unidades = ['ud', 'kg', 'l', 'pack', 'caja', 'botella', 'saco'];
    
    const modal = document.createElement('div');
    modal.className = 'modal-formulario-completo';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${esEdicion ? '✏️ Editar Producto' : '➕ Nuevo Producto'}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <form id="formularioCompleto" class="form-completo">
                    <!-- 1. Nombre del Producto -->
                    <div class="form-group">
                        <label for="nombreProducto">1. Nombre del Producto *</label>
                        <input type="text" id="nombreProducto" name="nombre" value="${producto?.nombre || ''}" required placeholder="Ej: Pan de Molde">
                    </div>
                    
                    <!-- 2. Categoría (Desplegable) -->
                    <div class="form-group">
                        <label for="categoriaProducto">2. Categoría *</label>
                        <select id="categoriaProducto" name="categoria" required>
                            <option value="">Selecciona una categoría</option>
                            ${categorias.map(cat => 
                                `<option value="${cat}" ${producto?.category === cat ? 'selected' : ''}>${cat}</option>`
                            ).join('')}
                        </select>
                    </div>
                    
                    <!-- 3. Descripción (Texto largo) -->
                    <div class="form-group">
                        <label for="descripcionProducto">3. Descripción</label>
                        <textarea id="descripcionProducto" name="descripcion" rows="4" placeholder="Describe el producto...">${producto?.descripcion || producto?.desc || ''}</textarea>
                    </div>
                    
                    <!-- 4. Precio (€) -->
                    <div class="form-group">
                        <label for="precioProducto">4. Precio (€) *</label>
                        <input type="number" id="precioProducto" name="precio" step="0.01" min="0" value="${producto?.precio || ''}" required placeholder="0.00">
                    </div>
                    
                    <!-- 5. Unidad -->
                    <div class="form-group">
                        <label for="unidadProducto">5. Unidad</label>
                        <select id="unidadProducto" name="unidad">
                            <option value="">Selecciona unidad</option>
                            ${unidades.map(uni => 
                                `<option value="${uni}" ${producto?.unidad === uni ? 'selected' : ''}>${uni}</option>`
                            ).join('')}
                        </select>
                    </div>
                    
                    <!-- 6. Imagen (URL) -->
                    <div class="form-group">
                        <label for="imagenProducto">6. Imagen (URL)</label>
                        <input type="url" id="imagenProducto" name="imagen" value="${producto?.imagen || producto?.img || ''}" placeholder="https://ejemplo.com/imagen.jpg">
                    </div>
                    
                    <input type="hidden" id="productoId" value="${producto?.id || ''}">
                    <input type="hidden" id="rutaFirebase" value="${producto?.route || ''}">
                    
                    <div class="form-actions">
                        <button type="button" class="btn-cancel">Cancelar</button>
                        <button type="submit" class="btn-save">
                            ${esEdicion ? '💾 Guardar Cambios' : '➕ Añadir Producto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Añadir estilos si no existen
    if (!document.querySelector('#formularioCompletoStyles')) {
        const styles = document.createElement('style');
        styles.id = 'formularioCompletoStyles';
        styles.textContent = `
            .modal-formulario-completo {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .modal-overlay {
                background: rgba(0, 0, 0, 0.5);
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .modal-content {
                background: white;
                padding: 2rem;
                border-radius: 12px;
                max-width: 600px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
            }
            .form-completo .form-group {
                margin-bottom: 1.5rem;
            }
            .form-completo label {
                display: block;
                margin-bottom: 0.5rem;
                font-weight: 600;
                color: #333;
            }
            .form-completo input,
            .form-completo select,
            .form-completo textarea {
                width: 100%;
                padding: 0.75rem;
                border: 1px solid #ddd;
                border-radius: 6px;
                font-size: 1rem;
            }
            .form-actions {
                display: flex;
                gap: 1rem;
                justify-content: flex-end;
                margin-top: 2rem;
            }
            .btn-cancel,
            .btn-save {
                padding: 0.75rem 1.5rem;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 1rem;
                font-weight: 600;
            }
            .btn-cancel {
                background: #e0e0e0;
                color: #333;
            }
            .btn-save {
                background: #4CAF50;
                color: white;
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Añadir al DOM
    document.body.appendChild(modal);
    
    // Event listeners
    const closeModal = () => document.body.removeChild(modal);
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.btn-cancel').addEventListener('click', closeModal);
    modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
        if (e.target === modal.querySelector('.modal-overlay')) closeModal();
    });
    
    // Submit del formulario
    modal.querySelector('#formularioCompleto').addEventListener('submit', (e) => {
        e.preventDefault();
        guardarProductoCompleto(modal, esEdicion);
    });
    
    return modal;
}

// FUNCIÓN PARA GUARDAR PRODUCTO COMPLETO (6 campos)
function guardarProductoCompleto(modal, esEdicion) {
    console.log("💾 Guardando producto completo");
    
    // Obtener datos del formulario
    const formData = {
        nombre: modal.querySelector('#nombreProducto').value.trim(),
        categoria: modal.querySelector('#categoriaProducto').value,
        descripcion: modal.querySelector('#descripcionProducto').value.trim(),
        precio: parseFloat(modal.querySelector('#precioProducto').value) || 0,
        unidad: modal.querySelector('#unidadProducto').value,
        imagen: modal.querySelector('#imagenProducto').value.trim(),
        id: modal.querySelector('#productoId').value,
        ruta: modal.querySelector('#rutaFirebase').value
    };
    
    console.log("� Datos del formulario:", formData);
    
    if (esEdicion && formData.id && formData.ruta) {
        // EDITAR producto existente
        console.log("✏️ Editando producto existente");
        
        const routeParts = formData.ruta.split('/');
        const collection = routeParts[0];
        const document = routeParts[1];
        const subcollectionPath = routeParts[2];
        
        const updateData = {
            nombre: formData.nombre,
            category: formData.categoria,
            desc: formData.descripcion,
            precio: formData.precio,
            unidad: formData.unidad,
            img: formData.imagen
        };
        
        const docRef = window.db.collection(collection).doc(document).collection(subcollectionPath).doc(formData.id);
        
        docRef.update(updateData)
            .then(() => {
                console.log("✅ Producto actualizado correctamente");
                showNotification('Producto actualizado correctamente', '#4CAF50');
                document.body.removeChild(modal);
                setTimeout(() => loadFirebaseProducts(), 500);
            })
            .catch(error => {
                console.error("❌ Error al actualizar:", error);
                showNotification('Error al actualizar producto', '#f44336');
            });
            
    } else {
        // NUEVO producto
        console.log("➕ Creando nuevo producto");
        
        // Determinar la ruta según la categoría
        const categoria = formData.categoria;
        const subcollection = FIREBASE_ROUTES_LATINOS[categoria]?.[0] || categoria;
        
        const newProductData = {
            nombre: formData.nombre,
            category: formData.categoria,
            desc: formData.descripcion,
            precio: formData.precio,
            unidad: formData.unidad,
            img: formData.imagen
        };
        
        const docRef = window.db.collection('productoslatinos').doc(categoria).collection(subcollection);
        
        docRef.add(newProductData)
            .then(() => {
                console.log("✅ Producto creado correctamente");
                showNotification('Producto creado correctamente', '#4CAF50');
                document.body.removeChild(modal);
                setTimeout(() => loadFirebaseProducts(), 500);
            })
            .catch(error => {
                console.error("❌ Error al crear:", error);
                showNotification('Error al crear producto', '#f44336');
            });
    }
}

// FUNCIÓN VACÍA PARA EVITAR ERROR DE REFERENCIA
function guardarCambiosProducto() {
    console.log("🔧 guardarCambiosProducto llamado - función temporal vacía");
    // Función temporal para evitar error de referencia
    // TODO: Implementar lógica completa más tarde
}

// FUNCIÓN UNIVERSAL - Confirmar eliminación para TODOS los productos
function confirmarEliminacion(producto, rutaFirebase) {
    console.log("🗑️ Confirmar eliminación universal para:", producto.nombre);
    console.log("📍 Ruta Firebase:", rutaFirebase);
    
    // Confirmación con el usuario
    const confirmacion = confirm(`¿Estás seguro de que quieres eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`);
    
    if (confirmacion) {
        console.log("✅ Usuario confirmó eliminación");
        
        // Ejecutar deleteDoc usando la rutaFirebase
        try {
            const routeParts = rutaFirebase.split('/');
            if (routeParts.length < 3) {
                console.error("❌ Error: Ruta inválida para eliminación:", rutaFirebase);
                alert("Error: Ruta de Firebase no válida para eliminación");
                return;
            }
            
            const collection = routeParts[0]; // productos o productoslatinos
            const document = routeParts[1];  // alimentacion, Dulce, etc.
            const subcollectionPath = routeParts[2]; // alimentacion, Dulce, etc.
            
            console.log("🔍 Ruta parseada para eliminación:", { collection, document, subcollectionPath });
            
            // Eliminar de Firebase usando deleteDoc
            const docRef = window.db.collection(collection).doc(document).collection(subcollectionPath).doc(producto.id);
            
            docRef.delete()
                .then(() => {
                    console.log("✅ Producto eliminado correctamente de Firebase");
                    const mensaje = collection === 'productoslatinos' ? 
                        'Producto latino eliminado correctamente' : 
                        'Producto eliminado correctamente';
                    showNotification(mensaje, '#e74c3c');
                    
                    // Refresco automático del contenedor
                    setTimeout(() => {
                        console.log("🔄 Recargando productos después de eliminación...");
                        refrescarContenedor();
                    }, 500);
                })
                .catch((error) => {
                    console.error("❌ Error al eliminar producto:", error);
                    showNotification('Error al eliminar producto: ' + error.message, '#f44336');
                });
                
        } catch (error) {
            console.error("❌ Error en confirmarEliminacion:", error);
            showNotification('Error al eliminar el producto: ' + error.message, '#f44336');
        }
    } else {
        console.log("❌ Usuario canceló eliminación");
    }
}

// Función unificada para mostrar formulario de edición (para todos los productos)
function mostrarFormularioEdicion(producto, rutaCompleta) {
    console.log("🔧 Mostrando formulario de edición para:", producto.nombre);
    console.log("📍 Ruta completa:", rutaCompleta);
    console.log("📍 Tipo de producto:", rutaCompleta.includes('productoslatinos') ? 'Latino' : 'General');
    
    // Verificar que tenemos la ruta necesaria
    if (!rutaCompleta) {
        console.error("❌ Error: No hay ruta Firebase para este producto");
        alert("Error: No se puede editar este producto porque falta la ruta de Firebase");
        return;
    }
    
    // Determinar si es producto latino para estilos especiales
    const esLatino = rutaCompleta.includes('productoslatinos');
    const icono = esLatino ? '🌮' : '🔧';
    const colorTema = esLatino ? '#e67e22' : '#3498db';
    
    // Crear modal dinámicamente
    const modal = document.createElement('div');
    modal.className = `edit-modal ${esLatino ? 'latino-modal' : 'general-modal'}`;
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content ${esLatino ? 'latino-content' : 'general-content'}">
                <div class="modal-header">
                    <h3>${icono} Editar Producto ${esLatino ? 'Latino' : 'General'}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <form id="editForm" class="edit-form ${esLatino ? 'latino-form' : 'general-form'}">
                    <div class="form-group">
                        <label for="editNombre">Nombre:</label>
                        <input type="text" id="editNombre" value="${producto.nombre || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="editPrecio">Precio (€):</label>
                        <input type="number" id="editPrecio" step="0.01" value="${producto.precio || 0}" required>
                    </div>
                    <div class="form-group">
                        <label for="editDescripcion">Descripción:</label>
                        <textarea id="editDescripcion" rows="3">${producto.descripcion || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="editImagen">URL Imagen:</label>
                        <input type="text" id="editImagen" value="${producto.imagen || ''}">
                    </div>
                    <input type="hidden" id="editProductId" value="${producto.id || ''}">
                    <input type="hidden" id="editRoute" value="${rutaCompleta || ''}">
                    <div class="form-actions">
                        <button type="button" class="btn-cancel">Cancelar</button>
                        <button type="button" class="btn-delete">Eliminar Producto</button>
                        <button type="submit" class="btn-save">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Añadir estilos si no existen
    if (!document.querySelector('#editModalStyles')) {
        const styles = document.createElement('style');
        styles.id = 'editModalStyles';
        styles.textContent = `
            .edit-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .modal-overlay {
                background: rgba(0, 0, 0, 0.5);
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .modal-content {
                background: white;
                padding: 2rem;
                border-radius: 12px;
                max-width: 500px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
            }
            .latino-modal .modal-content {
                border: 2px solid #e67e22;
                box-shadow: 0 8px 32px rgba(230, 126, 34, 0.3);
            }
            .general-modal .modal-content {
                border: 2px solid #3498db;
                box-shadow: 0 8px 32px rgba(52, 152, 219, 0.3);
            }
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.5rem;
            }
            .latino-content h3 {
                color: #e67e22;
            }
            .general-content h3 {
                color: #3498db;
            }
            .modal-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #666;
            }
            .form-group {
                margin-bottom: 1rem;
            }
            .form-group label {
                display: block;
                margin-bottom: 0.5rem;
                font-weight: 600;
                color: #333;
            }
            .form-group input,
            .form-group textarea {
                width: 100%;
                padding: 0.75rem;
                border: 1px solid #ddd;
                border-radius: 6px;
                font-size: 1rem;
            }
            .form-actions {
                display: flex;
                gap: 1rem;
                justify-content: flex-end;
                margin-top: 1.5rem;
            }
            .btn-cancel,
            .btn-save,
            .btn-delete {
                padding: 0.75rem 1.5rem;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 1rem;
                font-weight: 600;
            }
            .btn-cancel {
                background: #e0e0e0;
                color: #333;
            }
            .btn-save {
                background: ${colorTema};
                color: white;
            }
            .btn-save:hover {
                background: ${esLatino ? '#d35400' : '#2980b9'};
            }
            .btn-delete {
                background: #e74c3c;
                color: white;
            }
            .btn-delete:hover {
                background: #c0392b;
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Añadir modal al DOM
    document.body.appendChild(modal);
    
    // Event listeners
    const closeModal = () => {
        document.body.removeChild(modal);
    };
    
    // Cerrar modal con botón X
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    
    // Cerrar modal con botón Cancelar
    modal.querySelector('.btn-cancel').addEventListener('click', closeModal);
    
    // Cerrar modal haciendo clic fuera
    modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
        if (e.target === modal.querySelector('.modal-overlay')) {
            closeModal();
        }
    });
    
    // Eliminar producto
    modal.querySelector('.btn-delete').addEventListener('click', () => {
        const confirmacion = confirm(`¿Estás seguro de que quieres eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`);
        if (confirmacion) {
            eliminarProducto(producto.id, rutaCompleta, modal);
        }
    });
    
    // Guardar cambios
    modal.querySelector('#editForm').addEventListener('submit', (e) => {
        e.preventDefault();
        guardarProducto(producto.id, rutaCompleta, modal);
    });
}

// Función para abrir modal de edición con datos actuales del producto (general)
function abrirModalEdicion(producto) {
    console.log("🔧 Abriendo modal de edición para:", producto.nombre);
    console.log("📍 Ruta Firebase:", producto.route);
    console.log("📍 Subcolección:", producto.subcollection);
    
    // Verificar que tenemos la ruta necesaria
    if (!producto.route) {
        console.error("❌ Error: No hay ruta Firebase para este producto");
        alert("Error: No se puede editar este producto porque falta la ruta de Firebase");
        return;
    }
    
    // Crear modal dinámicamente
    const modal = document.createElement('div');
    modal.className = 'edit-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Editar Producto</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <form id="editForm" class="edit-form">
                    <div class="form-group">
                        <label for="editNombre">Nombre:</label>
                        <input type="text" id="editNombre" value="${producto.nombre || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="editPrecio">Precio (€):</label>
                        <input type="number" id="editPrecio" step="0.01" value="${producto.precio || 0}" required>
                    </div>
                    <div class="form-group">
                        <label for="editDescripcion">Descripción:</label>
                        <textarea id="editDescripcion" rows="3">${producto.descripcion || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="editImagen">URL Imagen:</label>
                        <input type="text" id="editImagen" value="${producto.imagen || ''}">
                    </div>
                    <input type="hidden" id="editProductId" value="${producto.id || ''}">
                    <input type="hidden" id="editRoute" value="${producto.route || ''}">
                    <input type="hidden" id="editSubcollection" value="${producto.subcollection || ''}">
                    <div class="form-actions">
                        <button type="button" class="btn-cancel">Cancelar</button>
                        <button type="submit" class="btn-save">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Añadir estilos al modal si no existen
    if (!document.querySelector('#editModalStyles')) {
        const styles = document.createElement('style');
        styles.id = 'editModalStyles';
        styles.textContent = `
            .edit-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .modal-overlay {
                background: rgba(0, 0, 0, 0.5);
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .modal-content {
                background: white;
                padding: 2rem;
                border-radius: 12px;
                max-width: 500px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
            }
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.5rem;
            }
            .modal-header h3 {
                margin: 0;
                color: #333;
            }
            .modal-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #666;
            }
            .form-group {
                margin-bottom: 1rem;
            }
            .form-group label {
                display: block;
                margin-bottom: 0.5rem;
                font-weight: 600;
                color: #333;
            }
            .form-group input,
            .form-group textarea {
                width: 100%;
                padding: 0.75rem;
                border: 1px solid #ddd;
                border-radius: 6px;
                font-size: 1rem;
            }
            .form-actions {
                display: flex;
                gap: 1rem;
                justify-content: flex-end;
                margin-top: 1.5rem;
            }
            .btn-cancel,
            .btn-save {
                padding: 0.75rem 1.5rem;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 1rem;
            }
            .btn-cancel {
                background: #e0e0e0;
                color: #333;
            }
            .btn-save {
                background: #4CAF50;
                color: white;
            }
            .btn-save:hover {
                background: #45a049;
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Añadir modal al DOM
    document.body.appendChild(modal);
    
    // Event listeners
    const closeModal = () => {
        document.body.removeChild(modal);
    };
    
    // Cerrar modal con botón X
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    
    // Cerrar modal con botón Cancelar
    modal.querySelector('.btn-cancel').addEventListener('click', closeModal);
    
    // Cerrar modal haciendo clic fuera
    modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
        if (e.target === modal.querySelector('.modal-overlay')) {
            closeModal();
        }
    });
    
    // Guardar cambios
    modal.querySelector('#editForm').addEventListener('submit', (e) => {
        e.preventDefault();
        guardarCambiosProducto(modal);
    });
}

// Función para actualizar producto en Firebase
function actualizarProducto(productId, route, datosActualizados) {
    console.log("💾 Actualizando producto:", productId);
    console.log("📍 Ruta completa:", route);
    console.log("📋 Datos actualizados:", datosActualizados);
    
    // Parsear la ruta para obtener colección, documento y subcolección
    const routeParts = route.split('/');
    if (routeParts.length < 3) {
        console.error("❌ Error: Ruta inválida:", route);
        return Promise.reject("Ruta inválida");
    }
    
    const collection = routeParts[0]; // productoslatinos o productos
    const document = routeParts[1];  // Dulce, Snacks, alimentacion, etc.
    const subcollectionPath = routeParts[2]; // Dulce, alimentacion, etc.
    
    console.log("🔍 Ruta parseada:", { collection, document, subcollectionPath });
    
    // Actualizar en Firebase usando updateDoc
    const docRef = window.db.collection(collection).doc(document).collection(subcollectionPath).doc(productId);
    
    // Asegurar que el precio sea un número válido
    const updateData = {
        ...datosActualizados,
        precio: parseFloat(datosActualizados.precio) || 0 // Guardar como número limpio
    };
    
    console.log("📋 Datos finales a guardar:", updateData);
    
    return docRef.update(updateData)
        .then(() => {
            console.log("✅ Producto actualizado correctamente en Firebase");
            showNotification('Producto actualizado correctamente', '#4CAF50');
            
            // Recargar productos automáticamente para mostrar cambios
            setTimeout(() => {
                console.log("🔄 Recargando productos para mostrar cambios...");
                loadFirebaseProducts();
            }, 500);
            
            return true;
        })
        .catch((error) => {
            console.error("❌ Error al actualizar producto:", error);
            showNotification('Error al actualizar producto: ' + error.message, '#f44336');
            return false;
        });
}

// Función para guardar cambios de productos latinos en Firebase
function guardarCambiosProductoLatino(modal) {
    const productId = modal.querySelector('#editLatinoProductId').value;
    const route = modal.querySelector('#editLatinoRoute').value;
    const subcollection = modal.querySelector('#editLatinoSubcollection').value;
    
    // Validaciones básicas
    if (!productId || !route) {
        console.error("❌ Error: Faltan datos necesarios para actualizar producto latino");
        showNotification('Error: Faltan datos del producto latino', '#f44336');
        return;
    }
    
    // Validar que sea una ruta de productoslatinos
    if (!route.includes('productoslatinos')) {
        console.error("❌ Error: La ruta no corresponde a productoslatinos");
        showNotification('Error: La ruta no corresponde a productos latinos', '#f44336');
        return;
    }
    
    // Obtener datos del formulario latino
    const nombre = modal.querySelector('#editLatinoNombre').value.trim();
    const precio = parseFloat(modal.querySelector('#editLatinoPrecio').value) || 0;
    const descripcion = modal.querySelector('#editLatinoDescripcion').value.trim();
    const imagen = modal.querySelector('#editLatinoImagen').value.trim();
    
    console.log("🌮 Guardando cambios para producto LATINO:", productId);
    console.log("📍 Ruta completa:", route);
    console.log("📍 Subcolección:", subcollection);
    console.log("📋 Datos a guardar:", { nombre, precio, descripcion, imagen });
    
    // Preparar datos para actualizar (usando campos correctos de Firebase)
    const datosActualizados = {
        nombre: nombre,
        precio: parseFloat(precio) || 0, // Asegurar número válido para evitar toFixed errors
        desc: descripcion, // Usar campo 'desc' como espera Firebase
        img: imagen // Usar campo 'img' como espera Firebase
    };
    
    console.log("📋 Datos finales para productoslatinos:", datosActualizados);
    
    // Usar la función actualizarProducto específica para productoslatinos
    actualizarProductoLatino(productId, route, datosActualizados)
        .then((success) => {
            if (success) {
                // Cerrar modal solo si la actualización fue exitosa
                document.body.removeChild(modal);
                console.log("✅ Modal latino cerrado tras actualización exitosa");
            }
        })
        .catch((error) => {
            console.error("❌ Error en el proceso de actualización latino:", error);
        });
}

// Función para actualizar producto latino en Firebase
function actualizarProductoLatino(productId, route, datosActualizados) {
    console.log("🌮 Actualizando producto LATINO:", productId);
    console.log("📍 Ruta completa:", route);
    console.log("📋 Datos actualizados:", datosActualizados);
    
    // Parsear la ruta para productoslatinos
    const routeParts = route.split('/');
    if (routeParts.length < 3 || routeParts[0] !== 'productoslatinos') {
        console.error("❌ Error: Ruta inválida para productoslatinos:", route);
        return Promise.reject("Ruta inválida para productoslatinos");
    }
    
    const collection = routeParts[0]; // productoslatinos
    const document = routeParts[1];  // Dulce, Snacks, Alimentacion, etc.
    const subcollectionPath = routeParts[2]; // Dulce, Arveja, etc.
    
    console.log("🔍 Ruta parseada para productoslatinos:", { collection, document, subcollectionPath });
    
    // Actualizar en Firebase usando updateDoc para productoslatinos
    const docRef = window.db.collection(collection).doc(document).collection(subcollectionPath).doc(productId);
    
    // Asegurar que el precio sea un número válido (consistencia de datos)
    const updateData = {
        ...datosActualizados,
        precio: parseFloat(datosActualizados.precio) || 0 // Número limpio para toFixed
    };
    
    console.log("📋 Datos finales para productoslatinos:", updateData);
    
    return docRef.update(updateData)
        .then(() => {
            console.log("✅ Producto LATINO actualizado correctamente en Firebase");
            showNotification('Producto latino actualizado correctamente', '#e67e22');
            
            // Refresco automático de la sección de latinos
            setTimeout(() => {
                console.log("🔄 Recargando productos latinos para mostrar cambios...");
                loadFirebaseProducts(); // Recarga la sección de latinos
            }, 500);
            
            return true;
        })
        .catch((error) => {
            console.error("❌ Error al actualizar producto latino:", error);
            showNotification('Error al actualizar producto latino: ' + error.message, '#f44336');
            return false;
        });
}

// Función para guardar producto latino usando updateDoc
function guardarProductoLatino(productId, rutaCompleta, modal) {
    console.log("🌮 Guardando producto LATINO:", productId);
    console.log("📍 Ruta completa:", rutaCompleta);
    
    // Validaciones básicas
    if (!productId || !rutaCompleta) {
        console.error("❌ Error: Faltan datos necesarios para actualizar producto latino");
        showNotification('Error: Faltan datos del producto latino', '#f44336');
        return;
    }
    
    // Validar que sea una ruta de productoslatinos
    if (!rutaCompleta.includes('productoslatinos')) {
        console.error("❌ Error: La ruta no corresponde a productoslatinos");
        showNotification('Error: La ruta no corresponde a productos latinos', '#f44336');
        return;
    }
    
    // Obtener datos del formulario latino
    const nombre = modal.querySelector('#editLatinoNombre').value.trim();
    const precioTexto = modal.querySelector('#editLatinoPrecio').value;
    const descripcion = modal.querySelector('#editLatinoDescripcion').value.trim();
    const imagen = modal.querySelector('#editLatinoImagen').value.trim();
    
    // Validación: Asegurar que el precio se convierta a número con parseFloat()
    const precio = parseFloat(precioTexto) || 0;
    
    if (isNaN(precio)) {
        console.error("❌ Error: El precio no es un número válido");
        showNotification('Error: El precio debe ser un número válido', '#f44336');
        return;
    }
    
    console.log("📋 Datos a guardar para producto latino:", { nombre, precio, descripcion, imagen });
    console.log("✅ Precio validado como número:", precio);
    
    // Parsear la ruta para productoslatinos: productoslatinos/Alimentacion/Arveja/ID
    const routeParts = rutaCompleta.split('/');
    if (routeParts.length < 3) {
        console.error("❌ Error: Ruta inválida:", rutaCompleta);
        showNotification('Error: Ruta de Firebase no válida', '#f44336');
        return;
    }
    
    const collection = routeParts[0]; // productoslatinos
    const document = routeParts[1];  // Alimentacion, Dulce, etc.
    const subcollectionPath = routeParts[2]; // Arveja, Dulce, etc.
    
    console.log("🔍 Ruta parseada para productoslatinos:", { collection, document, subcollectionPath });
    
    // Preparar datos para actualizar usando campos correctos de Firebase
    const datosActualizados = {
        nombre: nombre,
        precio: precio, // Número validado para evitar errores toFixed
        desc: descripcion, // Usar campo 'desc' como espera Firebase
        img: imagen // Usar campo 'img' como espera Firebase
    };
    
    // Actualizar en Firebase usando updateDoc para productoslatinos
    const docRef = window.db.collection(collection).doc(document).collection(subcollectionPath).doc(productId);
    
    docRef.update(datosActualizados)
        .then(() => {
            console.log("✅ Producto LATINO actualizado correctamente en Firebase");
            showNotification('Producto latino actualizado correctamente', '#e67e22');
            
            // Cerrar modal
            document.body.removeChild(modal);
            
            // Refresco automático del contenedor
            setTimeout(() => {
                console.log("🔄 Recargando productos latinos para mostrar cambios...");
                refrescarContenedor();
            }, 500);
        })
        .catch((error) => {
            console.error("❌ Error al actualizar producto latino:", error);
            showNotification('Error al actualizar producto latino: ' + error.message, '#f44336');
        });
}

// Función para guardar producto usando updateDoc (unificado para todos los productos)
function guardarProducto(productId, rutaCompleta, modal) {
    try {
        console.log("💾 Guardando producto:", productId);
        console.log("📍 Ruta completa:", rutaCompleta);
        console.log("📍 Tipo de producto:", rutaCompleta.includes('productoslatinos') ? 'Latino' : 'General');
        
        // Validaciones básicas
        if (!productId || !rutaCompleta) {
            console.error("❌ Error: Faltan datos necesarios para actualizar");
            showNotification('Error: Faltan datos del producto', '#f44336');
            return;
        }
        
        // Obtener datos del formulario (unificado para todos los productos)
        const nombreInput = modal.querySelector('#editNombre') || modal.querySelector('#editLatinoNombre');
        const precioInput = modal.querySelector('#editPrecio') || modal.querySelector('#editLatinoPrecio');
        const descripcionInput = modal.querySelector('#editDescripcion') || modal.querySelector('#editLatinoDescripcion');
        const imagenInput = modal.querySelector('#editImagen') || modal.querySelector('#editLatinoImagen');
        
        if (!nombreInput || !precioInput) {
            console.error("❌ Error: No se encontraron los campos del formulario");
            showNotification('Error: No se encontraron los campos del formulario', '#f44336');
            return;
        }
        
        const nombre = nombreInput.value.trim();
        const precioTexto = precioInput.value;
        const descripcion = descripcionInput ? descripcionInput.value.trim() : '';
        const imagen = imagenInput ? imagenInput.value.trim() : '';
        
        // Validación: Asegurar que el precio se convierta a número con parseFloat()
        const precio = parseFloat(precioTexto) || 0;
        
        if (isNaN(precio)) {
            console.error("❌ Error: El precio no es un número válido");
            showNotification('Error: El precio debe ser un número válido', '#f44336');
            return;
        }
        
        console.log("📋 Datos a guardar:", { nombre, precio, descripcion, imagen });
        console.log("✅ Precio validado como número:", precio);
        
        // Parsear la ruta para obtener colección, documento y subcolección
        const routeParts = rutaCompleta.split('/');
        if (routeParts.length < 3) {
            console.error("❌ Error: Ruta inválida:", rutaCompleta);
            showNotification('Error: Ruta de Firebase no válida', '#f44336');
            return;
        }
        
        const collection = routeParts[0]; // productos o productoslatinos
        const document = routeParts[1];  // alimentacion, Dulce, Alimentacion, etc.
        const subcollectionPath = routeParts[2]; // alimentacion, Dulce, Arveja, etc.
        
        console.log("🔍 Ruta parseada:", { collection, document, subcollectionPath });
        
        // Validar que la ruta sea correcta según el tipo de producto
        if (collection === 'productoslatinos') {
            console.log("🌮 Guardando producto LATINO en:", rutaCompleta);
        } else {
            console.log("🔧 Guardando producto GENERAL en:", rutaCompleta);
        }
        
        // Preparar datos para actualizar usando campos correctos de Firebase
        const datosActualizados = {
            nombre: nombre,
            precio: precio, // Número validado para evitar errores toFixed
            desc: descripcion, // Usar campo 'desc' como espera Firebase
            img: imagen // Usar campo 'img' como espera Firebase
        };
        
        // Actualizar en Firebase usando updateDoc
        const docRef = window.db.collection(collection).doc(document).collection(subcollectionPath).doc(productId);
        
        docRef.update(datosActualizados)
            .then(() => {
                console.log("✅ Producto actualizado correctamente en Firebase");
                const mensaje = collection === 'productoslatinos' ? 
                    'Producto latino actualizado correctamente' : 
                    'Producto actualizado correctamente';
                const color = collection === 'productoslatinos' ? '#e67e22' : '#4CAF50';
                showNotification(mensaje, color);
                
                // Cerrar modal
                if (modal && modal.parentNode) {
                    document.body.removeChild(modal);
                }
                
                // Refresco automático del contenedor
                setTimeout(() => {
                    console.log("🔄 Recargando productos para mostrar cambios...");
                    refrescarContenedor();
                }, 500);
            })
            .catch((error) => {
                console.error("❌ Error al actualizar producto:", error);
                showNotification('Error al actualizar producto: ' + error.message, '#f44336');
            });
            
    } catch (error) {
        console.error("❌ Error en función guardarProducto:", error);
        showNotification('Error al guardar el producto: ' + error.message, '#f44336');
        // No bloquear la página, mostrar error y continuar
    }
}

// Función para eliminar producto usando deleteDoc (unificado para todos los productos)
function eliminarProducto(productId, rutaCompleta, modal) {
    try {
        console.log("🗑️ Eliminando producto:", productId);
        console.log("📍 Ruta completa:", rutaCompleta);
        console.log("📍 Tipo de producto:", rutaCompleta.includes('productoslatinos') ? 'Latino' : 'General');

        // Validaciones básicas
        if (!productId || !rutaCompleta) {
            console.error("❌ Error: Faltan datos necesarios para eliminar");
            showNotification('Error: Faltan datos del producto', '#f44336');
            return;
        }

        // Parsear la ruta para obtener colección, documento y subcolección
        const routeParts = rutaCompleta.split('/');
        if (routeParts.length < 3) {
            console.error("❌ Error: Ruta inválida:", rutaCompleta);
            showNotification('Error: Ruta de Firebase no válida', '#f44336');
            return;
        }

        const collection = routeParts[0]; // productos o productoslatinos
        const document = routeParts[1];  // alimentacion, Dulce, Alimentacion, etc.
        const subcollectionPath = routeParts[2]; // alimentacion, Dulce, Arveja, etc.

        console.log("🔍 Ruta parseada para eliminación:", { collection, document, subcollectionPath });

        // Validar que la ruta sea correcta según el tipo de producto
        if (collection === 'productoslatinos') {
            console.log("🌮 Eliminando producto LATINO de:", rutaCompleta);
        } else {
            console.log("🔧 Eliminando producto GENERAL de:", rutaCompleta);
        }

        // Eliminar de Firebase usando deleteDoc
        const docRef = window.db.collection(collection).doc(document).collection(subcollectionPath).doc(productId);

        docRef.delete()
            .then(() => {
                console.log("✅ Producto eliminado correctamente de Firebase");
                const mensaje = collection === 'productoslatinos' ? 
                    'Producto latino eliminado correctamente' : 
                    'Producto eliminado correctamente';
                showNotification(mensaje, '#e74c3c');

                // Cerrar modal si existe
                if (modal && modal.parentNode) {
                    document.body.removeChild(modal);
                }

                // Refresco automático del contenedor
                setTimeout(() => {
                    console.log("🔄 Recargando productos después de eliminación...");
                    refrescarContenedor();
                }, 500);
            })
            .catch((error) => {
                console.error("❌ Error al eliminar producto:", error);
                showNotification('Error al eliminar producto: ' + error.message, '#f44336');
            });

    } catch (error) {
        console.error("❌ Error en función eliminarProducto:", error);
        showNotification('Error al eliminar el producto: ' + error.message, '#f44336');
        // No bloquear la página, mostrar error y continuar
    }
}

// Función para refrescar el contenedor después de guardar o eliminar
function refrescarContenedor() {
    console.log("🔄 Refrescando contenedor de productos...");

    
    // Limpiar el contenedor
    const productsGrid = document.getElementById('productsGrid');
    if (productsGrid) {
        productsGrid.innerHTML = '';
        console.log("🧹 Contenedor limpiado");
    }
    
    // Recargar la categoría actual o todos los productos
    if (typeof currentCategory !== 'undefined' && currentCategory) {
        console.log("📂 Recargando categoría actual:", currentCategory);
        if (typeof filterCategory === 'function') {
            filterCategory(currentCategory);
        } else if (typeof filterCategoryLatino === 'function') {
            filterCategoryLatino(currentCategory);
        } else {
            // Fallback a carga general
            loadFirebaseProducts();
        }
    } else {
        console.log("📂 Recargando todos los productos");
        loadFirebaseProducts();
    }
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
        z-index: 1001;
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
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    // Añadir mensaje de vacío sin borrar productos existentes
    const existingEmptyMessage = productsGrid.querySelector('.empty-firebase-message');
    if (existingEmptyMessage) return; // Ya existe mensaje
    
    const emptyMessage = document.createElement('div');
    emptyMessage.className = 'empty-firebase-message';
    emptyMessage.style.cssText = `
        text-align: center;
        padding: 40px 20px;
        color: #666;
        grid-column: 1 / -1;
    `;
    emptyMessage.innerHTML = `
        <i class="fas fa-inbox" style="font-size: 48px; margin-bottom: 20px; color: #ccc;"></i>
        <h3 style="margin-bottom: 10px; color: #333;">No hay productos en esta categoría</h3>
        <p style="margin-bottom: 20px; color: #666;">Verifica la conexión con Firebase o añade productos desde la consola</p>
        <small style="color: #999;">Revisa la consola para ver errores de conexión</small>
    `;
    
    productsGrid.appendChild(emptyMessage);
}

// Función para guardar productos en localStorage
function saveProductsToStorage() {
    localStorage.setItem('productosLatinos', JSON.stringify(products));
}

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    // Configurar estilos según el tipo
    let bgColor = '#666'; // info (gris)
    if (type === 'success') bgColor = '#E60000'; // rojo
    if (type === 'error') bgColor = '#E60000'; // rojo
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        font-weight: 500;
        max-width: 300px;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animación de entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animación de salida y eliminación
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Exponer funciones globalmente para el HTML
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.showNewProductModal = showNewProductModal;
window.closeModal = closeModal;
window.saveProduct = saveProduct;

// Función para normalizar texto (quitar tildes, minúsculas, espacios)
function normalizeText(text) {
    return text
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Eliminar tildes
        .replace(/\s+/g, ''); // Eliminar espacios
}

// Función de filtrado al final del archivo
window.filterCategoryLatino = function(category, event) {
    // Normalizar categoría del botón - SIN EMOJIS
    const normalizedCategory = normalizeText(category);
    console.log("🔍 Categoría normalizada para filtrado:", normalizedCategory);
    console.log("🔍 Categoría original del botón:", category);
    
    console.log("🔥 FILTRADO TOTAL - Categoría:", category, "(normalizado:", normalizedCategory + ")");
    
    // 1. EL BOTÓN ROJO: Cambiar clase activa
    const allButtons = document.querySelectorAll('.category-btn');
    allButtons.forEach(btn => {
        btn.classList.remove('active'); // Quitar rojo de todos
    });
    
    // Poner rojo solo al botón pulsado
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
    
    // 2. FILTRADO TOTAL: Ocultar TODO primero
    const allCards = document.querySelectorAll('.product-card');
    console.log("📋 Total de productos encontrados:", allCards.length);
    
    // MOSTRAR todos los productos primero
    allCards.forEach(card => {
        card.style.display = 'flex'; // Mostrar todos por defecto
    });
    console.log("✅ Todos los productos mostrados (display: flex)");
    
    // 3. FILTRAR solo los de la categoría correcta
    let mostrados = 0;
    allCards.forEach(card => {
        let cardCategory = '';
        
        // Obtener categoría del badge CSS (productos HTML) - SIN EMOJIS
        const categoryBadge = card.querySelector('.category-badge');
        if (categoryBadge) {
            const badgeText = categoryBadge.textContent.trim();
            cardCategory = normalizeText(badgeText);
            console.log("🔍 Badge encontrado:", badgeText, "-> normalizado:", cardCategory);
        }
        
        // También verificar data-category para productos Firebase (con normalización mejorada)
        if (!cardCategory && card.dataset.category) {
            cardCategory = card.dataset.category.trim().toLowerCase();
            console.log("🔍 Categoría desde data-category:", card.dataset.category, "-> normalizado:", cardCategory);
        }
        
        // Verificar clases CSS también
        if (!cardCategory) {
            const classes = card.className.split(' ');
            for (const cls of classes) {
                if (['alimentacion', 'bebidas', 'casero', 'dulce', 'snacks'].includes(cls)) {
                    cardCategory = cls.trim().toLowerCase();
                    console.log("🔍 Categoría desde clase CSS:", cls, "-> normalizado:", cardCategory);
                    break;
                }
            }
        }
        
        // 4. COMPROBAR: Mostrar solo si coincide la categoría (con normalización en ambos lados)
        console.log("🔍// Comparación EXACTA de categorías - SOLO PRODUCTOS LATINOS");
        const categoriasValidas = ['alimentacion', 'bebida', 'casero', 'dulce', 'snacks'];
        
        // Mapeo especial para botones (solo para bebidas -> bebida)
        let botonCategoria = normalizedCategory;
        if (normalizedCategory === 'bebidas') {
            botonCategoria = 'bebida';
        } else if (normalizedCategory === 'snacks') {
            botonCategoria = 'snacks'; // Solo filtrar snacks de productoslatinos
            console.log("🍿 Detectado botón SNACKS - filtrando solo productoslatinos/Snacks");
        } else {
            botonCategoria = normalizedCategory;
        }
        
        if (botonCategoria === 'all' || 
            (categoriasValidas.includes(botonCategoria) && cardCategory === botonCategoria)) {
            
            card.style.display = 'flex';
            mostrados++;
            console.log("✅ MOSTRADO:", card.querySelector('.product-title')?.textContent, "(categoría:", cardCategory + " vs botón:" + botonCategoria + ")");
        } else {
            card.style.display = 'none';
            console.log("🚫 OCULTADO:", card.querySelector('.product-title')?.textContent, "(categoría:", cardCategory + " vs botón:" + botonCategoria + ")");
        }
    });
    
    console.log("🎯 FILTRADO COMPLETADO - Productos mostrados:", mostrados, "de", allCards.length);
};

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM cargado - Iniciando carga de productos latinos");
    
    // Primero cargar textos dinámicos
    loadDynamicTexts();
    
    // Luego cargar productos desde Firebase
    loadFirebaseProducts();
    
    // Exponer funciones globalmente (SISTEMA UNIVERSAL EMERGENCIA)
    window.initializeProducts = initializeProducts;
    window.deleteProduct = deleteProduct;
    window.saveProduct = saveProduct;
    window.closeModal = closeModal;
    window.filterCategoryLatino = filterCategoryLatino;
    window.showNewProductModal = showNewProductModal;
    window.abrirModalEdicion = abrirModalEdicion;
    window.actualizarProducto = actualizarProducto;
    window.actualizarProductoLatino = actualizarProductoLatino;
    window.guardarCambiosProducto = guardarCambiosProducto;
    window.guardarCambiosProductoLatino = guardarCambiosProductoLatino;
    window.mostrarFormularioEdicion = mostrarFormularioEdicion;
    window.guardarProducto = guardarProducto;
    window.guardarProductoLatino = guardarProductoLatino;
    window.eliminarProducto = eliminarProducto;
    window.refrescarContenedor = refrescarContenedor;

    // FUNCIONES UNIVERSALES NUEVAS (EMERGENCIA)
    window.crearTarjetaUniversal = crearTarjetaUniversal;
    window.confirmarEliminacion = confirmarEliminacion;
    window.crearFormularioCompleto = crearFormularioCompleto;
    window.guardarProductoCompleto = guardarProductoCompleto;

    // FUNCIONES DE PRODUCTOS GENERALES (SOLO SNACKS)
    window.loadGeneralProducts = loadGeneralProducts;
    window.mapProductFieldsGeneral = mapProductFieldsGeneral;

    // FUNCIONES DE SNACKS COMPLEJOS
    window.loadSnacksComplex = loadSnacksComplex;
});
