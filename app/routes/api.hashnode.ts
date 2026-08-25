export async function loader() {
  try {
    const rssUrl = `https://adyfas-blog.hashnode.dev/rss.xml?v=${Date.now()}`;
    const response = await fetch(rssUrl, {
      cache: "no-store",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; PortfolioBot/1.0)",
      },
    });

    if (!response.ok) {
      return Response.json([], { status: response.status });
    }

    const xml = await response.text();
    const items = xml.split(/<item>/i).slice(1);

    const posts = items.map((item, idx) => {
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

    return Response.json(posts, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
      },
    });
  } catch (error) {
    console.error("Error in /api/hashnode loader:", error);
    return Response.json([]);
  }
}
