import React, { useEffect, useState } from "react";
import type { Route } from "../+types/root";
import MdxLayoutPage from "~/components/MdxLayout";
import { projectMdxMap, type ProjectSlug } from "~/data/SlugProject";
import { MoveLeft } from "lucide-react";
import { Link } from "react-router";

type MdxModule = {
  default: React.ComponentType;
  meta?: {
    title?: string;
    description?: string;
    date?: string;
    role?: string;
    link?: string;
    git?: string;
    tech?: string[];
    [key: string]: unknown;
  };
};

export default function ProjectDetail({ params }: Route.ComponentProps) {
  const slug = params.slug as ProjectSlug;
  const [mod, setMod] = useState<MdxModule | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loader = projectMdxMap[slug];
    if (!loader) {
      setNotFound(true);
      return;
    }

    loader()
      .then((m) => {
        setMod(m as MdxModule);
      })
      .catch(() => {
        setNotFound(true);
      });
  }, [slug]);

  if (notFound) {
    return (
      <MdxLayoutPage>
        <div className="py-16 text-center">
          <h1 className="text-2xl font-bold mb-2">Project not found</h1>
          <p className="text-slate-300">
            The project you are looking for does not exist or has been moved.
          </p>
        </div>
      </MdxLayoutPage>
    );
  }

  if (!mod) {
    return (
      <MdxLayoutPage>
        <div className="py-16 text-center">
          <p className="text-slate-300">Loading project details…</p>
        </div>
      </MdxLayoutPage>
    );
  }

  const Post = mod.default;
  const meta = mod.meta ?? {};
  document.title = meta.title ?? "";
  return (

    <MdxLayoutPage>
      <section className="relative">
        <header className="py-4 text-start">
          {meta.title && (
            <h1 className="text-5xl font-bold my-2 dark:text-white">{meta.title}</h1>
          )}

          {meta.description && (
            <p className="text-gray-600 dark:text-slate-300 text-xl">{meta.description}</p>
          )}

          <div className="flex items-center gap-3 py-4 border-b border-gray-400 dark:border-white/20 dark:text-slate-300">
            <p className="font-bold dark:text-white">Adyfas</p>
            {meta.date && <p>{meta.date}</p>}
            {meta.role && <p>{meta.role}</p>}
          </div>
          {/* {(meta.date || meta.role || meta.description) && (
          <div className="text-sm text-slate-400 mb-6 space-y-1">
            {meta.date && <p>{meta.date}</p>}
            {meta.role && <p>Role: {meta.role}</p>}
            {meta.description && <p>{meta.description}</p>}
          </div>
        )} */}
        </header>
        <article>
          <Post />

          {(meta.link || meta.git) && (
            <div className="my-10 flex flex-wrap gap-4 text-sm">
              {meta.link && (
                <a
                  href={meta.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-900 dark:bg-white p-2 rounded-2xl text-white dark:text-black font-bold hover:-translate-y-1 transition-all duration-700"
                >
                  Live Demo
                </a>
              )}
              {meta.git && (
                <a
                  href={meta.git}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-gray-400 dark:border-white/20 border p-2 rounded-2xl text-black dark:text-white hover:-translate-y-1 hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-700"
                >
                  Github Repo
                </a>
              )}
            </div>
          )}
        </article>

        <Link to={"/project"}>
          <button className="fixed p-2 bottom-5 right-5 cursor-pointer border dark:border-white/20 rounded-full bg-black dark:bg-slate-800 z-50">
            <MoveLeft className="text-white rotate-45" />
          </button>
        </Link>
      </section>
    </MdxLayoutPage>
  );
}
