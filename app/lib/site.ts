export const SITE_URL = "https://adyfas.com";

export const SITE_NAME = "Adyfas";

export const GA_MEASUREMENT_ID = "G-KLHFZ35QZK";

export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/faveicon.png`;

export function absoluteUrl(pathOrUrl: string | undefined | null): string {
  if (!pathOrUrl) return DEFAULT_OG_IMAGE;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${SITE_URL}${path}`;
}
