export interface BlogPost {
  id: string;
  documentId: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  tags: string[] | null;
  author: string;
  readTime: number | null;
  cover: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

const MEDIUM_FEED_URL = 'https://medium.com/feed/@adyfasofice';
const RSS2JSON_API = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(MEDIUM_FEED_URL)}`;

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

function getSlugFromLink(link: string): string {
  try {
    const url = new URL(link);
    const pathname = url.pathname;
    const parts = pathname.split('/').filter(Boolean);
    const lastPart = parts[parts.length - 1];
    return lastPart || link;
  } catch {
    return link;
  }
}

function getCoverImage(content: string, thumbnail: string): string | null {
  if (thumbnail && !thumbnail.includes('stat?')) return thumbnail;
  
  const imgRegex = /<img[^>]+src=\"([^\"]+)\"/g;
  let match;
  while ((match = imgRegex.exec(content)) !== null) {
    const src = match[1];
    if (!src.includes('medium.com/_/stat')) {
      return src;
    }
  }
  return null;
}

function calculateReadTime(content: string): number {
  const plainText = stripHtml(content);
  const words = plainText.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function mapRssItemToBlogPost(item: any): BlogPost {
  const slug = getSlugFromLink(item.link);
  const cover = getCoverImage(item.content || '', item.thumbnail || '');
  const readTime = calculateReadTime(item.content || '');
  const cleanDescription = stripHtml(item.description || item.content || '').slice(0, 180) + '...';

  // Format pubDate (e.g. "2026-06-16 07:09:28") to ISO format if possible, otherwise use original string
  let isoDate = item.pubDate;
  try {
    isoDate = new Date(item.pubDate.replace(' ', 'T')).toISOString();
  } catch {
    // Fallback if replace/Date parsing fails
  }

  return {
    id: item.guid || slug,
    documentId: item.guid || slug,
    title: item.title,
    slug,
    description: cleanDescription,
    content: item.content || '',
    tags: item.categories && item.categories.length > 0 ? item.categories : null,
    author: item.author || 'Adyfas',
    readTime,
    cover,
    createdAt: isoDate,
    updatedAt: isoDate,
    publishedAt: isoDate,
  };
}

export async function getBlogs(): Promise<BlogPost[]> {
  try {
    const res = await fetch(RSS2JSON_API);
    if (!res.ok) throw new Error(`RSS2JSON fetch error: ${res.status}`);
    const json = await res.json();
    if (json.status !== 'ok' || !json.items) {
      throw new Error(`Invalid feed status: ${json.status}`);
    }
    return json.items.map(mapRssItemToBlogPost);
  } catch (error) {
    console.error('Error fetching blogs from Medium:', error);
    return [];
  }
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const blogs = await getBlogs();
    return blogs.find((b) => b.slug === slug) || null;
  } catch (error) {
    console.error('Error getting blog by slug:', error);
    return null;
  }
}

export async function getBlogById(id: string): Promise<BlogPost | null> {
  try {
    const blogs = await getBlogs();
    return blogs.find((b) => b.id === id || b.documentId === id) || null;
  } catch (error) {
    console.error('Error getting blog by ID:', error);
    return null;
  }
}

export function getStrapiImageUrl(cover: string | null | undefined): string | null {
  return cover || null;
}
