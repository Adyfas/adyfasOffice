import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import LabMarkdown from "~/components/lab/LabMarkdown";
import { getLabBySlug, type LabData } from "~/data/Lab";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "~/lib/site";
import type { Route } from "./+types/adylabDetails";

function findLab(slug: string | undefined): LabData {
  const lab = slug ? getLabBySlug(slug) : undefined;
  if (!lab) throw new Response("Lab experiment not found", { status: 404 });
  return lab;
}

export function loader({ params }: Route.LoaderArgs) {
  return { lab: findLab(params.slug) };
}

export function clientLoader({ params }: Route.ClientLoaderArgs) {
  return { lab: findLab(params.slug) };
}

export function meta({ data }: Route.MetaArgs) {
  const lab = data?.lab;
  const title = lab ? `${lab.title} | Adyfas Lab` : "Adyfas Lab";
  const description =
    lab?.description ?? "Eksperimen dan prototipe web dari Adyfas.";
  const url = `${SITE_URL}/lab/${lab?.slug ?? ""}`;
  const image = lab?.cover ? `${SITE_URL}${lab.cover}` : DEFAULT_OG_IMAGE;

  return [
    { title },
    { name: "description", content: description },
    { name: "author", content: lab?.author ?? "Adyfas" },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: image },
    { property: "og:image:alt", content: lab?.title ?? title },
    { property: "og:url", content: url },
    { property: "og:type", content: "article" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
    { tagName: "link", rel: "canonical", href: url },
  ];
}

export default function AdyfasLabDetails({
  loaderData,
}: Route.ComponentProps) {
  const { lab } = loaderData;
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: lab.title,
    description: lab.description,
    image: `${SITE_URL}${lab.cover}`,
    author: { "@type": "Person", name: lab.author },
    mainEntityOfPage: `${SITE_URL}/lab/${lab.slug}`,
  }).replace(/</g, "\\u003c");

  return (
    <article className="mx-auto w-full max-w-3xl px-1 pb-16 pt-6 sm:px-2 sm:pt-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <Link
        to="/lab"
        className="mb-8 inline-flex min-h-11 items-center gap-2 rounded-md text-sm text-gray-600 transition-colors hover:text-gray-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 dark:text-slate-300 dark:hover:text-white dark:focus-visible:outline-sky-300"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back
      </Link>

      <header>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700 dark:text-sky-300">
          {lab.category} <span aria-hidden="true">·</span> {lab.author}
        </p>
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-950 dark:text-white sm:text-4xl">
          {lab.title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-gray-600 dark:text-slate-300 sm:text-lg">
          {lab.description}
        </p>
        <div className="mt-8 aspect-[1.7/1] overflow-hidden rounded-xl bg-gray-100 dark:bg-white/5">
          <img
            src={lab.cover}
            alt={lab.title}
            className="h-full w-full object-cover"
          />
        </div>
      </header>

      <div className="mt-10">
        <LabMarkdown source={lab.content} />
      </div>
    </article>
  );
}
