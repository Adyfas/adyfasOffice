import type { Route } from "./+types/home";
import AnimatedContent from "~/components/AnimatedContent";
import Introduction from "~/components/home/Introduction";
import CanIdo from "~/components/home/CanIdo";
import FeatureProject from "~/components/home/FeatureProject";
import TechStacks from "~/components/home/TechStack";
import Learning from "~/components/home/Learning";
import CalltoActionContact from "~/components/CalltoActionContact";
import { UsetateHandsome } from "~/store/handsome";
export function meta({}: Route.MetaArgs) {
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
      <AnimatedContent
        distance={50}
        direction="vertical"
        reverse={false}
        duration={1.2}
        ease="power3.out"
        initialOpacity={0}
        animateOpacity
        threshold={0.2}
        delay={0.3}
      >
        <Introduction />
      </AnimatedContent>

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
