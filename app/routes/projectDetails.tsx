import React, { useEffect, useState } from "react";
import type { Route } from "../+types/root";
import MdxLayoutPage from "~/components/MdxLayout";
import { projectMdxMap, type ProjectSlug } from "~/data/SlugProject";
import { MoveLeft } from "lucide-react";
import { Link } from "react-router";
import ScrollReveal from "~/components/ScrollReveal";

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

  return (
    <MdxLayoutPage>
      <section className="relative">
        <ScrollReveal animation="fadeUp">
          <header className="py-4 text-start">
            {meta.title && (
              <h1 className="text-5xl font-bold my-2">{meta.title}</h1>
            )}

            {meta.description && (
              <p className="text-gray-600 text-xl">{meta.description}</p>
            )}

            <div className="flex items-center gap-3 py-4 border-b border-gray-400">
              <p className="font-bold">Adyfas</p>
              {meta.date && <p>{meta.date}</p>}
              {meta.role && <p>{meta.role}</p>}
            </div>
          </header>
        </ScrollReveal>

        <ScrollReveal animation="fadeIn" delay={0.2}>
          <article>
            <Post />

            {(meta.link || meta.git) && (
              <div className="my-10 flex flex-wrap gap-4 text-sm">
                {meta.link && (
                  <a
                    href={meta.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-900 p-2 rounded-2xl text-white font-bold hover:-translate-y-1 transition-all duration-700"
                  >
                    Live Demo
                  </a>
                )}
                {meta.git && (
                  <a
                    href={meta.git}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-gray-400 border p-2 rounded-2xl text-black hover:-translate-y-1 transition-all duration-700"
                  >
                    Github Repo
                  </a>
                )}
              </div>
            )}
          </article>
        </ScrollReveal>

        <Link to={"/project"}>
          <button className="fixed text-black p-2 bottom-5 right-5 cursor-pointer border rounded-full bg-black z-50">
            <MoveLeft className="text-white rotate-45" />
          </button>
        </Link>
      </section>
    </MdxLayoutPage>
  );
}
