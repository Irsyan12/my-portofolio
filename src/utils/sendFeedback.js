import axios from "axios";
import { db } from "../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const sendFeedback = async (feedbackMessage, setSnackbar) => {
  const apiKey = "4790698";
  const phoneNumber = "6288214717802";

  if (!feedbackMessage) {
    setSnackbar({
      open: true,
      message: "Please provide feedback!",
      severity: "warning",
    });
    return false; // Indikasi gagal
  }

  try {
    // Simpan feedback ke Firestore
    await addDoc(collection(db, "feedback"), {
      feedbackMessage,
      timestamp: serverTimestamp(),
    });

    // Kirim notifikasi ke WhatsApp menggunakan CallMeBot
    const text = `New Feedback from visitors:%0AFeedback: ${feedbackMessage}`;
    const apiUrl = `https://api.callmebot.com/whatsapp.php`;

    try {
      await axios.get(apiUrl, {
        params: {
          phone: phoneNumber,
          text: text,
          apikey: apiKey,
        },
      });
    } catch (error) {
      // Abaikan error CORS atau error lainnya
      console.warn("CORS error ignored:", error);
    }

    // Tampilkan pesan sukses
    setSnackbar({
      open: true,
      message: "Feedback sent successfully!",
      severity: "success",
    });

    return true; // Indikasi sukses
  } catch (error) {
    // Tangani error saat menyimpan ke Firestore
    console.error("Error sending feedback:", error);
    setSnackbar({
      open: true,
      message: "Failed to send feedback!",
      severity: "error",
    });
    return false; // Indikasi gagal
  }
};

export { sendFeedback };
