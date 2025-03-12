import { getFirestore } from "firebase/firestore";
import { app } from "./firebase"; // Import konfigurasi Firebase

// Inisialisasi Firestore
const db = getFirestore(app);

export { db };
