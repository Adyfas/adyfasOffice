import type { Route } from "./+types/playground";
import AnimatedContent from "~/components/AnimatedContent";

import { Link } from "react-router";
import MinecraftSkinViewer from "~/components/playground/MinecraftSkinViewer";
import MinecraftTierCard from "~/components/playground/MinecraftTierCard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Adyfas - Playground" },
    {
      name: "description",
      content:
        "A small playground page where I share that I also love games, especially Minecraft.",
    },
  ] as const;
}

export default function PlaygroundPage() {
  return (
    <section className="relative">
      <AnimatedContent
        distance={50}
        direction="vertical"
        duration={1.2}
        ease="power3.out"
        initialOpacity={0}
        animateOpacity
        threshold={0.2}
        delay={0.3}
      >
        <section className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Playground
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-700">
            This is my little playground where I share that I also love games,
            especially Minecraft.
          </p>
        </section>
      </AnimatedContent>
      <div className="flex items-center justify-center mx-2 flex-col">
        <AnimatedContent
          distance={50}
          direction="vertical"
          duration={1.2}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          threshold={0.2}
          delay={0.3}
        >
          <MinecraftTierCard />
        </AnimatedContent>

        <div className="border-2 border-black/80 rounded-xl text-white p-3 my-2 bg-gray-900">
          Just For Fun 😅
        </div>
      </div>
    </section>
  );
}
