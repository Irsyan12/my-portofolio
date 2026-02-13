import { FaLaravel } from "react-icons/fa";

const cloudinaryBaseUrl = "https://res.cloudinary.com/dxwmph7tj/image/upload";
const cloudinaryFolder = "icons";

// Gunakan dictionary (object) dengan key = nama teknologi
const iconMap = {
  javascript: "JsiconAjs3avpQe0Lm",
  typescript: "xnnvgq5aswuihh8qzta4",
  react: "nly9im2daeprsv8wxebf",
  node: "owjeoe0fmddzsztpugmb",
  laravel: "q703u1nytlnjrw642jdq",
  php: "ayrwxgcemrspfgfjgmwz",
  bootstrap: "bootstraplogoshadow2p1ttj7",
  mysql: "axsekpus1o7h06rbvobt",
  flutter: "wtnnvetxyqycl3ljolot",
  python: "zpmkeuzpbmn4daejecwl",
  tensorflow: "pz3uxsmdfclx65pmx9ls",
  firebase: "nirkkkolnc1pegcay2sw",
  tailwind: "tailwind_br85lu",
  vue: "Vue_ocgcpe",
  supabase: "supabase_uhipak",
};

// ✅ Ambil semua icon sebagai objek lengkap { name, url }
export const getAllIcons = () => {
  return Object.entries(iconMap).map(([name, id]) => ({
    name,
    url: `${cloudinaryBaseUrl}/v1759761622/${cloudinaryFolder}/${id}.png`,
  }));
};

// ✅ Ambil icon tertentu berdasarkan nama
export const getIconByName = (name) => {
  const id = iconMap[name];
  if (!id) return null;

  return `${cloudinaryBaseUrl}/v1759761622/${cloudinaryFolder}/${id}.png`;
};

// ✅ Jika perlu, ekspor juga seluruh dictionary URL langsung
export const iconDict = Object.fromEntries(
  Object.entries(iconMap).map(([name, id]) => [
    name,
    `${cloudinaryBaseUrl}/v1759761622/${cloudinaryFolder}/${id}.png`,
  ])
);
