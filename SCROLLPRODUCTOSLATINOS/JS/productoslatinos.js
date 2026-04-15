const productos = {
  alimentacion: [
    { img: "/webTienda1daw/MULTIMEDIA/ARVEJAVERDEENTERAAMERICA_resultado.png", nombre: "Arveja", desc: "Arveja verde entera", precio: 1.20 },
    { img: "/webTienda1daw/MULTIMEDIA/BUÑUELOCOLMAIZ_resultado.png", nombre: "Harina de buñuelos", desc: "Buñuelos Colmaiz, 500g", precio: 2.50 },
    { img: "/webTienda1daw/MULTIMEDIA/FREJOLROJOAMERICA_resultado.png", nombre: "Frejol rojo", desc: "Marca América 500g", precio: 1.95 },
    { img: "/webTienda1daw/MULTIMEDIA/FREJOLNEGROAMERICA_resultado.png", nombre: "Frejol negro", desc: "Marca América 500g", precio: 1.95 },
    { img: "/webTienda1daw/MULTIMEDIA/JAMONDIABLITO_resultado.png", nombre: "Jamón Diablito", desc: "Jamón dulce envasado", precio: 4.95 },
    { img: "/webTienda1daw/MULTIMEDIA/PANELA_resultado.png", nombre: "Endulzante", desc: "Endulzante Panela", precio: 1.95 }

  ],


  bebida: [
    { img: "/webTienda1daw/MULTIMEDIA/ElChichero_resultado.png", nombre: "El Chichero", desc: "Botella de 1,5L", precio: 2.80 },
    { img: "/webTienda1daw/MULTIMEDIA/AmericaKola_resultado.png", nombre: "America Kola", desc: "Botella de refresco de Naranja de 500ml", precio: 2.10 },
    { img: "/webTienda1daw/MULTIMEDIA/Frescolita_resultado.png", nombre: "Frescolita", desc: "Botella de refresco de cola 500mL", precio: 2.20 },
    { img: "/webTienda1daw/MULTIMEDIA/MaltaMaltín_resultado.png", nombre: "Malta Maltín", desc: "Botella de refresco elaborado a base de malta de 0,33L", precio: 2.20 }
  ],

  casero: [
    { img: "/webTienda1daw/MULTIMEDIA/CachitoVenezolano_resultado.png", nombre: "Cachito Venezolano", desc: "Wrap de Jamón y queso elaborado por nosotros mismos", precio: 3.40 },
    { img: "/webTienda1daw/MULTIMEDIA/BocaditoGuayaba_resultado.png", nombre: "Bocadito de Guayaba", desc: "Delicioso dulce casero elaborado por receta Latina", precio: 2.40 }
  ],
  dulce: [
    { img: "/webTienda1daw/MULTIMEDIA/ChocolateCorona_resultado.png", nombre: "Chocolate Corona", desc: "Cacao latino puro", precio: 2.50 },
    { img: "/webTienda1daw/MULTIMEDIA/ToddyChoco_resultado.png", nombre: "Toddy Choco", desc: "Cacao Latino marca Toddy", precio: 2.40 }
  ],

   snacks: [
    { img: "/webTienda1daw/MULTIMEDIA/BelvitaKraker_resultado.png", nombre: "Belvita Kraker", desc: "Galletas 'snacks' saladas", precio: 1.80 },
    { img: "/webTienda1daw/MULTIMEDIA/MaduritosDulcePicante_resultado.png", nombre: "Maduritos Dulces-Picantes", desc: "Deliciosas botanas con un dulzor picante", precio: 2.00 },
    { img: "/webTienda1daw/MULTIMEDIA/PlatanitosConLimon_resultado.png", nombre: "Platanitos con limón", desc: "Rodajas de plátano fritas bañadas en jugo de limón", precio: 2.20 },
    { img: "/webTienda1daw/MULTIMEDIA/PlatanitosMaduritos_resultado.png", nombre: "Platanitos Maduritos", desc: "Platanitos fritos clásicos", precio: 2.00}
  ],
};

// Leer parámetro de la URL
const params = new URLSearchParams(window.location.search);
const categoria = params.get("cat");

// Insertar título
document.getElementById("titulo-categoria").textContent =
  categoria.charAt(0).toUpperCase() + categoria.slice(1);

// Insertar productos
const contenedor = document.getElementById("contenedor-productos");

productos[categoria].forEach(p => {
  contenedor.innerHTML += `
    <div class="producto">
      <img src="${p.img}" alt="${p.nombre}">
      <h3>${p.nombre}</h3>
      <p>${p.desc}</p>
      <p class="precio">${p.precio}€</p>
    </div>
  `;
});
