export type HighlightItem = {
  id: string;
  src: string;
  alt: string;
  title: string;
  year: string;
  aspectClass: "tall" | "square" | "wide"; // Untuk variasi tinggi Pinterest
};

export const Highlights: HighlightItem[] = [
  {
    id: "1st-runner-up",
    src: "/images/about/first-win.jpeg",
    alt: "1st Runner Up - National Web Competition",
    title: "1st Runner Up",
    year: "2024",
    aspectClass: "tall",
  },
  {
    id: "2nd-win",
    src: "/images/about/2nd-win.jpeg",
    alt: "2nd Win - National Competition",
    title: "2nd Win",
    year: "2025",
    aspectClass: "wide",
  },
  {
    id: "ferdidifest",
    src: "/images/ferdidifest1.webp",
    alt: "Ferdidifest",
    title: "Ferdidifest",
    year: "2025",
    aspectClass: "square",
  },
];
