import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import BlurText from "~/components/BlurText";
import type { Route } from "./+types/about";
import Image from "~/components/Image";
import AnimatedContent from "~/components/AnimatedContent";

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

export function meta({}: Route.MetaArgs) {
  return [
    {
      title: "Adyfas - About",
    },
    {
      name: "description",
      content:
        "Wellcome in my website adyfas and i'm a developer i'm have experience in web development",
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

  const greetingText = `${greetingsMap.en[timeKey]}🙌, I am Ferdi Iskandar or commonly known as Adyfas`;

  return (
    <>
      {/* intro */}
      <section>
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
                className="text-3xl font-bold text-right sm:text-5xl mb-8"
                text={greetingText}
              />
            </motion.div>
          ) : (
            <motion.h1
              key="h1-greeting"
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-left sm:text-5xl mb-8"
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
              🙌, I am Ferdi Iskandar or commonly known as Adyfas
            </motion.h1>
          )}
        </AnimatePresence>
      </section>

      {/* Cirebon */}
      <section>
        <div className="max-w-2xl grid place-content-center">
          {/* <Image
            alt="Cirebon"
            className="rounded-2xl h-65 w-[500px]"
            text="Cirebon, Indonesia"
            src="/images/about/cirebon.webp"
          /> */}
          <AnimatedContent
            distance={50}
            direction="vertical"
            reverse={false}
            duration={1.2}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            threshold={0.2}
            delay={0.3}
          >
            <div className="relative w-full rounded-2xl overflow-hidden shadow-md bg-gray-100 flex items-center justify-center">
              <Image
                alt="Cirebon"
                className="rounded-2xl h-65 w-full"
                src="/images/about/cirebon2.webp"
                text="Cirebon, Indonesia"
              />
            </div>
          </AnimatedContent>
        </div>
      </section>

      {/* Journey */}

      <section className="my-32">
        <AnimatedContent
          distance={50}
          direction="vertical"
          reverse={false}
          duration={1.2}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          threshold={0.2}
          delay={0.3}
        >
          <h2 className="text-xl font-bold">The Journey</h2>
          <p className="py-2">
            This is a glimpse into my journey—from early curiosity and
            experimentation to meaningful projects and competitive experiences.
            Each phase reflects growth, challenges, and a constant desire to
            learn and build better solutions.
          </p>
        </AnimatedContent>
      </section>

      <section>
        <AnimatedContent
          distance={50}
          direction="vertical"
          reverse={false}
          duration={1.2}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          threshold={0.2}
          delay={0.3}
        >
          <div className="flex items-start justify-start flex-col">
            <h2 className="text-xl font-bold">
              First Time Living on Earth Until Junior High School
            </h2>
            <span className="text-gray-300">2008 - 2023</span>
          </div>
          <p className="py-2">
            Hi, I'm Ferdi or people on the internet call me Adyfas, I live in
            Indonesia, more precisely in Cirebon City, since I was little I
            really like playing computers, especially playing games, the first
            game I played was the Angry Birds game, this is the first game I
            played since I was very little, around 8 years old, when I was
            around 10+ years old, my brother gave me a laptop and yes, I used it
            to play games again... this time the game is Minecraft, here the
            laptop is enough to play small games because the specifications are
            not adequate haha ​​this is my year of playing
          </p>
        </AnimatedContent>
      </section>

      <section className="my-32">
        <div className="flex items-start justify-start flex-col mb-5">
          <AnimatedContent
            distance={50}
            direction="vertical"
            reverse={false}
            duration={1.2}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            threshold={0.2}
            delay={0.3}
          >
            <h2 className="text-xl font-bold">Start Project And Skill Up</h2>
            <span className="text-gray-300">2024 - 2025</span>
          </AnimatedContent>
        </div>
        <div className="w-full flex flex-col sm:flex-row gap-6 items-stretch justify-center my-6">
          <AnimatedContent
            distance={50}
            direction="vertical"
            reverse={false}
            duration={1.2}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            threshold={0.2}
            delay={0.6}
          >
            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-full sm:w-[220px] aspect-4/5 rounded-2xl overflow-hidden shadow-md bg-gray-100 flex items-center justify-center">
                <Image
                  alt="1st RUNNER UP"
                  src="/images/about/first-win.jpeg"
                  className="object-cover w-full h-full"
                  text="2024"
                />
              </div>
            </div>
          </AnimatedContent>
          <AnimatedContent
            distance={50}
            direction="vertical"
            reverse={false}
            duration={1.2}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            threshold={0.2}
            delay={0.7}
          >
            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-full sm:w-[220px] aspect-4/5 rounded-2xl overflow-hidden shadow-md bg-gray-100 flex items-center justify-center">
                <Image
                  alt="Ferdidifest"
                  src="/images/ferdidifest1.webp"
                  className="object-cover w-full h-full"
                  text="2025"
                />
              </div>
            </div>
          </AnimatedContent>
          <AnimatedContent
            distance={50}
            direction="vertical"
            reverse={false}
            duration={1.2}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            threshold={0.2}
            delay={0.1}
          >
            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-full sm:w-[220px] aspect-4/5 rounded-2xl overflow-hidden shadow-md bg-gray-100 flex items-center justify-center">
                <Image
                  alt="2nd WIN"
                  src="/images/about/2nd-win.jpeg"
                  className="object-cover w-full h-full"
                  text="2025"
                />
              </div>
            </div>
          </AnimatedContent>
        </div>
        <AnimatedContent
          distance={50}
          direction="vertical"
          reverse={false}
          duration={1.2}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          threshold={0.2}
          delay={0.15}
        >
          <p className="py-2">
            In the year when I was around 15+ years old I had achieved several
            achievements in my school in the IT field, from there I learned a
            lot about how to design a website, coding to the technology, I was
            quite proud of myself to be able to get there from playing games to
            playing real games. from there I also received a big project from
            Koncomoto to make me a web application project to automate invoice
            creation and client management, from there I also received another
            project to create an ecommerce API
          </p>
        </AnimatedContent>
      </section>
      <section>
        <AnimatedContent
          distance={50}
          direction="vertical"
          reverse={false}
          duration={1.2}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          threshold={0.2}
          delay={0.3}
        >
          <div className="flex items-start justify-start flex-col mb-5">
            <h2 className="text-xl font-bold">Skill Up </h2>
            <span className="text-gray-300">2026</span>
          </div>
        </AnimatedContent>
        {/* Responsive masonry & better image framing */}
        <div className="w-full flex flex-col sm:flex-row gap-6 items-start justify-start my-6">
          <AnimatedContent
            distance={50}
            direction="vertical"
            reverse={false}
            duration={1.2}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            threshold={0.2}
            delay={0.3}
          >
            <div className="relative w-full sm:w-[220px] aspect-4/5 rounded-2xl overflow-hidden shadow-md bg-gray-100 flex items-start justify-start">
              <Image
                alt="Adyfas 2026"
                src="/images/CEO.png"
                className="object-cover w-full h-full"
              />
            </div>
          </AnimatedContent>
        </div>
        <AnimatedContent
        distance={50}
        direction="vertical"
        reverse={false}
        duration={1.2}
        ease="power3.out"
        initialOpacity={0}
        animateOpacity
        threshold={0.2}
        delay={0.7}
      >
        <p className="py-2">
          The game has just begun. This is where I continue refining my skills,
          learning from every challenge, and striving to become better than I
          was before. Many may have tried and failed, but I choose to believe in
          progress, consistency, and growth. This is my journey—and if you’ve
          read this far, it’s a pleasure to meet you.
        </p>
        </AnimatedContent>
      </section>
    </>
  );
}
