// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";

function Navbar() {
  return (
    <nav className="md:mx-6 md:w-5/6 lg:mx-auto py-8 md:py-16 ">
      <div className="flex justify-between items-center">
        <img
          src="/images/IrsyanRmd.png"
          className="w-[100px] md:w-[100px] ml-5 md:ml-0"
          alt="photo"
          draggable="false"
        />
        <ul className="hidden md:flex items-center text-secondary text-sm md:text-base space-x-16">
          {/* Regular screen menu */}
          <li className="hover:text-primary relative group cursor-pointer">
            <a href="#home" className="transition-colors">Home</a>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </li>
          <li className="hover:text-primary relative group cursor-pointer">
            <a href="#about" className="transition-colors">About</a>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </li>
          <li className="hover:text-primary relative group cursor-pointer">
            <a href="#projects" className="transition-colors">Projects</a>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </li>
          <li className="hover:text-primary relative group cursor-pointer">
            <a href="#contactMe" className="transition-colors">Contact Me</a>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </li>
        </ul>

        {/* Mobile menu */}
        <ul className="flex md:hidden items-center text-secondary text-xs space-x-4 me-5">
          <li className="hover:text-primary relative group">
            <i href="#home" className="transition-colors">Home</i>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </li>
          <li className="hover:text-primary relative group">
            <i href="#about" className="transition-colors">About</i>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </li>
          <li className="hover:text-primary relative group">
            <i href="#projects" className="transition-colors">Projects</i>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </li>
          <li className="hover:text-primary relative group">
            <i href="#contact" className="transition-colors">Contact</i>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
