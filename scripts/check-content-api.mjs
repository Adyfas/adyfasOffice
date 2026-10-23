/**
 * Smoke test API konten (backend-adyfasofice).
 *
 * Dipakai sebelum deploy: memastikan endpoint yang dipakai frontend benar-benar
 * hidup dan bentuk datanya sesuai kontrak. Tanpa ini, kesalahan paling umum
 * (backend lama belum ter-deploy -> /posts 404) baru ketahuan setelah situs
 * kosong di produksi.
 *
 * Pakai:
 *   node scripts/check-content-api.mjs
 *   VITE_API=https://api-adyfasoffice.vercel.app/api node scripts/check-content-api.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

/** Baca .env lokal (nilai dari environment tetap menang). */
function readEnvFile() {
  const envPath = path.join(ROOT, ".env");
  if (!fs.existsSync(envPath)) return {};
  const values = {};
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const match = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (!match) continue;
    values[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
  return values;
}

const env = { ...readEnvFile(), ...process.env };
const API_BASE = (env.VITE_API || "https://api-adyfasoffice.vercel.app/api").replace(
  /\/$/,
  "",
);

/** Slug yang pasti ada (post migrasi dari Hashnode). */
const KNOWN_SLUG = "warung-go-project";

let failed = 0;

function pass(message) {
  console.log(`  ok   ${message}`);
}

function fail(message) {
  failed += 1;
  console.log(`  FAIL ${message}`);
}

async function main() {
  console.log(`Cek API konten: ${API_BASE}\n`);

  // 1. Daftar post
  let response;
  try {
    response = await fetch(`${API_BASE}/posts`, {
      headers: { Accept: "application/json" },
    });
  } catch (error) {
    console.error(`Tidak bisa menghubungi ${API_BASE}/posts`);
    console.error(`  ${error.message}`);
    process.exit(1);
  }

  console.log(`GET /posts -> ${response.status}`);
  if (!response.ok) {
    fail(
      `endpoint /posts membalas ${response.status}. Backend lama kemungkinan belum ter-deploy (deploy backend dulu, baru frontend).`,
    );
    process.exit(1);
  }

  const posts = await response.json();
  if (!Array.isArray(posts)) {
    fail("/posts bukan array JSON");
    process.exit(1);
  }
  if (posts.length === 0) fail("/posts kosong (tidak ada file di content/posts)");
  else pass(`${posts.length} post`);

  // 2. Bentuk tiap post
  const required = ["id", "title", "slug", "brief", "body", "publishedAt"];
  const broken = posts.filter((post) =>
    required.some((field) => !post?.[field] || typeof post[field] !== "string"),
  );
  if (broken.length > 0) {
    fail(`${broken.length} post kehilangan field wajib (${required.join(", ")})`);
    broken.slice(0, 3).forEach((post) => console.log(`       - ${post?.slug ?? "?"}`));
  } else {
    pass("semua post punya id/title/slug/brief/body/publishedAt");
  }

  const noCover = posts.filter((post) => !post?.coverImage?.url);
  if (noCover.length > 0) {
    console.log(`  note ${noCover.length} post tanpa cover (boleh, tapi cek visualnya)`);
  } else {
    pass("semua post punya coverImage.url absolut");
  }

  const notAbsolute = posts.filter(
    (post) => post?.coverImage?.url && !/^https?:\/\//.test(post.coverImage.url),
  );
  if (notAbsolute.length > 0) fail(`${notAbsolute.length} coverImage.url tidak absolut`);

  // 3. Urutan terbaru dulu
  const dates = posts.map((post) => new Date(post.publishedAt).getTime());
  const sorted = dates.every((value, index) => index === 0 || dates[index - 1] >= value);
  if (!sorted) fail("urutan post bukan terbaru-dulu");
  else pass("urutan terbaru-dulu");

  // 4. Detail satu post + alias lama
  for (const endpoint of [`/posts/${KNOWN_SLUG}`, `/hashnode`]) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      fail(`GET ${endpoint} -> ${res.status}`);
      continue;
    }
    const data = await res.json();
    const found = Array.isArray(data) ? data.some((p) => p.slug === KNOWN_SLUG) : data.slug === KNOWN_SLUG;
    if (found) pass(`GET ${endpoint} memuat "${KNOWN_SLUG}"`);
    else fail(`GET ${endpoint} tidak memuat "${KNOWN_SLUG}"`);
  }

  // 5. CORS: origin situs harus dapat header ACAO
  const origin = env.CHECK_ORIGIN || "https://adyfas.com";
  const corsRes = await fetch(`${API_BASE}/posts`, {
    headers: { Accept: "application/json", Origin: origin },
  });
  const acao = corsRes.headers.get("access-control-allow-origin");
  if (acao === origin) pass(`CORS mengizinkan ${origin}`);
  else fail(`CORS menolak ${origin} (Access-Control-Allow-Origin: ${acao ?? "tidak ada"})`);

  console.log("");
  if (failed > 0) {
    console.error(`${failed} pemeriksaan gagal.`);
    process.exit(1);
  }
  console.log("Semua pemeriksaan lolos.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
