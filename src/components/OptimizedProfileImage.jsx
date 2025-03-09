// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import profilPlaceholder from "../assets/images/MyPhoto-tiny.png"; // Versi kecil (5-10KB)
import profil from "../assets/images/MyPhoto.png";

const OptimizedProfileImage = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(profilPlaceholder);

  useEffect(() => {
    // Preload gambar utama
    const img = new Image();
    img.src = profil;
    img.onload = () => {
      setImageSrc(profil);
      setImageLoaded(true);
    };
  }, []);

  return (
    <div className="w-[250px] md:w-[300px] h-[250px] md:h-[300px] rounded-full overflow-hidden border-4 border-color1 relative bg-gray-800">
      {/* Placeholder atau gambar blur yang sangat kecil */}
      <img
        src={profilPlaceholder}
        alt="Profile placeholder"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          imageLoaded ? 'opacity-0' : 'opacity-100 scale-[1.02] blur-sm'
        }`}
      />
      
      {/* Gambar utama dengan efek fade-in */}
      <img
        src={imageSrc}
        alt="Irsyan Ramadhan"
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};

export default OptimizedProfileImage;