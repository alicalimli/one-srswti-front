import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const images = [
  "https://api.magicnotes.app/storage/v1/object/public/public-ramnujan/wallpapers/magic-12.webp",
  "https://api.magicnotes.app/storage/v1/object/public/public-ramnujan/wallpapers/magic-16.webp",
  "https://api.magicnotes.app/storage/v1/object/public/public-ramnujan/wallpapers/magic-13.webp",
  "https://api.magicnotes.app/storage/v1/object/public/public-ramnujan/wallpapers/magic-14.webp",
  "https://api.magicnotes.app/storage/v1/object/public/public-ramnujan/wallpapers/magic-11.webp",
];

const Wallpaper = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.img
        alt="Image"
        key={images[index]}
        src={images[index]}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="h-full w-full object-cover bg-transparent rounded-[16px]"
      />
    </AnimatePresence>
  );
};

export default Wallpaper;
