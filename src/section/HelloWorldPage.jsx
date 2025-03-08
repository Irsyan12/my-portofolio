// eslint-disable-next-line no-unused-vars
import React from "react";
import { FaGithub, FaInstagram, FaLinkedin, FaEnvelope } from "react-icons/fa";
import TypeWriter from "../components/TypeWriter";
import profil from "../assets/images/MyPhoto.png";

function HelloWorldPage() {
  return (
    <>
      {/* <MouseShadowEffect /> */}

      <div
        className="w-11/12 md:pt-16 min-h-screen mx-auto text-white bg-dark"
        id="home"
      >
        <div className="md:w-5/6 mx-auto ">
          <div className="flex flex-col md:flex-row justify-between items-center pt-16 md:pt-32">
            {/* Left side content */}
            <div className="space-y-3 md:w-1/2 text-center md:text-left cursor-default">
              {/*eslint-disable-next-line react/no-unescaped-entities */}
              <p className="text-lg text-color1">Hello World, I'm</p>
              <h1 className="text-4xl md:text-6xl font-bold text-color1">
                Irsyan Ramadhan
              </h1>
              <TypeWriter />
              <p className="text-lg">
                Welcome to my personal website{" "}
                <span className="inline-block animate-wave">👋</span>
              </p>
              <button className="bg-color1 text-black px-6 py-3 rounded-md hover:bg-opacity-90 hover:shadow-primary/10 hover:shadow-md transition-all duration-300 hover:-translate-y-1 backdrop-blur">
                Download CV
              </button>
            </div>

            {/* Right side content */}
            <div className="mt-12 md:mt-0 md:w-1/2 flex justify-center">
              <div className="relative ms-auto">
                <div className="w-[250px] md:w-[300px] h-[250px] md:h-[300px] rounded-full overflow-hidden border-4 border-color1">
                  <img
                    src={profil}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                  <div className="flex space-x-4">
                    <a
                      className="bg-white p-2 rounded-full text-black hover:bg-color1 transition-colors"
                      href="mailto:irsyanramadhan72@gmail.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaEnvelope size={20} />
                    </a>
                    <a
                      href="https://github.com/Irsyan12"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white p-2 rounded-full text-black hover:bg-color1 transition-colors"
                    >
                      <FaGithub size={20} />
                    </a>
                    <a
                      href="https://instagram.com/irsan.rmd_"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white p-2 rounded-full text-black hover:bg-color1 transition-colors"
                    >
                      <FaInstagram size={20} />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/irsyanramadhan/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white p-2 rounded-full text-black hover:bg-color1 transition-colors"
                    >
                      <FaLinkedin size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HelloWorldPage;
