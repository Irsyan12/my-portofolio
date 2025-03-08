// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import logo from "../assets/images/IrsyanRmd.png";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

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
          ? "bg-black/60 backdrop-blur-md shadow-md rounded-2xl mt-3 w-5/6 md:rounded-xl md:w-4/6 md:mt-4 py-5 translate-x-10"
          : "w-full bg-transparent md:my-9 md:w-5/6 py-4"
      }`}
    >
      <div className="px-4 md:px-6 mx-auto flex justify-between items-center">
        <a onClick={() => window.scrollTo(0, 0)}>
          <img
            src={logo}
            className="w-[70px] md:w-[100px]"
            alt="Irsyan Ramadhan Logo"
            draggable="false"
          />
        </a>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center text-white text-base space-x-10">
          <li className="hover:text-[#c5f82a] relative group cursor-pointer">
            <a
            
              onClick={() => window.scrollTo(0, 0)}
              className="transition-colors"
            >
              Home
            </a>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#c5f82a] transition-all duration-300 group-hover:w-full"></span>
          </li>
          <li className="hover:text-[#c5f82a] relative group cursor-pointer">
            <a href="#about" className="transition-colors">
              About
            </a>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#c5f82a] transition-all duration-300 group-hover:w-full"></span>
          </li>
          <li className="hover:text-[#c5f82a] relative group cursor-pointer">
            <a href="#projects" className="transition-colors">
              Projects
            </a>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#c5f82a] transition-all duration-300 group-hover:w-full"></span>
          </li>
          <li className="hover:text-[#c5f82a] relative group cursor-pointer">
            <a href="#contactMe" className="transition-colors">
              Contact Me
            </a>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#c5f82a] transition-all duration-300 group-hover:w-full"></span>
          </li>
        </ul>

        {/* Mobile Menu - Simple Text Links */}
        <ul className="md:hidden flex items-center text-white text-sm space-x-3">
          <li className="hover:text-[#c5f82a]">
            <a href="#about">About</a>
          </li>
          <li className="hover:text-[#c5f82a]">
            <a href="#projects">Projects</a>
          </li>
          <li className="hover:text-[#c5f82a]">
            <a href="#contactMe">Contact Me</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
