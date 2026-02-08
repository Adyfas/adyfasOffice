import { Link } from "react-router";
import AnimatedContent from "../AnimatedContent";
import { timelineData } from "~/data/Timeline";

export default function Learning() {
  return (
    <>
      <div className="mb-8">
        <AnimatedContent
          distance={150}
          direction="vertical"
          reverse={false}
          duration={0.5}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          threshold={0.2}
          delay={0}
        >
          <h2 className="text-xl sm:text-2xl font-bold">
            Experience & Learning
          </h2>
        </AnimatedContent>
        {/* <p className="mt-1 text-sm text-gray-600">
                    A brief timeline of my journey in web development and system
                    building.
                  </p> */}
      </div>

      <div className="relative pl-4">
        <div className="absolute left-[6px] top-0 h-full w-px bg-gray-200" />

        <div className="space-y-8">
          {timelineData.map((item, index) => (
            <div key={index} className="relative flex gap-x-6">
              <div
                className={`mt-1 h-3 w-6 relative sm:right-4 right-3.5 bottom-1 rounded-full border-2 border-gray-900 bg-white`}
              />

              <AnimatedContent
                distance={50}
                direction="vertical"
                reverse={false}
                duration={1.5}
                ease="power3.out"
                initialOpacity={0}
                animateOpacity
                threshold={0.2}
                delay={0.2 * index}
              >
                <div
                  className={`w-full rounded-xl border p-4 transition border-gray-200 bg-white shadow-sm`}
                >
                  <p className="text-xs font-medium uppercase text-gray-500">
                    {item.date}
                  </p>
                  <h3 className="mt-1 text-sm font-semibold text-gray-900">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">
                      {item.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    {item.project?.map((project, idx) => {
                      return (
                        <Link
                          key={idx}
                          className="text-blue-500 text-xs hover:underline py-1"
                          to={project.link}
                        >
                          {project.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </AnimatedContent>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
