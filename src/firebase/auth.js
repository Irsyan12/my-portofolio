import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { app } from "./firebase"; // Import konfigurasi Firebase

// Inisialisasi Auth
const auth = getAuth(app);

// Fungsi login dengan email & password
const login = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);

};

const logout = () => {
  return signOut(auth);
};



export { auth, login, logout };
