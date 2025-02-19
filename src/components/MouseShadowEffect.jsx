import { useState, useEffect } from "react";

const MouseShadowEffect = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
      setIsActive(true);
    };

    const handleMouseLeave = () => {
      setIsActive(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <>
      <div 
        className="hidden md:block pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          opacity: isActive ? 1 : 0,
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, 
            rgba(197, 248, 42, 0.06),
            transparent 40%
          )`
        }}
      />
      <div
        className="pointer-events-none fixed inset-0 z-20"
        style={{
          background: "transparent"
        }}
      />
    </>
  );
};

export default MouseShadowEffect;