// components/MinecraftTierCard.tsx
import React from "react";

interface TierIcon {
  icon: string;
  label: "HT1" | "LT1";
}

const MinecraftTierCard = () => {
  const tierIcons: TierIcon[] = [
    { icon: "/images/playground/nethop.svg", label: "HT1" },
    { icon: "/images/playground/smp.svg", label: "HT1" },
    { icon: "/images/playground/mace.svg", label: "LT1" },
    { icon: "/images/playground/sword.svg", label: "LT1" },
    { icon: "/images/playground/pot.svg", label: "HT1" },
    { icon: "/images/playground/vanilla.svg", label: "HT1" },
    { icon: "/images/playground/axe.svg", label: "LT1" },
    { icon: "/images/playground/uhc.svg", label: "LT1" },
  ];

  return (
    <div className="w-full max-w-md bg-[#0f172a] rounded-xl p-5 shadow-lg border border-[#1e293b]">
      <div className="flex flex-col items-center mb-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-4 border-amber-400 overflow-hidden">
            <img
              src="/images/playground/adyfas.png"
              alt="Minecraft Skin"
              className="w-full h-full object-cover scale-200"
              width={96}
              height={96}
            />
          </div>
        </div>
        <h1 className="mt-3 text-2xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 bg-clip-text text-transparent">
          Adyfas
        </h1>
      </div>

      {/* Tier Badge */}
      <div className="flex justify-center mb-3">
        <div className="px-4 py-1.5 rounded-full bg-amber-900/70 flex items-center gap-2 border border-amber-700">
          <span className="text-amber-300 text-lg">🎖️</span>
          <span className="font-semibold text-amber-200">
            Combat Grandmaster
          </span>
        </div>
      </div>

      {/* Region */}
      <p className="text-center text-gray-400 text-sm mb-4">Asia</p>

      {/* NameMC Link */}
      <div className="flex justify-center mb-6">
        <a
          href="https://adyfas.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1e293b] border border-[#334155] rounded-lg text-gray-300 text-sm hover:bg-[#334155] transition-colors"
        >
          <span className="font-bold">N</span>
          <span>The Best Player</span>
          <span>↗</span>
        </a>
      </div>

      {/* POSITION */}
      <div className="mb-6">
        <h3 className="text-gray-300 font-semibold uppercase text-sm mb-2">
          POSITION
        </h3>
        <div className="flex items-center bg-[#1e293b] rounded-lg px-3 py-2">
          <div className="bg-amber-500 text-white font-bold text-lg px-3 py-1.5 rounded-l-lg">
            1.
          </div>
          <div className="ml-3 flex items-center">
            <img
              src="/images/playground/overall.svg"
              alt="Trophy"
              className="w-6 h-6 mx-2"
            />
            <span className="text-gray-200 font-medium">OVERALL</span>
            <span className="text-gray-400 ml-1">(124 points)</span>
          </div>
        </div>
      </div>

      {/* TIERS */}
      <div>
        <h3 className="text-gray-300 font-semibold uppercase text-sm mb-2">
          TIERS
        </h3>
        <div className="grid grid-cols-8 gap-2 bg-[#1e293b] p-3 rounded-lg">
          {tierIcons.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-lg bg-[#334155] border border-[#475569] flex items-center justify-center text-xl">
                <img
                  src={item.icon}
                  alt="Minecraft Tier Card"
                  className="w-full scale-65"
                />
              </div>
              <span
                className={`text-xs mt-1 font-medium ${
                  item.label === "HT1" ? "text-amber-400" : "text-cyan-400"
                }`}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MinecraftTierCard;
