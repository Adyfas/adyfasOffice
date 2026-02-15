import ScrollReveal from "../ScrollReveal";
import Image from "../Image";

const titleDelay = 0;
const imageDelay = 0.35;
const paragraphDelay = 0.6;

export default function ExThird() {
  return (
    <section className="py-16">
      <ScrollReveal
        animation="fadeUp"
        delay={0}
      >
        <h2 className="text-xl sm:text-2xl font-bold">Ongoing Growth</h2>
        <span className="inline-block mt-1 text-sm text-gray-500 font-medium">
          2026 — Now
        </span>
        <p className="mt-2 mb-8 text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl">
          The journey continues—refining skills, embracing challenges, and building the next chapter.
        </p>
      </ScrollReveal>

      <div className="flex flex-col sm:flex-row gap-6 mb-8">
        <ScrollReveal
          animation="fadeUp"
          delay={0.2}
        >
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm w-full sm:w-56 aspect-4/5 bg-gray-100 shrink-0">
            <Image
              alt="Adyfas 2026"
              src="/images/CEO.png"
              className="object-cover w-full h-full"
            />
          </div>
        </ScrollReveal>
        <ScrollReveal
          animation="fadeUp"
          delay={0.4}
        >
          <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-6 flex-1">
            <p className="text-base text-gray-700 leading-relaxed">
              The game has just begun. I'm committed to refining my skills, learning from every challenge, and consistently improving. Many may have tried and failed, but I choose to believe in progress, consistency, and growth. This is my journey—and if you've read this far, it's a pleasure to meet you.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
