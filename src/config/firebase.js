// src/config/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAbyX_DN-dZOu4wLqkMlXanKUx9kXz5MOs",
  authDomain: "bscs-32e1.firebaseapp.com",
  projectId: "bscs-32e1",
  storageBucket: "bscs-32e1.firebasestorage.app",
  messagingSenderId: "237006282672",
  appId: "1:237006282672:web:8f50e208c455c68b8ac075",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
