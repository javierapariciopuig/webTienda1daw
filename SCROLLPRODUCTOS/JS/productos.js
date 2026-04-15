const productos = {
  alimentacion: [
    { img: "/webTienda1daw/MULTIMEDIA/Aceite_resultado.png", nombre: "Aceite", desc: "Aceite de oliva virgen extra, 5L", precio: 1.20 },
    { img: "/webTienda1daw/MULTIMEDIA/Arroz_resultado.png", nombre: "Arroz y Legumbres", desc: "Variedad de granos, 500g", precio: 2.50 },
    { img: "/webTienda1daw/MULTIMEDIA/Azucar_resultado.png", nombre: "Azucar", desc: "", precio: 3.80 },
    { img: "/webTienda1daw/MULTIMEDIA/Pasta_resultado.png", nombre: "Pasta Italiana", desc: "Pasta de sémola de trigo, 500g", precio: 1.95 },
    { img: "/webTienda1daw/MULTIMEDIA/Huevos_resultado.png", nombre: "Huevos", desc: "Una docena", precio: 1.95 },
    { img: "/webTienda1daw/MULTIMEDIA/Maíz_resultado.png", nombre: "Maíz", desc: "Maíz fresco", precio: 1.95 },
    { img: "/webTienda1daw/MULTIMEDIA/sal_resultado.png", nombre: "Sal", desc: "Sal, 500g", precio: 1.95 }

  ],


  bebida: [
    { img: "/webTienda1daw/MULTIMEDIA/Café1_resultado.png", nombre: "Café", desc: "Paquete de 0,5Kg", precio: 0.80 },
    { img: "/webTienda1daw/MULTIMEDIA/Agua_resultado.png", nombre: "Agua", desc: "Botella de 500ml", precio: 1.10 },
    { img: "/webTienda1daw/MULTIMEDIA/Cocacola_resultado.png", nombre: "CocaCola", desc: "Botella de refresco de cola 1L", precio: 2.20 },
    { img: "/webTienda1daw/MULTIMEDIA/Fanta_resultado.png", nombre: "Fanta", desc: "Botella de refresco de Naranja 1L", precio: 2.20 },
    { img: "/webTienda1daw/MULTIMEDIA/Aquarius_resultado.png", nombre: "Aquarius", desc: "Botella de refresco de Naranja o Limón sin gas 1L", precio: 2.20 },
    { img: "/webTienda1daw/MULTIMEDIA/Sprite_resultado.png", nombre: "Sprite", desc: "Botella de refresco 1L", precio: 2.20 },
    { img: "/webTienda1daw/MULTIMEDIA/Zumos3_resultado.png", nombre: "Zumo de Naranja", desc: "Paquete de zumos Don Simón tetrabrick, precio por unidad", precio: 0.80},
    /*AQUÍ EMPIEZAN ALCOHOLES*/
    { img: "/webTienda1daw/MULTIMEDIA/Vino_resultado.png", nombre: "Vino Cuné", desc: "Botella de rioja 0,75L", precio: 6.20 },
    { img: "/webTienda1daw/MULTIMEDIA/Alcohol1_resultado_resultado.png", nombre: "Ron Barceló", desc: "Botella de ron Barceló 0,75L", precio: 15.90 },
    { img: "/webTienda1daw/MULTIMEDIA/Alcohol3_resultado.png", nombre: "Red Label", desc: "Botella de Whiskey Red Label 1L", precio: 13.20 },
    { img: "/webTienda1daw/MULTIMEDIA/Alcohol4_resultado.png", nombre: "Jack Daniels", desc: "Botella de Whiskey premium, 1L", precio: 19.90 },
    { img: "/webTienda1daw/MULTIMEDIA/Alcohol1_resultado.png", nombre: "Absolut vodka", desc: "Botella de Vodka 0,75L", precio: 10.30 }

  ],

  higiene: [
    { img: "", nombre: "Jabón", desc: "Jabón natural", precio: 1.50 },
    { img: "/webTienda1daw/MULTIMEDIA/Champú2_resultado.png", nombre: "Champú", desc: "Champú hidratante", precio: 3.40 },
    { img: "/webTienda1daw/MULTIMEDIA/Gel1_resultado.png", nombre: "Gel de ducha", desc: "Gel PH neutro", precio: 3.40 },
    { img: "/webTienda1daw/MULTIMEDIA/Champú3_resultado.png", nombre: "Champú HS", desc: "Champú anticaspa", precio: 3.90 },
    { img: "/webTienda1daw/MULTIMEDIA/Pasta1_resultado.png", nombre: "Pasta de dientes", desc: "Dentífrico sabor menta", precio: 2.00 },
    { img: "/webTienda1daw/MULTIMEDIA/Toallitas1_resultado.png", nombre: "Toallitas Húmedas", desc: "Papel de baño húmedo, suavidad extra.", precio: 3.10 }
  ],
  lacteos: [
    { img: "/webTienda1daw/MULTIMEDIA/Leche1_resultado.png", nombre: "Leche", desc: "Leche semi desnatada, precio por brick", precio: 1.50 },
    { img: "/webTienda1daw/MULTIMEDIA/Leche2_resultado.png", nombre: "Leche entera Puleva", desc: "Leche entera, precio por brick", precio: 2.40 },
    { img: "/webTienda1daw/MULTIMEDIA/Queso1_resultado.png", nombre: "Queso", desc: "Queso García Vaquero", precio: 4.40 },
    { img: "/webTienda1daw/MULTIMEDIA/Yogur3_resultado.png", nombre: "Yogurt", desc: "Yogurt con probióticos, precio por unidad", precio: 0.90 }
  ],
  limpieza: [
    { img: "/webTienda1daw/MULTIMEDIA/Deter2_resultado.png", nombre: "Detergente", desc: "Detergente para ropa, 1,5L", precio: 6.50 },
    { img: "/webTienda1daw/MULTIMEDIA/Lejia1_resultado.png", nombre: "Lejía", desc: "Lejía blanca, 1L", precio: 2.40 },
    { img: "/webTienda1daw/MULTIMEDIA/Lejia2_resultado.png", nombre: "Lejía", desc: "Lejía premium, inolora, 1L", precio: 4.40 },
    { img: "/webTienda1daw/MULTIMEDIA/Cistales3_resultado.png", nombre: "Cristasol", desc: "Limpia cristales calidad extra", precio: 2.40 },
    { img: "/webTienda1daw/MULTIMEDIA/Sua1_resultado.png", nombre: "Suavizante", desc: "Suavizante para ropa", precio: 2.90 }
  ],
  panaderia: [
    { img: "/webTienda1daw/MULTIMEDIA/Pan3_resultado.png", nombre: "Barra de pan", desc: "Pan recién horneado, precio por barra", precio: 0.40 }
  ],
   snacks: [
    { img: "/webTienda1daw/MULTIMEDIA/FrutosSecos1_resultado.png", nombre: "Frutos secos", desc: "Cocktail mezcla de frutos secos", precio: 1.00 },
    { img: "/webTienda1daw/MULTIMEDIA/FrutosSecos2_resultado.png", nombre: "Frutos secos Grefusa", desc: "Cocktail mezcla de frutos secos marca Grefusa", precio: 1.50 },
    { img: "/webTienda1daw/MULTIMEDIA/FrutosSecos3_resultado.png", nombre: "Maíz frito", desc: "Maíz frito 'kikos' Grefusa", precio: 2.20 },
        /*AQUÍ EMPIEZAN SNACKS GENERALES*/
    { img: "/webTienda1daw/MULTIMEDIA/Doritos2_resultado.png", nombre: "Doritos", desc: "Doritos sweet chili", precio: 2.00 },
    { img: "/webTienda1daw/MULTIMEDIA/Doritos_resultado.png", nombre: "Doritos Classic", desc: "Doritos classic cheese", precio: 2.00 },
    { img: "/webTienda1daw/MULTIMEDIA/Gusanitos_resultado.png", nombre: "Gusanitos", desc: "Gusanitos clasicos", precio: 2.20 },
    { img: "/webTienda1daw/MULTIMEDIA/patatas4_resultado.png", nombre: "Patatas fritas", desc: "Patatas fritas marca Lays sabor vinagre y sal", precio: 2.10},
    { img: "/webTienda1daw/MULTIMEDIA/Patatas1_resultado.png", nombre: "Patatas fritas Pringles", desc: "Bote de patatas marca Pringles sabor original", precio: 2.00 },
    { img: "/webTienda1daw/MULTIMEDIA/Patatas2_resultado.png", nombre: "Patatas fritas Pringles", desc: "Bote de patatas marca Pringles sabor cebolla", precio: 2.00 },
    { img: "/webTienda1daw/MULTIMEDIA/Patatas3_resultado.png", nombre: "Patatas Lays", desc: "Patatas fritas Lays sabor original", precio: 2.20 },
    { img: "/webTienda1daw/MULTIMEDIA/Patatas5_resultado.png", nombre: "Patatas Ruffles Jamón", desc: "Patatas fritas Ruffles sabor Jamón", precio: 2.20}
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
