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
 * Ambil nilai tags dari frontmatter Markdown.
 * HARUS mendukung dua gaya YAML, karena style block-list dulu tidak terbaca
 * (regex lama `tags: [ ... ]` saja) sehingga SEMUA post dikira blog dan
 * halaman /project/<slug>-nya tidak pernah ikut prerender:
 *
 *   tags: ["project", "blog"]        <- inline
 *   tags:                            <- block list
 *     - "project"
 *     - "blog-project"
 */
function parseFrontmatterTags(content: string): string[] {
  const frontmatter = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatter) return [];

  const body = frontmatter[1];
  const clean = (value: string) =>
    value.trim().replace(/^["']|["']$/g, "").trim().toLowerCase();

  // inline: tags: ["a", "b"] / tags: a, b
  const inline = body.match(/^tags:[ \t]*([^\r\n]+)$/m);
  if (inline) {
    const value = inline[1].trim();
    if (value && value !== "[]") {
      return value
        .replace(/^\s*\[|\]\s*$/g, "")
        .split(",")
        .map(clean)
        .filter(Boolean);
    }
  }

  // block list: tags:\n  - "a"\n  - "b"
  const block = body.match(/^tags:[ \t]*\r?\n((?:[ \t]*-[^\r\n]*(?:\r?\n|$))+)/m);
  if (block) {
    return block[1]
      .split(/\r?\n/)
      .map((line) => line.replace(/^[ \t]*-[ \t]*/, ""))
      .map(clean)
      .filter(Boolean);
  }

  return [];
}

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
    // Slug mengikuti frontmatter kalau ada, fallback ke nama file.
    const content = fs.readFileSync(path.join(postsDir, file), "utf-8");
    const slugMatch = content.match(/^slug:[ \t]*["']?([^"'\r\n]+)["']?[ \t]*$/m);
    const slug = (slugMatch?.[1] || file.replace(/\.md$/, "")).trim();
    const tags = parseFrontmatterTags(content);

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
