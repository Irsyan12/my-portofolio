// eslint-disable-next-line no-unused-vars
import React from "react";

const techIcons = [
  "firebase",
  "flutter",
  "laravel",
  "mysql",
  "node",
  "react",
  "typescript",
  "python",
  "tensorflow",
  "php",
];

// Import all images dynamically
const icons = import.meta.glob("../assets/icon/*.png", { eager: true });

const iconMap = Object.fromEntries(
  Object.entries(icons).map(([path, mod]) => [
    path.split("/").pop().replace(".png", ""), // Ambil nama file saja
    mod.default,
  ])
);

const techIconsRepeated = [...techIcons, ...techIcons, ...techIcons, ...techIcons];

const TechStack = () => {
  return (
    <div className="mt-20 w-full overflow-hidden bg-transparent">
      <div className="py-4 flex animate-scroll">
        {/* First set of icons */}
        {techIconsRepeated.map((icon, index) => (
          <img
            key={`icon-${index}`}
            src={iconMap[icon]} // Ambil dari iconMap
            alt={icon}
            className="mx-3 h-9 md:mx-8 md:h-12 object-contain"
          />
        ))}
        {/* Duplicate set for seamless loop */}
        {techIcons.map((icon, index) => (
          <img
            key={`icon-2-${index}`}
            src={iconMap[icon]} // Ambil dari iconMap
            alt={icon}
            className="mx-3 h-9 md:mx-8 md:h-12 object-contain"
          />
        ))}
      </div>
    </div>
  );
};

export default TechStack;
