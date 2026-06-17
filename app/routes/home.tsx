import type { Route } from "./+types/home";
import Reveal from "~/components/Reveal";

import Introduction from "~/components/home/Introduction";
import CanIdo from "~/components/home/CanIdo";
import FeatureProject from "~/components/home/FeatureProject";
import TechStacks from "~/components/home/TechStack";
import Learning from "~/components/home/Learning";
import CalltoActionContact from "~/components/CalltoActionContact";
import { UsetateHandsome } from "~/store/handsome";
export function meta({ }: Route.MetaArgs) {
  const title = "Adyfas | Full Stack Web Developer & Software Engineer";
  const description = "Welcome to Adyfas's portfolio. I'm a passionate Full Stack Developer specializing in modern web technologies, React, and creating stunning digital experiences.";
  const url = "https://adyfas-page.web.app/";
  
  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
}

export default function Home() {
  const handsome = UsetateHandsome((state) => state.hidden);
  const setHandsome = UsetateHandsome((state) => state.setHidden);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 itmes-start">
      <Reveal
        y={40}
        blur={0}
        duration={1.2}
        delay={0.1}
        width="100%"
      >
        <Introduction />
      </Reveal>


      <div className="my-10 flex flex-col items-start justify-start gap-5">
        <CanIdo />
      </div>

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
