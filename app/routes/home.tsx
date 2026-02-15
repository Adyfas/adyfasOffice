import type { Route } from "./+types/home";
import ScrollReveal from "~/components/ScrollReveal";
import Introduction from "~/components/home/Introduction";
import CanIdo from "~/components/home/CanIdo";
import FeatureProject from "~/components/home/FeatureProject";
import TechStacks from "~/components/home/TechStack";
import Learning from "~/components/home/Learning";
import CalltoActionContact from "~/components/CalltoActionContact";
import { UsetateHandsome } from "~/store/handsome";
export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Adyfas" },
    {
      name: "description",
      content:
        "Wellcome in my website adyfas and i'm a developer i'm have experience in web development",
    },
  ];
}

export default function Home() {
  const handsome = UsetateHandsome((state) => state.hidden);
  const setHandsome = UsetateHandsome((state) => state.setHidden);

  return (
    <>
      <ScrollReveal animation="fadeUp" delay={0.2}>
        <Introduction />
      </ScrollReveal>

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
    </>
  );
}
