import { Link } from "react-router";
import { ProjectList } from "~/data/DataProject";
import Reveal from "../Reveal";

export default function FeatureProject() {
  return (
    <>
      <Reveal
        y={20}
        blur={10}
        duration={0.8}
        width="100%"
      >
        <h2 className="text-xl sm:text-2xl font-bold dark:text-white">Featured Projects</h2>
      </Reveal>

      {(() => {
        const featured = [...ProjectList]
          .sort((a, b) => (b.tech?.length || 0) - (a.tech?.length || 0))
          .slice(0, 2);
        return (
          <>
            <div className="my-4 grid gap-6 grid-cols-1 w-full max-w-4xl">
              {featured.map((project, idx) => (
                <Reveal
                  y={30}
                  blur={15}
                  duration={1}
                  delay={0.1 * idx}
                  key={idx}
                  width="100%"
                >
                  <div className="transition-shadow duration-300 hover:shadow-xl bg-white/80 dark:bg-white/5 backdrop-blur-lg rounded-2xl shadow-md dark:shadow-none border border-gray-100 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 cursor-pointer flex flex-col sm:flex-row p-4 sm:p-6 gap-6">
                    <div className="w-full sm:w-32 h-40 sm:h-32 rounded-xl overflow-hidden shrink-0 border border-gray-200 dark:border-white/10 shadow-lg dark:shadow-none flex items-center justify-center bg-gray-50 dark:bg-white/5">
                      <img
                        src={project.img}
                        alt={project.title}
                        className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <div className="flex-1 flex flex-col items-start justify-between">
                      <div>
                        <h2 className="font-bold text-lg sm:text-2xl text-gray-900 dark:text-white mb-1 tracking-tight">
                          {project.title}
                        </h2>
                        <span className="inline-block bg-gray-900/80 dark:bg-white/80 text-white dark:text-black text-xs px-2 py-0.5 rounded mb-2">
                          {project.role}
                        </span>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-slate-300 mt-1 line-clamp-3">
                          {project.desc}
                        </p>
                        {project.tech && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {project.tech.slice(0, 6).map((tech, i) => (
                              <span
                                key={i}
                                className="bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-xs text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-white/10"
                              >
                                {tech}
                              </span>
                            ))}
                            {project.tech.length > 6 && (
                              <span className="bg-gray-200 dark:bg-zinc-700 px-2 py-0.5 rounded text-xs text-gray-600 dark:text-slate-400 border border-gray-300 dark:border-white/20">
                                ...
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-4 flex-wrap mt-4">
                        <span className="text-xs text-gray-500">
                          {project.date && (
                            <>
                              <span className="inline-block mr-2">
                                <i className="lucide lucide-calendar" />
                              </span>
                              {project.date.replace(/,?$/, "")}
                            </>
                          )}
                        </span>
                        {project.projectLink && (
                          <Link
                            className="hover:underline text-blue-700 dark:text-blue-400 font-medium text-xs"
                            to={project.projectLink}
                          >
                            View Project
                          </Link>
                        )}
                        {project.git && (
                          <a
                            className="hover:underline text-gray-800 dark:text-slate-300 font-medium text-xs"
                            href={project.git}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Github Project
                          </a>
                        )}
                        {project.link && (
                          <a
                            className="hover:underline text-green-700 dark:text-green-400 font-medium text-xs"
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="flex justify-center w-full mt-2">
              <Link to="/project">
                <button className="bg-gray-900 dark:bg-white p-2 text-white dark:text-black font-bold rounded-xl px-5 cursor-pointer hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-500 text-lg sm:text-xl hover:scale-101">
                  More Projects
                </button>
              </Link>
            </div>
          </>
        );
      })()}
    </>
  );
}