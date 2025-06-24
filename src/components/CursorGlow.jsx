import { useEffect, useRef } from "react";

const CursorGlow = () => {
  const glowRef = useRef(null);
  const mousePos = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });
  const currentPos = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      const glow = glowRef.current;
      if (!glow) return;

      // Lerp movement (smooth follow only, no scale)
      currentPos.current.x += (mousePos.current.x - currentPos.current.x) * 0.025;
      currentPos.current.y += (mousePos.current.y - currentPos.current.y) * 0.025;

      glow.style.transform = `translate(-50%, -50%) translate(${currentPos.current.x}px, ${currentPos.current.y}px)`;

      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animate();

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed top-0 left-0 w-72 h-72 opacity-5 rounded-full blur-3xl mix-blend-lighten transition-transform ease-out bg-gradient-to-tr from-color1 via-purple-400 to-pink-500"
      style={{ transform: "translate(-50%, -50%)" }}
    ></div>
  );
};

export default CursorGlow;
