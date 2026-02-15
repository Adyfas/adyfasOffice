import type { Route } from "./+types/playground";
import ScrollReveal from "~/components/ScrollReveal";

import { Link } from "react-router";
import MinecraftSkinViewer from "~/components/playground/MinecraftSkinViewer";
import MinecraftTierCard from "~/components/playground/MinecraftTierCard";
import PopupPassword from "~/components/playground/PopupPassword";

export function meta({ }: Route.MetaArgs) {
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
    <>
      <PopupPassword />
      <section className="relative">
        <ScrollReveal
          animation="fadeUp"
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
        </ScrollReveal>
        <div className="flex items-center justify-center mx-2 flex-col">
          <ScrollReveal
            animation="fadeUp"
            delay={0.3}
          >
            <MinecraftTierCard />
          </ScrollReveal>

          <div className="border-2 border-black/80 rounded-xl text-white p-3 my-2 bg-gray-900">
            Just For Fun 😅
          </div>
        </div>
      </section>
    </>
  );
}
