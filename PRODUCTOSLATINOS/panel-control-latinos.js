// Panel de control para modificar Firebase en tiempo real - productoslatinos
class PanelControlLatinos {
    constructor() {
        this.init();
    }

    init() {
        // Esperar a que todo esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.crearPanel());
        } else {
            setTimeout(() => this.crearPanel(), 2000);
        }
    }

    crearPanel() {
        // Crear panel flotante
        const panel = document.createElement('div');
        panel.id = 'panel-firebase-latinos';
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border: 2px solid #007bff;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 1000;
            font-family: Arial, sans-serif;
            max-width: 300px;
            font-size: 14px;
        `;

        panel.innerHTML = `
            <h4 style="margin: 0 0 10px 0; color: #007bff;">\ud83c\udfb8 Control Firebase Latinos</h4>
            <div style="margin-bottom: 10px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Elemento:</label>
                <select id="elemento-select" style="width: 100%; padding: 5px; border: 1px solid #ddd; border-radius: 4px;">
                    <option value="tituloPrincipal">Título Principal</option>
                    <option value="subtituloPrincipal">Subtítulo Principal</option>
                    <option value="tituloCalidad">Título de Calidad</option>
                    <option value="textoCalidad">Texto de Calidad</option>
                    <option value="alimentacion">Alimentación (ID 6)</option>
                    <option value="bebidas">Bebidas (ID 7)</option>
                    <option value="casero">Casero (ID 8)</option>
                    <option value="dulce">Dulce (ID 9)</option>
                    <option value="snacks">Snacks (ID 10)</option>
                </select>
            </div>
            <div style="margin-bottom: 10px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Campo:</label>
                <input type="text" id="input-campo" style="width: 100%; padding: 5px; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            <div style="margin-bottom: 10px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Valor:</label>
                <textarea id="input-valor" style="width: 100%; padding: 5px; border: 1px solid #ddd; border-radius: 4px; height: 60px; resize: vertical;"></textarea>
            </div>
            <div style="display: flex; gap: 5px;">
                <button id="btn-cargar" style="background: #6c757d; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">Cargar</button>
                <button id="btn-actualizar" style="background: #007bff; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">Actualizar</button>
                <button id="btn-cerrar" style="background: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">Cerrar</button>
            </div>
            <div style="margin-top: 10px; font-size: 12px; color: #666;">
                <small><strong>Estructura Firebase:</strong><br>
                Categorías/Textos/ProdLatinos/[ID]</small>
            </div>
            <div style="margin-top: 5px; font-size: 12px; color: #666;">
                <small><strong>Campos esperados:</strong><br>
                \u2022 Título/Subtítulo: TituloPrincipal, SubtituloPrincipal<br>
                \u2022 Calidad: TituloCalidad, TextoCalidad<br>
                \u2022 Categorías: NombreCategoria, DescripcionCategoria</small>
            </div>
        `;

        document.body.appendChild(panel);

        // Event listeners
        document.getElementById('btn-cargar').addEventListener('click', () => this.cargarDatos());
        document.getElementById('btn-actualizar').addEventListener('click', () => this.actualizarDatos());
        document.getElementById('btn-cerrar').addEventListener('click', () => panel.remove());
        
        // Cargar datos iniciales
        this.cargarDatos();

        console.log('Panel de control latinos creado');
    }

    async cargarDatos() {
        try {
            const elemento = document.getElementById('elemento-select').value;
            
            let docRef;
            let datos;

            if (elemento === 'tituloPrincipal' || elemento === 'subtituloPrincipal') {
                // Cargar título principal
                docRef = window.firebase.doc(
                    window.firebaseDB, 
                    'Categorías', 
                    'Textos', 
                    'ProdLatinos', 
                    'tituloPrincipal'
                );

                const docSnap = await window.firebase.getDoc(docRef);
                if (docSnap.exists()) {
                    datos = docSnap.data();
                    document.getElementById('input-valor').value = datos.TituloPrincipal || datos.SubtituloPrincipal || '';
                    console.log(`Datos cargados para ${elemento}:`, datos);
                } else {
                    console.log(`No existe documento para ${elemento}`);
                    this.limpiarFormulario();
                }
            } else if (elemento === 'tituloCalidad' || elemento === 'textoCalidad') {
                // Cargar texto de calidad
                docRef = window.firebase.doc(
                    window.firebaseDB, 
                    'Categorías', 
                    'Textos', 
                    'ProdLatinos', 
                    'calidad'
                );

                const docSnap = await window.firebase.getDoc(docRef);
                if (docSnap.exists()) {
                    datos = docSnap.data();
                    if (elemento === 'tituloCalidad') {
                        document.getElementById('input-valor').value = datos.TituloCalidad || '';
                    } else {
                        document.getElementById('input-valor').value = datos.TextoCalidad || '';
                    }
                    console.log(`Datos cargados para ${elemento}:`, datos);
                } else {
                    console.log(`No existe documento para ${elemento}`);
                    this.limpiarFormulario();
                }
            } else {
                // Cargar categoría
                docRef = window.firebase.doc(
                    window.firebaseDB, 
                    'Categorías', 
                    'Textos', 
                    'ProdLatinos', 
                    elemento
                );

                const docSnap = await window.firebase.getDoc(docRef);
                if (docSnap.exists()) {
                    datos = docSnap.data();
                    document.getElementById('input-campo').value = datos.NombreCategoria || '';
                    document.getElementById('input-valor').value = datos.DescripcionCategoria || '';
                    console.log(`Datos cargados para ${elemento}:`, datos);
                } else {
                    console.log(`No existe documento para ${elemento}`);
                    this.limpiarFormulario();
                }
            }

        } catch (error) {
            console.error('Error al cargar datos:', error);
        }
    }

    async actualizarDatos() {
        try {
            const elemento = document.getElementById('elemento-select').value;
            const campo = document.getElementById('input-campo').value;
            const valor = document.getElementById('input-valor').value;
            
            let docRef;
            let datos;

            if (elemento === 'tituloPrincipal' || elemento === 'subtituloPrincipal') {
                // Actualizar título principal
                docRef = window.firebase.doc(
                    window.firebaseDB, 
                    'Categorías', 
                    'Textos', 
                    'ProdLatinos', 
                    'tituloPrincipal'
                );

                if (elemento === 'tituloPrincipal') {
                    datos = { TituloPrincipal: valor };
                } else {
                    datos = { SubtituloPrincipal: valor };
                }
            } else if (elemento === 'tituloCalidad' || elemento === 'textoCalidad') {
                // Actualizar texto de calidad
                docRef = window.firebase.doc(
                    window.firebaseDB, 
                    'Categorías', 
                    'Textos', 
                    'ProdLatinos', 
                    'calidad'
                );

                if (elemento === 'tituloCalidad') {
                    datos = { TituloCalidad: valor };
                } else {
                    datos = { TextoCalidad: valor };
                }
            } else {
                // Actualizar categoría
                docRef = window.firebase.doc(
                    window.firebaseDB, 
                    'Categorías', 
                    'Textos', 
                    'ProdLatinos', 
                    elemento
                );

                datos = {
                    NombreCategoria: campo,
                    DescripcionCategoria: valor,
                    ultimaActualizacion: new Date()
                };
            }

            await window.firebase.updateDoc(docRef, datos);

            console.log(`Datos actualizados para ${elemento}:`, datos);
            this.mostrarConfirmacion('\u00a1Actualizado en tiempo real!');

        } catch (error) {
            console.error('Error al actualizar datos:', error);
            this.mostrarError('Error al actualizar');
        }
    }

    limpiarFormulario() {
        document.getElementById('input-campo').value = '';
        document.getElementById('input-valor').value = '';
    }

    mostrarConfirmacion(mensaje) {
        const confirmacion = document.createElement('div');
        confirmacion.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #28a745;
            color: white;
            padding: 15px;
            border-radius: 8px;
            z-index: 2000;
            font-weight: bold;
            font-size: 14px;
        `;
        confirmacion.textContent = mensaje;
        document.body.appendChild(confirmacion);

        setTimeout(() => confirmacion.remove(), 2000);
    }

    mostrarError(mensaje) {
        const error = document.createElement('div');
        error.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #dc3545;
            color: white;
            padding: 15px;
            border-radius: 8px;
            z-index: 2000;
            font-weight: bold;
            font-size: 14px;
        `;
        error.textContent = mensaje;
        document.body.appendChild(error);

        setTimeout(() => error.remove(), 2000);
    }
}

// Inicializar panel
window.panelControlLatinos = new PanelControlLatinos();

console.log('PanelControlLatinos inicializado');
