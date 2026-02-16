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
      <h1 className="font-bold text-xl sm:text-2xl text-start">
        Hey, Adyfas Here!
      </h1>
      <p className="pb-2">Nice to meet you🙌</p>
      <p className="text-sm sm:text-base">
        {/* Web Developer & Automation Enthusiast, I help individuals and small
          businesses build fast, modern websites and simple automation systems
          that solve real problems. */}
        Building modern web applications and automation systems that improve
        efficiency, reliability, and business workflows.
      </p>
      {/* <div className="flex items-center justify-start gap-5">
        <p className="pb-2 text-sm sm:text-base">
          Open for freelance & collaboration
        </p>
      </div> */}
      <Link to="/contact">
        <button className="bg-gray-900 p-2 text-white font-bold rounded-xl px-5 cursor-pointer hover:bg-gray-800 transition-all duration-500 text-lg sm:text-xl hover:scale-101 my-2">
          Contact
        </button>
      </Link>
    </>
  );
}
