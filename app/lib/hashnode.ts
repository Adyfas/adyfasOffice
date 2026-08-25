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

export async function getHashnodePosts(): Promise<HashnodePost[]> {
  try {
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost:5173";

    const response = await fetch(`${origin}/api/hashnode`, {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching Hashnode posts:", error);
    return [];
  }
}

const PROJECT_TAGS = ["project", "blog-project"];

export async function getBlogOnlyPosts(): Promise<HashnodePost[]> {
  const posts = await getHashnodePosts();
  return posts.filter(
    (post) => !post.categories.some((cat) => PROJECT_TAGS.includes(cat))
  );
}

export async function getProjectPosts(): Promise<HashnodePost[]> {
  const posts = await getHashnodePosts();
  return posts.filter((post) =>
    post.categories.some((cat) => PROJECT_TAGS.includes(cat))
  );
}

export async function getHashnodePostBySlug(
  slug: string
): Promise<HashnodePost | null> {
  const posts = await getHashnodePosts();
  return posts.find((p) => p.slug === slug || p.id === slug) || null;
}






