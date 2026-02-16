import { motion } from "framer-motion";
import Reveal from "../Reveal";
import { Highlights } from "~/data/Highlights";

const aspectMap = {
  tall: "aspect-[3/4]",
  square: "aspect-square",
  wide: "aspect-[4/3]",
};

export default function HighlightsAchievements() {
  return (
    <section className="py-16">
      <Reveal
        y={30}
        blur={12}
        duration={1}
        width="100%"
      >
        <h2 className="text-xl sm:text-2xl font-bold">Highlights & Achievements</h2>
        <p className="mt-2 mb-10 text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl">
          Competition wins, project milestones, and proof of what I can deliver.
        </p>
      </Reveal>

      {/* Pinterest-style masonry: CSS columns */}
      <div className="columns-2 [column-gap:1rem]">
        {Highlights.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.8,
              delay: idx * 0.1,
              ease: [0.22, 1, 0.36, 1]
            }}
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
          </motion.div>
        ))}
      </div>
    </section>
  );
}
