/**
 * Konfigurasi alamat API konten.
 *
 * Dipisah dari `content.ts` supaya `markdown.ts` bisa memakai `resolveMediaUrl`
 * tanpa saling impor (kalau digabung jadi circular import).
 */
export const API_BASE = import.meta.env.VITE_API ?? "";

/** Host API tanpa suffix /api - dipakai untuk membuat URL media absolut. */
export const API_ORIGIN = API_BASE.replace(/\/api\/?$/, "");

/**
 * Path media relatif (`/uploads/cover.jpg`) -> URL absolut.
 * URL eksternal (http/https) dibiarkan apa adanya.
 */
export function resolveMediaUrl(value: string): string {
  if (!value) return "";
  if (/^(https?:)?\/\//i.test(value)) return value;
  if (!API_ORIGIN) return value;
  return `${API_ORIGIN}${value.startsWith("/") ? "" : "/"}${value}`;
}
