// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";

const OptimizedProfileImage = () => {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <img
      src="https://res.cloudinary.com/dxwmph7tj/image/upload/v1783964240/myfoto2_dzdqo4.png"
      alt="Irsyan Ramadhan"
      draggable="false"
      onLoad={() => setLoaded(true)}
      className={`max-w-xs sm:max-w-sm md:max-w-md w-full h-auto object-contain transition-opacity duration-700 ${
        loaded ? "opacity-100" : "opacity-0"
      }`}
    />
  );
};

export default OptimizedProfileImage;
