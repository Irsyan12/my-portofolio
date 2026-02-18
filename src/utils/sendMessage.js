import { messagesAPI } from "../api";
import axios from "axios";

const sendMessage = async (formData, setSnackbar) => {
  const { name, email, subject, message } = formData;
  const web3formAccessKey = import.meta.env.VITE_APP_WEB3FORM_ACCESS_KEY;

  if (!name || !email || !subject || !message) {
    setSnackbar({
      open: true,
      message: "Please fill out all fields!",
      severity: "warning",
    });
    return false;
  }

  try {
    // Simpan ke MongoDB via backend
    await messagesAPI.create({
      name,
      email,
      subject,
      message,
    });

    // Kirim ke Web3Forms
    await axios.post("https://api.web3forms.com/submit", {
      access_key: web3formAccessKey,
      name,
      email,
      subject: `New message on portofolio website from ${name} : ${subject}`,
      message,
    });

    setSnackbar({
      open: true,
      message: "Message sent successfully!",
      severity: "success",
    });

    return true;
  } catch (error) {
    setSnackbar({
      open: true,
      message: "Failed to send message!",
      severity: "error",
    });
    return false;
  }
};

export { sendMessage };
