
//PRUEBAFIREBASE


// Importa la inicialización de Firebase
import "/webTienda1daw/JS-Firebase/firebase-init.js";

import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const db = getFirestore();

const params = new URLSearchParams(window.location.search);
const categoria = params.get("cat");

document.getElementById("titulo-categoria").textContent =
  categoria.charAt(0).toUpperCase() + categoria.slice(1);

const contenedor = document.getElementById("contenedor-productos");

// Mapa de subcolecciones según tu Firestore REAL
const MAPA_SUBCOLECCIONES = {
  Alimentacion: ["Arveja", "Buñuelos", "Frejoles", "Jamon"],
  Bebida: ["NoAlcoholicas"],
  Casero: ["Casero"],
  Dulce: ["Dulce"],
  Snacks: ["Snacks"]
};

async function cargarProductos() {
  const subcolecciones = MAPA_SUBCOLECCIONES[categoria] || [];

  for (const sub of subcolecciones) {
    const ref = collection(db, "productoslatinos", categoria, sub);
    const snapshot = await getDocs(ref);

    snapshot.forEach(doc => {
      const p = doc.data();

      contenedor.innerHTML += `
        <div class="producto">
          <img src="${p.img}" alt="${p.nombre}">
          <h3>${p.nombre}</h3>
          <p>${p.desc}</p>
          <p class="precio">${p.precio}€</p>
        </div>
      `;
    });
  }
}

cargarProductos();

