import React, { useState, useEffect } from "react";
import { RiFileDownloadLine } from "react-icons/ri";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const logo = "https://res.cloudinary.com/dxwmph7tj/image/upload/v1741494933/images-web/whtlytqgyqdef1mxnndl.png";

  // Effect untuk mendeteksi scroll
  useEffect(() => {
    const handleScroll = () => {
      // Aktifkan efek floating ketika scroll melebihi 10px
      if (window.scrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Tambahkan event listener untuk scroll
    window.addEventListener("scroll", handleScroll);

    // Cleanup event listener saat komponen unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 z-50 md:left-1/2 md:-translate-x-1/2 transition-all duration-500
      ${
        scrolled
          ? "bg-neutral-900/60 backdrop-blur-md shadow-md rounded-2xl mt-3 w-5/6 md:rounded-xl md:w-4/6 md:mt-4 py-5 translate-x-10 border border-white/5"
          : "w-full bg-transparent md:my-9 md:w-5/6 py-4 border border-transparent"
      }`}
    >
      <div className="px-4 md:px-6 mx-auto flex justify-between items-center">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          aria-label="Irsyan Ramadhan — Homepage"
        >
          <img
            src={logo}
            className="w-[70px] md:w-[100px] cursor-pointer"
            alt="Irsyan Ramadhan Logo"
            width="100"
            height="22"
            draggable="false"
          />
        </a>

        {/* Desktop Menu - Download CV */}
        <div className="hidden md:flex items-center">
          <a
            href="/cv.pdf"
            download="Irsyan_Ramadhan_CV.pdf"
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-white transition-colors duration-200 cursor-pointer"
          >
            <RiFileDownloadLine className="text-base text-amber-500" />
            <span>Download CV</span>
          </a>
        </div>

        {/* Mobile Menu - Simple Text Links */}
        <ul className="md:hidden flex items-center text-white text-sm space-x-3">
          <li className="hover:text-amber-500">
            <a href="#content">About</a>
          </li>
          <li className="hover:text-amber-500">
            <a href="#projects">Projects</a>
          </li>
          <li className="hover:text-amber-500">
            <a href="#contact">Contact Me</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;