import { useState } from "react";

type ImageProps = {
  text?: string;
  src: string;
  className: string;
  alt: string;
  hover?: string
};

type PopupImageProps = {
  src: string;
  text?: string;
  alt: string;
  onClose: () => void;
};

function PopupImage({ src, text, alt, onClose }: PopupImageProps) {
  return (
    <section
      className="inset-0 flex items-center justify-center h-screen bg-black/50 p-2 fixed z-50"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt={alt}
          className="object-cover w-1/2 h-auto max-w-[170vw] max-h-[170vh] rounded-xl"
          loading="lazy"
          style={{ display: "block" }}
        />
        {text && (
          <p className="mt-2 text-white text-center bg-black/60 px-2 py-1 rounded">
            {text}
          </p>
        )}
        <button
          onClick={onClose}
          className="absolute top-0 right-0 m-2 text-white text-xl bg-black/70 rounded-full px-3 py-1 hover:bg-black/90 transition"
          aria-label="Close"
        >
          &times;
        </button>
      </div>
    </section>
  );
}



export default function Image({ text, src, className, alt, hover }: ImageProps) {
  const [popup, setPopup] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const showText =
    typeof text === "string" && text.trim().length > 0 && isHovering;

  return (
    <>
      <div
        className={`relative group overflow-hidden`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        style={{ cursor: "pointer" }}
      >
        <img
          src={src}
          alt={alt}
          className={`${className} transition-transform duration-300 group-hover:scale-105`}
          loading="lazy"
          onClick={() => setPopup(true)}
        />
        {/* Text muncul dari atas ke bawah saat hover */}
        {text && text.trim().length > 0 && (
          <p
            className={`
              bg-gray-50 rounded-xl p-2 left-5 bottom-2 absolute
              transition-all duration-300 
              ${
                isHovering
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 pointer-events-none -translate-y-3"
              }
            `}
            style={{ zIndex: 3 }}
          >
            {text}
          </p>
        )}
      </div>

      {popup && (
        <PopupImage
          src={src}
          alt={alt}
          text={text}
          onClose={() => setPopup(false)}
        />
      )}
    </>
  );
}
