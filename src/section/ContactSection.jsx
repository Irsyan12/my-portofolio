import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sendMessage } from "../utils/sendMessage";
import { RiSendPlaneFill, RiErrorWarningLine } from "react-icons/ri";
import { Snackbar, Alert, Slide as MuiSlide } from "@mui/material";

function SlideTransition(props) {
  return <MuiSlide {...props} direction="down" />;
}

const ContactSection = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [validationError, setValidationError] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (validationError) setValidationError("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Please enter your name.";
    if (!formData.email.trim()) return "Please enter your email address.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return "Please enter a valid email address.";
    if (!formData.subject.trim()) return "Please enter a subject.";
    if (!formData.message.trim()) return "Please enter your message.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      setValidationError(error);
      return;
    }

    setValidationError("");
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
    <motion.div
      className="relative overflow-hidden"
      id="contact"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
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

      {/* Custom Alert Banner above Form */}
      <AnimatePresence>
        {validationError && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs sm:text-sm flex items-center gap-2.5 shadow-lg overflow-hidden"
          >
            <RiErrorWarningLine className="text-lg flex-shrink-0 text-rose-400" />
            <span>{validationError}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form className="space-y-4 relative z-10" onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full bg-neutral-900 border ${
              validationError && !formData.name.trim() ? "border-rose-500/60 focus:border-rose-500" : "border-neutral-800 focus:border-amber-500/50"
            } rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors`}
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full bg-neutral-900 border ${
              validationError && (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) ? "border-rose-500/60 focus:border-rose-500" : "border-neutral-800 focus:border-amber-500/50"
            } rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors`}
          />
        </div>
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
          className={`w-full bg-neutral-900 border ${
            validationError && !formData.subject.trim() ? "border-rose-500/60 focus:border-rose-500" : "border-neutral-800 focus:border-amber-500/50"
          } rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors`}
        />
        <textarea
          name="message"
          placeholder="Your Message"
          rows="5"
          value={formData.message}
          onChange={handleChange}
          className={`w-full bg-neutral-900 border ${
            validationError && !formData.message.trim() ? "border-rose-500/60 focus:border-rose-500" : "border-neutral-800 focus:border-amber-500/50"
          } rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors resize-none`}
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
              Send Message <RiSendPlaneFill />
            </>
          )}
        </button>
      </form>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        slots={{ transition: SlideTransition }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        className="mt-4"
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{
            backgroundColor: "#171717",
            color: "#f5f5f5",
            border: snackbar.severity === "success" ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid rgba(245, 158, 11, 0.4)",
            borderRadius: "0.75rem",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(12px)",
            "& .MuiAlert-icon": {
              color: snackbar.severity === "success" ? "#10b981" : "#f59e0b",
            },
          }}
          className="font-medium px-5 py-2.5 text-sm"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </motion.div>
  );
};

export default ContactSection;
