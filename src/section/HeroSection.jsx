import React from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import OptimizedProfileImage from "../components/OptimizedProfileImage";

const HeroSection = () => {
  const cursorX = useMotionValue(-1000);
  const cursorY = useMotionValue(-1000);

  const springConfig = { damping: 30, stiffness: 200 };
  const mouseX = useSpring(cursorX, springConfig);
  const mouseY = useSpring(cursorY, springConfig);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    cursorX.set(e.clientX - rect.left);
    cursorY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    cursorX.set(-1000);
    cursorY.set(-1000);
  };

  return (
    <header 
      className="relative pt-24 sm:pt-28 pb-10 overflow-hidden flex flex-col items-center justify-center h-screen group"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <h1
        className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-[#f3efe6] tracking-tight text-center z-10 px-4 pointer-events-none"
        data-aos="fade-down"
        data-aos-duration="1000"
      >
        Irsyan Ramadhan
      </h1>

      {/* Interactive Background Text Container */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%] w-full text-center opacity-70">
          <p className="font-serif text-[15vw] sm:text-8xl md:text-[11rem] lg:text-[13rem] font-bold tracking-widest text-outline leading-none text-transparent whitespace-nowrap">
            PORTFOLIO
          </p>
          <p className="hidden sm:block font-serif text-[15vw] sm:text-8xl md:text-[11rem] lg:text-[13rem] font-bold tracking-widest text-outline leading-none -mt-4 sm:-mt-8 text-transparent whitespace-nowrap">
            PORTFOLIO
          </p>
        </div>

        {/* Hover Filled Mask */}
        <motion.div 
          className="absolute inset-0"
          style={{
            WebkitMaskImage: useMotionTemplate`radial-gradient(250px circle at ${mouseX}px ${mouseY}px, black 10%, transparent 80%)`,
            maskImage: useMotionTemplate`radial-gradient(250px circle at ${mouseX}px ${mouseY}px, black 10%, transparent 80%)`,
          }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%] w-full text-center">
            <p className="font-serif text-[15vw] sm:text-8xl md:text-[11rem] lg:text-[13rem] font-bold tracking-widest text-amber-500/30 leading-none whitespace-nowrap">
              PORTFOLIO
            </p>
            <p className="hidden sm:block font-serif text-[15vw] sm:text-8xl md:text-[11rem] lg:text-[13rem] font-bold tracking-widest text-emerald-500/20 leading-none -mt-4 sm:-mt-8 whitespace-nowrap">
              PORTFOLIO
            </p>
          </div>
        </motion.div>
      </div>

      {/* Photo + Floating elements */}
      <div className="relative mt-6 z-10 flex flex-col items-center pointer-events-none">
        {/* Profile Photo */}
        <div
          className="w-64 sm:w-80 md:w-96 h-80 sm:h-96 md:h-[28rem] rounded-b-full overflow-hidden relative group pointer-events-auto"
          data-aos="zoom-in"
          data-aos-duration="1200"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 via-transparent to-transparent z-10"></div>
          <OptimizedProfileImage />
        </div>
      </div>

      {/* Simple Scroll Down Button (Vertical on the left) */}
      <a
        href="#content"
        className="absolute bottom-8 left-6 sm:bottom-12 sm:left-12 z-30 flex flex-col items-center gap-3 text-neutral-400 hover:text-amber-500 transition-colors"
        data-aos="fade-right"
        data-aos-delay="700"
      >
        <span className="text-[10px] tracking-[0.2em] uppercase font-bold [writing-mode:vertical-rl] rotate-180">Scroll</span>
        <i className="ri-arrow-down-line text-xl animate-bounce"></i>
      </a>
    </header>
  );
};

export default HeroSection;
