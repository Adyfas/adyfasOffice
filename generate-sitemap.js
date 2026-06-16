import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateSitemap() {
  const domain = "https://adyfas-page.web.app";
  
  // Base routes
  const routes = [
    "",
    "/about",
    "/project",
    "/contact",
    "/blog",
  ];

  // Dynamic project routes
  const projectRoutes = [
    "/project/ecomind",
    "/project/warunggo",
    "/project/insidetribe",
    "/project/aiindonesia",
    "/project/koncomoto",
    "/project/sipbos"
  ];

  // Dynamic blog routes (fetching from Medium RSS)
  let blogRoutes = [];
  try {
    const rssUrl = "https://medium.com/feed/@adyfasofice";
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`;
    const res = await fetch(apiUrl);
    const data = await res.json();
    if (data.items) {
      blogRoutes = data.items.map((item) => {
        const id = item.guid.split("/").pop();
        return `/blog/${id}`;
      });
    }
  } catch (e) {
    console.error("Error fetching blog for sitemap", e);
  }

  const allRoutes = [...routes, ...projectRoutes, ...blogRoutes];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allRoutes
    .map((route) => `
    <url>
      <loc>${domain}${route}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>daily</changefreq>
      <priority>${route === "" ? "1.0" : "0.8"}</priority>
    </url>`)
    .join("")}
</urlset>`;

  const publicDir = path.join(__dirname, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap.trim());
  console.log("Sitemap generated successfully!");
}

generateSitemap();
