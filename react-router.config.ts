import type { Config } from "@react-router/dev/config";
import { vercelPreset } from "@vercel/react-router/vite";
import { ProjectList } from "./app/data/DataProject";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Untuk Firebase Hosting, kita perlu disable SSR karena Firebase Hosting hanya support static files
const isFirebaseBuild = process.env.FIREBASE_BUILD === "true";

const PROJECT_TAGS = ["project", "blog-project"];

/**
 * Scan file Markdown di backend repo untuk dapat slug blog/project.
 * File ada di ../backend-adyfasofice/content/posts/*.md
 * Ini tidak butuh backend jalan — cukup baca file dari repo.
 */
function scanMarkdownSlugs(): { projects: string[]; blogs: string[] } {
  const postsDir = path.join(__dirname, "..", "backend-adyfasofice", "content", "posts");
  const projects: string[] = [];
  const blogs: string[] = [];

  if (!fs.existsSync(postsDir)) {
    console.warn(`[scanMarkdownSlugs] Directory not found: ${postsDir}`);
    return { projects: [], blogs: [] };
  }

  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));

  for (const file of files) {
    const slug = file.replace(".md", "");
    const content = fs.readFileSync(path.join(postsDir, file), "utf-8");
    // Extract tags dari frontmatter
    const tagsMatch = content.match(/^tags:\s*\[([^\]]*)\]/m);
    const tags = tagsMatch
      ? tagsMatch[1].split(",").map((t) => t.trim().replace(/"/g, "").toLowerCase())
      : [];

    if (tags.some((t) => PROJECT_TAGS.includes(t))) {
      projects.push(slug);
    } else {
      blogs.push(slug);
    }
  }

  return { projects, blogs };
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
    const { projects, blogs } = scanMarkdownSlugs();
    for (const slug of projects) paths.add(`/project/${slug}`);
    for (const slug of blogs) paths.add(`/blog/${slug}`);
    return [...paths];
  },
} satisfies Config;
