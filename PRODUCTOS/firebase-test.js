// Script de prueba para Firebase
class FirebaseTest {
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
            console.log('Iniciando prueba de Firebase...');
            
            // Verificar que Firebase está disponible
            if (!window.firebaseDB) {
                console.error('Firebase no está disponible');
                return;
            }

            console.log('Firebase disponible correctamente');
            console.log('Base de datos:', window.firebaseDB);

            // Probar escritura
            await this.testWrite();
            
            // Probar lectura
            await this.testRead();

        } catch (error) {
            console.error('Error en la prueba de Firebase:', error);
        }
    }

    async testWrite() {
        try {
            console.log('Probando escritura en Firestore...');
            
            const testData = {
                nombre: 'Producto de prueba',
                categoria: 'test',
                fecha: new Date()
            };

            const docRef = await window.firebase.addDoc(
                window.firebase.collection(window.firebaseDB, 'productos'),
                testData
            );

            console.log('Escritura exitosa. Documento ID:', docRef.id);
            
        } catch (error) {
            console.error('Error en escritura:', error);
        }
    }

    async testRead() {
        try {
            console.log('Probando lectura de Firestore...');
            
            const querySnapshot = await window.firebase.getDocs(
                window.firebase.collection(window.firebaseDB, 'productos')
            );

            console.log('Lectura exitosa');
            console.log('Documentos encontrados:', querySnapshot.size);

            querySnapshot.forEach((doc) => {
                console.log(`Documento ${doc.id}:`, doc.data());
            });

        } catch (error) {
            console.error('Error en lectura:', error);
        }
    }
}

// Inicializar prueba
window.firebaseTest = new FirebaseTest();

console.log('Firebase Test inicializado');
