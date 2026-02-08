import { Careers } from "~/data/Career";
import AnimatedContent from "../AnimatedContent";

const titleDelay = 0;
const itemDelay = 0.12;

export default function CareerSnapshot() {
  return (
    <section className="py-16">
      <AnimatedContent
        distance={50}
        direction="vertical"
        reverse={false}
        duration={1.2}
        ease="power3.out"
        initialOpacity={0}
        animateOpacity
        threshold={0.2}
        delay={titleDelay}
      >
        <h2 className="text-xl sm:text-2xl font-bold">Career Snapshot</h2>
        <p className="mt-2 mb-10 text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl">
          Skill progression and milestones—from first code to shipping production systems.
        </p>
      </AnimatedContent>

      <div className="relative">
        <div className="absolute left-[11px] sm:left-[15px] top-2 bottom-2 w-px bg-gray-200" />

        <div className="space-y-4">
          {Careers.map((item, index) => (
            <AnimatedContent
              key={item.year}
              distance={40}
              direction="vertical"
              reverse={false}
              duration={1}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
              threshold={0.2}
              delay={itemDelay * (index + 1)}
            >
              <div className="relative flex gap-4 sm:gap-6 pl-8 sm:pl-10">
                <div className="absolute left-0 top-1.5 h-6 w-6 rounded-full border-2 border-gray-900 bg-white shrink-0 ring-4 ring-white" />
                <div className="flex-1 min-w-0 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-sm font-semibold text-gray-500 tabular-nums">
                      {item.year}
                    </span>
                    <span className="text-gray-400">—</span>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900">
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm sm:text-base leading-relaxed text-gray-600">
                    {item.description}
                  </p>
                </div>
              </div>
            </AnimatedContent>
          ))}
        </div>
      </div>
    </section>
  );
}
