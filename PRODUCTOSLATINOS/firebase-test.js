// Script de prueba para Firebase - productoslatinos
class FirebaseTestLatinos {
    constructor() {
        this.init();
    }

    init() {
        // Esperar a que Firebase esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.testConnection());
        } else {
            setTimeout(() => this.testConnection(), 1000);
        }
    }

    async testConnection() {
        try {
            console.log('Iniciando prueba de Firebase para productoslatinos...');
            
            // Verificar que Firebase está disponible
            if (!window.firebaseDB) {
                console.error('Firebase no está disponible');
                return;
            }

            console.log('Firebase disponible correctamente');
            console.log('Base de datos:', window.firebaseDB);

            // Probar escritura en la estructura correcta
            await this.testWrite();
            
            // Probar lectura
            await this.testRead();

        } catch (error) {
            console.error('Error en la prueba de Firebase:', error);
        }
    }

    async testWrite() {
        try {
            console.log('Probando escritura en Categorías/Textos/ProdLatinos...');
            
            // Crear título principal
            const tituloData = {
                TituloPrincipal: "Productos Latinos \ud83c\udfb8",
                SubtituloPrincipal: "Los mejores sabores de Latinoamérica en tu barrio.",
                activo: true,
                timestamp: new Date()
            };

            await window.firebase.setDoc(
                window.firebase.doc(window.firebaseDB, 'Categorías', 'Textos', 'ProdLatinos', 'tituloPrincipal'),
                tituloData
            );

            console.log('Título principal creado en Firestore');

            // Crear texto de calidad
            const calidadData = {
                TituloCalidad: "¡Sabor Latino Auténtico! \ud83c\udf2e",
                TextoCalidad: "Traemos los mejores productos directamente desde Latinoamérica. Ingredientes frescos y auténticos para que cocines como en tu tierra.",
                activo: true,
                timestamp: new Date()
            };

            await window.firebase.setDoc(
                window.firebase.doc(window.firebaseDB, 'Categorías', 'Textos', 'ProdLatinos', 'calidad'),
                calidadData
            );

            console.log('Texto de calidad creado en Firestore');

            // Crear categorías
            const categorias = [
                { docId: 'alimentacion', NombreCategoria: 'ALIMENTACIÓN', DescripcionCategoria: 'Sabores auténticos de Latinoamérica.' },
                { docId: 'bebidas', NombreCategoria: 'BEBIDAS', DescripcionCategoria: 'Refrescos, zumos y mucho más' },
                { docId: 'casero', NombreCategoria: 'CASERO', DescripcionCategoria: 'Comida casera como en casa.' },
                { docId: 'dulce', NombreCategoria: 'DULCE', DescripcionCategoria: 'Dulces y postres latinos.' },
                { docId: 'snacks', NombreCategoria: 'SNACKS', DescripcionCategoria: 'Botanas y snacks latinos.' }
            ];

            for (const cat of categorias) {
                const catData = {
                    NombreCategoria: cat.NombreCategoria,
                    DescripcionCategoria: cat.DescripcionCategoria,
                    activo: true,
                    timestamp: new Date()
                };

                await window.firebase.setDoc(
                    window.firebase.doc(window.firebaseDB, 'Categorías', 'Textos', 'ProdLatinos', cat.docId),
                    catData
                );

                console.log(`Categoría ${cat.docId} creada en Firestore`);
            }
            
        } catch (error) {
            console.error('Error en escritura:', error);
        }
    }

    async testRead() {
        try {
            console.log('Probando lectura de Categorías/Textos/ProdLatinos...');
            
            // Leer título principal
            const tituloDoc = await window.firebase.getDoc(
                window.firebase.doc(window.firebaseDB, 'Categorías', 'Textos', 'ProdLatinos', 'tituloPrincipal')
            );

            if (tituloDoc.exists()) {
                console.log('Título principal leído:', tituloDoc.data());
            }

            // Leer calidad
            const calidadDoc = await window.firebase.getDoc(
                window.firebase.doc(window.firebaseDB, 'Categorías', 'Textos', 'ProdLatinos', 'calidad')
            );

            if (calidadDoc.exists()) {
                console.log('Texto de calidad leído:', calidadDoc.data());
            }

            // Leer categorías
            const categorias = ['alimentacion', 'bebidas', 'casero', 'dulce', 'snacks'];
            
            for (const cat of categorias) {
                const catDoc = await window.firebase.getDoc(
                    window.firebase.doc(window.firebaseDB, 'Categorías', 'Textos', 'ProdLatinos', cat)
                );

                if (catDoc.exists()) {
                    console.log(`Categoría ${cat} leída:`, catDoc.data());
                }
            }

        } catch (error) {
            console.error('Error en lectura:', error);
        }
    }
}

// Inicializar prueba
window.firebaseTestLatinos = new FirebaseTestLatinos();

console.log('Firebase Test para productoslatinos inicializado');
