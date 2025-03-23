import axios from "axios";
import { db } from "../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const sendMessage = async (formData, setSnackbar) => {
  const apiKey = "4790698";
  const phoneNumber = "6288214717802";
  const { name, email, subject, message } = formData;

  if (!name || !email || !subject || !message) {
    setSnackbar({
      open: true,
      message: "Please fill out all fields!",
      severity: "warning",
    });
    return false; // Indikasi gagal
  }

  try {
    await addDoc(collection(db, "messages"), {
      name,
      email,
      subject,
      message,
      timestamp: serverTimestamp(),
    });

    const text = `New Message from Contact Form:%0AName: ${name}%0AEmail: ${email}%0ASubject: ${subject}%0AMessage: ${message}`;
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
      // console.warn("CORS error ignored:", error);
    }

    setSnackbar({
      open: true,
      message: "Message sent successfully!",
      severity: "success",
    });

    return true; // Indikasi sukses
  } catch (error) {
    // console.error("Error sending message:", error);
    setSnackbar({
      open: true,
      message: "Failed to send message!",
      severity: "error",
    });
    return false; // Indikasi gagal
  }
};

export { sendMessage };
