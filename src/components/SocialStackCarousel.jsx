import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  RiGithubFill,
  RiLinkedinFill,
  RiInstagramFill,
  RiArrowRightUpLine,
  RiMailFill,
} from "react-icons/ri";

const socialLinks = [
  {
    name: "GitHub",
    username: "@Irsyan12",
    description: "Check out my projects!",
    url: "https://github.com/Irsyan12",
    icon: RiGithubFill,
    accentColor: "from-white/[0.03] via-white/[0.015] to-transparent",
    borderColor: "border-white/10 hover:border-white/20",
    badgeColor: "bg-white/[0.04] text-neutral-300 border-white/10",
    iconColor: "text-neutral-300",
  },
  {
    name: "LinkedIn",
    username: "Irsyan Ramadhan",
    description: "Connect with me professionally!",
    url: "https://linkedin.com/in/irsyanramadhan",
    icon: RiLinkedinFill,
    accentColor: "from-sky-400/[0.08] via-sky-400/[0.03] to-transparent",
    borderColor: "border-sky-400/15 hover:border-sky-400/25",
    badgeColor: "bg-sky-400/[0.08] text-sky-300 border-sky-400/15",
    iconColor: "text-sky-300",
  },
  {
    name: "Instagram",
    username: "@irsan.rmd_",
    description: "Follow my daily life & tech updates!",
    url: "https://instagram.com/irsan.rmd_",
    icon: RiInstagramFill,
    accentColor: "from-fuchsia-400/[0.08] via-pink-400/[0.03] to-transparent",
    borderColor: "border-fuchsia-400/15 hover:border-fuchsia-400/25",
    badgeColor: "bg-fuchsia-400/[0.08] text-fuchsia-300 border-fuchsia-400/15",
    iconColor: "text-fuchsia-300",
  },
  {
    name: "Gmail",
    username: "irsyanramadhan72@gmail.com",
    description: "Send me an email for collaborations!",
    url: "mailto:irsyanramadhan72@gmail.com",
    icon: RiMailFill,
    accentColor: "from-red-400/[0.08] via-orange-400/[0.03] to-transparent",
    borderColor: "border-red-400/15 hover:border-red-400/25",
    badgeColor: "bg-red-400/[0.08] text-red-300 border-red-400/15",
    iconColor: "text-red-300",
  },
];

const SocialStackCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Auto slide interval (paused during drag)
  useEffect(() => {
    if (isDragging) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % socialLinks.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [isDragging]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % socialLinks.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + socialLinks.length) % socialLinks.length,
    );
  };

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 40;

    if (distance > minSwipeDistance) {
      handleNext(); // Swiped left -> Next card
    } else if (distance < -minSwipeDistance) {
      handlePrev(); // Swiped right -> Prev card
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  // Helper to determine position relative to active card
  const getCardOffset = (index) => {
    const total = socialLinks.length;
    const diff = (index - currentIndex + total) % total;

    if (diff === 0) return 0; // Active center
    if (diff === 1 || diff === total - 3) return 1; // Right peek
    if (diff === total - 1 || diff === 2) return -1; // Left peek
    return 2; // Hidden offscreen
  };

  return (
    <div className="my-8 relative overflow-hidden py-2 select-none">
      <h3 className="text-xs uppercase tracking-wider font-semibold text-neutral-400 mb-4 text-center">
        Social Connect
      </h3>

      <div
        className="relative h-24 sm:h-24 w-full flex items-center justify-center cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {socialLinks.map((item, index) => {
          const offset = getCardOffset(index);
          const isActive = offset === 0;
          const isLeft = offset === -1;
          const isRight = offset === 1;

          const Icon = item.icon;

          return (
            <motion.a
              key={item.name}
              href={item.url}
              target={isActive ? "_blank" : undefined}
              rel={isActive ? "noopener noreferrer" : undefined}
              draggable={false}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={(e, info) => {
                setIsDragging(false);
                const swipeThreshold = 50;
                if (info.offset.x < -swipeThreshold) {
                  handleNext();
                } else if (info.offset.x > swipeThreshold) {
                  handlePrev();
                }
              }}
              onClick={(e) => {
                if (isDragging) {
                  e.preventDefault();
                  return;
                }
                if (!isActive) {
                  e.preventDefault();
                  setCurrentIndex(index);
                }
              }}
              className={`absolute w-[82%] sm:w-[360px] rounded-2xl p-3.5 sm:p-4 flex items-center justify-between border backdrop-blur-xl bg-neutral-900/85 ${item.borderColor}`}
              animate={{
                x: isLeft
                  ? "-45%"
                  : isRight
                    ? "45%"
                    : offset === 0
                      ? "0%"
                      : "0%",
                scale: isActive ? 1 : offset === 2 ? 0.7 : 0.88,
                rotateY: isLeft ? 6 : isRight ? -6 : 0,
                opacity: isActive ? 1 : offset === 2 ? 0 : 0.45,
                filter: isActive ? "blur(0px)" : "blur(1.5px)",
                zIndex: isActive ? 20 : offset === 2 ? 0 : 10,
                boxShadow: isActive
                  ? "0 16px 36px -6px rgba(0,0,0,0.5), 0 0 20px rgba(0,0,0,0.3)"
                  : "0 4px 12px rgba(0,0,0,0.2)",
              }}
              whileHover={
                isActive && !isDragging
                  ? {
                      scale: 1.025,
                      y: -2,
                    }
                  : undefined
              }
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 26,
              }}
              style={{
                pointerEvents: isActive ? "auto" : "cursor-pointer",
                cursor: isDragging ? "grabbing" : "grab",
              }}
            >
              {/* Background gradient accent */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${item.accentColor} opacity-60 pointer-events-none`}
              />

              <div className="flex items-center gap-3 relative z-10 min-w-0 pr-2 pointer-events-none">
                <div
                  className={`w-10 h-10 rounded-xl bg-neutral-800/80 border border-neutral-700/50 flex items-center justify-center flex-shrink-0 ${item.iconColor}`}
                >
                  <Icon className="text-xl" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="text-white font-bold text-sm sm:text-base leading-tight truncate">
                      {item.name}
                    </h4>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium border shrink-0 ${item.badgeColor}`}
                    >
                      {item.username}
                    </span>
                  </div>
                  <p className="text-neutral-400 text-xs truncate">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="relative z-10 w-8 h-8 rounded-full bg-neutral-800/80 border border-neutral-700 flex items-center justify-center text-neutral-300 hover:text-white hover:bg-neutral-700 transition shrink-0 pointer-events-none">
                <RiArrowRightUpLine className="text-lg" />
              </div>
            </motion.a>
          );
        })}
      </div>

      {/* Progress Indicators */}
      <div className="flex justify-center items-center gap-1.5 mt-6">
        {socialLinks.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1 rounded-full transition-all duration-300 ${
              currentIndex === idx
                ? "w-6 bg-amber-500"
                : "w-1.5 bg-neutral-700 hover:bg-neutral-500"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default SocialStackCarousel;
