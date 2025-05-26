import { useState } from "react";
import { sendMessage } from "../utils/sendMessage";
import { Snackbar, Alert } from "@mui/material";

const ContactSection = () => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const success = await sendMessage(formData, setSnackbar);

    if (success) {
      setFormData({ name: "", email: "", subject: "", message: "" });
    }
    setLoading(false);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <section
      className="py-24 w-11/12 md:w-5/6 mx-auto text-white"
      id="contactMe"
    >
      <div className="text-center mb-12 cursor-default">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-color1">
          Get In Touch
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Have a project in mind? Let&apos;s work together!
        </p>
      </div>
      <div className="max-w-2xl mx-auto">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="bg-white/5 rounded-lg px-4 py-3 focus:outline-hidden focus:ring-2 focus:ring-color1"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="bg-white/5 rounded-lg px-4 py-3 focus:outline-hidden focus:ring-2 focus:ring-color1"
            />
          </div>
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full bg-white/5 rounded-lg px-4 py-3 focus:outline-hidden focus:ring-2 focus:ring-color1"
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows="6"
            value={formData.message}
            onChange={handleChange}
            className="w-full bg-white/5 rounded-lg px-4 py-3 focus:outline-hidden focus:ring-2 focus:ring-color1"
          />
          <button
            type="submit"
            className={`${
              loading ? "bg-opacity-70 cursor-progress" : ""
            } w-full bg-color1 text-black py-3 cursor-pointer rounded-lg hover:bg-opacity-90 transition-colors`}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </section>
  );
};

export default ContactSection;
