// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";

const OptimizedProfileImage = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Cloudinary URLs
  const baseImageUrl = "https://res.cloudinary.com/dxwmph7tj/image/upload/";
  const profileImageUrl =
    `${baseImageUrl}v1741492349/pgnbo5f6ndeuepcqevsr.png`;
  // For placeholder, you can generate a tiny version using Cloudinary transformations
  const placeholderImageUrl =
    `${baseImageUrl}w_20,e_blur:100/v1741492349/pgnbo5f6ndeuepcqevsr.png`;

  useEffect(() => {
    // Preload gambar utama
    const img = new Image();
    img.src = profileImageUrl;
    img.onload = () => {
      setImageLoaded(true);
    };
  }, []);

  return (
    <div className="w-[250px] md:w-[300px] h-[250px] md:h-[300px] rounded-full overflow-hidden border-4 border-color1 relative bg-gray-800">
      {/* Placeholder atau gambar blur yang sangat kecil */}
      <img
        src={placeholderImageUrl}
        alt="Profile placeholder"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          imageLoaded ? "opacity-0" : "opacity-100 scale-[1.02] blur-xs"
        }`}
      />

      {/* Gambar utama dengan efek fade-in */}
      <img
        src={profileImageUrl}
        alt="Irsyan Ramadhan"
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          imageLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
};

export default OptimizedProfileImage;
