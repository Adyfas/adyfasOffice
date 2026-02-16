import { iDoSomething } from "~/data/Ido";
import Reveal from "../Reveal";
import * as icons from "lucide-react";

export default function CanIdo() {
  return (
    <>
      <Reveal
        y={20}
        blur={10}
        duration={0.8}
        width="100%"
      >
        <h2 className="text-xl sm:text-2xl font-bold">What I Can Do?</h2>
        <p>I help turn ideas and business needs into reliable, scalable web solutions.</p>
      </Reveal>
      {iDoSomething?.map((item, idx) => {
        const Icon = icons[item.icon as keyof typeof icons] as icons.LucideIcon;
        if (!Icon) return null;
        return (
          <Reveal
            y={20}
            blur={8}
            duration={0.8}
            delay={0.1 * idx}
            key={idx}
            width="100%"
          >
            <div className="flex items-start justify-start gap-2 py-2">
              <Icon size={34} />
              <div className="flex items-start flex-col">
                <span className="font-bold text-md sm:text-xl ">
                  {item.title}
                </span>
                <span>{item.desc}</span>
              </div>
            </div>
          </Reveal>
        );
      })}

    </>
  );
}
