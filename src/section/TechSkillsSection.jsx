import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { getAllIcons } from "../utils/getTechIcons";

const TechSkillsSection = () => {
  const [icons, setIcons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchedIcons = getAllIcons();
    setIcons(fetchedIcons);
    setLoading(false);
  }, []);

  return (
    <div
      className="bg-cardBg border border-cardBorder rounded-3xl p-6 sm:p-8 overflow-hidden relative"
      data-aos="fade-up"
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center glow-green">
          <i className="ri-code-s-slash-line text-xl text-emerald-500"></i>
        </div>
        <h2 className="font-serif text-2xl font-bold text-white">
          TechStack
        </h2>
      </div>

      {loading ? (
        <div className="h-20 animate-pulse bg-white/5 rounded-lg"></div>
      ) : (
        <div className="relative">
          {/* Left Fade */}
          <div className="absolute left-0 top-0 h-full w-12 sm:w-20 bg-gradient-to-r from-cardBg via-cardBg/80 to-transparent z-10 pointer-events-none" />

          {/* Right Fade */}
          <div className="absolute right-0 top-0 h-full w-12 sm:w-20 bg-gradient-to-l from-cardBg via-cardBg/80 to-transparent z-10 pointer-events-none" />

          <div className="flex flex-col gap-8 py-2">
            <Marquee speed={30} autoFill={true} gradient={false} direction="left">
              {icons.slice(0, Math.ceil(icons.length / 2)).map(({ name, url }, index) => (
                <div key={`row1-${index}`} className="mx-6 sm:mx-8 flex flex-col items-center relative group cursor-pointer">
                  <img
                    src={url}
                    alt={name}
                    className="h-6 sm:h-8 object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                  />
                  <span className="text-[10px] text-neutral-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-5 whitespace-nowrap">
                    {name}
                  </span>
                </div>
              ))}
            </Marquee>

            <Marquee speed={30} autoFill={true} gradient={false} direction="right">
              {icons.slice(Math.ceil(icons.length / 2)).map(({ name, url }, index) => (
                <div key={`row2-${index}`} className="mx-6 sm:mx-8 flex flex-col items-center relative group cursor-pointer">
                  <img
                    src={url}
                    alt={name}
                    className="h-6 sm:h-8 object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                  />
                  <span className="text-[10px] text-neutral-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-5 whitespace-nowrap">
                    {name}
                  </span>
                </div>
              ))}
            </Marquee>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechSkillsSection;
