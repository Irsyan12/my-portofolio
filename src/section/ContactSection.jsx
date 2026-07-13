import React, { useState } from "react";
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
    e.preventDefault();
    setLoading(true);
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
    <div
      className="bg-cardBg border border-cardBorder rounded-3xl p-6 sm:p-8 relative overflow-hidden"
      id="contact"
      data-aos="fade-up"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px] -z-10 pointer-events-none"></div>

      <div className="mb-8">
        <h2 className="font-serif text-3xl font-bold text-white mb-3">
          Get In Touch
        </h2>
        <p className="text-neutral-400 text-sm">
          Have a project in mind, or just want to say hi? Let's connect and build
          something great together.
        </p>
      </div>

      <form className="space-y-4 relative z-10" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 transition-colors"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 transition-colors"
          />
        </div>
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          required
          value={formData.subject}
          onChange={handleChange}
          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 transition-colors"
        />
        <textarea
          name="message"
          placeholder="Your Message"
          rows="5"
          required
          value={formData.message}
          onChange={handleChange}
          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 transition-colors resize-none"
        ></textarea>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all glow-orange flex items-center justify-center gap-2 ${
            loading
              ? "bg-amber-600/50 text-white cursor-wait"
              : "bg-amber-500 hover:bg-amber-400 text-black cursor-pointer hover:-translate-y-0.5"
          }`}
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
          ) : (
            <>
              Send Message <i className="ri-send-plane-fill"></i>
            </>
          )}
        </button>
      </form>

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
    </div>
  );
};

export default ContactSection;
