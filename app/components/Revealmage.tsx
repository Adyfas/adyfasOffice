import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { UsestateLightbox } from "~/store/lightbox";

const Revealmage = () => {
  const isOpen = UsestateLightbox((s) => s.isOpen);
  const src = UsestateLightbox((s) => s.src);
  const alt = UsestateLightbox((s) => s.alt);
  const close = UsestateLightbox((s) => s.close);

  // Escape menutup + kunci scroll halaman selama popup terbuka
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && src && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={alt || "Image preview"}
          className="fixed inset-0 z-[9990] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
        >
          <motion.figure
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-full flex-col items-center"
          >
            <img
              src={src}
              alt={alt || "Image preview"}
              className="max-h-[85dvh] w-auto max-w-[92vw] rounded-xl object-contain shadow-2xl"
              draggable={false}
            />
            {alt && (
              <figcaption className="mt-3 max-w-[92vw] truncate text-center text-sm text-white/80">
                {alt}
              </figcaption>
            )}
            <button
              onClick={close}
              aria-label="Close image preview"
              className="absolute -top-2 -right-2 flex h-11 w-11 items-center justify-center rounded-full bg-white text-black shadow-lg transition hover:scale-105 active:scale-95 dark:bg-white dark:text-black"
            >
              <X size={20} />
            </button>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Revealmage;
