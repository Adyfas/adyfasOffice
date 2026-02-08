import AnimatedContent from "../AnimatedContent";
import Image from "../Image";


export default function CityJava(){
    return(
          <section>
        <div className="max-w-2xl grid place-content-center">
          {/* <Image
            alt="Cirebon"
            className="rounded-2xl h-65 w-[500px]"
            text="Cirebon, Indonesia"
            src="/images/about/cirebon.webp"
          /> */}
          <AnimatedContent
            distance={50}
            direction="vertical"
            reverse={false}
            duration={1.2}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            threshold={0.2}
            delay={0.3}
          >
            <div className="relative w-full rounded-2xl overflow-hidden shadow-md bg-gray-100 flex items-start justify-start">
              <Image
                alt="Cirebon"
                className="rounded-2xl h-65 w-full"
                src="/images/CEO.png"
              />
            </div>
          </AnimatedContent>
        </div>
      </section>
    )
}