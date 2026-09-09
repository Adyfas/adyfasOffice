import { Link } from "react-router";
import PopupHandsome from "./PopupHandsome";
import { UsetateHandsome } from "~/store/handsome";

export default function Introduction() {
  return (
    <>
      <div className="w-36 h-36 sm:w-32 sm:h-32 my-2 flex items-center gap-2">
        <img
          src="/images/CEO.png"
          alt="adyfas"
          className="rounded-full w-full h-full object-cover"
          sizes="62px"
        />
        {/* <PopupHandsome /> */}
      </div>
      <h1 className="font-bold text-xl sm:text-2xl text-start dark:text-white">
        Hey, Adyfas Here!
      </h1>
      <p className="pb-2 dark:text-slate-300">Nice to meet you🙌</p>
      <p className="text-sm sm:text-base dark:text-slate-300">
        {/* Web Developer & Automation Enthusiast, I help individuals and small
          businesses build fast, modern websites and simple automation systems
          that solve real problems. */}
        A product engineer focused on creating products and autonomous systems.
      </p>
      {/* <div className="flex items-center justify-start gap-5">
        <p className="pb-2 text-sm sm:text-base">
          Open for freelance & collaboration
        </p>
      </div> */}
      <div className="flex items-center justify-start gap-5">
        <Link to="/contact">
          <button className="bg-black text-white dark:bg-white dark:text-black border border-black dark:border-white p-2 rounded-xl px-5 cursor-pointer hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-500 text-md hover:scale-101 my-2">
            Talk With Me
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
