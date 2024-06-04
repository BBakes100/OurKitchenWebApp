import { initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBBW66TKe6ryNRC4cjKpP_FNQI2gLN0yMI",
  authDomain: "cis-371-ourkitchen.firebaseapp.com",
  projectId: "cis-371-ourkitchen",
  storageBucket: "cis-371-ourkitchen.appspot.com",
  messagingSenderId: "398200249698",
  appId: "1:398200249698:web:256c594a4b549a10cde03b",
  measurementId: "G-3DRNR4HTFN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db: Firestore = getFirestore(app);