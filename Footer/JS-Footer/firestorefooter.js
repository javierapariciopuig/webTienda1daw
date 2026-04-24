import { db } from "../../JS-Firebase/firebase-init.js";
import {
  collection,
  getDocs, doc, getDoc
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";


async function cargarFooter() {
    try {
        const refTextos = doc(db, "Footer", "Texto");
        const snapTextos = await getDoc(refTextos);

        if (!snapTextos.exists()) {
            console.error("❌ No existe Footer/Texto");
            return;
        }

        const data = snapTextos.data();

        // EMOJIS
        document.getElementById("emoji_trofeo").textContent = data.emoji_trofeo;
        document.getElementById("emoji_lugar").textContent = data.emoji_lugar;
        document.getElementById("emoji_tel").textContent = data.emoji_tel;
        document.getElementById("emoji_email").textContent = data.emoji_email;

        // TITULOS
        document.getElementById("TituloHorario").textContent = data.TituloHorario;
        document.getElementById("TituloContacto").textContent = data.TituloContacto;
        document.getElementById("TituloPrincipal").textContent = data.TituloPrincipal;
      
        // COPY
        document.getElementById("copyright_text").textContent = data.copyright_text;
        
        //SLOGAN Y FRASE
        document.getElementById("Slogan").textContent = data.Slogan;
        document.getElementById("Frase_destacada").textContent = data.Frase_destacada;

     
        // DATOS Y DETALLE
        document.getElementById("DetalleHorario").textContent = data.DetalleHorario;
        document.getElementById("Direccion").textContent = data.Direccion;
        document.getElementById("Email").textContent = data.Email;
        document.getElementById("Telefono").textContent = data.Telefono;

        console.log("✔ Textos cargados correctamente");

    } catch (error) {
        console.error("❌ Error cargando textos:", error);
    }
}
cargarFooter();