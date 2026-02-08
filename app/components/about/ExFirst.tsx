import AnimatedContent from "../AnimatedContent";

const titleDelay = 0;
const contentDelay = 0.35;

export default function ExFirst() {
  return (
    <section className="py-16">
      <AnimatedContent
        distance={50}
        direction="vertical"
        reverse={false}
        duration={1.2}
        ease="power3.out"
        initialOpacity={0}
        animateOpacity
        threshold={0.2}
        delay={titleDelay}
      >
        <h2 className="text-xl sm:text-2xl font-bold">Roots & Early Years</h2>
        <span className="inline-block mt-1 text-sm text-gray-500 font-medium">
          2008 — 2023
        </span>
        <p className="mt-2 mb-6 text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl">
          Where it all began—games, curiosity, and the first lines of code.
        </p>
      </AnimatedContent>
      <AnimatedContent
        distance={50}
        direction="vertical"
        reverse={false}
        duration={1.2}
        ease="power3.out"
        initialOpacity={0}
        animateOpacity
        threshold={0.2}
        delay={contentDelay}
      >
        <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-6">
          <p className="text-base text-gray-700 leading-relaxed">
            I'm Ferdi—or Adyfas, as people know me online. I grew up in Cirebon, Indonesia. From a young age, I was drawn to computers and games. My first game was Angry Birds at around 8 years old. When I was 10+, my brother gave me a laptop, and I dove into Minecraft. The specs were modest, but that didn't stop me—those years of playing sparked my interest in how things work behind the screen.
          </p>
        </div>
      </AnimatedContent>
    </section>
  );
}
