import Reveal from "../Reveal";
import Image from "../Image";

export default function ExSecond() {
  return (
    <section className="py-16">
      <Reveal
        y={20}
        blur={10}
        duration={0.8}
        width="100%"
      >
        <h2 className="text-xl sm:text-2xl font-bold">Competitions & Real Projects</h2>
        <span className="inline-block mt-1 text-sm text-gray-500 font-medium">
          2024 — 2025
        </span>
        <p className="mt-2 mb-8 text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl">
          From competing on the national stage to shipping production-ready applications.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <Reveal
          y={30}
          blur={12}
          duration={1}
          delay={0.1}
          width="100%"
        >
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm aspect-4/5 bg-gray-100">
            <Image
              alt="1st Runner Up - National Web Competition"
              src="/images/about/first-win.jpeg"
              className="object-cover w-full h-full"
              text="2024"
            />
          </div>
          <p className="mt-2 text-xs font-medium text-gray-500 text-center">1st Runner Up</p>
        </Reveal>
        <Reveal
          y={30}
          blur={12}
          duration={1}
          delay={0.2}
          width="100%"
        >
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm aspect-4/5 bg-gray-100">
            <Image
              alt="Ferdidifest"
              src="/images/ferdidifest1.webp"
              className="object-cover w-full h-full"
              text="2025"
            />
          </div>
          <p className="mt-2 text-xs font-medium text-gray-500 text-center">Ferdidifest</p>
        </Reveal>
        <Reveal
          y={30}
          blur={12}
          duration={1}
          delay={0.3}
          width="100%"
        >
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm aspect-4/5 bg-gray-100">
            <Image
              alt="2nd Win - National Competition"
              src="/images/about/2nd-win.jpeg"
              className="object-cover w-full h-full"
              text="2025"
            />
          </div>
          <p className="mt-2 text-xs font-medium text-gray-500 text-center">2nd Win</p>
        </Reveal>
      </div>

      <Reveal
        y={20}
        blur={10}
        duration={0.8}
        delay={0.4}
        width="100%"
      >
        <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-6">
          <p className="text-base text-gray-700 leading-relaxed">
            Around 15, I started achieving in IT at school—learning web design, coding, and technology. From there, I landed a major project with Koncomoto: a web application for invoice automation and client management. I also built an e-commerce API. The shift from playing games to building real solutions was complete.
          </p>
        </div>
      </Reveal>
    </section>
  );
}

