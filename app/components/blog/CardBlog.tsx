import React from "react";
import { Bookmark, MoreHorizontal } from "lucide-react";

export type Blog = {
  title: string;
  description: string;
  createTime: string;
  image?: string;
  author?: string;
  authorImage?: string;
  readTime?: string;
  slug?: string;
};

export default function CardBlog({
  title,
  description,
  createTime,
  image,
  author = "Adyfas",
  authorImage,
  readTime,
  slug,
}: Blog) {
  return (
    <article className="w-full py-6 border-b border-gray-200 dark:border-white/10 group">
      {/* Header: Author & Date */}
      <div className="flex items-center gap-2 mb-2.5 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
        {authorImage ? (
          <img
            src={authorImage}
            alt={author}
            className="w-5 h-5 rounded-full object-cover"
          />
        ) : (
          <div className="w-5 h-5 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-[10px] font-semibold text-gray-700 dark:text-gray-300">
            {author.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="font-medium text-gray-900 dark:text-gray-200">
          {author}
        </span>
        <span>·</span>
        <span className="text-gray-500 dark:text-gray-400">{createTime}</span>
      </div>

      <div className="flex items-start justify-between gap-4 sm:gap-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white leading-snug sm:leading-tight tracking-tight line-clamp-2 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
            {title}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed font-normal">
            {description}
          </p>
        </div>
        {image && (
          <div className="w-24 h-20 sm:w-36 sm:h-24 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-3">
          {readTime && <span>{readTime}</span>}
        </div>
      </div>
    </article>
  );
}

