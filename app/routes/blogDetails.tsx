import { useEffect, useState } from "react";
import { useParams, Link, useLoaderData } from "react-router";
import { ArrowLeft, Calendar, User } from "lucide-react";
import Reveal from "~/components/Reveal";
import CalltoActionContact from "~/components/CalltoActionContact";
import { getHashnodePostBySlug, type HashnodePost } from "~/lib/hashnode";
import type { Route } from "./+types/blogDetails";

export async function clientLoader({ params }: Route.LoaderArgs) {
  const slug = params.slug;
  const post = slug ? await getHashnodePostBySlug(slug) : null;
  return { post };
}

export function meta({ data }: Route.MetaArgs) {
  const post = data?.post as HashnodePost | undefined;
  const title = post?.title ? `${post.title} | Adyfas Blog` : "Blog Article | Adyfas";
  const description = post?.brief || "Baca artikel lengkap di Adyfas Blog.";
  const imageUrl = post?.coverImage?.url || "https://adyfas-page.web.app/images/faveicon.png";
  const url = `https://adyfas-page.web.app/blog/${post?.slug || ""}`;

  return [
    { title },
    { name: "description", content: description },
    { name: "author", content: "Adyfas (Ferdi Iskandar)" },
    { name: "robots", content: "index, follow" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: imageUrl },
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
    font-family: Georgia, "Times New Roman", Times, serif;
    font-size: 18px;
    line-height: 1.75;
    color: rgba(55, 55, 55, 1);
  }
  .dark .blog-content {
    color: rgba(210, 210, 210, 1);
  }
  .blog-content p {
    margin-top: 24px;
    margin-bottom: 16px;
  }
  .blog-content h1, .blog-content h2, .blog-content h3, .blog-content h4 {
    font-family: "Inter", ui-sans-serif, system-ui, sans-serif;
    font-weight: 700;
    color: rgba(30, 30, 30, 1);
    margin-top: 36px;
    margin-bottom: 16px;
    letter-spacing: -0.02em;
  }
  .dark .blog-content h1, .dark .blog-content h2, .dark .blog-content h3, .dark .blog-content h4 {
    color: rgba(255, 255, 255, 1);
  }
  .blog-content h1 { font-size: 28px; line-height: 34px; }
  .blog-content h2 { font-size: 24px; line-height: 30px; }
  .blog-content h3 { font-size: 20px; line-height: 26px; }
  .blog-content blockquote {
    border-left: 3px solid rgba(0, 0, 0, 0.8);
    padding-left: 20px;
    margin: 28px 0;
    font-style: italic;
    color: rgba(117, 117, 117, 1);
  }
  .dark .blog-content blockquote {
    border-left-color: rgba(255, 255, 255, 0.8);
    color: rgba(168, 168, 168, 1);
  }
  .blog-content img {
    width: 100%;
    height: auto;
    margin: 32px 0;
    border-radius: 8px;
  }
  .blog-content a {
    text-decoration: underline;
    color: #2563eb;
    text-underline-offset: 3px;
  }
  .dark .blog-content a {
    color: #60a5fa;
  }
  .blog-content pre {
    background: #f4f4f5;
    padding: 18px;
    border-radius: 8px;
    overflow-x: auto;
    font-size: 14px;
    line-height: 22px;
    margin-top: 24px;
    font-family: "SF Mono", Monaco, "Cascadia Code", monospace;
  }
  .dark .blog-content pre {
    background: rgba(255, 255, 255, 0.08);
  }
  .blog-content code {
    font-family: "SF Mono", Monaco, "Cascadia Code", monospace;
    font-size: 14px;
  }
  .blog-content p > code {
    background: #e4e4e7;
    padding: 2px 6px;
    border-radius: 4px;
  }
  .dark .blog-content p > code {
    background: rgba(255, 255, 255, 0.12);
  }
  .blog-content ul, .blog-content ol {
    margin-top: 20px;
    margin-bottom: 20px;
    padding-left: 24px;
  }
  .blog-content ul { list-style-type: disc; }
  .blog-content ol { list-style-type: decimal; }
  .blog-content li {
    margin-top: 8px;
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
      name: "Adyfas (Ferdi Iskandar)",
      url: "https://adyfas-page.web.app",
    },
    publisher: {
      "@type": "Person",
      name: "Adyfas",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://adyfas-page.web.app/blog/${post.slug}`,
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

