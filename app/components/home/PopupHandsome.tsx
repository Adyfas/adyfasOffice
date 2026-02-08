import { motion } from "framer-motion";
import { UsetateHandsome } from "~/store/handsome";
export default function PopupHandsome() {
  const handosmehidden = UsetateHandsome((state) => state.hidden);
  return (
    <>
      {handosmehidden && (
        <motion.div
          initial={{ y: -120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 350,
            damping: 22,
            duration: 0.85,
          }}
          className="absolute  translate-1/2 left-15 bg-white rounded-xl flex flex-col text-black shadow-2xl p-4  z-50"
        >
          <h1>that's me Haha😂😂😂</h1>
        </motion.div>
     )}
    </>
  );
}
