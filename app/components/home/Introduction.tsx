import { Link } from "react-router";
import PopupHandsome from "./PopupHandsome";
import { UsetateHandsome } from "~/store/handsome";
import TechText from "../TechText";

export default function Introduction() {
  return (
    <>
      <div className="w-36 h-36 sm:w-32 sm:h-32 my-2 flex items-center gap-2">
        <img
          src="/images/CEO.png"
          alt="Ferdi Iskandar"
          className="rounded-full w-full h-full object-cover"
          sizes="62px"
        />
        {/* <PopupHandsome /> */}
      </div>
      <h1 className="font-bold text-xl sm:text-2xl text-start dark:text-white">
        Hey, I'm Ferdi Iskandar
      </h1>
      <h2 className="font-bold text-md text-start dark:text-white">
       I Build Web Applications and Digital Products That Solve Real Problems.
      </h2>
      {/* <p className="pb-2 dark:text-slate-300">
        Full Stack Web Developer &amp; Software Engineer 🙌
      </p> */}
      <p className="text-sm sm:text-base dark:text-slate-300">
        {/* Web Developer & Automation Enthusiast, I help individuals and small
          businesses build fast, modern websites and simple automation systems
          that solve real problems. */}
       Software Engineer focused on building useful web applications, business systems, and digital products from idea to implementation.
      </p>
      {/* <div className="flex items-center justify-start gap-5">
        <p className="pb-2 text-sm sm:text-base">
          Open for freelance & collaboration
        </p>
      </div> */}
      <div className="flex items-center justify-start gap-5">
        <Link to="/project">
          <button className="bg-black text-white dark:bg-white dark:text-black border border-black dark:border-white p-2 rounded-xl px-5 cursor-pointer hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-500 text-md hover:scale-101 my-2">
            Explore My Work
          </button>
        </Link>

        {/* <Link to="/project">
          <button className="bg-white text-black dark:bg-black dark:text-white border border-black dark:border-white p-2 rounded-xl px-5 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 transition-all duration-500 text-md hover:scale-101 my-2">
            See My Project
          </button>
        </Link> */}
      </div>
    </>
  );
}
