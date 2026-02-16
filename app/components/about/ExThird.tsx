import Reveal from "../Reveal";
import Image from "../Image";

export default function ExThird() {
  return (
    <section className="py-16">
      <Reveal
        y={20}
        blur={10}
        duration={0.8}
        width="100%"
      >
        <h2 className="text-xl sm:text-2xl font-bold">Ongoing Growth</h2>
        <span className="inline-block mt-1 text-sm text-gray-500 font-medium">
          2026 — Now
        </span>
        <p className="mt-2 mb-8 text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl">
          The journey continues—refining skills, embracing challenges, and building the next chapter.
        </p>
      </Reveal>

      <div className="flex flex-col sm:flex-row gap-6 mb-8">
        <Reveal
          y={30}
          blur={12}
          duration={1}
          delay={0.2}
          width="fit-content"
          className="shrink-0"
        >
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm w-full sm:w-56 aspect-4/5 bg-gray-100">
            <Image
              alt="Adyfas 2026"
              src="/images/CEO.png"
              className="object-cover w-full h-full"
            />
          </div>
        </Reveal>
        <Reveal
          y={20}
          blur={10}
          duration={0.8}
          delay={0.3}
          width="100%"
        >
          <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-6 flex-1">
            <p className="text-base text-gray-700 leading-relaxed">
              The game has just begun. I'm committed to refining my skills, learning from every challenge, and consistently improving. Many may have tried and failed, but I choose to believe in progress, consistency, and growth. This is my journey—and if you've read this far, it's a pleasure to meet you.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

