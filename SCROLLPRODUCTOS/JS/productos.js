
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
  alimentacion: ["alimentacion"],
  Bebida: ["Alcoholicas", "NoAlcoholicas"],
  Higiene: ["Champú","Geles","PastaDeDientes", "Toallitas"],
  Lacteos: ["Leches","Queso","Yogurt"],
  Limpieza: ["Detergentes","Lejias","LimpiaCristales","Suavizantes"],
  Snacks: ["SnacksGeneral", "FrutosSecos", "SnacksGeneral/Doritos/Doritos","SnacksGeneral/Doritos/Gusanitos","SnacksGeneral/Doritos/PatatasFritas" ],
  Panaderia: ["Pan"]
};

async function cargarProductos() {
  const subcolecciones = MAPA_SUBCOLECCIONES[categoria] || [];

  for (const sub of subcolecciones) {
    const ref = collection(db, "productos", categoria, sub);
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

