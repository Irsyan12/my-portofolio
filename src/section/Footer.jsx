// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import { Snackbar, Alert } from "@mui/material";
import { sendFeedback } from "../utils/sendFeedback";

const Footer = () => {
  const [feedback, setFeedback] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await sendFeedback(feedback);
    setSnackbar({
      open: true,
      message: response.message,
      severity: response.success ? "success" : "warning",
    });

    if (response.success) {
      setFeedback("");
    }
  };

  return (
    <footer className="bg-zinc-900 text-white py-6 w-full">
      <div className="container mx-auto text-center flex flex-col-reverse md:flex-row items-center md:justify-between px-4">
        <div className="mb-4 md:mb-0 text-center md:text-left w-full md:w-auto">
          <p className="mt-3 mb-2 text-sm">
            &copy; 2025 Irsyan Ramadhan. All rights reserved.
          </p>
          <div className="flex justify-center md:justify-start space-x-4">
            <a
              href="https://github.com/Irsyan12"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-400"
            >
              <FaGithub size={24} />
            </a>
            <a
              href="https://www.linkedin.com/in/irsyanramadhan/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-400"
            >
              <FaLinkedin size={24} />
            </a>
            <a
              href="https://instagram.com/irsan.rmd_"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-400"
            >
              <FaInstagram size={24} />
            </a>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full md:w-auto flex flex-row items-center space-x-2"
        >
          <input
            type="text"
            placeholder="Enter feedback..."
            className="px-4 py-2 w-full md:w-64 text-black rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 md:mb-0"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <button
            type="submit"
            className="md:ml-2 bg-color1 hover:bg-blue-700 text-black px-4 py-2 rounded-md md:w-auto"
          >
            Send
          </button>
        </form>
      </div>
      {/* Snackbar untuk notifikasi */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "top" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </footer>
  );
};

export default Footer;
