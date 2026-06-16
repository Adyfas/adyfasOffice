const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

export interface StrapiImage {
  id: number;
  url: string;
  alternativeText: string | null;
  width: number;
  height: number;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
  };
}

export interface StrapiMeta {
  pagination?: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export interface StrapiResponse<T> {
  data: T[];
  meta: StrapiMeta;
}

export interface StrapiSingleResponse<T> {
  data: T;
  meta: StrapiMeta;
}

export interface BlogPost {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  tags: string[] | null;
  author: string;
  readTime: number | null;
  cover: StrapiImage | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export function getStrapiImageUrl(image: StrapiImage | null | undefined): string | null {
  if (!image) return null;
  const baseUrl = STRAPI_URL;
  if (image.formats?.medium?.url) return `${baseUrl}${image.formats.medium.url}`;
  if (image.formats?.small?.url) return `${baseUrl}${image.formats.small.url}`;
  return `${baseUrl}${image.url}`;
}

function formatStrapiData<T>(data: any): T {
  if (Array.isArray(data)) return data as T;
  return data as T;
}

export async function getBlogs(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${STRAPI_URL}/api/blogs?populate=cover&sort[0]=publishedAt:desc`);
    if (!res.ok) throw new Error(`Strapi error: ${res.status}`);
    const json: StrapiResponse<BlogPost> = await res.json();
    return json.data;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${STRAPI_URL}/api/blogs?filters[slug][$eq]=${slug}&populate=cover`);
    if (!res.ok) throw new Error(`Strapi error: ${res.status}`);
    const json: StrapiResponse<BlogPost> = await res.json();
    return json.data[0] || null;
  } catch (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
}

export async function getBlogById(id: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${STRAPI_URL}/api/blogs/${id}?populate=cover`);
    if (!res.ok) throw new Error(`Strapi error: ${res.status}`);
    const json: StrapiSingleResponse<BlogPost> = await res.json();
    return json.data;
  } catch (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
}
