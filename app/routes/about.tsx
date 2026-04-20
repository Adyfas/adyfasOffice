import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import BlurText from "~/components/BlurText";
import type { Route } from "./+types/about";
import ClientOnly from "~/components/ClientOnly";
import CalltoActionContact from "~/components/CalltoActionContact";
import CareerSnapshot from "~/components/about/CareerSnapshot";
import Snapshot from "~/components/about/Snapshot";
import HighlightsAchievements from "~/components/about/HighlightsAchievements";
import Reveal from "~/components/Reveal";

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

export function meta({ }: Route.MetaArgs) {
  return [
    {
      title: "Adyfas - About",
    },
    {
      name: "description",
      content:
        "Adyfas (Ferdi Iskandar) — Web developer & problem solver. Full-stack, backend-focused. Builds web apps, automation systems, REST APIs. 1st Runner-Up national web competitions. Shipping real projects.",
    },
  ];
}

export default function AboutPage() {
  const [showBlurText, setShowBlurText] = useState(true);
  const [currentGreetingIndex, setCurrentGreetingIndex] = useState(0);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBlurText(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showBlurText) return;

    const timer = setInterval(() => {
      setCurrentGreetingIndex((prev) => (prev + 1) % greetings.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [showBlurText, greetings.length]);

  const greetingText = `${greetingsMap.en[timeKey]}🙌, Hi, I’m Adyfas (Ferdi Iskandar)`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      {/* intro */}
      <section className="pt-8 pb-12">
          <ClientOnly
          fallback={
            <h1 className="text-3xl font-bold text-left sm:text-5xl mb-8 dark:text-white">
              {greetingText}
            </h1>
          }
        >
          <AnimatePresence mode="wait">
            {showBlurText ? (
              <motion.div
                key="blur-text"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <BlurText
                  direction="bottom"
                  className="text-3xl font-bold text-right sm:text-5xl mb-8 dark:text-white"
                  text={greetingText}
                />
              </motion.div>
            ) : (
              <motion.h1
                key="h1-greeting"
                initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.5 }}
                className="text-3xl font-bold text-left sm:text-5xl mb-8 dark:text-white"
                style={{ display: "block" }}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentGreetingIndex}
                    initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                    transition={{ duration: 0.5 }}
                    style={{ display: "inline-block" }}
                  >
                    {greetings[currentGreetingIndex]}
                  </motion.span>
                </AnimatePresence>{" "}
                🙌, Hi, I’m Adyfas (Ferdi Iskandar)
              </motion.h1>
            )}
          </AnimatePresence>


          <Reveal
            y={20}
            blur={10}
            duration={0.5}
            width="100%"
          >
            <p className="text-base sm:text-lg text-gray-600 dark:text-slate-300 leading-relaxed mt-4">
              Web developer & problem solver. I build web applications, automation systems, and APIs that streamline workflows. Full-stack capable, backend focused I deliver solutions that perform in production. 1st Runner-Up in national web competitions, shipping real projects for real clients.
            </p>
          </Reveal>

        </ClientOnly>
      </section>

      <Snapshot />
      <CareerSnapshot />
      <HighlightsAchievements />

      <CalltoActionContact />
    </div>
  );
}
