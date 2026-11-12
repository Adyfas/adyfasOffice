import { Link } from "react-router";
import type { LabData } from "~/data/Lab";

type CardLabProps = Pick<
  LabData,
  | "slug"
  | "title"
  | "cover"
  | "description"
  | "author"
  | "category"
  | "gradient"
>;

const gradients = {
  aurora: "bg-gradient-to-br from-blue-700 via-sky-500 to-cyan-300",
  sunset: "bg-gradient-to-br from-amber-300 via-orange-400 to-fuchsia-500",
  mint: "bg-gradient-to-br from-emerald-500 via-teal-400 to-sky-500",
  violet: "bg-gradient-to-br from-violet-700 via-purple-500 to-pink-300",
};

export default function CardLab({
  slug,
  title,
  cover,
  description,
  author,
  category,
  gradient,
}: CardLabProps) {
  return (
    <Link
      to={`/lab/${slug}`}
      className="group flex min-w-0 flex-col rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 dark:focus-visible:outline-sky-300"
    >
      <article className="flex flex-col">
        <div
          className={`relative aspect-[1.15/1] overflow-hidden rounded-xl sm:aspect-[1.2/1] ${gradients[gradient]}`}
        >
          <img
            src={cover}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:transition-none"
          />
          <span className="absolute inset-0 bg-black/[0.03] transition-colors group-hover:bg-black/[0.08]" />
        </div>

        <div className="pt-4">
          <h2 className="text-lg font-semibold leading-snug tracking-tight text-gray-900 transition-colors group-hover:text-gray-600 dark:text-white dark:group-hover:text-gray-300 sm:text-xl">
            {title}
          </h2>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-600 dark:text-slate-300">
            {description}
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
            <span className="font-medium text-gray-800 dark:text-slate-200">
              {category}
            </span>
            <span aria-hidden="true">·</span>
            <span>{author}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
