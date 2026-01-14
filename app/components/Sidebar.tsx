"use client"

import { dataIconSidebar } from "~/data/Sidebar-data"
import * as icons from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { motion } from "framer-motion"
import { Link, useLocation } from "react-router"

export default function Sidebar() {

  const route = useLocation()

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50">
      <motion.div
        initial={{ width: 56 }}
        whileHover={{ width: 180 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
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
          const Icon = icons[item.icon as keyof typeof icons] as LucideIcon
          if (!Icon) return null

          const activeRoute = route.pathname === item.route ? 'bg-black/10' : ''

          return (
            <Link to={item.route} key={idx}>
              <motion.div
                className={`
                flex items-center gap-3
                px-2 py-2
                rounded-xl
                cursor-pointer
                hover:bg-black/10
              ${activeRoute}
              `}
                whileHover={{ scale: 1.05 }}
              >

                <Icon size={24} className="min-w-6" />


                <motion.span
                  initial={{ opacity: 1, x: -10 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="whitespace-nowrap text-sm font-medium hidden group-hover:block"
                >
                  {item.name}
                </motion.span>
              </motion.div>
            </Link>
          )
        })}
      </motion.div>
    </div>
  )
}
