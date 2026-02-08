import { useState } from "react";
import { Link } from "react-router";
import BlogAuthGate from "~/components/blog/BlogAuthGate";
import { useBlogPosts } from "~/store/blogPosts";
import type { Route } from "./+types/blog.dashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard - Adyfas Blog" },
    {
      name: "robots",
      content: "noindex, nofollow",
    },
  ];
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogDashboardPage() {
  const posts = useBlogPosts((s) => s.posts);
  const deletePost = useBlogPosts((s) => s.deletePost);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    setDeletingId(id);
    deletePost(id);
    setDeletingId(null);
  };

  return (
    <BlogAuthGate>
      <section className="py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Blog Dashboard</h1>
          <Link
            to="/blog/write"
            className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800"
          >
            + Add Post
          </Link>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Manage your blog posts. Add, edit, or delete articles.
        </p>

        <div className="space-y-4">
          {posts.length === 0 ? (
            <p className="text-gray-500 py-8">No posts yet.</p>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-white hover:border-gray-300"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500 uppercase">{post.category}</p>
                  <h2 className="font-bold text-gray-900 truncate">{post.title}</h2>
                  <p className="text-sm text-gray-500">{formatDate(post.publishedAt)}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  <Link
                    to={`/blog/${post.slug}/edit`}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(post.id, post.title)}
                    disabled={deletingId === post.id}
                    className="px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </BlogAuthGate>
  );
}
