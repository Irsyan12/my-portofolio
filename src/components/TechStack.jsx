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
    path.split("/").pop().replace(".png", ""),
    mod.default,
  ])
);

const TechStack = () => {
  return (
    <div className="mt-20 w-full overflow-hidden bg-transparent">
      <div className="relative flex">
        <div className="animate-marquee whitespace-nowrap flex">
          {techIcons.map((icon, index) => (
            <img
              key={`icon-1-${index}`}
              src={iconMap[icon]}
              alt={icon}
              className="mx-3 h-9 md:mx-8 md:h-12 object-contain"
            />
          ))}
        </div>
        <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex">
          {techIcons.map((icon, index) => (
            <img
              key={`icon-2-${index}`}
              src={iconMap[icon]}
              alt={icon}
              className="mx-3 h-9 md:mx-8 md:h-12 object-contain"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechStack;
