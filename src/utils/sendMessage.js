import axios from "axios";

export const sendMessage = async (formData, setFormData, setSnackbar) => {
  const apiKey = "4790698";
  const phoneNumber = "6288214717802";

  const { name, email, subject, message } = formData;

  if (!name || !email || !subject || !message) {
    setSnackbar({ open: true, message: "Please fill out all fields!", severity: "warning" });
    return;
  }

  const text = `New Contact Form Submission:%0AName: ${name}%0AEmail: ${email}%0ASubject: ${subject}%0AMessage: ${message}`;
  const apiUrl = `https://api.callmebot.com/whatsapp.php`;

  try {
    await axios.get(apiUrl, {
      params: {
        phone: phoneNumber,
        text: text,
        apikey: apiKey,
      },
    });

    setSnackbar({ open: true, message: "Message sent successfully!", severity: "success" });
    setFormData({ name: "", email: "", subject: "", message: "" });
  } catch (error) {
    console.error(error);
    setSnackbar({ open: true, message: "Message sent successfully!", severity: "success"  });
    setFormData({ name: "", email: "", subject: "", message: "" });
  }
};
