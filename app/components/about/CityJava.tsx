import Reveal from "../Reveal";
import Image from "../Image";

export default function CityJava() {
  return (
    <section>
      <div className="max-w-2xl grid place-content-center">
        <Reveal
          y={30}
          blur={15}
          duration={1}
          delay={0.2}
          width="100%"
        >
          <div className="relative w-full rounded-2xl overflow-hidden shadow-md bg-gray-100 flex items-start justify-start">
            <Image
              alt="Cirebon"
              className="rounded-2xl h-65 w-full"
              src="/images/CEO.png"
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}