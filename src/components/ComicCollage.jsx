import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

// Assets
import gojo from "../assets/Gojo Satoru.webp";
import kaneki from "../assets/Ken Kaneki.webp";
import luffy from "../assets/Monkey D Luffy.webp";
import nezuko from "../assets/Nezuko.webp";
import rimuru from "../assets/Rimuru Tempest.webp";
import jinwoo from "../assets/Sung Jin Woo.webp";
import killua from "../assets/Killua.webp";
import saitama from "../assets/Saitama.webp";

const CHARACTERS = [gojo, kaneki, luffy, nezuko, rimuru, jinwoo, killua, saitama];

export const ComicCollage = () => {
  const { darkMode } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 3000); // Berpindah setiap 3 detik
    return () => clearInterval(timer);
  }, []);

  const variants = {
    center: {
      x: 0,
      scale: 1.1,
      opacity: 1,
      zIndex: 30,
      filter: "brightness(1) drop-shadow(0 0 20px rgba(34, 197, 94, 0.4))",
    },
    left: {
      x: "-60%",
      scale: 0.8,
      opacity: 0.5,
      zIndex: 20,
      filter: "brightness(0.6) drop-shadow(0 0 0px transparent)",
    },
    right: {
      x: "60%",
      scale: 0.8,
      opacity: 0.5,
      zIndex: 20,
      filter: "brightness(0.6) drop-shadow(0 0 0px transparent)",
    },
    hiddenLeft: {
      x: "-120%",
      scale: 0.5,
      opacity: 0,
      zIndex: 10,
      filter: "brightness(0.2) drop-shadow(0 0 0px transparent)",
    },
    hiddenRight: {
      x: "120%",
      scale: 0.5,
      opacity: 0,
      zIndex: 10,
      filter: "brightness(0.2) drop-shadow(0 0 0px transparent)",
    },
  };

  const getPosition = (index) => {
    const N = CHARACTERS.length;
    const current = currentIndex % N;

    if (index === current) return "center";
    if (index === (current - 1 + N) % N) return "left";
    if (index === (current + 1) % N) return "right";
    
    // Karakter yang baru akan masuk dari kanan, dan yang akan keluar ke kiri
    if (index === (current - 2 + N) % N) return "hiddenLeft";
    return "hiddenRight";
  };

  return (
    <div className="relative w-full h-full flex items-end justify-center">
      {CHARACTERS.map((char, index) => {
        const position = getPosition(index);
        
        return (
          <motion.img
            key={index}
            src={char}
            alt={`Comic Character ${index}`}
            className="absolute bottom-0 w-auto h-[320px] object-cover object-bottom drop-shadow-2xl will-change-transform"
            variants={variants}
            initial={false}
            animate={position}
            transition={{
              duration: 6,
              ease: [0.32, 0.72, 0, 1], // Custom kubik smooth
            }}
          />
        );
      })}

      {/* Gradasi bawah ke atas */}
      <div className={`absolute inset-x-0 bottom-0 h-2/5 z-40 pointer-events-none bg-gradient-to-t ${
        darkMode ? "from-black via-black/50 to-transparent" : "from-white via-white/50 to-transparent"
      }`}></div>
    </div>
  );
};
