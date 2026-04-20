import { useNavigate } from "react-router";
import Reveal from "./Reveal";
import { UsestateMessage } from "~/store/contact";

export default function CalltoActionContact() {
  const message = UsestateMessage((state) => state.message);
  const setMessage = UsestateMessage((state) => state.setMessage);
  const router = useNavigate();
  return (
    <>
      <Reveal
        y={40}
        blur={15}
        duration={1.2}
        delay={0.2}
        width="100%"
      >
        <section className="mt-32 rounded-2xl bg-white dark:bg-white/5 dark:border dark:border-white/10 px-8 py-10 shadow-sm dark:shadow-none">
          <div className="flex items-center justify-center flex-col">
            <h3 className="text-xl sm:text-2xl font-bold text-center dark:text-white">
              Let’s Work Together
            </h3>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600 dark:text-slate-300 text-center">
              Interested in working together or discussing a project? You can
              contact me directly via email.
            </p>
          </div>

          <form className="mt-6 flex max-w-2xl gap-3">
            <input
              type="email"
              placeholder="contact.adyfas@gmail.com"
              value={message}
              onChange={(e) => setMessage(e.currentTarget.value)}
              className="flex-1 rounded-full border border-gray-300 dark:border-white/20 dark:bg-black/20 dark:text-white px-4 py-2 text-sm focus:border-gray-900 dark:focus:border-white focus:outline-none"
            />
            <button
              onClick={() => {
                message !== "" || message.length > 0 ? router("/contact") : "";
              }}
              type="button"
              className="rounded-full bg-gray-900 dark:bg-white px-5 py-2 text-sm font-medium text-white dark:text-black transition hover:bg-gray-800 dark:hover:bg-gray-200"
            >
              Contact
            </button>
          </form>
        </section>
      </Reveal>
    </>
  );
}
