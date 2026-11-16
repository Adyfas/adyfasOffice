import CardLab from "~/components/lab/CardLab";
import DataLabAdyfas from "~/data/Lab";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "~/lib/site";
import type { Route } from "./+types/adylab";
import Reveal from "~/components/Reveal";
import { FlaskConical } from "lucide-react"

export function meta({ }: Route.MetaArgs) {
  const title = "Adyfas Lab — Web Experiments and Prototypes";
  const description =
    "Adyfas's experimentation space for trying out web ideas, visuals, and prototypes.";
  const url = `${SITE_URL}/lab`;
  const ogImage = DEFAULT_OG_IMAGE;

  return [
    { title },
    { name: "description", content: description },
    {
      name: "keywords",
      content: "Adyfas Lab, web experiments, prototypes, UI, creative coding",
    },
    { name: "author", content: "Adyfas (Ferdi Iskandar)" },
    { name: "robots", content: "index, follow" },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:type", content: "website" },
    { property: "og:image", content: ogImage },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: ogImage },
    { tagName: "link", rel: "canonical", href: url },
  ];
}

export default function AdyfasLab() {
  const [latestLab, ...otherLabs] = DataLabAdyfas;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Adyfas Lab",
    description:
      "Adyfas's experimentation space for trying out web ideas, visuals, and prototypes.",
    url: `${SITE_URL}/lab`,
    author: {
      "@type": "Person",
      name: "Ferdi Iskandar",
      alternateName: "Adyfas",
      url: SITE_URL,
    },
  };

  return (
    <section
      className="mx-auto w-full max-w-5xl px-1 py-6 sm:px-2 sm:py-8"
      aria-labelledby="lab-heading"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="mb-8 sm:mb-10">
        <Reveal
          y={20}
          blur={10}
          duration={0.8}
          width="100%"
        >
          <h1 className="text-xl sm:text-2xl font-bold text-start my-2 dark:text-white">
            Lab Adyfas
          </h1>
          <p className="dark:text-slate-300">
            A space to experiment with ideas, visuals, and little details on the web. Not everything is finished yet and that’s exactly what makes it fun.
          </p>
        </Reveal>
      </header>

      {latestLab && (
        <section className="mb-12" aria-labelledby="latest-lab-heading">
          <div className="mb-5">
            <div className="flex items-center gap-2">
              {/* <FlaskConical className="text-xs text-blue-700 dark:text-sky-300" size={20} /> */}
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700 dark:text-sky-300">
                New in the Lab
              </p>
            </div>
            <h2
              id="latest-lab-heading"
              className="text-2xl font-semibold tracking-tight text-gray-950 dark:text-white"
            >
              Latest experiment
            </h2>
          </div>
          <div className="flex flex-col">
            <div className="w-full max-w-2xl">
              <Reveal y={40} blur={15} duration={1.5} delay={0.1} width="100%">
                <CardLab {...latestLab} />
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {otherLabs.length > 0 && (
        <section aria-labelledby="more-labs-heading">
          <h2
            id="more-labs-heading"
            className="mb-5 text-xl font-semibold tracking-tight text-gray-950 dark:text-white"
          >
            Other experiments
          </h2>
          <div
            className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3"
            aria-label="Eksperimen Adyfas"
          >
            {otherLabs.map((lab, index) => (
              <Reveal y={40} blur={15} duration={1.5} delay={0.1 * index} width="100%">
                <CardLab key={lab.slug} {...lab} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
