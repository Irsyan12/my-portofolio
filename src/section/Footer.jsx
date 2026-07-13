import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-neutral-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-neutral-500 text-sm">
          <span
            className="cursor-pointer"
            onClick={() => (window.location.href = "/login")}
          >
            &copy;
          </span>{" "}
          2026 Irsyan Ramadhan. All rights reserved.
        </p>
        <div className="flex gap-4">
          <a
            href="https://github.com/Irsyan12"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
            aria-label="GitHub"
          >
            <i className="ri-github-fill text-xl"></i>
          </a>
          <a
            href="https://www.linkedin.com/in/irsyanramadhan/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
            aria-label="LinkedIn"
          >
            <i className="ri-linkedin-fill text-xl"></i>
          </a>
          <a
            href="https://instagram.com/irsan.rmd_"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
            aria-label="Instagram"
          >
            <i className="ri-instagram-fill text-xl"></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
