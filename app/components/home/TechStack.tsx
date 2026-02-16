import { TechStack } from "~/data/TechStack";
import Reveal from "../Reveal";


export default function TechStacks() {
  return (
    <>
      <Reveal
        y={20}
        blur={8}
        duration={0.6}
        delay={0.1}
        width="100%"
      >
        <h2 className="font-bold text-xl sm:text-2xl">Tech Stack</h2>
      </Reveal>
      <div className="my-2 grid grid-cols-3 sm:grid-cols-5 justify-start gap-2">
        {TechStack.map((item, idx) => (
          <Reveal
            y={15}
            blur={5}
            duration={0.5}
            delay={idx * 0.04}
            key={idx}
            width="100%"
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
          </Reveal>
        ))}
      </div>

    </>
  );
}