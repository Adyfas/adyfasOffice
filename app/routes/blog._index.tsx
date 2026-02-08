import { Link } from "react-router";
import { useBlogPosts } from "~/store/blogPosts";
import { useBlogAuth } from "~/store/blogAuth";
import type { Route } from "./+types/blog._index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Blog - Adyfas" },
    {
      name: "description",
      content:
        "Blog by Adyfas - articles about web development, technology, and more.",
    },
  ];
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export default function BlogIndexPage() {
  const posts = useBlogPosts((s) => s.posts);
  const isAuthenticated = useBlogAuth((s) => s.isAuthenticated);

  return (
    <section className="py-8">
      <div className="mb-12 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Writing
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl">
            I write blogs that blend deep dives into development, technology, and
            random thoughts—some of it's like my personal journal on display.
          </p>
        </div>
        {isAuthenticated && (
          <div className="flex gap-2 shrink-0">
            <Link
              to="/blog/write"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              + Write
            </Link>
            <span className="text-gray-300">|</span>
            <Link
              to="/blog/dashboard"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Dashboard
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {posts.map((post) => (
          <Link
            key={post.id}
            to={`/blog/${post.slug}`}
            className="group block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {post.category}
              </span>
              <span className="shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-gray-900 group-hover:text-white transition-colors">
                →
              </span>
            </div>
            <h2 className="mt-3 text-lg font-bold text-gray-900 group-hover:text-gray-700 line-clamp-2">
              {post.title}
            </h2>
            <p className="mt-1 text-sm text-gray-500">{formatDate(post.publishedAt)}</p>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed line-clamp-3">
              {post.intro}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
