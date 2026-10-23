import { marked } from "marked";
import { resolveMediaUrl } from "./api";

marked.setOptions({
  gfm: true,
  breaks: false,
});

/**
 * Gambar artikel ditulis relatif (`/uploads/foo.jpg`) karena file-nya memang
 * ada di repo backend, bukan di domain situs. Tanpa ini browser mencari
 * `adyfas.com/uploads/foo.jpg` yang tidak ada.
 */
const MEDIA_ATTRIBUTE = /(\s(?:src|href))="(\/uploads\/[^"]*)"/g;

function absolutizeMedia(html: string): string {
  return html.replace(
    MEDIA_ATTRIBUTE,
    (_match, attribute: string, path: string) =>
      `${attribute}="${resolveMediaUrl(path)}"`,
  );
}

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
  return typeof html === "string" ? absolutizeMedia(html) : "";
}
