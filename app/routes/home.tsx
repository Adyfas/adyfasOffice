import type { Route } from "./+types/home";
import Reveal from "~/components/Reveal";
import Introduction from "~/components/home/Introduction";
import CanIdo from "~/components/home/CanIdo";
import FeatureProject from "~/components/home/FeatureProject";
import TechStacks from "~/components/home/TechStack";
import Learning from "~/components/home/Learning";
import CalltoActionContact from "~/components/CalltoActionContact";
import { UsetateHandsome } from "~/store/handsome";
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from "~/lib/site";
export function meta({ }: Route.MetaArgs) {
  const title = "Ferdi Iskandar (Adyfas) | Full Stack Web Developer & Software Engineer";
  const description = "Portfolio of Ferdi Iskandar, also known as Adyfas — Full Stack Web Developer & Software Engineer from Indonesia, specializing in modern web technologies, React, and creating stunning digital experiences.";
  const url = `${SITE_URL}/`;
  
  return [
    { title },
    { name: "description", content: description },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: DEFAULT_OG_IMAGE },
    { property: "og:url", content: url },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: DEFAULT_OG_IMAGE },
    { tagName: "link", rel: "canonical", href: url },
  ];
}

export default function Home() {
  const handsome = UsetateHandsome((state) => state.hidden);
  const setHandsome = UsetateHandsome((state) => state.setHidden);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ferdi Iskandar",
    alternateName: "Adyfas",
    url: SITE_URL,
    jobTitle: "Full Stack Web Developer & Software Engineer",
    description:
      "Ferdi Iskandar, also known as Adyfas — Full Stack Web Developer & Software Engineer from Indonesia.",
    sameAs: [
      "https://www.instagram.com/adyfas.ver/",
      "https://www.linkedin.com/in/ferdi-iskandar-1a0a95385/",
      "https://github.com/Adyfas",
    ],
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 itmes-start">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Reveal
        y={40}
        blur={0}
        duration={1.2}
        delay={0.1}
        width="100%"
      >
        <Introduction />
      </Reveal>

{/* 
      <div className="my-10 flex flex-col items-start justify-start gap-5">
        <CanIdo />
      </div> */}

      <div className="my-10 flex flex-col items-start justify-start">
        <FeatureProject />
      </div>

      <div className="my-10 flex flex-col items-start justify-start">
        <TechStacks />
      </div>

      <section className="my-10 max-w-3xl">
        <Learning />
      </section>

      <CalltoActionContact />
    </div>
  );
}
