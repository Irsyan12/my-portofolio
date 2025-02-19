// eslint-disable-next-line no-unused-vars
import React from "react";

const TechStack = () => {
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

  const techIconsRepeated = [...techIcons, ...techIcons, ...techIcons, ...techIcons];

  return (
    <div className="mt-20 w-full overflow-hidden bg-transparent">
      <div className="py-4 flex animate-scroll">
        {/* First set of icons */}
        {techIconsRepeated.map((icon, index) => (
          <img
            key={`icon-${index}`}
            src={`/icon/${icon}.png`}
            alt={icon}
            className="mx-3 h-9 md:mx-8 md:h-12 object-contain"
          />
        ))}
        {/* Duplicate set for seamless loop */}
        {techIcons.map((icon, index) => (
          <img
            key={`icon-2-${index}`}
            src={`/icon/${icon}.png`}
            alt={icon}
            className="mx-3 h-9 md:mx-8 md:h-12 object-contain"
          />
        ))}
      </div>
    </div>
  );
};

export default TechStack;