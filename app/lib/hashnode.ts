export interface HashnodePost {
  id: string;
  title: string;
  slug: string;
  brief: string;
  content?: string;
  publishedAt: string;
  coverImage?: {
    url: string;
  };
  link: string;
  categories: string[];
}

async function fetchRssXml(rssUrl: string): Promise<string> {
  // Method 1: Local Vite Dev Proxy (Instant, 100% reliable on localhost)
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    try {
      const res = await fetch(`/hashnode-rss?v=${Date.now()}`, { cache: "no-store" });
      if (res.ok) {
        return await res.text();
      }
    } catch (e) {
      console.warn("Vite dev proxy failed, trying fallback...", e);
    }
  }

  // Method 2: allorigins.win /get JSON endpoint
  try {
    const res = await fetch(
      `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`,
      { cache: "no-store" }
    );
    if (res.ok) {
      const data = await res.json();
      if (data && data.contents) {
        return data.contents;
      }
    }
  } catch (e) {
    console.warn("Allorigins get failed, trying fallback...", e);
  }

  // Method 3: corsproxy.io
  try {
    const res = await fetch(
      `https://corsproxy.io/?${encodeURIComponent(rssUrl)}`,
      { cache: "no-store" }
    );
    if (res.ok) {
      return await res.text();
    }
  } catch (e) {
    console.warn("Corsproxy.io failed...", e);
  }

  throw new Error("All RSS CORS proxies failed.");
}

export async function getHashnodePosts(): Promise<HashnodePost[]> {
  const rssUrl = `https://adyfas-blog.hashnode.dev/rss.xml?v=${Date.now()}`;

  try {
    const xml = await fetchRssXml(rssUrl);
    const items = xml.split(/<item>/i).slice(1);

    return items.map((item, idx) => {
      // Title
      const titleMatch = item.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
      const title = titleMatch
        ? titleMatch[1].replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "").trim()
        : "";

      // Description / Brief
      const descMatch = item.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i);
      const rawDesc = descMatch
        ? descMatch[1].replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "").trim()
        : "";
      const brief = rawDesc.replace(/<[^>]*>/g, "").trim();

      // Content HTML
      const contentMatch = item.match(/<content:encoded>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/content:encoded>/i);
      const content = contentMatch
        ? contentMatch[1].replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "").trim()
        : rawDesc;

      // Link & Slug
      const linkMatch = item.match(/<link>([\s\S]*?)<\/link>/i);
      const link = linkMatch ? linkMatch[1].trim() : "";
      const slug = link.split("/").pop() || `post-${idx}`;

      // Date
      const dateMatch = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/i);
      const publishedAt = dateMatch ? dateMatch[1].trim() : "";

      // Cover Image
      const coverMatch = item.match(/<enclosure[^>]+url=["\']([^"\']+)["\']/i);
      const coverUrl = coverMatch ? coverMatch[1].trim() : undefined;

      // Categories / Tags
      const catMatches = item.match(/<category>[\s\S]*?<\/category>/gi) || [];
      const categories = catMatches.map((c) =>
        c
          .replace(/<\/?category>/gi, "")
          .replace(/^<!\[CDATA\[/, "")
          .replace(/\]\]>$/, "")
          .toLowerCase()
          .trim()
      );

      return {
        id: slug,
        title,
        slug,
        brief,
        content,
        publishedAt,
        coverImage: coverUrl ? { url: coverUrl } : undefined,
        link,
        categories,
      };
    });
  } catch (error) {
    console.error("Error fetching Hashnode posts:", error);
    return [];
  }
}

const PROJECT_TAGS = ["project", "blog-project"];

export async function getBlogOnlyPosts(): Promise<HashnodePost[]> {
  const posts = await getHashnodePosts();
  return posts.filter(
    (post) => !post.categories.some((cat) => PROJECT_TAGS.includes(cat))
  );
}

export async function getProjectPosts(): Promise<HashnodePost[]> {
  const posts = await getHashnodePosts();
  return posts.filter((post) =>
    post.categories.some((cat) => PROJECT_TAGS.includes(cat))
  );
}

export async function getHashnodePostBySlug(
  slug: string
): Promise<HashnodePost | null> {
  const posts = await getHashnodePosts();
  return posts.find((p) => p.slug === slug || p.id === slug) || null;
}







