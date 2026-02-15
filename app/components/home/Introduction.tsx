import { Link } from "react-router";
import PopupHandsome from "./PopupHandsome";
import { UsetateHandsome } from "~/store/handsome";
import { motion } from "framer-motion";
import { fadeUp } from "~/lib/framer-utils";

export default function Introduction() {
  return (
    <>
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.3}
        className="w-36 h-36 sm:w-32 sm:h-32 my-2 flex items-center gap-2"
      >
        <img
          src="/images/CEO.png"
          alt="adyfas"
          className="rounded-full w-full h-full object-cover"
          sizes="62px"
        />
        {/* <PopupHandsome /> */}
      </motion.div>
      <motion.h1
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.4}
        className="font-bold text-xl sm:text-2xl text-start"
      >
        Hey, Adyfas Here!
      </motion.h1>
      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.5}
        className="pb-2"
      >
        Nice to meet you🙌
      </motion.p>
      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.6}
        className="text-sm sm:text-base"
      >
        Building modern web applications and automation systems that improve
        efficiency, reliability, and business workflows.
      </motion.p>
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.7}
      >
        <Link to="/contact">
          <button className="bg-gray-900 p-2 text-white font-bold rounded-xl px-5 cursor-pointer hover:bg-gray-800 transition-all duration-500 text-lg sm:text-xl hover:scale-101 my-2">
            Contact
          </button>
        </Link>
      </motion.div>
    </>
  );
}
