import React, { type ReactNode } from "react";

interface Hyperlinks {
  children: ReactNode;
  link: string;
}

export default function Hyperlink({ children, link }: Hyperlinks) {
  return (
    <a className="hover:underline no-underline text-blue-500" target="_blank" href={link}>
      {children}
    </a>
  );
}
