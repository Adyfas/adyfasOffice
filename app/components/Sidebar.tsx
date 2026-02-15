import { dataIconSidebar } from "~/data/SidebarData";
import * as icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router";
import { premiumEase } from "~/lib/framer-utils";

export default function Sidebar() {
  const route = useLocation();

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 80,
        damping: 18,
        mass: 0.8,
        duration: 0.8
      }}
      className="fixed left-4 top-1/2 -translate-y-1/2 z-50 hidden md:block"
    >
      <motion.div
        initial={{ width: 56 }}
        whileHover={{ width: 180 }}
        transition={{ duration: 0.5, ease: premiumEase }}
        className="
          flex flex-col gap-2
          bg-white/60 backdrop-blur-xl
          rounded-3xl p-2
          shadow-xl
          overflow-hidden
          group
        "
      >
        {dataIconSidebar?.map((item, idx) => {
          const Icon = icons[item.icon as keyof typeof icons] as LucideIcon;
          if (!Icon) return null;

          const isActive = route.pathname === item.route;

          return (
            <Link to={item.route} key={idx}>
              <motion.div
                className={`
                flex items-center gap-3
                px-2 py-2
                rounded-xl
                cursor-pointer
                hover:bg-black/10
              ${isActive ? "bg-black/10" : ""}
              `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Icon size={24} className="min-w-6" />

                <motion.span
                  initial={{ opacity: 0, x: -5 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    transition: { duration: 0.3, delay: 0.1 }
                  }}
                  className="whitespace-nowrap text-sm font-medium hidden group-hover:block"
                >
                  {item.name}
                </motion.span>
              </motion.div>
            </Link>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
