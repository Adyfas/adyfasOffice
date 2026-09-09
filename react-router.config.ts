import type { Config } from "@react-router/dev/config";
import { vercelPreset } from "@vercel/react-router/vite";
import { ProjectList } from "./app/data/DataProject";

// Untuk Firebase Hosting, kita perlu disable SSR karena Firebase Hosting hanya support static files
const isFirebaseBuild = process.env.FIREBASE_BUILD === "true";

const PROJECT_TAGS = ["project", "blog-project"];

function stripCdata(value: string): string {
  return value.replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1").trim();
}

// Slug Hashnode diambil dari RSS publik (tidak butuh API key / .env),
// supaya daftar halaman prerender selalu mengikuti post terbaru.
// Gagal fetch = fallback ke slug lokal, build tidak boleh gagal.
async function fetchHashnodeSlugs(): Promise<{ projects: string[]; blogs: string[] }> {
  const fallback = { projects: [] as string[], blogs: [] as string[] };
  try {
    const res = await fetch("https://adyfas-blog.hashnode.dev/rss.xml");
    if (!res.ok) return fallback;
    const xml = await res.text();
    const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];
    const projects: string[] = [];
    const blogs: string[] = [];
    for (const item of items) {
      const linkMatch = item.match(
        /<link>\s*https?:\/\/[^<]*?hashnode\.dev\/([A-Za-z0-9-]+)\s*<\/link>/
      );
      if (!linkMatch) continue;
      const slug = linkMatch[1];
      const categories = [...item.matchAll(/<category[^>]*>([\s\S]*?)<\/category>/g)].map(
        (m) => stripCdata(m[1]).toLowerCase()
      );
      if (categories.some((c) => PROJECT_TAGS.includes(c))) {
        projects.push(slug);
      } else {
        blogs.push(slug);
      }
    }
    return { projects, blogs };
  } catch {
    return fallback;
  }
}

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  // Disable SSR untuk Firebase Hosting (static hosting)
  ssr: !isFirebaseBuild,
  // Vercel preset untuk deployment (hanya aktif jika bukan Firebase build)
  presets: isFirebaseBuild ? [] : [vercelPreset()],
  // Prerender tiap halaman ke HTML statis saat build, supaya crawler
  // WhatsApp/Twitter/Discord/Facebook dapat og:image per project/blog
  // meski hosting Firebase yang statis (tanpa server SSR).
  // NOTE: post Hashnode baru butuh rebuild + redeploy agar slug-nya ke-generate.
  prerender: async () => {
    const paths = new Set<string>([
      "/",
      "/about",
      "/contact",
      "/project",
      "/blog",
    ]);
    for (const p of ProjectList) {
      paths.add(p.projectLink);
    }
    const { projects, blogs } = await fetchHashnodeSlugs();
    for (const slug of projects) paths.add(`/project/${slug}`);
    for (const slug of blogs) paths.add(`/blog/${slug}`);
    return [...paths];
  },
} satisfies Config;
