// Configuración Firebase SDK v9 - productoslatinos
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, setDoc, getDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Configuración de Firebase - REEMPLAZA CON TUS DATOS
const firebaseConfig = {
  apiKey: "AIzaSyDorHNEHe8T3-nZOP0ytBsGeFZq4s56xs8",
  authDomain: "web-tienda-14323.firebaseapp.com",
  projectId: "web-tienda-14323",
  storageBucket: "web-tienda-14323.firebasestorage.app",
  messagingSenderId: "248700874855",
  appId: "1:248700874855:web:3238cd1369456f9b5da4c2",
  measurementId: "G-8EY1JZN272"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Exportar para uso global
window.firebaseApp = app;
window.firebaseDB = db;
window.firebase = {
    collection,
    addDoc,
    getDocs,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    deleteDoc
};

console.log("Firebase inicializado correctamente para productoslatinos");
console.log("Firestore disponible:", db);
