import React, { type ReactNode } from "react";
import Image from "~/components/Image";
interface Images {
  img: string;
  alt: string;
}

export default function Img({img, alt }: Images) {
  return (
      <Image
        alt={alt}
        className="rounded-2xl h-65"
        src={img}
      />
  );
}
