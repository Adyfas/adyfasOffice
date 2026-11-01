import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = "https://adyfas.com";

// Harus sama dengan PROJECT_TAGS di react-router.config.ts & app/lib/hashnode.ts
const PROJECT_TAGS = ["project", "blog-project"];
const BIG_PROJECT_TAG = "big-project-adyfas";

// Project statis (bukan dari Markdown, sumbernya app/data/DataProject.ts)
const STATIC_PROJECT_ROUTES = [
  "/project/ecomind",
  "/project/warunggo",
  "/project/insidetribe",
  "/project/aiindonesia",
  "/project/koncomoto",
  "/project/sipbos",
];

/** Ambil VITE_API dari .env supaya sitemap memakai backend yang sama dengan situs. */
function readApiUrl() {
  if (process.env.VITE_API) return process.env.VITE_API;
  try {
    const env = fs.readFileSync(path.join(__dirname, ".env"), "utf8");
    const match = env.match(/^VITE_API\s*=\s*(.+)$/m);
    if (match) return match[1].trim().replace(/^["']|["']$/g, "");
  } catch {}
  return "https://api-adyfasoffice.vercel.app/api";
}

/**
 * Slug post dari API konten (file Markdown di backend-adyfasofice).
 * Pemisahan blog/project memakai tag yang sama dengan yang dipakai UI,
 * supaya URL di sitemap = URL yang benar-benar dirender.
 */
async function getPostRoutes() {
  const apiUrl = readApiUrl().replace(/\/$/, "");
  const res = await fetch(`${apiUrl}/posts`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API konten membalas ${res.status}`);
  const posts = await res.json();
  if (!Array.isArray(posts)) throw new Error("Response API bukan array");

  const projectRoutes = [];
  const blogRoutes = [];

  for (const post of posts) {
    const slug = post?.slug;
    if (!slug || post.draft) continue;
    const categories = Array.isArray(post.categories) ? post.categories : [];
    const isProject =
      categories.some((cat) => PROJECT_TAGS.includes(cat)) ||
      categories.includes(BIG_PROJECT_TAG);
    (isProject ? projectRoutes : blogRoutes).push(
      `${isProject ? "/project" : "/blog"}/${slug}`,
    );
  }

  return { projectRoutes, blogRoutes };
}

async function generateSitemap() {
  const baseRoutes = ["", "/about", "/project", "/contact", "/blog"];

  let projectRoutes = STATIC_PROJECT_ROUTES;
  let blogRoutes = [];
  try {
    const postRoutes = await getPostRoutes();
    projectRoutes = [...STATIC_PROJECT_ROUTES, ...postRoutes.projectRoutes];
    blogRoutes = postRoutes.blogRoutes;
  } catch (e) {
    console.error(
      "[sitemap] Gagal ambil post dari API konten, hanya URL statis yang dimasukkan:",
      e.message,
    );
  }

  const allRoutes = [...new Set([...baseRoutes, ...projectRoutes, ...blogRoutes])];
  const lastmod = new Date().toISOString();

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allRoutes
    .map(
      (route) => `
    <url>
      <loc>${DOMAIN}${route}</loc>
      <lastmod>${lastmod}</lastmod>
      <changefreq>daily</changefreq>
      <priority>${route === "" ? "1.0" : "0.8"}</priority>
    </url>`,
    )
    .join("")}
</urlset>`;

  const publicDir = path.join(__dirname, "public");
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);

  fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap.trim());
  console.log(`Sitemap generated successfully! (${allRoutes.length} URL)`);
}

generateSitemap();
