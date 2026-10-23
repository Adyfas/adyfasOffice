import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Baca .env project (nilai environment tetap menang) supaya sitemap lokal
 * memakai API yang sama dengan dev server.
 */
function readEnvFile() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) return {};
  const values = {};
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const match = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (!match) continue;
    values[match[1]] = match[2].replace(/^["']|["']$/g, '');
  }
  return values;
}

const buildEnv = { ...readEnvFile(), ...process.env };

const SITEMAP_POST_LIST_QUERY = `
  query PostList {
    postConnection(sort: "date") {
      edges {
        node {
          slug
          tags
        }
      }
    }
  }
`;

/**
 * Ambil daftar post dari sumber konten.
 * 1) TinaCMS GraphQL (proxy backend) - selalu paling baru
 * 2) Endpoint /posts backend - baca file .md dari repo
 */
async function fetchPosts(apiBase) {
  try {
    const res = await fetch(`${apiBase}/tina/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: SITEMAP_POST_LIST_QUERY }),
    });
    if (res.ok) {
      const payload = await res.json();
      const edges = payload?.data?.postConnection?.edges;
      if (Array.isArray(edges) && edges.length > 0) {
        return edges.map((edge) => ({
          slug: edge.node.slug,
          categories: edge.node.tags || [],
        }));
      }
    }
  } catch {
    // lanjut ke sumber berikutnya
  }

  const res = await fetch(`${apiBase}/posts`);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  const data = await res.json();
  if (!Array.isArray(data)) {
    throw new Error("respons /posts bukan array");
  }
  return data.map((post) => ({
    slug: post.slug,
    categories: post.categories || [],
  }));
}

async function generateSitemap() {
  const domain = "https://adyfas.com";
  
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

  // Dynamic content routes (fetching from API konten - TinaCMS / backend /posts).
  // Klasifikasi kategori disamakan dengan react-router.config.ts + app/lib/content.ts:
  // tag project/blog-project/big-project-adyfas -> /project/, sisanya -> /blog/.
  // Salah tag = URL salah di sitemap, jadi jaga tag tetap bersih.
  const PROJECT_TAGS = [
    "project",
    "blog-project",
    "project-blog",
    "big-project",
    "big-project-adyfas",
  ];
  let contentRoutes = [];
  try {
    const apiBase = buildEnv.VITE_API || "https://api-adyfasoffice.vercel.app/api";
    const posts = await fetchPosts(apiBase);
    contentRoutes = posts.map((post) => {
      const cats = (post.categories || []).map((c) => String(c).toLowerCase());
      const isProject = cats.some((c) => PROJECT_TAGS.includes(c));
      return isProject ? `/project/${post.slug}` : `/blog/${post.slug}`;
    });
  } catch (e) {
    console.error("Error fetching blog for sitemap", e);
  }

  const allRoutes = [...routes, ...projectRoutes, ...contentRoutes];

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
