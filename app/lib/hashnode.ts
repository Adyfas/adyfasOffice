export interface HashnodePost {
  id: string;
  title: string;
  slug: string;
  brief: string;
  content?: string;
  publishedAt: string;
  coverImage?: {
    url: string;
  };
  link: string;
  categories: string[];
}

const BACKEND_URL = import.meta.env.VITE_API_DEV;
// || import.meta.env.VITE_API;
console.log("data backkend", BACKEND_URL);

export async function getHashnodePosts(): Promise<HashnodePost[]> {
  try {
    const response = await fetch(`${BACKEND_URL}/hashnode`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching Hashnode posts from backend API:", error);
    return [];
  }
}

const PROJECT_TAGS = ["project", "blog-project"];

export async function getBlogOnlyPosts(): Promise<HashnodePost[]> {
  const posts = await getHashnodePosts();
  return posts.filter(
    (post) => !post.categories.some((cat) => PROJECT_TAGS.includes(cat)),
  );
}

export async function getProjectPosts(): Promise<HashnodePost[]> {
  const posts = await getHashnodePosts();
  return posts.filter((post) =>
    post.categories.some((cat) => PROJECT_TAGS.includes(cat)),
  );
}

export async function getBigProjects(): Promise<HashnodePost[]> {
  const posts = await getHashnodePosts();
  return posts
    .filter((post) => post.categories.some((cat) => cat === "big-project"))
    .slice(0, 3);
}

export async function getHashnodePostBySlug(
  slug: string,
): Promise<HashnodePost | null> {
  const posts = await getHashnodePosts();
  return posts.find((p) => p.slug === slug || p.id === slug) || null;
}
