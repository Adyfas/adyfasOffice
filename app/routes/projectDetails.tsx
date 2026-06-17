import React, { useEffect, useState } from "react";
import type { Route } from "../+types/root";
import MdxLayoutPage from "~/components/MdxLayout";
import { projectMdxMap, type ProjectSlug } from "~/data/SlugProject";
import {
  MoveLeft,
  Calendar,
  Briefcase,
  ExternalLink,
  Code2,
  Timer,
} from "lucide-react";
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

import { ProjectList } from "~/data/DataProject";
import Reveal from "~/components/Reveal";
import { motion } from "framer-motion";

export function meta({ params }: Route.MetaArgs) {
  const slug = params.slug;
  const project = ProjectList.find((p) => p.projectLink === `/project/${slug}`);

  if (!project) {
    return [
      { title: "Project Not Found | Adyfas" },
      {
        name: "description",
        content: "The project you are looking for does not exist.",
      },
    ];
  }

  const title = `${project.title} | Adyfas Project`;
  const description = project.desc;
  const url = `https://adyfas-page.web.app${project.projectLink}`;
  const imageUrl = `https://adyfas-page.web.app${project.img}`;

  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: imageUrl },
    { property: "og:url", content: url },
    { property: "og:type", content: "article" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: imageUrl },
  ];
}

export default function ProjectDetail({ params }: Route.ComponentProps) {
  const slug = params.slug as ProjectSlug;
  const [mod, setMod] = useState<MdxModule | null>(null);
  const [notFound, setNotFound] = useState(false);

  const typographyStyles = `
  .blog-content {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size: 16px;
    line-height: 1.8;
    color: #4b5563; /* text-gray-600 */
  }
  .dark .blog-content {
    color: #d1d5db; /* text-gray-300 */
  }
  .blog-content p {
    margin-top: 1.25rem;
    margin-bottom: 1.25rem;
  }
  .blog-content h1, .blog-content h2, .blog-content h3 {
    font-family: "Inter", sans-serif;
    font-weight: 700;
    color: #111827;
    margin-top: 2.25rem;
    margin-bottom: 0.75rem;
    letter-spacing: -0.02em;
  }
  .dark .blog-content h1, .dark .blog-content h2, .dark .blog-content h3 {
    color: #f9fafb;
  }
  .blog-content h1 { font-size: 1.75rem; line-height: 2.25rem; }
  .blog-content h2 { font-size: 1.5rem; line-height: 2rem; }
  .blog-content h3 { font-size: 1.25rem; line-height: 1.75rem; }
  
  .blog-content blockquote {
    border-left: 4px solid #3b82f6;
    padding-left: 1.25rem;
    margin: 1.75rem 0;
    font-style: italic;
    color: #4b5563;
  }
  .dark .blog-content blockquote {
    color: #9ca3af;
  }
  .blog-content img {
    width: 100%;
    height: auto;
    margin: 2rem 0;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.05);
  }
  .dark .blog-content img {
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3);
  }

  .blog-content pre {
    background: #f3f4f6;
    padding: 1.25rem;
    border-radius: 0.75rem;
    overflow-x: auto;
    font-size: 0.875rem;
    line-height: 1.5rem;
    margin: 1.75rem 0;
    border: 1px solid #e5e7eb;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  }
  .dark .blog-content pre {
    background: #111827;
    border-color: #1f2937;
  }
  .blog-content code {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.875rem;
  }
  .blog-content p > code {
    background: #f3f4f6;
    padding: 0.2rem 0.4rem;
    border-radius: 0.25rem;
    color: #ef4444;
  }
  .dark .blog-content p > code {
    background: #1f2937;
    color: #f87171;
  }
  .blog-content ul {
    list-style-type: disc;
    margin: 1.25rem 0;
    padding-left: 1.5rem;
  }
  .blog-content ol {
    list-style-type: decimal;
    margin: 1.25rem 0;
    padding-left: 1.5rem;
  }
  .blog-content li {
    margin-top: 0.5rem;
  }
`;

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
      <style>{typographyStyles}</style>

      <section className="relative blog-content max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <header className="py-6 text-start space-y-6 z-99 relative">
          <Reveal y={30} blur={10} duration={1} width="100%">
            {/* <Link
              to="/project"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors group mb-2 z-999 relative"
            >
              <MoveLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 relative z-999" />
              <span>Back to Projects</span>
            </Link> */}

            <div className="space-y-3">
              {meta.title && (
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
                  {meta.title}
                </h1>
              )}
              {meta.description && (
                <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 leading-relaxed font-light">
                  {meta.description}
                </p>
              )}
              <div className="flex items-center justify-start gap-2 w-full text-gray-500 text-md">
                <span className="text-black dark:text-white">Adyfas</span>
                <span>.</span>
                <span className="flex items-center gap-1">
                  <Calendar size={15} />
                  {meta.date}
                </span>
              </div>
            </div>
          </Reveal>
        </header>

        <article className="prose dark:prose-invert max-w-none mt-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Post />
          </motion.div>

          {(meta.link || meta.git) && (
            <div className="my-12 flex flex-wrap gap-4 text-sm border-t border-gray-150 dark:border-white/10 pt-8">
              {meta.link && (
                <a
                  href={meta.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 px-5 py-3 rounded-xl text-white dark:text-black font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Launch Live Demo</span>
                </a>
              )}
              {meta.git && (
                <a
                  href={meta.git}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-gray-300 dark:border-white/20 hover:border-gray-900 dark:hover:border-white px-5 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white font-semibold hover:-translate-y-0.5 hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-300"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                    />
                  </svg>
                  <span>Explore Source Code</span>
                </a>
              )}
            </div>
          )}
        </article>
        {meta.tech && meta.tech.length > 0 && (
          <div className="flex items-center gap-3">
            <div>
              <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                Tech Stack
              </p>
              <div className="flex flex-wrap gap-1 mt-0.5">
                {meta.tech.slice(0, 10).map((t: string) => (
                  <span
                    key={t}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-gray-200/60 dark:bg-white/10 text-gray-600 dark:text-gray-300 font-medium"
                  >
                    {t}
                  </span>
                ))}
                {meta.tech.length > 10 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-200/60 dark:bg-white/10 text-gray-500 dark:text-gray-400 font-medium">
                    +{meta.tech.length - 10}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        <Link to={"/project"}>
          <button className="fixed p-3 bottom-6 right-6 cursor-pointer border border-gray-200 dark:border-white/10 rounded-full bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 shadow-lg transition-all z-50 group hover:-translate-y-1">
            <MoveLeft className="text-gray-800 dark:text-white rotate-45 group-hover:scale-110 transition-transform" />
          </button>
        </Link>
      </section>
    </MdxLayoutPage>
  );
}
