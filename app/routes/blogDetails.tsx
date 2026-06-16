import type { Route } from "./+types/blogDetails";
import Reveal from "~/components/Reveal";
import CalltoActionContact from "~/components/CalltoActionContact";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Link } from "react-router";
import { getBlogBySlug, getBlogById, getStrapiImageUrl } from "~/lib/medium";
import type { BlogPost } from "~/lib/medium";

export async function clientLoader({ params }: Route.LoaderArgs) {
  const id = params.id;
  let post = await getBlogBySlug(id);
  if (!post) {
    post = await getBlogById(id);
  }
  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }
  return { post };
}

export function meta({ data }: Route.MetaArgs) {
  const post = data?.post as BlogPost | undefined;
  const title = post?.title ? `${post.title} | Adyfas` : "Blog | Adyfas";
  const description = post?.description || "Read article on Adyfas Blog.";
  const imageUrl = post?.cover ? getStrapiImageUrl(post.cover) || "" : "";
  const url = `https://adyfas-page.web.app/blog/${post?.slug || ""}`;

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

const typographyStyles = `
  .blog-content {
    font-family: Georgia, "Times New Roman", Times, serif;
    font-size: 18px;
    line-height: 30px;
    color: rgba(55, 55, 55, 1);
    letter-spacing: -0.002em;
  }
  .dark .blog-content {
    color: rgba(210, 210, 210, 1);
  }
  .blog-content p {
    margin-top: 24px;
    margin-bottom: -8px;
  }
  .blog-content h1, .blog-content h2, .blog-content h3 {
    font-family: "Inter", ui-sans-serif, system-ui, sans-serif;
    font-weight: 700;
    color: rgba(30, 30, 30, 1);
    margin-top: 40px;
    letter-spacing: -0.02em;
  }
  .dark .blog-content h1, .dark .blog-content h2, .dark .blog-content h3 {
    color: rgba(255, 255, 255, 1);
  }
  .blog-content h1 { font-size: 30px; line-height: 36px; margin-bottom: -6px; }
  .blog-content h2 { font-size: 24px; line-height: 30px; margin-bottom: -6px; }
  .blog-content h3 { font-size: 20px; line-height: 26px; margin-bottom: -6px; }
  .blog-content blockquote {
    border-left: 3px solid rgba(0, 0, 0, 0.8);
    padding-left: 20px;
    margin-left: 0;
    margin-top: 28px;
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
    margin: 36px 0 0 0;
    border-radius: 4px;
  }
  .blog-content a {
    text-decoration: underline;
    color: inherit;
    text-underline-offset: 2px;
  }
  .blog-content a:hover {
    color: #2563eb;
  }
  .blog-content pre {
    background: #f5f5f5;
    padding: 20px;
    border-radius: 8px;
    overflow-x: auto;
    font-size: 14px;
    line-height: 22px;
    margin-top: 28px;
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
    background: #f0f0f0;
    padding: 2px 6px;
    border-radius: 4px;
  }
  .dark .blog-content p > code {
    background: rgba(255, 255, 255, 0.1);
  }
  .blog-content ul, .blog-content ol {
    margin-top: 24px;
    padding-left: 24px;
  }
  .blog-content li {
    margin-top: 8px;
  }
`;

export default function BlogDetailsPage({ loaderData }: Route.ComponentProps) {
  const { post } = loaderData;

  const date = new Date(post.publishedAt || post.createdAt);
  const formattedDate = date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const coverUrl = getStrapiImageUrl(post.cover);

  return (
    <section className="w-full flex justify-center pb-20">
      <style>{typographyStyles}</style>
      <div className="w-full max-w-[680px] mt-4 px-4 sm:px-0">
        <Reveal y={20} blur={10} duration={0.8} width="100%">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-10"
          >
            <ArrowLeft size={15} />
            Back to blog
          </Link>

          <h1 className="text-3xl sm:text-[40px] font-bold tracking-tight text-gray-900 dark:text-white mb-4 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 mb-6">
            <span className="font-medium text-gray-700 dark:text-gray-300">{post.author}</span>
            <span>·</span>
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

          {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag: string, i: number) => (
                <span
                  key={i}
                  className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </Reveal>

        {coverUrl && (
          <Reveal y={20} blur={10} duration={0.8} delay={0.1} width="100%">
            <div className="w-full aspect-[2/1] rounded-lg overflow-hidden mb-10 bg-gray-50 dark:bg-white/5">
              <img
                src={coverUrl}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </Reveal>
        )}

        {/* <Reveal y={30} blur={10} duration={0.8} width="100%"> */}
          <div
            className="blog-content w-full"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        {/* </Reveal> */}

        <div className="mt-1">
          <CalltoActionContact />
        </div>
      </div>
    </section>
  );
}
