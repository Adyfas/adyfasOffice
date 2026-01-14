import { Link } from "react-router";
import type { Route } from "./+types/home";
import { iDoSomething } from "~/data/Ido";
import * as icons from "lucide-react";
import { ProjectList } from "~/data/DataProject";
import { TechStack } from "~/data/TechStack";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Adyfas" },
    {
      name: "description",
      content:
        "Wellcome in my website adyfas and i'm a developer i'm have experience in web development",
    },
  ];
}

export default function Home() {
  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-start justify-start py-12 sm:py-24">
          <div className="w-full sm:w-full">
            <div className="w-36 h-36 sm:w-32 sm:h-32 my-2">
              <img
                src="/images/CEO.png"
                alt="adyfas"
                className="rounded-full w-full h-full object-cover"
                sizes="62px"
              />
            </div>
            <h1 className="font-bold text-xl sm:text-2xl text-start">
              Hey, Adyfas Here!
            </h1>
            <p>Nice to meet you</p>
            <p className="py-5 text-sm sm:text-base">
            An IT enthusiast who enjoys building websites, automation systems, and solving real-world problems through technology.
            I focus on developing practical digital solutions — from responsive websites to simple automation systems — with clean code and clear logic.

            </p>
            <Link to="/contact">
              <button className="bg-gray-900 p-2 text-white font-bold rounded-xl px-5 cursor-pointer hover:bg-gray-800 transition-all duration-500 text-lg sm:text-xl hover:scale-101">
                Contact
              </button>
            </Link>

            <div className="my-10 flex flex-col items-start justify-start gap-5">
              <h1 className="text-2xl font-bold">What I Can Do?</h1>
              {iDoSomething?.map((item, idx) => {
                const Icon = icons[
                  item.icon as keyof typeof icons
                ] as icons.LucideIcon;
                if (!Icon) return null;
                return (
                  <div className="flex items-center justify-center gap-5 py-2">
                    <Icon size={34} />
                    <div className="flex items-start flex-col">
                      <span className="font-bold text-md sm:text-xl ">
                        {item.title}
                      </span>
                      <span>{item.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="my-10 flex flex-col items-start justify-start">
              <h1 className="text-xl sm:text-2xl font-bold">
                Featured Projects
              </h1>
              {/* <p className="text-md">
                Here are some projects that showcase my work and creativity.
                While there are many more, I've chosen a few to keep this
                portfolio concise and focused.
              </p> */}

              {(() => {
                const featured = [...ProjectList]
                  .sort((a, b) => (b.tech?.length || 0) - (a.tech?.length || 0))
                  .slice(0, 3);
                return (
                  <>
                    <div className="my-4 grid gap-6 grid-cols-1 w-full max-w-4xl">
                      {featured.map((project, idx) => (
                        <div
                          key={idx}
                          className="transition-shadow duration-300 hover:shadow-xl bg-white/80 backdrop-blur-lg rounded-2xl shadow-md border border-gray-100 hover:border-gray-300 cursor-pointer flex flex-col sm:flex-row p-4 sm:p-6 gap-6"
                        >
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
                                  {project.tech.map((tech, i) => (
                                    <span
                                      key={i}
                                      className="bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-700 border border-gray-200"
                                    >
                                      {tech}
                                    </span>
                                  ))}
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
                      ))}
                    </div>
                    <div className="flex justify-center w-full mt-2">
                      <Link to="/project">
                        <button className="bg-gray-900 p-2 text-white font-bold rounded-xl px-5 cursor-pointer hover:bg-gray-800 transition-all duration-500 text-lg sm:text-xl hover:scale-101">
                          More Projects
                        </button>
                      </Link>
                    </div>
                  </>
                );
              })()}

              <div className="my-10 flex flex-col items-start justify-start">
                <h1 className="font-bold text-xl sm:text-2xl">Tech Stack</h1>
                <div className="my-2 grid grid-cols-5 justify-start gap-2">
                  {TechStack.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-white bg-opacity-80 rounded-lg shadow-sm border border-gray-200 px-2 py-1"
                      style={{ fontSize: "0.85rem", minHeight: "32px" }}
                    >
                      <span
                        className="text-lg"
                        style={{ width: 42, height: 42, display: "flex", alignItems: "center" }}
                        dangerouslySetInnerHTML={{ __html: item.logo }}
                      />
                      <span className="text-xs font-medium text-gray-700">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
