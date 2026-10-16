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
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from "~/lib/site";
import MyJourney from "~/components/about/MyJourney";

// Helper: dapatkan ucapan berdasarkan jam
const getGreetingByHour = (
  hour: number,
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
    afternoon: "Selamat siang",
    evening: "Selamat sore",
    night: "Selamat malam",
  },
  jv: {
    morning: "Sugeng enjing",
    afternoon: "Sugeng siang",
    evening: "Sugeng sonten",
    night: "Sugeng dalu",
  },
  su: {
    morning: "Wilujeng énjing",
    afternoon: "Wilujeng siang",
    evening: "Wilujeng sonten",
    night: "Wilujeng wengi",
  },
  en: {
    morning: "Good morning",
    afternoon: "Good afternoon",
    evening: "Good evening",
    night: "Good evening",
  },
  de: {
    morning: "Guten Morgen",
    afternoon: "Guten Tag",
    evening: "Guten Abend",
    night: "Guten Abend",
  },
  ja: {
    morning: "おはようございます",
    afternoon: "こんにちは",
    evening: "こんばんは",
    night: "こんばんは",
  },
};

export function meta({}: Route.MetaArgs) {
  const title =
    "About Ferdi Iskandar (Adyfas) | Full Stack Developer & Problem Solver";
  const description =
    "Adyfas (Ferdi Iskandar) — Web developer & problem solver. Full-stack, backend-focused. Builds web apps, automation systems, REST APIs. 1st Runner-Up national web competitions. Shipping real projects.";
  const url = `${SITE_URL}/about`;

  return [
    { title },
    { name: "description", content: description },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: DEFAULT_OG_IMAGE },
    { property: "og:url", content: url },
    { property: "og:type", content: "profile" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: DEFAULT_OG_IMAGE },
    { tagName: "link", rel: "canonical", href: url },
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

  const greetingText = `${greetingsMap.en[timeKey]}🙌, Hi, I'm Ferdi Iskandar also known as Adyfas.`;

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

          <Reveal y={20} blur={10} duration={0.5} delay={1.4} width="100%">
            <h2 className="font-bold text-gray-900 dark:text-white text-xl sm:text-2xl">
              A Little About Me
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-slate-300 leading-relaxed mt-4">
              I'm a full-stack developer with an interest in building web
              applications, digital products, and software systems. My journey
              began with curiosity about games and technology, which gradually
              led me to explore how software works and how I could create things
              of my own. Over time, that curiosity grew into a deeper interest
              in web development, problem-solving, and product engineering.
              Today, I'm continuing to explore how thoughtful design, reliable
              systems, and emerging technologies can come together to create
              useful digital experiences.
            </p>
          </Reveal>
        </ClientOnly>
      </section>

      {/* <section className="pb-4">
        <p className="text-sm text-gray-500 dark:text-slate-400">
          Adyfas adalah nama internet dari Ferdi Iskandar.
        </p>
      </section> */}

      {/* <Snapshot />
      <CareerSnapshot /> */}
      <MyJourney />
      <HighlightsAchievements />

      <CalltoActionContact />
    </div>
  );
}
