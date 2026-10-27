import { marked } from "marked";

/**
 * Konversi Markdown -> HTML.
 *
 * Dipakai di server (SSR/prerender) maupun di browser, supaya hasil render
 * artikel identik di keduanya. Sumber konten (file .md di GitHub) adalah
 * Markdown murni, jadi konversi ini satu-satunya tempat HTML dibuat.
 */
export function markdownToHtml(markdown: string): string {
  if (!markdown || !markdown.trim()) return "";
  
  const html = marked.parse(markdown);
  
  // marked.parse() bisa mengembalikan string atau Promise<string>
  if (typeof html === "string") {
    return absolutizeMedia(html);
  }
  
  // Kalau bukan string (mis. objek atau Promise), log untuk debugging
  console.error("[markdownToHtml] marked.parse() returned non-string:", typeof html, html);
  return "";
}

/**
 * Ganti URL media relatif (/uploads/...) menjadi absolut ke backend API.
 * Konten Markdown dari backend bisa pakai path relatif untuk gambar,
 * jadi kita perlu resolve ke URL absolut supaya render di browser berhasil.
 */
function absolutizeMedia(html: string): string {
  const apiBase = import.meta.env.VITE_API?.replace(/\/api$/, "") || "";
  return html.replace(
    /src="(\/uploads\/[^"]+)"/g,
    `src="${apiBase}$1"`,
  );
}
