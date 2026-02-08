import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import BlogAuthGate from "~/components/blog/BlogAuthGate";
import { useBlogPosts } from "~/store/blogPosts";
import type { BlogPost } from "~/types/blog";
import type { Route } from "./+types/blog.$slug.edit";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Edit - Adyfas Blog" },
    {
      name: "robots",
      content: "noindex, nofollow",
    },
  ];
}

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function BlogEditPage() {
  const { slug } = useParams<"slug">();
  const navigate = useNavigate();
  const getPostBySlug = useBlogPosts((s) => s.getPostBySlug);
  const updatePost = useBlogPosts((s) => s.updatePost);
  const post = slug ? getPostBySlug(slug) : undefined;

  const [form, setForm] = useState({
    category: "",
    title: "",
    intro: "",
    body: "",
  });

  useEffect(() => {
    if (post) {
      setForm({
        category: post.category,
        title: post.title,
        intro: post.intro,
        body: post.body,
      });
    }
  }, [post]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;
    const now = new Date().toISOString();
    const newSlug = generateSlug(form.title);
    updatePost(post.id, {
      ...form,
      slug: newSlug,
      updatedAt: now,
    });
    navigate(`/blog/${newSlug}`);
  };

  if (!post) {
    return (
      <BlogAuthGate>
        <div className="py-16 text-center">
          <p className="text-gray-500">Post not found.</p>
          <Link to="/blog/dashboard" className="mt-4 inline-block text-gray-600 hover:text-gray-900">
            ← Back to Dashboard
          </Link>
        </div>
      </BlogAuthGate>
    );
  }

  return (
    <BlogAuthGate>
      <section className="py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Edit Post</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              type="text"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="e.g. Web Development"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Article title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Intro / Summary
            </label>
            <textarea
              value={form.intro}
              onChange={(e) => setForm({ ...form, intro: e.target.value })}
              placeholder="Brief intro for the listing page"
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Body (use ## for headings)
            </label>
            <textarea
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              placeholder="Your article content..."
              rows={12}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none resize-y font-mono text-sm"
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800"
            >
              Save Changes
            </button>
            <Link
              to="/blog/dashboard"
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 inline-block"
            >
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </BlogAuthGate>
  );
}
