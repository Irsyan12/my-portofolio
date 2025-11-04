import { messagesAPI } from "../api";
import axios from "axios";

const sendMessage = async (formData, setSnackbar) => {
  const { name, email, subject, message } = formData;
  const web3formAccessKey = "896a421d-8d9e-40b3-973a-a3e01c6d08cf";

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
      subject: `New message from portfolio web: ${subject}`,
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
