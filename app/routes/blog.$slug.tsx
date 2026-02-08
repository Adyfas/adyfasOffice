import { Link, useParams } from "react-router";
import { useBlogPosts } from "~/store/blogPosts";
import type { Route } from "./+types/blog.$slug";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Blog Article - Adyfas` },
    {
      name: "description",
      content: "Read articles and insights from Adyfas.",
    },
  ];
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function BodyContent({ body }: { body: string }) {
  const blocks = body.split("\n\n").filter(Boolean);

  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        if (block.startsWith("## ")) {
          return (
            <h2
              key={i}
              className="text-xl font-bold text-gray-900 mt-8 mb-2"
            >
              {block.replace("## ", "")}
            </h2>
          );
        }
        const isFirst = i === 0 && !blocks[0].startsWith("## ");
        return (
          <p
            key={i}
            className={`text-base leading-relaxed text-gray-700 ${
              isFirst ? "first-letter:text-5xl first-letter:font-bold first-letter:text-gray-900 first-letter:float-left first-letter:mr-2 first-letter:leading-none" : ""
            }`}
          >
            {block}
          </p>
        );
      })}
    </div>
  );
}

export default function BlogArticlePage() {
  const { slug } = useParams<"slug">();
  const getPostBySlug = useBlogPosts((s) => s.getPostBySlug);
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Article not found</h1>
        <Link to="/blog" className="mt-4 inline-block text-gray-600 hover:text-gray-900">
          ← Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <article className="py-8 max-w-3xl">
      <p className="text-sm text-gray-500 uppercase tracking-wide">
        {formatDate(post.publishedAt)}
      </p>

      <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
        {post.title}
      </h1>

      <p className="mt-4 text-base text-gray-600 leading-relaxed">
        {post.intro}
      </p>

      <div className="mt-8 flex items-center gap-3">
        {post.author.avatar ? (
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="h-12 w-12 rounded-full object-cover"
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
            {post.author.name.charAt(0)}
          </div>
        )}
        <div>
          <p className="font-semibold text-gray-900">{post.author.name}</p>
          <p className="text-sm text-gray-500">{post.author.role}</p>
        </div>
      </div>

      <div className="hidden sm:flex fixed left-4 top-1/2 -translate-y-1/2 flex-col gap-2 mt-16">
        <button
          type="button"
          className="h-10 w-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50"
          aria-label="Share on Facebook"
        >
          <span className="text-xs font-bold">f</span>
        </button>
        <button
          type="button"
          className="h-10 w-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50"
          aria-label="Share on Twitter"
        >
          <span className="text-xs">𝕏</span>
        </button>
      </div>

      <div className="mt-12 max-w-none">
        <BodyContent body={post.body} />
      </div>

      <Link
        to="/blog"
        className="inline-block mt-12 text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        ← Back to Blog
      </Link>
    </article>
  );
}
