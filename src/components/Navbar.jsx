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
            <span className="transition-colors">Home</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </li>
          <li className="hover:text-primary relative group cursor-pointer">
            <span className="transition-colors">About</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </li>
          <li className="hover:text-primary relative group cursor-pointer">
            <span className="transition-colors">Projects</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </li>
          <li className="hover:text-primary relative group cursor-pointer">
            <span className="transition-colors">Contact Me</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </li>
        </ul>

        {/* Mobile menu */}
        <ul className="flex md:hidden items-center text-secondary text-xs space-x-4 me-5">
          <li className="hover:text-primary relative group">
            <span className="transition-colors">Home</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </li>
          <li className="hover:text-primary relative group">
            <span className="transition-colors">About</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </li>
          <li className="hover:text-primary relative group">
            <span className="transition-colors">Projects</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </li>
          <li className="hover:text-primary relative group">
            <span className="transition-colors">Contact</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
