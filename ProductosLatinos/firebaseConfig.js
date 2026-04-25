// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCcfk5iRS03VrtxOjItcjG8Cs7M2y2udNQ",
    authDomain: "web-tienda-test.firebaseapp.com",
    projectId: "web-tienda-test",
    storageBucket: "web-tienda-test.firebasestorage.app",
    messagingSenderId: "733341350922",
    appId: "1:733341350922:web:375a72e70a63a5390473f3",
    measurementId: "G-4GQLZYGZGQ"
};

// Inicializar Firebase y asignar window.db inmediatamente
firebase.initializeApp(firebaseConfig);
window.db = firebase.firestore();

console.log("✅ Firebase inicializado para productos latinos - window.db disponible inmediatamente");
