import { db } from "../../JS-Firebase/firebase-init.js";
import {
  collection,
  getDocs, doc, getDoc
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";


async function cargarContacto() {
    try {
        const refTextos = doc(db, "Contact", "contact_texts");
        const snapTextos = await getDoc(refTextos);

        if (!snapTextos.exists()) {
            console.error("❌ No existe Contact/contact_texts");
            return;
        }

        const data = snapTextos.data();

        // TITULOS Y TEXTOS PRINCIPALES
        document.getElementById("titulo_principal").textContent = data.titulo_principal;
        document.getElementById("desc_principal").textContent = data.desc_principal;
        document.getElementById("form_title").textContent = data.from_title;
        document.getElementById("faq_title").textContent = data.faq_title;

        // LABELS
        document.getElementById("lbl_name").textContent = data.lbl_name;
        document.getElementById("lbl_email").textContent = data.lbl_email;
        document.getElementById("lbl_phone").textContent = data.lbl_phone;
        document.getElementById("lbl_message").textContent = data.lbl_message;

        // PLACEHOLDERS
        document.getElementById("input_name").placeholder = data.placeholder_name;
        document.getElementById("input_email").placeholder = data.placeholder_email;
        document.getElementById("input_phone").placeholder = data.placeholder_phone;
        document.getElementById("input_message").placeholder = data.placeholder_message;

        // BOTÓN
        document.getElementById("btn_enviar").textContent = data.btn_enviar;

        // INFO CONTACTO
        document.getElementById("info-direccion").textContent = data.direccion;
        document.getElementById("info_tel").textContent = data.tel_contacto;
        document.getElementById("info_email").textContent = data.email_contacto;
        document.getElementById("info_horario").textContent = data.horario_tienda;

        // FAQS
        document.getElementById("faq_q1").textContent = data.faq_q1;
        document.getElementById("faq_a1").textContent = data.faq_a1;

        document.getElementById("faq_q2").textContent = data.faq_q2;
        document.getElementById("faq_a2").textContent = data.faq_a2;

        document.getElementById("faq_q3").textContent = data.faq_q3;
        document.getElementById("faq_a3").textContent = data.faq_a3;

        document.getElementById("faq_q4").textContent = data.faq_q4;
        document.getElementById("faq_a4").textContent = data.faq_a4;
        
        // TÍTULOS INFO CONTACTO
        document.getElementById("title_direccion").textContent = data.title_direccion;
        document.getElementById("title_tel").textContent = data.title_tel;
        document.getElementById("title_email").textContent = data.title_email;
        document.getElementById("title_horario").textContent = data.title_horario;

        //INFO CONTACTO
        document.getElementById("info_tel").textContent = data.info_tel;
        document.getElementById("info_horario").textContent = data.info_horario;
        document.getElementById("info_email").textContent = data.info_email;
        document.getElementById("info_direccion").textContent = data.info_direccion;

        // MAPA
        document.getElementById("db-map").src = data.ubicacion_mapa;

        console.log("✔ Textos cargados correctamente");

    } catch (error) {
        console.error("❌ Error cargando textos:", error);
    }
}

async function cargarImagenes() {
    try {
        const refImg = doc(db, "Contact", "Imágenes");
        const snapImg = await getDoc(refImg);

        if (!snapImg.exists()) {
            console.error("❌ No existe Contact/Imágenes");
            return;
        }

        const data = snapImg.data();

        const campos = [
            "url_icono_email",
            "url_icono_email_blanco",
            "url_icono_enviar",
            "url_icono_horario ",
            "url_icono_lugar",
            "url_icono_pelota",
            "url_icono_tel "
        ];

        campos.forEach(campo => {
            const el = document.getElementById(campo);
            if (el && data[campo]) el.src = data[campo];
        });

        console.log("✔ Imágenes cargadas correctamente");

    } catch (error) {
        console.error("❌ Error cargando imágenes:", error);
    }
}

cargarContacto();
cargarImagenes();

