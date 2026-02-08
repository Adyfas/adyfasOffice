import { Link } from "react-router";
import { ProjectList } from "~/data/DataProject";
import AnimatedContent from "../AnimatedContent";

export default function(){
    return (
        <>
         <AnimatedContent
          distance={50}
          direction="vertical"
          reverse={false}
          duration={0.5}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          threshold={0.2}
          delay={0.2}
        >
          <h2 className="text-xl sm:text-2xl font-bold">Featured Projects</h2>
        </AnimatedContent>
        {/* <p className="text-md">
                Here are some projects that showcase my work and creativity.
                While there are many more, I've chosen a few to keep this
                portfolio concise and focused.
              </p> */}
        {(() => {
          const featured = [...ProjectList]
            .sort((a, b) => (b.tech?.length || 0) - (a.tech?.length || 0))
            .slice(0, 2);
          return (
            <>
              <div className="my-4 grid gap-6 grid-cols-1 w-full max-w-4xl">
                {featured.map((project, idx) => (
                  <AnimatedContent
                    distance={50}
                    direction="vertical"
                    reverse={false}
                    duration={1.5}
                    ease="power3.out"
                    initialOpacity={0}
                    animateOpacity
                    threshold={0.2}
                    delay={0.2 * idx}
                    key={idx}
                  >
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
                              {project.tech.slice(0, 6).map((tech, i) => (
                                <span
                                  key={i}
                                  className="bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-700 border border-gray-200"
                                >
                                  {tech}
                                </span>
                              ))}
                              {project.tech.length > 6 && (
                                <span className="bg-gray-200 px-2 py-0.5 rounded text-xs text-gray-600 border border-gray-300">
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
                  </AnimatedContent>
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
        </>
    )
}