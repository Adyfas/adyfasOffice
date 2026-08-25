import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getBlogOnlyPosts, type HashnodePost } from "~/lib/hashnode";
import type { Route } from "./+types/blog";
import CardBlog from "~/components/blog/CardBlog";

export function meta({}: Route.MetaArgs) {
  const title = "Blog & Articles | Adyfas - Web Developer & Tech Writing";
  const description =
    "Artikel, catatan pengalaman, tutorial web development, dan cerita seputar pemrograman oleh Adyfas (Ferdi Iskandar).";
  const url = "https://adyfas-page.web.app/blog";
  const ogImage = "https://adyfas-page.web.app/images/faveicon.png";

  return [
    { title },
    { name: "description", content: description },
    { name: "keywords", content: "blog adyfas, ferdi iskandar, web development, tutorial react, php, lks web technology, frontend developer" },
    { name: "author", content: "Adyfas (Ferdi Iskandar)" },
    { name: "robots", content: "index, follow" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:type", content: "website" },
    { property: "og:image", content: ogImage },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: ogImage },
    { tagName: "link", rel: "canonical", href: url },
  ];
}

export default function BlogPage() {
  const [posts, setPosts] = useState<HashnodePost[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getBlogOnlyPosts().then((data) => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Adyfas Blog",
    description: "Tulisan, tutorial, dan catatan pengalaman seputar teknologi web dan pemrograman.",
    url: "https://adyfas-page.web.app/blog",
    author: {
      "@type": "Person",
      name: "Adyfas (Ferdi Iskandar)",
      url: "https://adyfas-page.web.app",
    },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.brief,
      url: `https://adyfas-page.web.app/blog/${post.slug}`,
      datePublished: post.publishedAt,
      image: post.coverImage?.url,
    })),
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex items-start flex-col mb-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white my-2">
        Blog
      </h1>
      <p>I write about my personal experiences here, so you might find something inspiring! But sometimes, I just talk about random things too (;</p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-500">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="py-12 text-center text-gray-500">Belum ada postingan blog.</div>
      ) : (
        posts.map((post) => (
          <Link
            key={post.id}
            to={`/blog/${post.slug}`}
            className="block"
          >
            <CardBlog
              title={post.title}
              description={post.brief}
              createTime={
                post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : ""
              }
              image={post.coverImage?.url}
            />
          </Link>
        ))
      )}
    </div>
  );
}