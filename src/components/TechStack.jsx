import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { getAllIcons } from "../utils/getTechIcons";

const TechStack = () => {
  const [icons, setIcons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const icons = getAllIcons();
    setIcons(icons);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="mt-20 w-full bg-transparent">Loading tech stack...</div>
    );
  }

  return (
    <div className="mt-20 w-full bg-transparent relative overflow-hidden">
      {/* Left Fade */}
      <div className="absolute left-0 top-0 h-full w-96 bg-gradient-to-r from-dark via-transparent to-transparent z-10 pointer-events-none" />

      {/* Right Fade */}
      <div className="absolute right-0 top-0 h-full w-96 bg-gradient-to-l from-dark via-transparent to-transparent z-10 pointer-events-none" />

      <Marquee speed={40} autoFill={true}>
        {icons.map(({ name, url }, index) => (
          <div
            key={name}
            className="mx-5 md:mx-8"
            data-aos="zoom-in"
            data-aos-delay={index * 150}
          >
            <img src={url} alt={name} className="h-10 md:h-12 object-contain" />
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default TechStack;
