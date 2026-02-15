import { ProjectList } from "~/data/DataProject";
import type { Route } from "../+types/root";
import ScrollReveal from "~/components/ScrollReveal";
import { Link } from "react-router";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Adyfas - Project" },
    {
      name: "description",
      content:
        "Wellcome in my website adyfas and i'm a developer i'm have experience in web development",
    },
  ];
}

export default function ProjectPage() {
  return (
    <>
      <section>
        <h1 className="text-xl sm:text-2xl font-bold text-start my-2">
          Project
        </h1>
        <p>
          Below are a selection of projects that showcase my process,
          creativity, and work. These projects have been concisely selected to
          keep the portfolio focused and easy to understand.
        </p>

        {(() => {
          const filter = [...ProjectList].sort(
            (a, b) => (b.tech?.length ?? 0) - (a.tech?.length ?? 0)
          );
          return (
            <>
              <div className="my-4 grid gap-6 grid-cols-1 w-full max-w-4xl">
                {filter.map((project, idx) => (
                  <ScrollReveal
                    animation="fadeUp"
                    delay={0.1 * idx}
                    key={idx}
                  >
                    <Link to={project.projectLink}>
                      <div className="transition-shadow duration-300 hover:shadow-xl bg-white/80 backdrop-blur-lg rounded-2xl shadow-md border border-gray-100 hover:border-gray-300 cursor-pointer flex flex-col sm:flex-row p-4 sm:p-6 gap-6">
                        <div className="w-full sm:w-32 h-40 sm:h-32 rounded-xl overflow-hidden shrink-0 border border-gray-200 shadow-lg flex items-center justify-center bg-gray-50">
                          <img
                            src={project.img}
                            alt={project.title}
                            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                        <div className="flex-1 flex flex-col items-start justify-between">
                          <div>
                            <h2 className="font-bold text-lg sm:text-2xl text-gray-900 mb-1 tracking-tight">
                              {project.title}
                            </h2>
                            <span className="inline-block bg-gray-900/80 text-white text-xs px-2 py-0.5 rounded mb-2">
                              {project.role}
                            </span>
                            <p className="text-sm sm:text-base text-gray-600 mt-1 line-clamp-3">
                              {project.desc}
                            </p>
                            {project.tech && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {project.tech.map((item, idx) => {
                                  return (
                                    <span
                                      key={idx}
                                      className="bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-700 border border-gray-200"
                                    >
                                      {item}
                                    </span>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-4 flex-wrap mt-4">
                            <span className="text-xs text-gray-500">
                              {project.date && (
                                <span>
                                  <span className="inline-block mr-2">
                                    <i className="lucide lucide-calendar" />
                                  </span>
                                  {project.date.replace(/,?$/, "")}
                                </span>
                              )}
                            </span>
                            {project.projectLink && (
                              <Link
                                className="hover:underline text-blue-700 font-medium text-xs"
                                to={project.projectLink}
                              >
                                View Project
                              </Link>
                            )}
                            {project.git && (
                              <a
                                className="hover:underline text-gray-800 font-medium text-xs"
                                href={project.git}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Github Project
                              </a>
                            )}
                            {project.link && (
                              <a
                                className="hover:underline text-green-700 font-medium text-xs"
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
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            </>
          );
        })()}
      </section>
    </>
  );
}
