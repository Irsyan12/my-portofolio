// eslint-disable-next-line no-unused-vars
import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import TypeWriter from "../components/TypeWriter"; // Adjust the import path as needed
// import MouseShadowEffect from "../components/MouseShadowEffect";

function HelloWorldPage() {
  return (
    <>
    {/* <MouseShadowEffect /> */}

      <div className="w-11/12 mx-auto min-h-screen text-white bg-dark">

        <div className="md:w-5/6 mx-auto ">
          <div className="flex flex-col md:flex-row justify-between items-center pt-16 md:pt-32">
            {/* Left side content */}
            <div className="space-y-3 md:w-1/2 text-center md:text-left cursor-default">
              {/*eslint-disable-next-line react/no-unescaped-entities */}
              <p className="text-lg text-[#c5f82a]">Hello World, I'm</p>
              <h1 className="text-4xl md:text-6xl font-bold text-[#c5f82a]">
                Irsyan Ramadhan
              </h1>
              <TypeWriter />
              <p className="text-lg">
                Welcome to my personal website{" "}
                <span className="inline-block animate-wave">👋</span>
              </p>
              <button className="bg-[#c5f82a] text-black px-6 py-3 rounded-md hover:bg-opacity-90 transition-colors">
                Download CV
              </button>
            </div>

            {/* Right side content */}
            <div className="mt-12 md:mt-0 md:w-1/2 flex justify-center">
              <div className="relative ms-auto">
                <div className="w-[250px] md:w-[300px] h-[250px] md:h-[300px] rounded-full overflow-hidden border-4 border-[#c5f82a]">
                  <img
                    src="/images/MyPhoto.png"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                  <div className="flex space-x-4">
                    <a
                      href="#"
                      className="bg-white p-2 rounded-full text-black hover:bg-[#c5f82a] transition-colors"
                    >
                      <FaFacebook size={20} />
                    </a>
                    <a
                      href="#"
                      className="bg-white p-2 rounded-full text-black hover:bg-[#c5f82a] transition-colors"
                    >
                      <FaTwitter size={20} />
                    </a>
                    <a
                      href="#"
                      className="bg-white p-2 rounded-full text-black hover:bg-[#c5f82a] transition-colors"
                    >
                      <FaInstagram size={20} />
                    </a>
                    <a
                      href="#"
                      className="bg-white p-2 rounded-full text-black hover:bg-[#c5f82a] transition-colors"
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
