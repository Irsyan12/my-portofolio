// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import { Snackbar, Alert } from "@mui/material";
import { sendFeedback } from "../utils/sendFeedback";

const Footer = () => {
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <footer className="bg-zinc-900 text-white py-6 w-full">
      <div className="container mx-auto text-center items-center md:justify-between px-4">
        <div className="mb-4 md:mb-0 text-center w-full">
          <p className="mt-3 mb-2 text-sm">
            <span onClick={() => (window.location.href = "/login")}>
              &copy;
            </span>{" "}
            2025 Irsyan Ramadhan. Made with ❤️.
          </p>
          <div className="flex justify-center space-x-4">
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
      </div>
    </footer>
  );
};

export default Footer;
