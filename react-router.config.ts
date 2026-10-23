import fs from "node:fs";
import path from "node:path";
import type { Config } from "@react-router/dev/config";
import { vercelPreset } from "@vercel/react-router/vite";
import { ProjectList } from "./app/data/DataProject";

// Untuk Firebase Hosting, kita perlu disable SSR karena Firebase Hosting hanya support static files
const isFirebaseBuild = process.env.FIREBASE_BUILD === "true";

const PROJECT_TAGS = [
  "project",
  "blog-project",
  "project-blog",
  "big-project",
  "big-project-adyfas",
];

// Tag "project unggulan" (dipakai juga di lib/content.ts).
const BIG_PROJECT_TAG = "big-project-adyfas";

function isProjectCategory(cat: string): boolean {
  return PROJECT_TAGS.includes(cat) || cat === BIG_PROJECT_TAG;
}

/**
 * Baca .env project supaya build lokal memakai API yang sama dengan dev.
 * Nilai dari environment (CI/Vercel) selalu menang.
 */
function readEnvFile(): Record<string, string> {
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return {};
  const values: Record<string, string> = {};
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const match = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (!match) continue;
    values[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
  return values;
}

const buildEnv = { ...readEnvFile(), ...process.env };
const API_BASE =
  buildEnv.VITE_API || "https://api-adyfasoffice.vercel.app/api";

// Daftar cadangan kalau API konten mati saat build.
// Prerender tetap jalan dengan daftar ini + warning keras, supaya deploy
// tidak diam-diam menghilangkan halaman. Update daftar ini kalau publish
// post baru persis saat API down.
const FALLBACK_PROJECT_SLUGS = [
  "warung-go-project",
  "yetim-snack-project",
  "sanova-solusi-manajemen-stok-medis-terintegrasi",
  "web-design-competition",
  "inside-tribe-is-the-best-website-i-ve-ever-built",
  "web-design-competition-with-an-environmental-theme",
  "api-e-commerce-sipbos",
];
const FALLBACK_BLOG_SLUGS = [
  "pengalaman-saya-pkl-di-instansi-selama-1-minggu",
  "pengalaman-saya-mengikuti-lks-lomba-kompetensi-siswa-web-technology",
];

const BUILD_POST_LIST_QUERY = `
  query PostList {
    postConnection(sort: "date") {
      edges {
        node {
          id
          title
          slug
          date
          categories: tags
        }
      }
    }
  }
`;

interface BuildPost {
  slug: string;
  categories: string[];
}

/** Normalisasi daftar kategori (string[]) dari API konten. */
function toCategoryList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item).toLowerCase());
}

/**
 * Daftar post diambil dari API konten (TinaCMS / backend `/posts`).
 * Gagal semua = pakai daftar cadangan + warning keras (build tetap jalan,
 * halaman yang datanya tidak ketemu ter-prerender sebagai cangkang yang
 * terisi saat runtime - jauh lebih baik daripada halaman hilang total
 * yang berujung error routeId di production).
 */
async function fetchPostsForBuild(): Promise<BuildPost[]> {
  try {
    const res = await fetch(`${API_BASE}/tina/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: BUILD_POST_LIST_QUERY }),
    });
    if (res.ok) {
      const payload = await res.json();
      const edges = payload?.data?.postConnection?.edges;
      if (Array.isArray(edges) && edges.length > 0) {
        return edges.map((edge: { node: Record<string, unknown> }) => ({
          slug: String(edge.node.slug ?? ""),
          categories: toCategoryList(edge.node.categories),
        }));
      }
    }
  } catch {
    // lanjut ke sumber berikutnya
  }

  try {
    const res = await fetch(`${API_BASE}/posts`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.map((post: Record<string, unknown>) => ({
          slug: String(post.slug ?? ""),
          categories: toCategoryList(post.categories),
        }));
      }
    }
  } catch {
    // lanjut ke fallback
  }

  return [];
}

async function fetchContentSlugs(): Promise<{
  projects: string[];
  blogs: string[];
}> {
  const fallback = {
    projects: [...FALLBACK_PROJECT_SLUGS],
    blogs: [...FALLBACK_BLOG_SLUGS],
  };
  const warnFallback = (reason: string) => {
    console.warn(
      `\n⚠️  PRERENDER FALLBACK: API konten tidak bisa dibaca (${reason}). ` +
        `Memakai ${fallback.projects.length} project + ${fallback.blogs.length} blog terakhir yang diketahui. ` +
        `Deploy tetap jalan tapi halaman baru tidak ikut. Cek koneksi/API lalu rebuild.\n`
    );
  };

  const posts = await fetchPostsForBuild();
  if (posts.length === 0) {
    warnFallback("tidak ada post yang diterima");
    return fallback;
  }

  const projects: string[] = [];
  const blogs: string[] = [];
  for (const post of posts) {
    if (!post.slug) continue;
    if (post.categories.some(isProjectCategory)) {
      projects.push(post.slug);
    } else {
      blogs.push(post.slug);
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
  // NOTE: post baru butuh rebuild + redeploy agar slug-nya ke-generate.
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
    const { projects, blogs } = await fetchContentSlugs();
    for (const slug of projects) paths.add(`/project/${slug}`);
    for (const slug of blogs) paths.add(`/blog/${slug}`);
    return [...paths];
  },
} satisfies Config;
