import { useEffect, useState } from "react";
import { ProjectList } from "~/data/DataProject";
import type { Route } from "../+types/root";
import Reveal from "~/components/Reveal";
import { Link } from "react-router";
import CalltoActionContact from "~/components/CalltoActionContact";
import { getProjectPosts, type HashnodePost } from "~/lib/hashnode";

export function meta({ }: Route.MetaArgs) {
  const title = "Adyfas Projects | Full Stack Web Portfolios";
  const description = "Explore a selection of my latest web development projects, including React apps, automation systems, and REST APIs.";
  const url = "https://adyfas-page.web.app/project";

  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
}

export default function ProjectPage() {
  const [hashnodeProjects, setHashnodeProjects] = useState<HashnodePost[]>([]);
  useEffect(() => {
    getProjectPosts().then((data) => {
      setHashnodeProjects(data);
    });
  }, []);

  const filter = [...ProjectList].sort(
    (a, b) => (b.tech?.length ?? 0) - (a.tech?.length ?? 0)
  );

  return (
    <>
      <section>
        <Reveal
          y={20}
          blur={10}
          duration={0.8}
          width="100%"
        >
          <h1 className="text-xl sm:text-2xl font-bold text-start my-2 dark:text-white">
            Project
          </h1>
          <p className="dark:text-slate-300">
            Below are a selection of projects that showcase my process,
            creativity, and work. These projects have been concisely selected to
            keep the portfolio focused and easy to understand.
          </p>
        </Reveal>

        <div className="my-4 grid gap-6 grid-cols-1 w-full max-w-4xl">
          {/* Hashnode Blog Projects */}
          {hashnodeProjects.map((post, idx) => {
            const dateStr = post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "";
            const techTags = post.categories.filter(
              (c) => c !== "project" && c !== "blog-project"
            );

            return (
              <Reveal
                y={30}
                blur={15}
                duration={1}
                delay={0.1 * idx}
                key={`hashnode-${post.id}`}
                width="100%"
              >
              <Link to={`/project/${post.slug}`}>
                <div className="transition-shadow duration-300 hover:shadow-xl bg-white/80 dark:bg-white/5 backdrop-blur-lg rounded-2xl shadow-md dark:shadow-none border border-gray-100 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 cursor-pointer flex flex-col sm:flex-row p-4 sm:p-6 gap-6">
                  {post.coverImage?.url && (
                    <div className="w-full sm:w-32 h-40 sm:h-32 rounded-xl overflow-hidden shrink-0 border border-gray-200 dark:border-white/10 shadow-lg dark:shadow-none flex items-center justify-center bg-gray-50 dark:bg-white/5">
                      <img
                        src={post.coverImage.url}
                        alt={post.title}
                        className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="flex-1 flex flex-col items-start justify-between">
                    <div>
                      <h2 className="font-bold text-lg sm:text-2xl text-gray-900 dark:text-white mb-1 tracking-tight">
                        {post.title}
                      </h2>
                      <span className="inline-block bg-gray-900/80 dark:bg-white/80 text-white dark:text-black text-xs px-2 py-0.5 rounded mb-2">
                        Blog Project
                      </span>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-slate-300 mt-1 line-clamp-3">
                        {post.brief}
                      </p>
                      {techTags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {techTags.map((item, tagIdx) => (
                            <span
                              key={tagIdx}
                              className="bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-xs text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-white/10 capitalize"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4 flex-wrap mt-4">
                      {dateStr && (
                        <span className="text-xs text-gray-500">
                          {dateStr}
                        </span>
                      )}
                      <Link
                        className="hover:underline text-blue-700 dark:text-blue-400 font-medium text-xs"
                        to={`/project/${post.slug}`}
                      >
                        View Project
                      </Link>
                    </div>
                  </div>
                </div>
              </Link>
              </Reveal>
            );
          })}

          {/* Existing Local Projects */}
          {/* {filter.map((project, idx) => (
            <Reveal
              y={30}
              blur={15}
              duration={1}
              delay={0.1 * idx}
              key={idx}
              width="100%"
            >
              <Link to={project.projectLink}>
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
                          {project.tech.map((item, idx) => {
                            return (
                              <span
                                key={idx}
                                className="bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-xs text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-white/10"
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
              </Link>
            </Reveal>
          ))} */}
        </div>

        <CalltoActionContact />
      </section>
    </>
  );
}

