import ScrollReveal from "../ScrollReveal";

const titleDelay = 0;
const contentDelay = 0.35;

export default function Journey() {
  return (
    <section className="py-16">
      <ScrollReveal
        animation="fadeUp"
        delay={0}
      >
        <h2 className="text-xl sm:text-2xl font-bold">The Journey</h2>
        <p className="mt-2 mb-6 text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl">
          How curiosity turned into a career—and how I keep evolving.
        </p>
      </ScrollReveal>
      <ScrollReveal
        animation="fadeUp"
        delay={0.2}
      >
        <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-6">
          <p className="text-base text-gray-700 leading-relaxed">
            My journey into web development started from curiosity about technology and problem-solving. Over time, I transitioned from learning the basics of web design and programming to building real projects used in actual workflows.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
