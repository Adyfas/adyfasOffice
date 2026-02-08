import { useNavigate } from "react-router";
import AnimatedContent from "./AnimatedContent";
import { UsestateMessage } from "~/store/contact";

export default function CalltoActionContact() {
  const message = UsestateMessage((state) => state.message);
  const setMessage = UsestateMessage((state) => state.setMessage);
  const router = useNavigate();
  return (
    <>
      <AnimatedContent
        distance={50}
        direction="vertical"
        reverse={false}
        duration={1.5}
        ease="power3.out"
        initialOpacity={0}
        animateOpacity
        threshold={0.2}
        delay={0.2}
      >
        <section className="mt-32 rounded-2xl bg-white px-8 py-10">
          <div className="flex items-center justify-center flex-col">
            <h3 className="text-xl sm:text-2xl font-bold text-center">
              Let’s Work Together
            </h3>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600 text-center">
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
              className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none"
            />
            <button
              onClick={() => {
                message !== "" || message.length > 0 ? router("/contact") : "";
              }}
              type="button"
              className="rounded-full bg-gray-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Contact
            </button>
          </form>
        </section>
      </AnimatedContent>
    </>
  );
}
