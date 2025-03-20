import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";

const cloudinaryBaseUrl = "https://res.cloudinary.com/dxwmph7tj/image/upload";
const cloudinaryFolder = "icons";

const TechStack = () => {
  const [icons, setIcons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const iconIds = [
      "xnnvgq5aswuihh8qzta4",
      "nly9im2daeprsv8wxebf",
      "pz3uxsmdfclx65pmx9ls",
      "zpmkeuzpbmn4daejecwl",
      "q703u1nytlnjrw642jdq",
      "nirkkkolnc1pegcay2sw",
      "ayrwxgcemrspfgfjgmwz",
      "owjeoe0fmddzsztpugmb",
      "wtnnvetxyqycl3ljolot",
      "axsekpus1o7h06rbvobt",
    ];

    // eslint-disable-next-line no-unused-vars
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

    setIcons(
      iconIds.map(
        (id) => `${cloudinaryBaseUrl}/v1741494343/${cloudinaryFolder}/${id}.png`
      )
    );

    // ATAU, jika Anda tahu pattern URL dan ID bisa diprediksi berdasarkan nama teknologi:
    // setIcons(techIcons.map(tech => `${cloudinaryBaseUrl}/v1741494343/${cloudinaryFolder}/${tech}.png`));

    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="mt-20 w-full bg-transparent">Loading tech stack...</div>
    );
  }

  return (
    <div className="mt-20 w-full bg-transparent">
      <Marquee
        speed={40}
        autoFill={true}
      >
        {icons.map((iconUrl, index) => (
          <div key={`icon-${index}`} className="mx-5 md:mx-8">
            <img
              src={iconUrl}
              alt={`Tech Icon ${index + 1}`}
              className="h-10 md:h-12 object-contain"
            />
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default TechStack;
