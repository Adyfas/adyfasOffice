declare module "*.mdx" {
  import type * as React from "react";

  export const meta: {
    title?: string;
    slug?: string;
    date?: string;
    description?: string;
    role?: string;
    link?: string;
    git?: string;
    tech?: string[];
    [key: string]: unknown;
  };

  const Component: React.ComponentType;
  export default Component;
}

