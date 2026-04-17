import { db } from "/webTienda1daw/JS-Firebase/firebase-init.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

//   CARGA DE TEXTOS


const SUBCOLECCIONES = ["TITULO", "Info-Box", "PRODUCTOS", "Marcas"];

async function cargarSubcoleccion(nombreSubcoleccion) {
  const colRef = collection(db, "Home", "TEXTOS", nombreSubcoleccion);
  const snap = await getDocs(colRef);

  snap.forEach(docSnap => {
    const data = docSnap.data();

    for (const campo in data) {
      const elemento = document.getElementById(campo);
      if (elemento) {
        elemento.textContent = data[campo];
      } else {
        console.warn(`No existe en el HTML un id="${campo}"`);
      }
    }
  });
}

async function cargarTextos() {
  try {
    for (const nombre of SUBCOLECCIONES) {
      await cargarSubcoleccion(nombre);
    }
    console.log(" Textos cargados desde Firestore");
  } catch (error) {
    console.error(" Error cargando textos:", error);
  }
}

//   CARGA DE IMÁGENES


const SUBCOLECCIONES_IMAGENES = [
  "Box-Info",
  "FondoEstadio",
  "ProductosHome"
];
async function cargarImagenes() {
  try {
    for (const sub of SUBCOLECCIONES_IMAGENES) {
      const colRef = collection(db, "Home", "MULTIMEDIA", sub);
      const snap = await getDocs(colRef);

      snap.forEach(docSnap => {
        const data = docSnap.data();

        for (const campo in data) {
          const elemento = document.getElementById(campo);

          if (!elemento) {
            console.warn(`⚠ No existe en el HTML un id="${campo}"`);
            continue;
          }

          if (elemento.tagName === "IMG") {
            elemento.src = data[campo];
            console.log(`✔ Imagen cargada: ${campo}`);
          }
          //   REUTILIZAR IMÁGENES
          if (campo === "VerduraURL") {
            const imgDuplicada = document.getElementById("VerduraURL2");
            if (imgDuplicada) {
              imgDuplicada.src = data[campo];
              console.log("✔ VerduraURL2 reutiliza VerduraURL");
            }
          }

        }
      });
    }

    console.log("  Imágenes cargadas desde Firestore");

  } catch (error) {
    console.error(" Error cargando imágenes:", error);
  }
}

cargarTextos();
cargarImagenes();
