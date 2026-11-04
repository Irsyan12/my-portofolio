import React, { useState, useEffect } from "react";

const HackerLoadingScreen = ({ onSkip }) => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    // Cycle dots from 0 to 3
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    // Listen for Escape key to skip
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && onSkip) {
        onSkip();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onSkip]);

  return (
    <div className="fixed inset-0 z-0 flex flex-col items-center justify-center bg-[#030303] overflow-hidden">
      <div className="relative flex flex-col items-center">
        {/* WEBM Loading Animation */}
        <video 
          src="/loading.webm" 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-24 h-24 md:w-32 md:h-32 object-contain mb-6"
        />

        {/* Status Text with Animated Dots */}
        <div className="font-mono text-xs sm:text-sm text-neutral-400 tracking-widest uppercase mt-4 text-center">
          Initialize system<span className="inline-block w-6 text-left">{dots}</span>
        </div>
      </div>
    </div>
  );
};

export default HackerLoadingScreen;
