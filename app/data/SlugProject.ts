export const projectMdxMap = {
  ecomind: () => import("../blog/projects/ecomind.mdx"),
  warunggo: () => import("../blog/projects/warunggo.mdx"),
  insidetribe: () => import("../blog/projects/insidetribe.mdx"),
  aiindonesia: () => import("../blog/projects/aiindonesia.mdx"),
  koncomoto: () => import("../blog/projects/koncomoto.mdx"),
  sipbos: () => import("../blog/projects/sipbos.mdx"),
} as const;

export type ProjectSlug = keyof typeof projectMdxMap;

