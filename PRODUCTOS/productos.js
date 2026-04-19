// Script para conectar HTML con Firebase - Estructura específica con IDs
import { onSnapshot } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

class ProductosFirebase {
    constructor() {
        this.init();
    }

    async init() {
        // Esperar a que Firebase esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupFirebase());
        } else {
            setTimeout(() => this.setupFirebase(), 1000);
        }
    }

    async setupFirebase() {
        try {
            console.log('Configurando Firebase para productos...');
            
            // Esperar a que Firebase esté disponible
            let intentos = 0;
            while (!window.firebaseDB && intentos < 10) {
                await new Promise(resolve => setTimeout(resolve, 500));
                intentos++;
            }

            if (!window.firebaseDB) {
                console.error('Firebase no está disponible');
                return;
            }

            // Hacer onSnapshot disponible globalmente
            window.firebase.onSnapshot = onSnapshot;

            console.log('Firebase disponible, cargando datos...');
            
            // Cargar título y subtítulo principales
            await this.cargarTituloPrincipal();
            
            // Cargar texto de calidad
            await this.cargarTextoCalidad();
            
            // Cargar todas las categorías
            await this.cargarTodasCategorias();
            
            // Configurar listeners en tiempo real
            this.setupRealtimeListeners();

        } catch (error) {
            console.error('Error al configurar Firebase:', error);
        }
    }

    async cargarTituloPrincipal() {
        try {
            // Ruta: Categorías/Textos/ProdGenerales/tituloPrincipal
            const docRef = window.firebase.doc(
                window.firebaseDB, 
                'Categorías', 
                'Textos', 
                'ProdGenerales', 
                'tituloPrincipal'
            );

            const docSnap = await window.firebase.getDoc(docRef);
            
            if (docSnap.exists()) {
                const datos = docSnap.data();
                console.log('Datos del título principal encontrados:', datos);
                this.actualizarTituloPrincipal(datos);
            } else {
                console.log('Creando título principal por defecto...');
                await this.crearTituloPrincipalPorDefecto();
            }

        } catch (error) {
            console.error('Error al cargar título principal:', error);
        }
    }

    async cargarTodasCategorias() {
        const categorias = [
            { id: 1, nombre: 'alimentacion', docId: 'alimentacion' },
            { id: 2, nombre: 'panaderia', docId: 'panaderia' },
            { id: 3, nombre: 'limpieza', docId: 'limpieza' },
            { id: 4, nombre: 'higiene', docId: 'higiene' },
            { id: 5, nombre: 'bebidas', docId: 'bebidas' }
        ];

        for (const categoria of categorias) {
            await this.cargarCategoria(categoria);
        }
    }

    async cargarCategoria(categoria) {
        try {
            // Ruta: Categorías/Textos/ProdGenerales/[docId]
            const docRef = window.firebase.doc(
                window.firebaseDB, 
                'Categorías', 
                'Textos', 
                'ProdGenerales', 
                categoria.docId
            );

            const docSnap = await window.firebase.getDoc(docRef);
            
            if (docSnap.exists()) {
                const datos = docSnap.data();
                console.log(`Datos de ${categoria.nombre} encontrados:`, datos);
                this.actualizarHTML(categoria.id, datos);
            } else {
                console.log(`Creando documento por defecto para ${categoria.nombre}...`);
                await this.crearCategoriaPorDefecto(categoria);
            }

        } catch (error) {
            console.error(`Error al cargar ${categoria.nombre}:`, error);
        }
    }

    setupRealtimeListeners() {
        const categorias = [
            { id: 1, nombre: 'alimentacion', docId: 'alimentacion' },
            { id: 2, nombre: 'panaderia', docId: 'panaderia' },
            { id: 3, nombre: 'limpieza', docId: 'limpieza' },
            { id: 4, nombre: 'higiene', docId: 'higiene' },
            { id: 5, nombre: 'bebidas', docId: 'bebidas' }
        ];

        categorias.forEach(categoria => {
            const docRef = window.firebase.doc(
                window.firebaseDB, 
                'Categorías', 
                'Textos', 
                'ProdGenerales', 
                categoria.docId
            );

            const unsubscribe = window.firebase.onSnapshot(docRef, (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const datos = docSnapshot.data();
                    console.log(`Cambio detectado en ${categoria.nombre}:`, datos);
                    this.actualizarHTML(categoria.id, datos);
                }
            });

            console.log(`Listener configurado para ${categoria.nombre}`);
        });

        // Configurar listener para título principal
        const tituloRef = window.firebase.doc(
            window.firebaseDB, 
            'Categorías', 
            'Textos', 
            'ProdGenerales', 
            'tituloPrincipal'
        );

        const unsubscribeTitulo = window.firebase.onSnapshot(tituloRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                const datos = docSnapshot.data();
                console.log('Cambio detectado en título principal:', datos);
                this.actualizarTituloPrincipal(datos);
            }
        });

        console.log('Listener configurado para título principal');

        // Configurar listener para texto de calidad
        const calidadRef = window.firebase.doc(
            window.firebaseDB, 
            'Categorías', 
            'Textos', 
            'ProdGenerales', 
            'calidad'
        );

        const unsubscribeCalidad = window.firebase.onSnapshot(calidadRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                const datos = docSnapshot.data();
                console.log('Cambio detectado en texto de calidad:', datos);
                this.actualizarTextoCalidad(datos);
            }
        });

        console.log('Listener configurado para texto de calidad');
    }

    actualizarHTML(categoriaId, datos) {
        try {
            // Actualizar título
            const tituloElement = document.getElementById(`NombreCategoría${categoriaId}`);
            if (tituloElement && datos.NombreCategoría) {
                tituloElement.textContent = datos.NombreCategoría;
                console.log(`Título ${categoriaId} actualizado:`, datos.NombreCategoría);
            }

            // Actualizar descripción
            const descripcionElement = document.getElementById(`DescripcionCategoría${categoriaId}`);
            if (descripcionElement && datos.DescripcionCategoría) {
                descripcionElement.textContent = datos.DescripcionCategoría;
                console.log(`Descripción ${categoriaId} actualizada:`, datos.DescripcionCategoría);
            }

            // Actualizar icono si existe
            const iconoElement = document.getElementById(`IconoCategoría${categoriaId}`);
            if (iconoElement && datos.IconoCategoría) {
                iconoElement.innerHTML = datos.IconoCategoría;
                console.log(`Icono ${categoriaId} actualizado`);
            }

            // Efecto visual de actualización
            this.mostrarEfectoActualizacion(categoriaId);

        } catch (error) {
            console.error(`Error al actualizar HTML ${categoriaId}:`, error);
        }
    }

    actualizarTituloPrincipal(datos) {
        try {
            // Actualizar título principal
            const tituloElement = document.getElementById('TituloPrincipal');
            if (tituloElement && datos.TituloPrincipal) {
                tituloElement.textContent = datos.TituloPrincipal;
                console.log('Título principal actualizado:', datos.TituloPrincipal);
            }

            // Actualizar subtítulo principal
            const subtituloElement = document.getElementById('SubtituloPrincipal');
            if (subtituloElement && datos.SubtituloPrincipal) {
                subtituloElement.textContent = datos.SubtituloPrincipal;
                console.log('Subtítulo principal actualizado:', datos.SubtituloPrincipal);
            }

            // Efecto visual de actualización
            this.mostrarEfectoActualizacionPrincipal();

        } catch (error) {
            console.error('Error al actualizar título principal:', error);
        }
    }

    actualizarTextoCalidad(datos) {
        try {
            // Actualizar título de calidad
            const tituloElement = document.getElementById('TituloCalidad');
            if (tituloElement && datos.TituloCalidad) {
                tituloElement.textContent = datos.TituloCalidad;
                console.log('Título de calidad actualizado:', datos.TituloCalidad);
            }

            // Actualizar texto de calidad
            const textoElement = document.getElementById('TextoCalidad');
            if (textoElement && datos.TextoCalidad) {
                textoElement.textContent = datos.TextoCalidad;
                console.log('Texto de calidad actualizado:', datos.TextoCalidad);
            }

            // Efecto visual de actualización
            this.mostrarEfectoActualizacionCalidad();

        } catch (error) {
            console.error('Error al actualizar texto de calidad:', error);
        }
    }

    mostrarEfectoActualizacion(categoriaId) {
        const categoriaElement = document.getElementById(`NombreCategoría${categoriaId}`)?.closest('.categoria');
        if (categoriaElement) {
            categoriaElement.style.transition = 'all 0.3s ease';
            categoriaElement.style.backgroundColor = '#90EE90';
            
            setTimeout(() => {
                categoriaElement.style.backgroundColor = '';
            }, 1000);
        }
    }

    mostrarEfectoActualizacionPrincipal() {
        const tituloElement = document.getElementById('TituloPrincipal');
        const subtituloElement = document.getElementById('SubtituloPrincipal');
        
        if (tituloElement) {
            tituloElement.style.transition = 'all 0.3s ease';
            tituloElement.style.backgroundColor = '#90EE90';
            
            setTimeout(() => {
                tituloElement.style.backgroundColor = '';
            }, 1000);
        }

        if (subtituloElement) {
            subtituloElement.style.transition = 'all 0.3s ease';
            subtituloElement.style.backgroundColor = '#90EE90';
            
            setTimeout(() => {
                subtituloElement.style.backgroundColor = '';
            }, 1000);
        }
    }

    mostrarEfectoActualizacionCalidad() {
        const tituloElement = document.getElementById('TituloCalidad');
        const textoElement = document.getElementById('TextoCalidad');
        
        if (tituloElement) {
            tituloElement.style.transition = 'all 0.3s ease';
            tituloElement.style.backgroundColor = '#90EE90';
            
            setTimeout(() => {
                tituloElement.style.backgroundColor = '';
            }, 1000);
        }

        if (textoElement) {
            textoElement.style.transition = 'all 0.3s ease';
            textoElement.style.backgroundColor = '#90EE90';
            
            setTimeout(() => {
                textoElement.style.backgroundColor = '';
            }, 1000);
        }
    }

    async crearCategoriaPorDefecto(categoria) {
        try {
            const datosPorDefecto = {
                NombreCategoría: this.getTituloPorDefecto(categoria.nombre),
                DescripcionCategoría: this.getDescripcionPorDefecto(categoria.nombre),
                IconoCategoría: this.getIconoPorDefecto(categoria.nombre),
                activo: true,
                fechaCreacion: new Date()
            };

            await window.firebase.setDoc(
                window.firebase.doc(
                    window.firebaseDB, 
                    'Categorías', 
                    'Textos', 
                    'ProdGenerales', 
                    categoria.docId
                ),
                datosPorDefecto
            );

            console.log(`Documento por defecto creado para ${categoria.nombre}`);
            this.actualizarHTML(categoria.id, datosPorDefecto);

        } catch (error) {
            console.error(`Error al crear documento por defecto para ${categoria.nombre}:`, error);
        }
    }

    async crearTituloPrincipalPorDefecto() {
        try {
            const datosPorDefecto = {
                TituloPrincipal: "Nuestros Productos ⚾",
                SubtituloPrincipal: "Descubre todas nuestras categorías de productos de calidad.",
                activo: true,
                fechaCreacion: new Date()
            };

            await window.firebase.setDoc(
                window.firebase.doc(
                    window.firebaseDB, 
                    'Categorías', 
                    'Textos', 
                    'ProdGenerales', 
                    'tituloPrincipal'
                ),
                datosPorDefecto
            );

            console.log('Título principal por defecto creado');
            this.actualizarTituloPrincipal(datosPorDefecto);

        } catch (error) {
            console.error('Error al crear título principal por defecto:', error);
        }
    }

    async cargarTextoCalidad() {
        try {
            // Ruta: Categorías/Textos/ProdGenerales/calidad
            const docRef = window.firebase.doc(
                window.firebaseDB, 
                'Categorías', 
                'Textos', 
                'ProdGenerales', 
                'calidad'
            );

            const docSnap = await window.firebase.getDoc(docRef);
            
            if (docSnap.exists()) {
                const datos = docSnap.data();
                console.log('Datos del texto de calidad encontrados:', datos);
                this.actualizarTextoCalidad(datos);
            } else {
                console.log('Creando texto de calidad por defecto...');
                await this.crearTextoCalidadPorDefecto();
            }

        } catch (error) {
            console.error('Error al cargar texto de calidad:', error);
        }
    }

    async crearTextoCalidadPorDefecto() {
        try {
            const datosPorDefecto = {
                TituloCalidad: "¡Calidad Garantizada! \ud83c\udfc6",
                TextoCalidad: "Todos nuestros productos son seleccionados cuidadosamente para ofrecerte la mejor calidad al mejor precio. \u00a1Tu satisfacci\u00f3n es nuestro home run!",
                activo: true
            };

            await window.firebase.setDoc(
                window.firebase.doc(
                    window.firebaseDB, 
                    'Categorías', 
                    'Textos', 
                    'ProdGenerales', 
                    'calidad'
                ),
                datosPorDefecto
            );

            console.log('Texto de calidad por defecto creado');
            this.actualizarTextoCalidad(datosPorDefecto);

        } catch (error) {
            console.error('Error al crear texto de calidad por defecto:', error);
        }
    }

    getIconoPorDefecto(nombre) {
        const iconos = {
            'alimentacion': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" 
                 viewBox="0 0 24 24" stroke="white" stroke-width="2" width="50">
                <path stroke-linecap="round" stroke-linejoin="round" 
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6h13M10 21a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2z"/>
            </svg>`,
            'panaderia': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M4 14c0-3 3-6 8-6s8 3 8 6-3 5-8 5-8-2-8-5z"/>
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M8 11l1 2M12 10l1 2M16 11l1 2"/>
            </svg>`,
            'limpieza': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5z"/>
            </svg>`,
            'higiene': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21 4.318 12.682a4.5 4.5 0 010-6.364z"/>
            </svg>`,
            'bebidas': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 3h8l-1 9a4 4 0 01-6 0L8 3z"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 12v6m-3 0h6"/>
            </svg>`
        };
        
        return iconos[nombre] || iconos['alimentacion'];
    }

    getTituloPorDefecto(nombre) {
        const titulos = {
            'alimentacion': 'ALIMENTACIÓN',
            'panaderia': 'PANADERÍA',
            'limpieza': 'LIMPIEZA',
            'higiene': 'HIGIENE',
            'bebidas': 'BEBIDAS'
        };
        
        return titulos[nombre] || 'CATEGORÍA';
    }

    getDescripcionPorDefecto(nombre) {
        const descripciones = {
            'alimentacion': 'Productos frescos y de primera calidad',
            'panaderia': 'Pan recién hecho cada día',
            'limpieza': 'Todo lo que necesitas para tu hogar',
            'higiene': 'Cuidado personal de calidad',
            'bebidas': 'Refrescos, zumos y mucho más'
        };
        
        return descripciones[nombre] || 'Descripción de la categoría';
    }

    // Función para actualizar datos manualmente
    async actualizarCategoriaEnFirebase(docId, datos) {
        try {
            await window.firebase.updateDoc(
                window.firebase.doc(
                    window.firebaseDB, 
                    'Categorías', 
                    'Textos', 
                    'ProdGenerales', 
                    docId
                ),
                datos
            );

            console.log(`Categoría ${docId} actualizada en Firebase`);

        } catch (error) {
            console.error(`Error al actualizar categoría ${docId}:`, error);
        }
    }
}

// Inicializar el sistema
window.productosFirebase = new ProductosFirebase();

// Exponer funciones para uso manual
window.actualizarCategoria = (docId, datos) => {
    window.productosFirebase.actualizarCategoriaEnFirebase(docId, datos);
};

console.log('ProductosFirebase inicializado');
console.log('Estructura Firebase: Categorías/Textos/ProdGenerales/[ID]');
console.log('Campos esperados: NombreCategoría, DescripcionCategoría, IconoCategoría');
console.log('Para actualizar manualmente: actualizarCategoria("alimentacion", {NombreCategoría: "Nuevo título"})');
