import React from "react";
import Reveal from "../Reveal";
import { dataJourney } from "~/data/Journey";
const MyJourney = () => {
  const getGridCols = (count: number): string => {
    if (count === 1) return "grid-cols-1 max-w-[300px]";
    if (count === 2) return "grid-cols-1 sm:grid-cols- max-w-[600px]";
    return "grid-cols-1 sm:grid-cols-2 max-w-full";
  };

  return (
    <Reveal y={20} blur={10} duration={0.5} delay={1.0} width="100%">
      <section className="relative flex items-start justify-start flex-col">
        {dataJourney.map((item, index) => (
          <Reveal
            y={20}
            blur={10}
            duration={0.5}
            delay={0.1}
            width="100%"
          >
            <div className="flex items-start justify-start flex-col w-full">
              <div className="my-2">
                <h2 className="text-md sm:text-xl font-bold mb-2 text-gray-900 dark:text-white mt-2">
                  {item.title}
                </h2>
                {/* <p className="text-gray-500 text-md">12 Juli 2026</p> */}
              </div>
              <p className="text-base sm:text-lg text-gray-600 dark:text-slate-300 leading-relaxed mt-2">
                {item.body}
              </p>

              {/* Container Foto dengan Dynamic Grid */}
              <div
                className={`grid gap-2 w-full ${getGridCols(item.documentation.length)}`}
              >
                {item.documentation.length >= 1 && (
                  <>
                    {item.documentation.map((src, index) => (
                      <div
                        key={index}
                        className="overflow-hidden rounded-2xl shadow-md transition-all duration-300"
                      >
                        <img
                          src={src}
                          alt={`Dokumentasi pengalaman ${index + 1}`}
                          className="w-full h-[190px] object-cover rounded-2xl hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </section>
    </Reveal>
  );
};

export default MyJourney;
