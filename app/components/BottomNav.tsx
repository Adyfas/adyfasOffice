import { dataIconSidebar } from "~/data/SidebarData";
import * as icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router";

export function BottomNav() {
  const route = useLocation();

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 md:hidden">
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        className="flex gap-2 rounded-2xl bg-white/70 dark:bg-[#0a0a0a]/70 px-3 py-2 shadow-xl dark:shadow-none backdrop-blur-xl border border-transparent dark:border-white/10"
      >
        {dataIconSidebar.map((item, idx) => {
          const Icon = icons[item.icon as keyof typeof icons] as LucideIcon;
          if (!Icon) return null;

          const isActive = route.pathname === item.route;

          return (
            <Link key={idx} to={item.route}>
              <motion.div
                whileHover="hover"
                className={`
                  relative flex h-11 w-11 items-center justify-center
                  rounded-xl group text-black dark:text-slate-300 dark:hover:text-white
                  ${isActive ? "bg-black/10 dark:bg-white/10 dark:text-white" : "hover:bg-black/10 dark:hover:bg-white/10"}
                `}
              >
                <Icon size={22} />

                <span
                  className="
                    pointer-events-none
                    absolute
                    hidden
                    -top-8
                    rounded-xl px-2 py-1
                    text-xs text-white dark:text-slate-900
                    whitespace-nowrap
                    group-hover:block
                    bg-gray-900 dark:bg-white
                    transition-all
                    duration-700
                  "
                >
                  {item.name}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </motion.div>
    </div>
  );
}
