import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Marquee from "react-fast-marquee";
import { getAllIcons } from "../utils/getTechIcons";
import { RiCodeSSlashLine } from "react-icons/ri";

const TechSkillsSection = () => {
  const [icons, setIcons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchedIcons = getAllIcons();
    setIcons(fetchedIcons);
    setLoading(false);
  }, []);

  return (
    <motion.div
      className="overflow-hidden relative"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="flex items-center gap-4 mb-8">
        <h2 className="font-serif text-2xl font-bold text-white">
          <span className="text-emerald-500 pr-2.5">#</span>TechStack
        </h2>
      </div>

      {loading ? (
        <div className="h-20 animate-pulse bg-white/5 rounded-lg"></div>
      ) : (
        <div className="relative overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)]">
          <div className="flex flex-col gap-8">
            <Marquee
              speed={30}
              autoFill={true}
              gradient={false}
              direction="left"
              className="overflow-hidden"
            >
              {icons
                .slice(0, Math.ceil(icons.length / 2))
                .map(({ name, url }, index) => (
                  <div
                    key={`row1-${index}`}
                    className="mx-6 sm:mx-8 py-2 flex flex-col items-center relative group cursor-pointer"
                  >
                    <img
                      src={url}
                      alt={name}
                      className="h-6 sm:h-8 object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                    />
                  </div>
                ))}
            </Marquee>

            <Marquee
              speed={30}
              autoFill={true}
              gradient={false}
              direction="right"
              className="overflow-hidden"
            >
              {icons
                .slice(Math.ceil(icons.length / 2))
                .map(({ name, url }, index) => (
                  <div
                    key={`row2-${index}`}
                    className="mx-6 sm:mx-8 py-2 flex flex-col items-center relative group cursor-pointer"
                  >
                    <img
                      src={url}
                      alt={name}
                      className="h-6 sm:h-8 object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                    />
                  </div>
                ))}
            </Marquee>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TechSkillsSection;
