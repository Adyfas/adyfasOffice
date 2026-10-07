import { TechStack } from "~/data/TechStack";
import Reveal from "../Reveal";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TechStacks() {
  interface Tech {
    name: string;
    logo: string;
    description: string;
  }

  const [popup, setPopup] = useState<boolean>(false);
  const [popupData, setPopupData] = useState<Tech[]>([]);
  const handlePopup = (name: string) => {
    const data = TechStack.filter((item) => item.description == name);
    setPopupData(data);
    setPopup(true);
  };
  return (
    <>
      {popup && (
        <div
          className="inset-0 fixed flex items-center justify-center z-50 m-4"
          onClick={() => setPopup(!popup)}
        >
          <AnimatePresence>
            {popupData.map((item, index) => {
              return (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  key={index}
                  className="bg-white/50 dark:bg-black/50 dark:text-white text-black backdrop-blur-xl rounded-2xl p-4 max-w-2xl h-45 border dark:border-white"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl dark:text-white text-black font-bold flex items-center justify-between gap-5">
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
                      {item.name}
                    </h1>
                    <button
                      className="cursor-pointer text-ceter"
                      onClick={() => setPopup(!popup)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                        viewBox="0 0 1024 1024"
                      >
                        <path d="M0 0h1024v1024H0z" fill="none" />
                        <path
                          fill="currentColor"
                          fill-rule="evenodd"
                          d="M799.855 166.312c.023.007.043.018.084.059l57.69 57.69c.041.041.052.06.059.084a.1.1 0 0 1 0 .069c-.007.023-.018.042-.059.083L569.926 512l287.703 287.703c.041.04.052.06.059.083a.12.12 0 0 1 0 .07c-.007.022-.018.042-.059.083l-57.69 57.69c-.041.041-.06.052-.084.059a.1.1 0 0 1-.069 0c-.023-.007-.042-.018-.083-.059L512 569.926L224.297 857.629c-.04.041-.06.052-.083.059a.12.12 0 0 1-.07 0c-.022-.007-.042-.018-.083-.059l-57.69-57.69c-.041-.041-.052-.06-.059-.084a.1.1 0 0 1 0-.069c.007-.023.018-.042.059-.083L454.073 512L166.371 224.297c-.041-.04-.052-.06-.059-.083a.12.12 0 0 1 0-.07c.007-.022.018-.042.059-.083l57.69-57.69c.041-.041.06-.052.084-.059a.1.1 0 0 1 .069 0c.023.007.042.018.083.059L512 454.073l287.703-287.702c.04-.041.06-.052.083-.059a.12.12 0 0 1 .07 0Z"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-start">
                    <p className="my-4">{item.description}</p>
                  </div>
                </motion.div>
              );
            })}{" "}
          </AnimatePresence>
        </div>
      )}

      <Reveal y={20} blur={8} duration={0.6} delay={0.1} width="100%">
        <h2 className="font-bold text-xl sm:text-2xl dark:text-white">
          Tech Stack
        </h2>
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
              className="flex items-center gap-2 bg-white dark:bg-white/5 bg-opacity-80 dark:bg-opacity-100 rounded-lg shadow-sm dark:shadow-none border border-gray-200 dark:border-white/10 px-2 py-1 cursor-pointer"
              style={{ fontSize: "0.85rem", minHeight: "32px" }}
              onClick={() => handlePopup(item.description)}
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
              <span className="text-xs font-medium text-gray-700 dark:text-slate-300">
                {item.name}
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </>
  );
}
