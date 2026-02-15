import ScrollReveal from "../ScrollReveal";
import { Highlights } from "~/data/Highlights";

const aspectMap = {
  tall: "aspect-[3/4]",
  square: "aspect-square",
  wide: "aspect-[4/3]",
};

export default function HighlightsAchievements() {
  return (
    <section className="py-16">
      <ScrollReveal animation="fadeUp">
        <h2 className="text-xl sm:text-2xl font-bold">Highlights & Achievements</h2>
        <p className="mt-2 mb-10 text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl">
          Competition wins, project milestones, and proof of what I can deliver.
        </p>
      </ScrollReveal>

      {/* Pinterest-style masonry: CSS columns */}
      <div className="columns-2 gap-x-4">
        {Highlights.map((item, idx) => (
          <ScrollReveal
            key={item.id}
            animation="fadeUp"
            delay={0.1 * idx}
            className="break-inside-avoid mb-4"
          >
            <div className={`relative w-full ${aspectMap[item.aspectClass]} overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300`}>
              <img
                src={item.src}
                alt={item.alt}
                className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
