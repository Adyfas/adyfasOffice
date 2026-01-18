import React from "react";
import { AnimatePresence, motion } from "framer-motion";

// Helper: dapatkan ucapan berdasarkan jam
const getGreetingByHour = (
  hour: number
): "morning" | "afternoon" | "evening" | "night" => {
  if (hour >= 5 && hour < 10) return "morning";
  if (hour >= 10 && hour < 14) return "afternoon";
  if (hour >= 14 && hour < 18) return "evening";
  return "night";
};

// Mapping per bahasa
const greetingsMap = {
  id: {
    morning: "Selamat pagi",
    afternoon: "Selamat Siang",
    evening: "Selamat Sore",
    night: "Selamat Malam",
  },
  jv: {
    morning: "Sugeng Enjang",
    afternoon: "Sugeng Sonten",
    evening: "Sugeng Sonten",
    night: "Sugeng ndalu",
  },
  su: {
    morning: "Wilujeng énjing",
    afternoon: "Wilujeng Sonten",
    evening: "Wilujeng Sonten",
    night: "Wilujeng Wengi",
  },
  en: {
    morning: "Good morning",
    afternoon: "Good Afternoon",
    evening: "Good Evening",
    night: "Good Night",
  },
  de: {
    morning: "Guten Morgen",
    afternoon: "Guten Tag",
    evening: "Guten Abend",
    night: "Gute Nacht",
  },
  ja: {
    morning: "おはようございます",
    afternoon: "こんにちは",
    evening: "こんばんは",
    night: "おやすみなさい",
  },
};

interface LoadingPageProps {
  onComplete: () => void;
}

const LoadingPage: React.FC<LoadingPageProps> = ({ onComplete }) => {
  const now = new Date();
  const hour = now.getHours();
  const timeKey = getGreetingByHour(hour);

  const greetings = [
    greetingsMap.id[timeKey],
    greetingsMap.jv[timeKey],
    greetingsMap.su[timeKey],
    greetingsMap.en[timeKey],
    greetingsMap.de[timeKey],
    greetingsMap.ja[timeKey],
  ];

  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (currentIndex >= greetings.length) {
      const finalTimer = setTimeout(() => onComplete(), 900);
      return () => clearTimeout(finalTimer);
    }

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 600);

    return () => clearTimeout(timer);
  }, [currentIndex, greetings.length, onComplete]);

  return (
    <div className="fixed inset-0 z-500 flex flex-col items-center justify-center bg-white overflow-hidden w-full">

      <div className="relative h-screen flex items-center justify-center w-full">
        <AnimatePresence mode="wait">
          {currentIndex < greetings.length && (
            <motion.div
              key={currentIndex}
              initial={{
                y: 40,
                opacity: 0,
                filter: "blur(10px)",
                scale: 0.9,
              }}
              animate={{
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 400,
                  damping: 18,
                },
              }}
              exit={{
                y: -30,
                opacity: 0,
                filter: "blur(8px)",
                scale: 0.95,
                transition: { duration: 0.25 },
              }}
              style={{
                position: "absolute",
                fontSize: "3rem",
                fontWeight: "700",
                color: "#111827",
              }}
              className="max-w-3xl"
            >
              {greetings[currentIndex]}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Final message — hanya muncul setelah SEMUA selesai */}
      {currentIndex >= greetings.length && (
        <motion.p
          className="mt-12 text-xl text-gray-600 px-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          we fix issues faster than your government
        </motion.p>
      )}
    </div>
  );
};

export default LoadingPage;
