import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "./firebase"; // Import konfigurasi Firebase

// Inisialisasi Auth
const auth = getAuth(app);

// Fungsi login dengan email & password
const login = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export { auth, login };
