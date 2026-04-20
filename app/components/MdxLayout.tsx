import { MDXProvider } from "@mdx-js/react";

const H1 = (props: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h1 className="text-4xl font-bold mb-4 dark:text-white" {...props} />
);

const H2 = (props: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2 className="text-3xl font-semibold mt-8 mb-3 dark:text-white" {...props} />
);

const P = (props: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className="mb-4 leading-relaxed text-slate-700 dark:text-slate-300" {...props} />
);

const components = {
  h1: H1,
  h2: H2,
  p: P,
};

interface MdxLayoutProps {
  children: React.ReactNode;
}
export default function MdxLayoutPage({ children }: MdxLayoutProps) {
  return (
    <div className="min-h-screen text-black dark:text-white">
        <MDXProvider components={components}>{children}</MDXProvider>
    </div>
  );
}
