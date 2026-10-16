import { useEffect } from "react";
import { UsestateLightbox } from "~/store/lightbox";

// Batas ukuran (px): gambar di bawah ini dianggap ikon/avatar, tidak dibuka.
const MIN_SIZE = 200;

// Satu listener global: klik pada <img> mana pun membuka lightbox.
// Mencakup <img> JSX biasa maupun gambar di dalam HTML artikel (Hashnode)
// yang tidak bisa ditempeli onClick React.
export default function LightboxListener() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const img = target?.closest?.("img");
      if (!img) return;
      if (img.hasAttribute("data-no-lightbox")) return;

      const rect = img.getBoundingClientRect();
      if (rect.width < MIN_SIZE && rect.height < MIN_SIZE) return;

      const src = img.currentSrc || img.src;
      if (!src) return;

      UsestateLightbox.getState().open(src, img.alt || "");
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
