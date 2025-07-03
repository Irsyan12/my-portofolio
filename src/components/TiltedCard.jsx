import React, { useRef, useEffect, useState } from "react";

const TiltedCard = ({
  imageSrc,
  altText = "",
  captionText = "",
  containerHeight = "300px",
  containerWidth = "300px",
  rotateAmplitude = 1,
  scaleOnHover = 1.05,
  showTooltip = false,
  showMobileWarning = false,
  children,
}) => {
  const cardRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const targetTransform = useRef({ rotateX: 0, rotateY: 0 });
  const animationFrameRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current || isMobile) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -rotateAmplitude;
    const rotateY = ((x - centerX) / centerX) * rotateAmplitude;

    targetTransform.current = { rotateX, rotateY };
  };

  const animateTilt = () => {
    if (!cardRef.current) return;

    const current = cardRef.current.style.transform.match(
      /rotateX\((-?\d+\.?\d*)deg\).*rotateY\((-?\d+\.?\d*)deg\)/
    );

    const currentX = current ? parseFloat(current[1]) : 0;
    const currentY = current ? parseFloat(current[2]) : 0;

    const { rotateX, rotateY } = targetTransform.current;

    // Lerp
    const lerpedX = currentX + (rotateX - currentX) * 0.1;
    const lerpedY = currentY + (rotateY - currentY) * 0.1;

    cardRef.current.style.transform = `rotateX(${lerpedX}deg) rotateY(${lerpedY}deg) scale(${scaleOnHover})`;

    animationFrameRef.current = requestAnimationFrame(animateTilt);
  };

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(animateTilt);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, []);

  const resetTilt = () => {
    if (cardRef.current) {
      targetTransform.current = { rotateX: 0, rotateY: 0 };
    }
  };

  return (
    <div
      className="relative rounded-xl flex justify-center items-center"
      style={{
        width: containerWidth,
        height: containerHeight,
        perspective: "1000px",
        overflow: "visible",
        transformStyle: "preserve-3d",
      }}
    >
      <div
        ref={cardRef}
        className={`transition-transform duration-300 ease-out ${
          isMobile ? "" : "will-change-transform"
        }`}
        onMouseMove={handleMouseMove}
        onMouseLeave={resetTilt}
        onTouchStart={resetTilt}
        style={{
          width: containerWidth,
          height: containerHeight,
          transform: "rotateX(0deg) rotateY(0deg) scale(1)",
          transformStyle: "preserve-3d",
          borderRadius: "0.75rem",
        }}
      >
        <div
          className="w-full h-full overflow-hidden rounded-xl flex justify-center items-center"
          style={{ transform: "translateZ(0)" }}
        >
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={altText}
              className="w-full h-full object-cover rounded-xl"
              draggable="false"
            />
          ) : (
            <div className="w-full h-full flex justify-center items-center">
              {children}
            </div>
          )}
        </div>
      </div>

      {captionText && (
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-center py-2 text-sm rounded-b-xl">
          {captionText}
        </div>
      )}

      {showTooltip && !isMobile && (
        <div className="absolute top-2 right-2 text-xs bg-white text-black px-2 py-1 rounded-md shadow-md">
          Hover to Tilt
        </div>
      )}

      {showMobileWarning && isMobile && (
        <div className="absolute bottom-2 left-2 text-xs bg-yellow-400 text-black px-2 py-1 rounded-md shadow-md">
          Tilt disabled on mobile
        </div>
      )}
    </div>
  );
};

export default TiltedCard;