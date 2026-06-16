import type { Route } from "../+types/root";
import Reveal from "~/components/Reveal";

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
        <Reveal
          y={20}
          blur={10}
          duration={0.8}
          delay={0.1}
          width="100%"
        >
          <section className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Playground
            </h1>
            <p className="mt-3 text-sm sm:text-base text-gray-700 dark:text-slate-300">
              This is my little playground where I share that I also love games,
              especially Minecraft.
            </p>
          </section>
        </Reveal>
        <div className="flex items-center justify-center mx-2 flex-col">
          <Reveal
            y={30}
            blur={15}
            duration={1}
            delay={0.2}
            width="100%"
          >
            <MinecraftTierCard />
          </Reveal>

          <div className="border-2 border-black/80 dark:border-white/20 rounded-xl text-white p-3 my-2 bg-gray-900 dark:bg-white/10">
            Just For Fun 😅
          </div>
        </div>
      </section>
    </>
  );
}
