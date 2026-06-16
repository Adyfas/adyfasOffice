import type { Route } from "./+types/blog";
import Reveal from "~/components/Reveal";
import CalltoActionContact from "~/components/CalltoActionContact";
import { Calendar, Clock, ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { getBlogs, getStrapiImageUrl } from "~/lib/medium";
import type { BlogPost } from "~/lib/medium";

export function meta({}: Route.MetaArgs) {
  const title = "Blog | Adyfas";
  const description = "Tulisan, tutorial, dan pemikiran tentang pengembangan web modern.";
  const url = "https://adyfas-page.web.app/blog";

  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:type", content: "blog" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
}

export async function clientLoader() {
  const blogs = await getBlogs();
  return { blogs };
}

function BlogCard({ post, idx }: { post: BlogPost; idx: number }) {
  const date = new Date(post.publishedAt || post.createdAt);
  const formattedDate = date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const coverUrl = getStrapiImageUrl(post.cover);

  return (
    <Reveal y={20} blur={10} duration={0.8} delay={0.08 * idx} width="100%">
      <article className="group border-b border-gray-100 dark:border-white/10 pb-8 mb-8 last:border-0 last:mb-0">
        <Link to={`/blog/${post.slug}`} className="block">
          {coverUrl && (
            <div className="w-full aspect-[2/1] sm:aspect-[2.2/1] rounded-lg overflow-hidden mb-5 bg-gray-50 dark:bg-white/5">
              <img
                src={coverUrl}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
          )}

          <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500 mb-3">
            <span className="flex items-center gap-1.5">
              <Calendar size={13} />
              {formattedDate}
            </span>
            {post.readTime && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1.5">
                  <Clock size={13} />
                  {post.readTime} min read
                </span>
              </>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 leading-snug tracking-tight group-hover:text-gray-600 dark:group-hover:text-blue-400 transition-colors">
            {post.title}
          </h2>

          {post.description && (
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
              {post.description}
            </p>
          )}

          {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.slice(0, 3).map((tag: string, i: number) => (
                <span
                  key={i}
                  className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-4 flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-blue-400 transition-colors">
            Read article
            <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </Link>
      </article>
    </Reveal>
  );
}

export default function BlogPage({ loaderData }: Route.ComponentProps) {
  const { blogs } = loaderData;

  return (
    <section>
      <Reveal y={20} blur={10} duration={0.8} width="100%">
        <h1 className="text-xl sm:text-2xl font-bold text-start my-2 dark:text-white">
          Blog
        </h1>
        <p className="dark:text-gray-400 text-gray-500 mb-10">
        The blog below discusses my experiences, tips or stories about me.
        </p>
      </Reveal>

      <div className="w-full max-w-2xl">
        {blogs.map((post: BlogPost, idx: number) => (
          <BlogCard key={post.documentId || post.id} post={post} idx={idx} />
        ))}
        {blogs.length === 0 && (
          <div className="text-center py-16 text-gray-400 dark:text-gray-500">
            <p className="text-lg font-medium mb-1">blog is still empty</p>
            <p className="text-sm"></p>
          </div>
        )}
      </div>

      <CalltoActionContact />
    </section>
  );
}
