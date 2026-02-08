import { useState } from "react";
import { useNavigate } from "react-router";
import BlogAuthGate from "~/components/blog/BlogAuthGate";
import { useBlogPosts } from "~/store/blogPosts";
import type { BlogPost } from "~/types/blog";
import type { Route } from "./+types/blog.write";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Write - Adyfas Blog" },
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

function generateId() {
  return crypto.randomUUID();
}

export default function BlogWritePage() {
  const navigate = useNavigate();
  const addPost = useBlogPosts((s) => s.addPost);
  const [form, setForm] = useState({
    category: "",
    title: "",
    intro: "",
    body: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    const slug = generateSlug(form.title);
    const post: BlogPost = {
      id: generateId(),
      slug,
      category: form.category,
      title: form.title,
      intro: form.intro,
      body: form.body,
      author: {
        name: "Adyfas",
        role: "Web Developer & Problem Solver",
        avatar: "/images/CEO.png",
      },
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
    };
    addPost(post);
    navigate(`/blog/${slug}`);
  };

  return (
    <BlogAuthGate>
      <section className="py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Write New Post</h1>

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
              Publish
            </button>
            <button
              type="button"
              onClick={() => navigate("/blog")}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </BlogAuthGate>
  );
}
