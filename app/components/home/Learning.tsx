import { Link } from "react-router";
import Reveal from "../Reveal";
import { timelineData } from "~/data/Timeline";

export default function Learning() {
  return (
    <>
      <div className="mb-8">
        <Reveal
          y={20}
          blur={10}
          duration={0.8}
          width="100%"
        >
          <h2 className="text-xl sm:text-2xl font-bold dark:text-white">
            Experience & Learning
          </h2>
        </Reveal>
      </div>

      <div className="relative pl-8">
        <div className="absolute left-[15px] top-0 h-full w-0.5 bg-gray-100 dark:bg-white/10" />

        <div className="space-y-10">
          {timelineData.map((item, index) => (
            <div key={index} className="relative flex gap-x-6">
              <div className="absolute -left-[25px] -top-3 mt-1.5 h-4 w-4 flex items-center justify-center z-10">
                <div className="h-4 w-4 rounded-full border-2 border-gray-900 dark:border-slate-400 bg-white dark:bg-[#0a0a0a]" />
                <div className="absolute h-1.5 w-1.5 rounded-full bg-gray-900 dark:bg-slate-300" />
              </div>


              <div className="flex-1">
                <Reveal
                  y={20}
                  blur={8}
                  duration={0.8}
                  delay={0.1 * index}
                  width="100%"
                >
                  <div
                    className={`w-full rounded-xl border p-5 transition border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 shadow-sm dark:shadow-none hover:shadow-md hover:border-gray-300 dark:hover:border-white/20 duration-300`}
                  >
                    <p className="text-xs font-bold uppercase text-gray-400 tracking-wider">
                      {item.date}
                    </p>
                    <h3 className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-slate-300">
                        {item.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 flex-wrap mt-3">
                      {item.project?.map((project, idx) => {
                        return (
                          <Link
                            key={idx}
                            className="bg-gray-50 dark:bg-white/10 text-gray-700 dark:text-slate-300 text-[10px] font-semibold hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors duration-200 px-2 py-1 rounded-md border border-gray-200 dark:border-white/10"
                            to={project.link}
                          >
                            {project.name}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          ))}
        </div>
      </div>


    </>
  );
}
