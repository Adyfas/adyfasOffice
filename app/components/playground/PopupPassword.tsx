import { motion } from "framer-motion";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { UsetateHandsome } from "~/store/handsome";

export default function PopupPassword() {
  const router = useNavigate();
  const handsomehidden = UsetateHandsome((state) => state.setHidden);
  const [answer, setanswer] = React.useState<string>("");
  function handleSubmit() {
    if (answer !== "") {
      router("/");
      handsomehidden(true);
    }
  }

  return (
    <section className="fixed w-full h-screen inset-0 bg-black/50 backdrop-blur-2xl flex justify-center z-50">
      <motion.div
        initial={{ y: -120, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 350,
          damping: 22,
          duration: 0.85,
        }}
        className="bg-white rounded-xl p-4 text-black flex flex-col z-50 h-fit m-3"
      >
        <h1 className="font-bold text-start">
          If you are a gamer, you can definitely answer this question.
        </h1>
        <p className="text-center text-gray-500">
          who is the most handsome person in the world?🤔
        </p>
        <div className="flex items-center justify-center gap-2">
          <input
            type="text"
            className="p-2 rounded-xl border my-2 w-1/2"
            placeholder="Answer"
            value={answer || ""}
            onChange={(e) => setanswer(e.target.value)}
          />
          <button
            onClick={() => handleSubmit()}
            className="bg-gray-900 text-white text-center rounded-xl p-2 px-4 hover:bg-gray-700 transition-all duration-500"
          >
            Submit
          </button>
        </div>
      </motion.div>
    </section>
  );
}
