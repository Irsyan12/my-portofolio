import React from "react";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-neutral-950 text-white py-6 w-full">
      <div className="container mx-auto text-center items-center md:justify-between px-4">
        <div className="flex flex-row-reverse mb-4 md:mb-0 text-center w-full">
          <p className="mt-3 mb-2 text-xs md:text-sm">
            <span onClick={() => (window.location.href = "/login")}>
              &copy;
            </span>{" "}
            Copyright 2026 - Irsyan Ramadhan. All rights reserved.
          </p>
          <div className="flex items-center justify-center space-x-4 mr-auto">
            {/* blink dots */}
            <div className="relative flex items-center justify-center">
              <span className="absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75 animate-ping"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </div>
            <p className="text-xs md:text-sm">Get in Touch</p>
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
