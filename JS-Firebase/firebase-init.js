import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDorHNEHe8T3-nZOP0ytBsGeFZq4s56xs8",
  authDomain: "web-tienda-14323.firebaseapp.com",
  projectId: "web-tienda-14323",
  storageBucket: "web-tienda-14323.firebasestorage.app",
  messagingSenderId: "248700874855",
  appId: "1:248700874855:web:3238cd1369456f9b5da4c2",
  measurementId: "G-8EY1JZN272"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
