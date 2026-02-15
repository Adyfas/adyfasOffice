import { iDoSomething } from "~/data/Ido";
import ScrollReveal from "../ScrollReveal";
import * as icons from "lucide-react";

export default function CanIdo() {
  return (
    <>
      <ScrollReveal animation="fadeUp">
        <h2 className="text-xl sm:text-2xl font-bold">What I Can Do?</h2>
        <p>I help turn ideas and business needs into reliable, scalable web solutions.</p>
      </ScrollReveal>
      {iDoSomething?.map((item, idx) => {
        const Icon = icons[item.icon as keyof typeof icons] as icons.LucideIcon;
        if (!Icon) return null;
        return (
          <ScrollReveal
            animation="fadeUp"
            delay={0.1 * idx}
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
          </ScrollReveal>
        );
      })}
    </>
  );
}
