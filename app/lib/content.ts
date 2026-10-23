import { markdownToHtml } from "./markdown";

/**
 * Lapisan data konten blog.
 *
 * Sumber (berurutan prioritas):
 *  1. TinaCMS (GraphQL) - content .md di GitHub, index Tina selalu terbaru
 *     sehingga post baru langsung tampil tanpa rebuild/redeploy.
 *  2. Endpoint `/posts` milik backend sendiri - membaca file .md langsung
 *     dari repo, dipakai sebagai fallback saat Tina belum dikonfigurasi
 *     (belum ada TINA_TOKEN) atau GraphQL Tina bermasalah.
 *
 * Bentuk JSON yang dikembalikan sengaja sama dengan kontrak lama
 * ("HashnodePost") supaya komponen yang sudah ada tidak perlu diubah.
 */

export interface Post {
  id: string;
  title: string;
  slug: string;
  brief: string;
  content: string;
  publishedAt: string;
  coverImage?: {
    url: string;
  };
  link: string;
  github?: string;
  categories: string[];
}

const API_BASE = import.meta.env.VITE_API ?? "";
const TINA_GRAPHQL_URL = `${API_BASE}/tina/graphql`;
const POSTS_URL = `${API_BASE}/posts`;

/** Host API tanpa suffix /api - dipakai untuk membuat URL media absolut. */
const API_ORIGIN = API_BASE.replace(/\/api\/?$/, "");

export const PROJECT_TAGS: string[] = ["project", "blog-project"];
export const BIG_PROJECT_TAG = "big-project-adyfas";

/**
 * Query Tina untuk daftar post.
 *
 * CATATAN:
 * - `cover` bertipe String (path relatif, mis. /uploads/cover.jpg).
 * - `sort: "date"` hanya support ASCENDING di Tina, jadi urutannya dibalik
 *   di kode (lihat getPostsResult) supaya post terbaru tetap di atas.
 */
export const POST_LIST_QUERY = `
  query PostList {
    postConnection(sort: "date") {
      edges {
        node {
          id
          title
          slug
          date
          description
          body
          tags
          link
          draft
          featured
          cover
        }
      }
    }
  }
`;

/** Query Tina untuk satu dokumen (dipakai visual editing / `useTina`). */
export const POST_DOCUMENT_QUERY = `
  query PostByRelativePath($relativePath: String!) {
    post(relativePath: $relativePath) {
      id
      title
      slug
      date
      description
      body
      tags
      link
      draft
      featured
      cover
    }
  }
`;

export interface TinaPostNode {
  id?: string | null;
  title?: string | null;
  slug?: string | null;
  date?: string | null;
  description?: string | null;
  body?: string | null;
  tags?: string[] | null;
  link?: string | null;
  draft?: boolean | null;
  featured?: boolean | null;
  cover?: string | null;
}

function readCover(cover: TinaPostNode["cover"]): string {
  if (!cover) return "";
  return cover;
}

/** Path relatif seperti /uploads/cover.jpg -> URL absolut. */
export function resolveMediaUrl(value: string): string {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  if (!API_ORIGIN) return value;
  return `${API_ORIGIN}${value.startsWith("/") ? "" : "/"}${value}`;
}

function toPost(node: TinaPostNode): Post {
  const cover = readCover(node.cover);
  const slug = String(node.slug ?? "");
  // Tina memakai id berupa path ("content/posts/x.md"); website memakai slug.
  const rawId = String(node.id ?? "");
  const id = rawId.includes("/") ? slug : rawId || slug;

  return {
    id,
    title: String(node.title ?? ""),
    slug,
    brief: String(node.description ?? ""),
    content: markdownToHtml(String(node.body ?? "")),
    publishedAt: String(node.date ?? ""),
    coverImage: cover ? { url: resolveMediaUrl(cover) } : undefined,
    link: String(node.link ?? ""),
    categories: (node.tags ?? []).map((tag) => String(tag).toLowerCase()),
  };
}

/**
 * Petakan node dokumen Tina ke bentuk Post.
 * Dipakai juga saat live preview Tina mengirim data terbaru.
 */
export function mapTinaPost(node: TinaPostNode | null | undefined): Post | null {
  if (!node) return null;
  return toPost(node);
}

interface BackendPost {
  id: string;
  title: string;
  slug: string;
  brief: string;
  body: string;
  publishedAt: string;
  coverImage?: { url: string };
  link: string;
  github?: string;
  categories: string[];
}

function fromBackendPost(post: BackendPost): Post {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    brief: post.brief ?? "",
    content: markdownToHtml(post.body ?? ""),
    publishedAt: post.publishedAt ?? "",
    coverImage: post.coverImage,
    link: post.link ?? "",
    github: post.github,
    categories: (post.categories ?? []).map((tag) => String(tag).toLowerCase()),
  };
}

async function fetchTinaGraphQL(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<any | null> {
  try {
    const response = await fetch(TINA_GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });
    if (!response.ok) return null;
    const payload = await response.json();
    if (payload?.errors?.length) return null;
    return payload?.data ?? null;
  } catch {
    return null;
  }
}

async function fetchBackendPosts(): Promise<Post[]> {
  try {
    const response = await fetch(POSTS_URL, { cache: "no-store" });
    if (!response.ok) return [];
    const data = await response.json();
    if (!Array.isArray(data)) return [];
    return data.map(fromBackendPost);
  } catch (error) {
    console.error("Error fetching posts from backend API:", error);
    return [];
  }
}

/**
 * Post index + query GraphQL yang dipakai untuk visual editing.
 * `tinaData` berisi response GraphQL apa adanya (dibutuhkan `useTina`).
 */
export interface PostsResult {
  posts: Post[];
  tinaData: Record<string, unknown> | null;
}

let cache: { at: number; result: PostsResult } | null = null;
const CACHE_TTL_MS = 30 * 1000;

export async function getPostsResult(): Promise<PostsResult> {
  const now = Date.now();
  if (cache && now - cache.at < CACHE_TTL_MS) {
    return cache.result;
  }

  let result: PostsResult = { posts: [], tinaData: null };

  const tinaData = await fetchTinaGraphQL(POST_LIST_QUERY);
  const edges = tinaData?.postConnection?.edges;
  if (Array.isArray(edges)) {
    result = {
      // Tina hanya support sort ascending -> dibalik supaya terbaru di atas.
      posts: edges
        .map((edge: { node: TinaPostNode }) => toPost(edge.node))
        .filter((post: Post) => Boolean(post.slug))
        .reverse(),
      tinaData,
    };
  } else {
    result = { posts: await fetchBackendPosts(), tinaData: null };
  }

  cache = { at: now, result };
  return result;
}

export async function getPosts(): Promise<Post[]> {
  return (await getPostsResult()).posts;
}

export async function getBlogOnlyPosts(): Promise<Post[]> {
  const posts = await getPosts();
  return posts.filter(
    (post) => !post.categories.some((cat) => PROJECT_TAGS.includes(cat)),
  );
}

export async function getProjectPosts(): Promise<Post[]> {
  const posts = await getPosts();
  const bigProjects = posts.filter((post) =>
    post.categories.some((cat) => cat === BIG_PROJECT_TAG),
  );
  const regularProjects = posts.filter(
    (post) =>
      post.categories.some((cat) => PROJECT_TAGS.includes(cat)) &&
      !post.categories.some((cat) => cat === BIG_PROJECT_TAG),
  );
  return [...bigProjects, ...regularProjects];
}

export async function getBigProjects(): Promise<Post[]> {
  const posts = await getPosts();
  return posts
    .filter((post) => post.categories.some((cat) => cat === BIG_PROJECT_TAG))
    .slice(0, 3);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getPosts();
  return posts.find((post) => post.slug === slug || post.id === slug) ?? null;
}

/**
 * Raw GraphQL Tina untuk satu dokumen + query/variables-nya.
 * Dipakai `useTina` agar live preview bisa mencocokkan field artikel.
 */
export async function getTinaDocument(
  slug: string,
): Promise<{
  query: string;
  variables: Record<string, unknown>;
  data: Record<string, unknown>;
} | null> {
  const variables = { relativePath: `${slug}.md` };
  const data = await fetchTinaGraphQL(POST_DOCUMENT_QUERY, variables);
  if (!data?.post) return null;
  return { query: POST_DOCUMENT_QUERY, variables, data };
}
