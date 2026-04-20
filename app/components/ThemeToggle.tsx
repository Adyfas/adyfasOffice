import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="fixed top-4 right-4 md:top-6 md:right-6 z-[9999] w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />;
  }

  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 md:top-6 md:right-6 z-[9999] p-3 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 group flex items-center justify-center overflow-hidden"
      aria-label="Toggle Theme"
    >
      <div className="relative flex items-center justify-center w-5 h-5 text-slate-700 dark:text-slate-300">
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Moon className="w-full h-full text-indigo-400 group-hover:text-indigo-300 transition-colors" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ rotate: 90, scale: 0.5, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -90, scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Sun className="w-full h-full text-amber-500 group-hover:text-amber-600 transition-colors" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </button>
  );
};
