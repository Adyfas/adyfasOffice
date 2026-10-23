import { marked } from "marked";

marked.setOptions({
  gfm: true,
  breaks: false,
});

/**
 * Konversi Markdown -> HTML.
 *
 * Dipakai di server (SSR/prerender) maupun di browser, supaya hasil render
 * artikel identik di keduanya. Sumber konten (file .md di GitHub) adalah
 * Markdown murni, jadi konversi ini satu-satunya tempat HTML dibuat.
 */
export function markdownToHtml(markdown: string): string {
  if (!markdown) return "";
  const html = marked.parse(markdown, { async: false });
  return typeof html === "string" ? html : "";
}
