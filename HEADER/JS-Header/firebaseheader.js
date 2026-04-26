import { db } from "../../JS-Firebase/firebase-init.js";
import {
  collection,
  getDocs, doc, getDoc
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";


async function cargarHeader() {
    try {
        const refTextos = doc(db, "header", "textos");
        const snapTextos = await getDoc(refTextos);

        if (!snapTextos.exists()) {
            console.error("No existe header/textos");
            return;
        }

        const data = snapTextos.data();

        // CATEGORIAS
        document.getElementById("HeaderContacto").textContent = data.HeaderContacto;
        document.getElementById("HeaderInicio").textContent = data.HeaderInicio;
        document.getElementById("HeaderProductos").textContent = data.HeaderProductos;
        document.getElementById("HeaderProductosLatinos").textContent = data.HeaderProductosLatinos;

        // TITULOS
        document.getElementById("TituloHeader").textContent = data.TituloHeader;
        document.getElementById("SubtituloHeader").textContent = data.SubtituloHeader;
        
        
        //EMOJIS
        document.getElementById("Headeremoji_trofeo").textContent = data.Headeremoji_trofeo;
        document.getElementById("emoji_cesta").textContent = data.emoji_cesta;

     

        // Initialize menu toggle after header is loaded
        initializeMenuToggle();
        
        console.log("Textos cargados correctamente");

    } catch (error) {
        console.error("Error cargando textos:", error);
    }
}

// Menu toggle functionality
function initializeMenuToggle() {
    console.log('Initializing menu toggle...');
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    console.log('menuToggle:', menuToggle);
    console.log('navMenu:', navMenu);
    
    if (menuToggle && navMenu) {
        console.log('Both elements found, adding event listeners...');
        menuToggle.addEventListener('click', function(e) {
            console.log('Menu toggle clicked!');
            e.preventDefault();
            navMenu.classList.toggle('active');
            console.log('Menu active class:', navMenu.classList.contains('active'));
            
            // Animate hamburger menu
            const spans = menuToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!menuToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close menu when window is resized above mobile breakpoint
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                navMenu.classList.remove('active');
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    } else {
        console.error('Menu elements not found:', { menuToggle, navMenu });
    }
}

// Fallback: Try to initialize menu toggle after DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMenuToggle);
} else {
    // DOM is already ready
    setTimeout(initializeMenuToggle, 100);
}

cargarHeader();