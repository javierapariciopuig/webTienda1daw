// Script para conectar productoslatinos.html con Firebase - Estructura específica con IDs
import { onSnapshot } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

class ProductosLatinosFirebase {
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
            console.log('Configurando Firebase para productoslatinos...');
            
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
            // Ruta: Categorías/Textos/ProdLatinos/tituloPrincipal
            const docRef = window.firebase.doc(
                window.firebaseDB, 
                'Categorías', 
                'Textos', 
                'ProdLatinos', 
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

    async cargarTextoCalidad() {
        try {
            // Ruta: Categorías/Textos/ProdLatinos/calidad
            const docRef = window.firebase.doc(
                window.firebaseDB, 
                'Categorías', 
                'Textos', 
                'ProdLatinos', 
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

    async cargarTodasCategorias() {
        const categorias = [
            { id: 6, nombre: 'alimentacion', docId: 'alimentacion' },
            { id: 7, nombre: 'bebidas', docId: 'bebidas' },
            { id: 8, nombre: 'casero', docId: 'casero' },
            { id: 9, nombre: 'dulce', docId: 'dulce' },
            { id: 10, nombre: 'snacks', docId: 'snacks' }
        ];

        for (const categoria of categorias) {
            await this.cargarCategoria(categoria);
        }
    }

    async cargarCategoria(categoria) {
        try {
            // Ruta: Categorías/Textos/ProdLatinos/[docId]
            const docRef = window.firebase.doc(
                window.firebaseDB, 
                'Categorías', 
                'Textos', 
                'ProdLatinos', 
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
        // Listener para título principal
        const tituloRef = window.firebase.doc(
            window.firebaseDB, 
            'Categorías', 
            'Textos', 
            'ProdLatinos', 
            'tituloPrincipal'
        );

        const unsubscribeTitulo = window.firebase.onSnapshot(tituloRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                const datos = docSnapshot.data();
                console.log('Cambio detectado en título principal:', datos);
                this.actualizarTituloPrincipal(datos);
            }
        });

        // Listener para texto de calidad
        const calidadRef = window.firebase.doc(
            window.firebaseDB, 
            'Categorías', 
            'Textos', 
            'ProdLatinos', 
            'calidad'
        );

        const unsubscribeCalidad = window.firebase.onSnapshot(calidadRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                const datos = docSnapshot.data();
                console.log('Cambio detectado en texto de calidad:', datos);
                this.actualizarTextoCalidad(datos);
            }
        });

        // Listeners para categorías
        const categorias = [
            { id: 6, nombre: 'alimentacion', docId: 'alimentacion' },
            { id: 7, nombre: 'bebidas', docId: 'bebidas' },
            { id: 8, nombre: 'casero', docId: 'casero' },
            { id: 9, nombre: 'dulce', docId: 'dulce' },
            { id: 10, nombre: 'snacks', docId: 'snacks' }
        ];

        categorias.forEach(categoria => {
            const docRef = window.firebase.doc(
                window.firebaseDB, 
                'Categorías', 
                'Textos', 
                'ProdLatinos', 
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

        console.log('Listeners configurados para productoslatinos');
    }

    actualizarTituloPrincipal(datos) {
        try {
            // Actualizar título principal
            const tituloElement = document.getElementById('TituloPrincipal1');
            if (tituloElement && datos.TituloPrincipal) {
                tituloElement.textContent = datos.TituloPrincipal;
                console.log('Título principal actualizado:', datos.TituloPrincipal);
            }

            // Actualizar subtítulo principal
            const subtituloElement = document.getElementById('SubtituloPrincipal1');
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
            const tituloElement = document.getElementById('TituloCalidad1');
            if (tituloElement && datos.TituloCalidad) {
                tituloElement.textContent = datos.TituloCalidad;
                console.log('Título de calidad actualizado:', datos.TituloCalidad);
            }

            // Actualizar texto de calidad
            const textoElement = document.getElementById('SubtituloCalidad1');
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

    actualizarHTML(categoriaId, datos) {
        try {
            // Actualizar título
            const tituloElement = document.getElementById(`NombreCategoria${categoriaId}`);
            if (tituloElement && datos.NombreCategoria) {
                tituloElement.textContent = datos.NombreCategoria;
                console.log(`Título ${categoriaId} actualizado:`, datos.NombreCategoria);
            }

            // Actualizar descripción
            const descripcionElement = document.getElementById(`DescripcionCategoria${categoriaId}`);
            if (descripcionElement && datos.DescripcionCategoria) {
                descripcionElement.textContent = datos.DescripcionCategoria;
                console.log(`Descripción ${categoriaId} actualizada:`, datos.DescripcionCategoria);
            }

            // Efecto visual de actualización
            this.mostrarEfectoActualizacion(categoriaId);

        } catch (error) {
            console.error(`Error al actualizar HTML ${categoriaId}:`, error);
        }
    }

    mostrarEfectoActualizacion(categoriaId) {
        const categoriaElement = document.getElementById(`NombreCategoria${categoriaId}`)?.closest('.categoria');
        if (categoriaElement) {
            categoriaElement.style.transition = 'all 0.3s ease';
            categoriaElement.style.backgroundColor = '#90EE90';
            
            setTimeout(() => {
                categoriaElement.style.backgroundColor = '';
            }, 1000);
        }
    }

    mostrarEfectoActualizacionPrincipal() {
        const tituloElement = document.getElementById('TituloPrincipal1');
        const subtituloElement = document.getElementById('SubtituloPrincipal1');
        
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
        const tituloElement = document.getElementById('TituloCalidad1');
        const textoElement = document.getElementById('SubtituloCalidad1');
        
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

    async crearTituloPrincipalPorDefecto() {
        try {
            const datosPorDefecto = {
                TituloPrincipal: "Productos Latinos \ud83c\udfb8",
                SubtituloPrincipal: "Los mejores sabores de Latinoamérica en tu barrio.",
                activo: true
            };

            await window.firebase.setDoc(
                window.firebase.doc(
                    window.firebaseDB, 
                    'Categorías', 
                    'Textos', 
                    'ProdLatinos', 
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

    async crearTextoCalidadPorDefecto() {
        try {
            const datosPorDefecto = {
                TituloCalidad: "¡Sabor Latino Auténtico! \ud83c\udf2e",
                TextoCalidad: "Traemos los mejores productos directamente desde Latinoamérica. Ingredientes frescos y auténticos para que cocines como en tu tierra.",
                activo: true
            };

            await window.firebase.setDoc(
                window.firebase.doc(
                    window.firebaseDB, 
                    'Categorías', 
                    'Textos', 
                    'ProdLatinos', 
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

    async crearCategoriaPorDefecto(categoria) {
        try {
            const datosPorDefecto = {
                NombreCategoria: this.getTituloPorDefecto(categoria.nombre),
                DescripcionCategoria: this.getDescripcionPorDefecto(categoria.nombre),
                activo: true
            };

            await window.firebase.setDoc(
                window.firebase.doc(
                    window.firebaseDB, 
                    'Categorías', 
                    'Textos', 
                    'ProdLatinos', 
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

    getTituloPorDefecto(nombre) {
        const titulos = {
            'alimentacion': 'ALIMENTACIÓN',
            'bebidas': 'BEBIDAS',
            'casero': 'CASERO',
            'dulce': 'DULCE',
            'snacks': 'SNACKS'
        };
        
        return titulos[nombre] || 'CATEGORÍA';
    }

    getDescripcionPorDefecto(nombre) {
        const descripciones = {
            'alimentacion': 'Sabores auténticos de Latinoamérica.',
            'bebidas': 'Refrescos, zumos y mucho más',
            'casero': 'Comida casera como en casa.',
            'dulce': 'Dulces y postres latinos.',
            'snacks': 'Botanas y snacks latinos.'
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
                    'ProdLatinos', 
                    docId
                ),
                datos
            );

            console.log(`Categoría ${docId} actualizada en Firebase`);

        } catch (error) {
            console.error(`Error al actualizar categoría ${docId}:`, error);
        }
    }

    // Limpiar listeners cuando se cierre la página
    destroy() {
        console.log('Listeners eliminados');
    }
}

// Inicializar el sistema
window.productosLatinosFirebase = new ProductosLatinosFirebase();

// Exponer funciones para uso manual
window.actualizarCategoriaLatina = (docId, datos) => {
    window.productosLatinosFirebase.actualizarCategoriaEnFirebase(docId, datos);
};

console.log('ProductosLatinosFirebase inicializado');
console.log('Estructura Firebase: Categorías/Textos/ProdLatinos/[ID]');
console.log('Categorías: alimentacion (ID 6), bebidas (ID 7), casero (ID 8), dulce (ID 9), snacks (ID 10)');
console.log('Para actualizar manualmente: actualizarCategoriaLatina("alimentacion", {NombreCategoria: "Nuevo título"})');
