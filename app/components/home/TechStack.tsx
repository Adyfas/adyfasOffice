import { TechStack } from "~/data/TechStack";
import ScrollReveal from "../ScrollReveal";

export default function TechStacks() {
  return (
    <>
      <ScrollReveal animation="fadeUp">
        <h2 className="font-bold text-xl sm:text-2xl">Tech Stack</h2>
      </ScrollReveal>
      <div className="my-2 grid grid-cols-3 sm:grid-cols-5 justify-start gap-2">
        {TechStack.map((item, idx) => (
          <ScrollReveal
            animation="fadeUp"
            delay={0.05 * idx}
            key={idx}
          >
            <div
              className="flex items-center gap-2 bg-white bg-opacity-80 rounded-lg shadow-sm border border-gray-200 px-2 py-1"
              style={{ fontSize: "0.85rem", minHeight: "32px" }}
            >
              <span
                className="text-lg"
                style={{
                  width: 42,
                  height: 42,
                  display: "flex",
                  alignItems: "center",
                }}
                dangerouslySetInnerHTML={{ __html: item.logo }}
              />
              <span className="text-xs font-medium text-gray-700">
                {item.name}
              </span>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </>
  );
}