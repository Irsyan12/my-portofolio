import { React, useEffect, useState } from "react";
import Projects from "../section/Projects";
import { FaLongArrowAltUp } from "react-icons/fa";

const ProjectsPage = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#1e1e1e]">
      <button
        className={`fixed ${
          scrolled ? "top-5 left-5" : "top-20 left-28"
        } transition-all duration-500 bg-color1 text-slate font-medium px-6 py-3 rounded-full z-50`}
        onClick={() => window.history.back()}
      >
        {scrolled ? "Back" : "Back to Home"}
      </button>
      <Projects limit={999} /> {/* Passing a high limit to show all projects */}
      <button
        className={`${
          scrolled ? "block animate-slide-up" : "hidden"
        } fixed bottom-5 right-5 p-5 bg-color1 rounded-full transition-all duration-500  animate-fade-in`}
      >
        <FaLongArrowAltUp
          onClick={() => window.scrollTo({ top: 0 })}
        ></FaLongArrowAltUp>
      </button>
    </div>
  );
};

export default ProjectsPage;
