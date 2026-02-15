import { Code2, Database, Zap, Puzzle } from "lucide-react";
import { fadeUp } from "~/lib/framer-utils";
import ScrollReveal from "../ScrollReveal";

const skillsData = [
  {
    Icon: Code2,
    title: "Full-Stack Web Development",
    description:
      "Build responsive web apps from frontend to backend. React, Node.js, REST APIs—solutions that scale and perform.",
  },
  {
    Icon: Puzzle,
    title: "Problem Solving",
    description:
      "Break down complex requirements into clear solutions. Debug, optimize, and deliver systems that actually work.",
  },
  {
    Icon: Database,
    title: "Backend & Automation",
    description:
      "Design APIs, automate workflows, and streamline business processes. Less manual work, more efficiency.",
  },
  {
    Icon: Zap,
    title: "Real-World Delivery",
    description:
      "Ship production-ready apps: dashboards, e-commerce APIs, management tools—used by real clients every day.",
  },
];

export default function Snapshot() {
  return (
    <section className="py-16">
      <ScrollReveal animation="fadeUp">
        <h2 className="text-xl sm:text-2xl font-bold">What I Can Do</h2>
        <p className="mt-2 mb-10 text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl">
          Skills and expertise I bring to every project—focused on solving real problems and delivering measurable results.
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {skillsData.map(({ Icon, title, description }, idx) => (
          <ScrollReveal
            key={title}
            animation="fadeUp"
            delay={0.1 * idx}
            className="group relative rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-gray-900 hover:shadow-md"
          >
            <Icon className="absolute bottom-4 right-4 h-7 w-7 text-gray-300 transition-colors duration-300 group-hover:text-gray-900" />
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 pr-10">
              {title}
            </h3>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              {description}
            </p>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
