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
        <h2 className="text-xl sm:text-2xl font-bold dark:text-white">What I Can Do?</h2>
        <p className="dark:text-slate-300">I help turn ideas and business needs into reliable, scalable web solutions.</p>
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
              <Icon size={34} className="dark:text-slate-300" />
              <div className="flex items-start flex-col">
                <span className="font-bold text-md sm:text-xl dark:text-white">
                  {item.title}
                </span>
                <span className="dark:text-slate-400">{item.desc}</span>
              </div>
            </div>
          </Reveal>
        );
      })}

    </>
  );
}
