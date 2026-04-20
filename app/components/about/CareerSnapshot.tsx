import { Careers } from "~/data/Career";
import Reveal from "../Reveal";

const titleDelay = 0;
const itemDelay = 0.12;

export default function CareerSnapshot() {
  return (
    <section className="py-16">
      <Reveal
        y={30}
        blur={12}
        duration={1}
        delay={titleDelay}
        width="100%"
      >
        <h2 className="text-xl sm:text-2xl font-bold dark:text-white">Career Highlights </h2>
        <p className="mt-2 mb-10 text-sm sm:text-base text-gray-600 dark:text-slate-300 leading-relaxed max-w-2xl">
          Skill progression and milestones—from first code to shipping production systems.
        </p>
      </Reveal>

      <div className="relative">
        <div className="absolute left-[11px] sm:left-[15px] top-2 bottom-2 w-px bg-gray-200 dark:bg-white/10" />

        <div className="space-y-4">
          {Careers.map((item, index) => (
            <Reveal
              key={item.year}
              y={20}
              blur={8}
              duration={0.8}
              delay={itemDelay * (index + 1)}
              width="100%"
            >
              <div className="relative flex gap-4 sm:gap-6 pl-8 sm:pl-10">
                <div className="absolute left-0 top-1.5 h-6 w-6 rounded-full border-2 border-gray-900 dark:border-slate-400 bg-white dark:bg-[#0a0a0a] shrink-0 ring-4 ring-white dark:ring-[#0a0a0a]" />
                <div className="flex-1 min-w-0 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-4 shadow-sm transition-shadow hover:shadow-md dark:shadow-none hover:border-gray-300 dark:hover:border-white/20">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-sm font-semibold text-gray-500 tabular-nums">
                      {item.year}
                    </span>
                    <span className="text-gray-400">—</span>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm sm:text-base leading-relaxed text-gray-600 dark:text-slate-300">
                    {item.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

    </section>
  );
}
