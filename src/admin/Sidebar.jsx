import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  FaHome,
  FaBriefcase,
  FaFile,
  FaCog,
  FaBars,
  FaTimes,
  FaEnvelope,
  FaCommentAlt, // Import feedback icon
} from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation(); // Hook to get current location

  const menuItems = [
    { icon: FaHome, label: "Dashboard", href: "/admin" },
    { icon: FaBriefcase, label: "Experiences", href: "/admin/experiences" },
    { icon: FaFile, label: "Projects", href: "/admin/projects" },
    { icon: FaEnvelope, label: "Message", href: "/admin/messages" },
    { icon: FaCommentAlt, label: "Feedback", href: "/admin/feedback" }, // Add Feedback link
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Function to check if the menu item is active
  const isActive = (path) => {
    // Exact match for dashboard to avoid matching with sub-routes
    if (path === "/admin") {
      return location.pathname === path;
    }
    // For other routes, check if the current path starts with the menu item path
    return location.pathname.startsWith(path);
  };

  return (
    <div className="h-screen flex bg-dark">
      {/* Mobile toggle button */}
      <div className="fixed top-0 left-0 z-40 md:hidden p-4">
        <button
          onClick={toggleMenu}
          className="text-gray-400 hover:text-color1 transition-colors duration-300"
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Overlay for mobile */}
      <div
        onClick={toggleMenu}
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 ease-in-out md:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sidebar */}
      <div
        className={`fixed md:static inset-y-0 left-0 w-64 bg-[#1E1E1E] border-r border-gray-800 p-4 z-30
                    transform transition-transform duration-300 ease-in-out
                    ${isOpen ? "translate-x-0" : "-translate-x-full"} 
                    md:translate-x-0`}
      >
        <div className="mb-8 text-center pt-4 md:pt-0">
          <h1 className="text-color1 text-2xl font-bold">Admin</h1>
        </div>

        <nav>
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className={`flex items-center p-3 mb-2 rounded-md transition-all duration-200 group
                         ${
                           isActive(item.href)
                             ? "bg-gray-800 border-l-4 border-color1"
                             : "hover:bg-gray-800"
                         }`}
            >
              <item.icon
                className={`mr-3 transition-colors duration-200 
                           ${
                             isActive(item.href)
                               ? "text-color1"
                               : "text-gray-400 group-hover:text-color1"
                           }`}
                size={20}
              />
              <span
                className={`transition-colors duration-200 
                               ${
                                 isActive(item.href)
                                   ? "text-color1 font-medium"
                                   : "text-gray-300 group-hover:text-color1"
                               }`}
              >
                {item.label}
              </span>
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
