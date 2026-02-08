import { iDoSomething } from "~/data/Ido";
import AnimatedContent from "../AnimatedContent";
import * as icons from "lucide-react";

export default function CanIdo() {
  return (
    <>
      <AnimatedContent
        distance={50}
        direction="vertical"
        reverse={false}
        duration={0.5}
        ease="power3.out"
        initialOpacity={0}
        animateOpacity
        threshold={0.2}
        delay={0}
      >
        <h2 className="text-xl sm:text-2xl font-bold">What I Can Do?</h2>
        {/* <p>Web Development – Building responsive websites</p> */}
        <p>I help turn ideas and business needs into reliable, scalable web solutions.</p>
      </AnimatedContent>
      {iDoSomething?.map((item, idx) => {
        const Icon = icons[item.icon as keyof typeof icons] as icons.LucideIcon;
        if (!Icon) return null;
        return (
          <AnimatedContent
            distance={50}
            direction="vertical"
            reverse={false}
            duration={1.5}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            threshold={0.2}
            delay={0.2 * idx}
            key={idx}
          >
            <div className="flex items-center justify-center gap-5 py-2">
              <Icon size={34} />
              <div className="flex items-start flex-col">
                <span className="font-bold text-md sm:text-xl ">
                  {item.title}
                </span>
                <span>{item.desc}</span>
              </div>
            </div>
          </AnimatedContent>
        );
      })}
    </>
  );
}
