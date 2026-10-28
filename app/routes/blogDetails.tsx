import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, Calendar, User } from "lucide-react";
import Reveal from "~/components/Reveal";
import CalltoActionContact from "~/components/CalltoActionContact";
import { getHashnodePostBySlug, type HashnodePost } from "~/lib/hashnode";
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from "~/lib/site";
import type { Route } from "./+types/blogDetails";

// CATATAN: route ini dulu punya `loader` + `clientLoader`.
// `loader` dihapus karena build Firebase pakai `ssr:false`, dan React Router
// menolak route ber-`loader` yang tidak ikut prerender. Daftar halaman
// /blog/:slug ikut prerender hanya kalau fetch RSS Hashnode saat build
// berhasil — kalau RSS 403/down, build ikut meledak. Dengan hanya
// `clientLoader`, prerender tetap mengisi meta og:image saat RSS hidup
// (clientLoader jalan saat prerender), dan build tetap lolos saat RSS mati.
export async function clientLoader({ params }: Route.LoaderArgs) {
  const slug = params.slug;
  const post = slug ? await getHashnodePostBySlug(slug) : null;
  return { post };
}

export function meta({ data }: Route.MetaArgs) {
  const post = data?.post as HashnodePost | undefined;
  const title = post?.title ? `${post.title} | Ferdi Iskandar` : "Blog Article | Ferdi Iskandar (Adyfas)";
  const description = post?.brief || "Baca artikel lengkap di Adyfas Blog.";
  const imageUrl = post?.coverImage?.url || DEFAULT_OG_IMAGE;
  const url = `${SITE_URL}/blog/${post?.slug || ""}`;

  return [
    { title },
    { name: "description", content: description },
    { name: "author", content: "Adyfas (Ferdi Iskandar)" },
    { name: "robots", content: "index, follow" },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: imageUrl },
    { property: "og:image:alt", content: post?.title ?? title },
    { property: "og:url", content: url },
    { property: "og:type", content: "article" },
    { property: "article:published_time", content: post?.publishedAt },
    { property: "article:author", content: "Adyfas" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: imageUrl },
    { tagName: "link", rel: "canonical", href: url },
  ];
}

const typographyStyles = `
  .blog-content {
    font-family: Georgia, "Times New Roman", "Charter", serif;
    font-size: 20px;
    line-height: 1.7;
    color: #242424;
    letter-spacing: -0.01em;
  }
  .dark .blog-content {
    color: #e0e0e0;
  }
  .blog-content p {
    margin-top: 28px;
    margin-bottom: 0;
  }
  .blog-content h1, .blog-content h2, .blog-content h3, .blog-content h4 {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    font-weight: 700;
    color: #1a1a1a;
    margin-top: 48px;
    margin-bottom: 16px;
    letter-spacing: -0.02em;
    line-height: 1.3;
  }
  .dark .blog-content h1, .dark .blog-content h2, .dark .blog-content h3, .dark .blog-content h4 {
    color: #ffffff;
  }
  .blog-content h1 { font-size: 32px; line-height: 1.2; }
  .blog-content h2 { font-size: 26px; line-height: 1.3; }
  .blog-content h3 { font-size: 22px; line-height: 1.4; }
  .blog-content h4 { font-size: 19px; line-height: 1.4; }
  .blog-content blockquote {
    border-left: 3px solid #e5e5e5;
    padding-left: 24px;
    margin: 32px 0;
    font-style: italic;
    color: #6b6b6b;
    font-size: 18px;
  }
  .dark .blog-content blockquote {
    border-left-color: #333;
    color: #a0a0a0;
  }
  .blog-content img {
    width: 100%;
    height: auto;
    margin: 36px 0;
    border-radius: 4px;
  }
  .blog-content a {
    text-decoration: underline;
    color: #1a8917;
    text-underline-offset: 2px;
  }
  .dark .blog-content a {
    color: #4ade80;
  }
  .blog-content pre {
    background: #f7f7f7;
    padding: 20px 24px;
    border-radius: 6px;
    overflow-x: auto;
    font-size: 15px;
    line-height: 1.6;
    margin: 28px 0;
    font-family: "SF Mono", Monaco, "Cascadia Code", "Consolas", monospace;
    border: 1px solid #e8e8e8;
  }
  .dark .blog-content pre {
    background: #1e1e1e;
    border-color: #333;
    color: #d4d4d4;
  }
  .blog-content code {
    font-family: "SF Mono", Monaco, "Cascadia Code", monospace;
    font-size: 0.85em;
  }
  .blog-content p > code {
    background: #f0f0f0;
    padding: 2px 6px;
    border-radius: 4px;
    color: #d73a49;
  }
  .dark .blog-content p > code {
    background: #2d2d2d;
    color: #ff7b72;
  }
  .blog-content ul, .blog-content ol {
    margin: 24px 0;
    padding-left: 28px;
  }
  .blog-content ul { list-style-type: disc; }
  .blog-content ol { list-style-type: decimal; }
  .blog-content li {
    margin-top: 8px;
    line-height: 1.7;
  }
  .blog-content hr {
    border: none;
    border-top: 1px solid #e5e5e5;
    margin: 40px 0;
  }
  .dark .blog-content hr {
    border-top-color: #333;
  }
  .blog-content strong { font-weight: 700; }
  .blog-content em { font-style: italic; }
  .blog-content table {
    width: 100%;
    border-collapse: collapse;
    margin: 28px 0;
    font-size: 18px;
  }
  .blog-content th, .blog-content td {
    padding: 12px 16px;
    border: 1px solid #e5e5e5;
    text-align: left;
  }
  .blog-content th {
    background: #f7f7f7;
    font-weight: 600;
  }
  .dark .blog-content th, .dark .blog-content td {
    border-color: #333;
  }
  .dark .blog-content th {
    background: #1e1e1e;
  }
`;

export default function BlogDetailsPage({ loaderData }: Route.ComponentProps) {
  const { slug } = useParams();
  const initialPost = (loaderData as any)?.post as HashnodePost | null;
  const [post, setPost] = useState<HashnodePost | null>(initialPost);
  const [loading, setLoading] = useState(!initialPost);

  useEffect(() => {
    if (!post && slug) {
      getHashnodePostBySlug(slug).then((data) => {
        setPost(data);
        setLoading(false);
      });
    }
  }, [slug, post]);

  if (loading) {
    return (
      <div className="w-full flex justify-center py-20 text-gray-500">
        Loading article...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="w-full text-center py-20">
        <h2 className="text-xl font-bold mb-4 dark:text-white">Article not found</h2>
        <Link to="/blog" className="text-blue-600 dark:text-blue-400 underline">
          ← Back to Blog
        </Link>
      </div>
    );
  }

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.brief,
    image: post.coverImage?.url,
    datePublished: post.publishedAt,
    author: {
      "@type": "Person",
      name: "Ferdi Iskandar",
      alternateName: "Adyfas",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      name: "Adyfas",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
  };

  return (
    <section className="w-full flex justify-center pb-20">
      <style>{typographyStyles}</style>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="w-full max-w-[680px] mt-4 px-4 sm:px-0">
        <Reveal y={20} blur={10} duration={0.6} width="100%">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Back to blog
          </Link>

          <h1 className="text-3xl sm:text-[38px] font-bold tracking-tight text-gray-900 dark:text-white mb-4 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
            <span className="flex items-center gap-1.5 font-medium text-gray-800 dark:text-gray-200">
              <User size={14} />
              Adyfas
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {formattedDate}
            </span>
          </div>
        </Reveal>

        {post.coverImage?.url && (
          <Reveal y={20} blur={10} duration={0.6} delay={0.1} width="100%">
            <div className="w-full aspect-[2/1] rounded-lg overflow-hidden mb-10 bg-gray-100 dark:bg-gray-800">
              <img
                src={post.coverImage.url}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </Reveal>
        )}

        <div
          className="blog-content w-full"
          dangerouslySetInnerHTML={{ __html: post.content || post.brief }}
        />

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-white/10">
          <CalltoActionContact />
        </div>
      </div>
    </section>
  );
}

