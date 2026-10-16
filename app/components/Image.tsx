import { useState } from "react";

type ImageProps = {
  text?: string;
  src: string;
  className: string;
  alt: string;
  hover?: string
};

export default function Image({ text, src, className, alt, hover }: ImageProps) {
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
    </>
  );
}
