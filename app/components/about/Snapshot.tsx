import { Code2, Database, Zap, Puzzle } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import Reveal from "../Reveal";

const skillsData: { Icon: any; title: string; description: string }[] = [
  {
    Icon: Code2,
    title: "End-to-End Product Engineering",
    description:
      "Transforming product requirements into scalable, full-stack web applications using modern frameworks like React, Next.js, and Node.js.",
  },
  {
    Icon: Puzzle,
    title: "Product-Minded Problem Solving",
    description:
      "Bridging the gap between user needs and technical constraints. Focused on building intuitive features, optimizing performance, and delivering real value.",
  },
  {
    Icon: Database,
    title: "Backend Architecture & Automation",
    description:
      "Designing robust APIs, efficient database models, and workflow automations to reduce operational friction and streamline business operations.",
  },
  {
    Icon: Zap,
    title: "Continuous Delivery & Execution",
    description:
      "Shipping production-grade features quickly and iteratively—from client dashboards to e-commerce APIs—ensuring high reliability and user satisfaction.",
  },
];

const cardVariants: Variants = {
  offscreen: { opacity: 0, scale: 0.9, y: 30, filter: "blur(10px)" },
  onscreen: (custom: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      bounce: 0.2,
      duration: 0.8,
      delay: 0.1 * custom,
    },
  }),
};

export default function Snapshot() {
  return (
    <section className="py-16">
      <Reveal y={30} blur={10} duration={1} delay={1.4} width="100%">
        <h2 className="text-xl sm:text-2xl font-bold dark:text-white">
          What I Can Do
        </h2>
        <p className="mt-2 mb-10 text-sm sm:text-base text-gray-600 dark:text-slate-300 leading-relaxed max-w-2xl">
          Skills and expertise I bring to every project focused on solving real
          problems and delivering measurable results.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {skillsData.map(({ Icon, title, description }, idx) => (
          // <motion.div
          //   key={title}
          //   initial="offscreen"
          //   whileInView="onscreen"
          //   viewport={{ once: true, amount: 0.3 }}
          //   variants={cardVariants}
          //   custom={idx}
          //   className="group relative rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-5 shadow-sm dark:shadow-none transition-all duration-300 hover:border-gray-900 dark:hover:border-white/30 hover:shadow-md"
          // >
          <Reveal y={30} blur={10} duration={1} delay={1.4} width="100%">
            <div className="group relative rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-5 shadow-sm dark:shadow-none transition-all duration-300 hover:border-gray-900 dark:hover:border-white/30 hover:shadow-md h-[230px]">
              <Icon className="absolute bottom-4 right-4 h-7 w-7 text-gray-300 dark:text-slate-500/50 transition-colors duration-300 group-hover:text-gray-900 dark:group-hover:text-white" />
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white pr-10">
                {title}
              </h3>
              <p className="mt-3 text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
                {description}
              </p>
            </div>
          </Reveal>
          // </motion.div>
        ))}
      </div>
    </section>
  );
}
