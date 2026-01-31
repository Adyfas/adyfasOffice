import { Link } from "react-router";
import type { Route } from "./+types/home";
import { iDoSomething } from "~/data/Ido";
import * as icons from "lucide-react";
import { ProjectList } from "~/data/DataProject";
import { TechStack } from "~/data/TechStack";
import { timelineData } from "~/data/Timeline";
import AnimatedContent from "~/components/AnimatedContent";

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
    <>
      <AnimatedContent
        distance={50}
        direction="vertical"
        reverse={false}
        duration={1.2}
        ease="power3.out"
        initialOpacity={0}
        animateOpacity
        threshold={0.2}
        delay={0.3}
      >
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
          An IT enthusiast who enjoys building websites, automation systems, and
          solving real-world problems through technology. I focus on developing
          practical digital solutions — from responsive websites to simple
          automation systems — with clean code and clear logic.
        </p>
        <Link to="/contact">
          <button className="bg-gray-900 p-2 text-white font-bold rounded-xl px-5 cursor-pointer hover:bg-gray-800 transition-all duration-500 text-lg sm:text-xl hover:scale-101">
            Contact
          </button>
        </Link>
      </AnimatedContent>

      <div className="my-10 flex flex-col items-start justify-start gap-5">
        <AnimatedContent
          distance={50}
          direction="vertical"
          reverse={false}
          duration={0.5}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          threshold={0.2}
          delay={0}
        >
          <h2 className="text-xl sm:text-2xl font-bold">What I Can Do?</h2>
        </AnimatedContent>
        {iDoSomething?.map((item, idx) => {
          const Icon = icons[
            item.icon as keyof typeof icons
          ] as icons.LucideIcon;
          if (!Icon) return null;
          return (
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
              <div className="flex items-center justify-center gap-5 py-2">
                <Icon size={34} />
                <div className="flex items-start flex-col">
                  <span className="font-bold text-md sm:text-xl ">
                    {item.title}
                  </span>
                  <span>{item.desc}</span>
                </div>
              </div>
            </AnimatedContent>
          );
        })}
      </div>

      <div className="my-10 flex flex-col items-start justify-start">
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
                    <div
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

        <div className="my-10 flex flex-col items-start justify-start">
          <AnimatedContent
            distance={30}
            direction="vertical"
            reverse={false}
            duration={0.5}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            threshold={0.2}
            delay={0.2}
          >
            <h2 className="font-bold text-xl sm:text-2xl">Tech Stack</h2>
          </AnimatedContent>
          <div className="my-2 grid grid-cols-3 sm:grid-cols-5 justify-start gap-2">
            {TechStack.map((item, idx) => (
              <AnimatedContent
                distance={50}
                direction="vertical"
                reverse={false}
                duration={1.5}
                ease="power3.out"
                initialOpacity={0}
                animateOpacity
                threshold={0.2}
                delay={0.05 * idx}
                key={idx}
              >
                <div
                  className="flex items-center gap-2 bg-white bg-opacity-80 rounded-lg shadow-sm border border-gray-200 px-2 py-1"
                  style={{ fontSize: "0.85rem", minHeight: "32px" }}
                >
                  <span
                    className="text-lg"
                    style={{
                      width: 42,
                      height: 42,
                      display: "flex",
                      alignItems: "center",
                    }}
                    dangerouslySetInnerHTML={{ __html: item.logo }}
                  />
                  <span className="text-xs font-medium text-gray-700">
                    {item.name}
                  </span>
                </div>
              </AnimatedContent>
            ))}
          </div>
        </div>

        <section className="my-10 max-w-3xl">
          <div className="mb-8">
            <AnimatedContent
              distance={150}
              direction="vertical"
              reverse={false}
              duration={0.5}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
              threshold={0.2}
              delay={0}
            >
              <h2 className="text-xl sm:text-2xl font-bold">
                Experience & Learning
              </h2>
            </AnimatedContent>
            {/* <p className="mt-1 text-sm text-gray-600">
                    A brief timeline of my journey in web development and system
                    building.
                  </p> */}
          </div>

          <div className="relative pl-4">
            <div className="absolute left-[6px] top-0 h-full w-px bg-gray-200" />

            <div className="space-y-8">
              {timelineData.map((item, index) => (
                <div key={index} className="relative flex gap-x-6">
                  <div
                    className={`mt-1 h-3 w-6 relative sm:right-4 right-3.5 bottom-1 rounded-full border-2 border-gray-900 bg-white`}
                  />

                  <AnimatedContent
                    distance={50}
                    direction="vertical"
                    reverse={false}
                    duration={1.5}
                    ease="power3.out"
                    initialOpacity={0}
                    animateOpacity
                    threshold={0.2}
                    delay={0.2 * index}
                  >
                    <div
                      className={`w-full rounded-xl border p-4 transition border-gray-200 bg-white shadow-sm`}
                    >
                      <p className="text-xs font-medium uppercase text-gray-500">
                        {item.date}
                      </p>
                      <h3 className="mt-1 text-sm font-semibold text-gray-900">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="mt-2 text-sm leading-relaxed text-gray-600">
                          {item.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2">
                        {item.project?.map((project, idx) => {
                          return (
                            <Link
                              key={idx}
                              className="text-blue-500 text-xs hover:underline py-1"
                              to={project.link}
                            >
                              {project.name}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </AnimatedContent>
                </div>
              ))}
            </div>
          </div>
        </section>

        <AnimatedContent
          distance={50}
          direction="vertical"
          reverse={false}
          duration={1.5}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          threshold={0.2}
          delay={0.2}
        >
          <section className="mt-32 rounded-2xl bg-white px-8 py-10">
            <h3 className="text-xl sm:text-2xl font-bold">
              Monthly Learning Notes
            </h3>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">
              I share what I learn each month about web development, design, and
              building real-world projects. No spam — just practical insights.
            </p>

            <form className="mt-6 flex max-w-2xl gap-3">
              <input
                type="email"
                placeholder="contact.adyfas@gmail.com"
                className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-full bg-gray-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Subscribe
              </button>
            </form>
          </section>
        </AnimatedContent>
      </div>
    </>
  );
}
