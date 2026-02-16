import React from "react";
import type { Route } from "./+types/contact";
import Reveal from "~/components/Reveal";
import {
  setExpiredLocalstorage,
  setRemoveLocalstorage,
} from "@/lib/setLocalstorage";
import { UsestateMessage } from "~/store/contact";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Adyfas - Contact" },
    {
      name: "description",
      content: "Contact Adyfas for collaboration, projects, or questions.",
    },
  ] as const;
}

export default function ContactPage() {
  const formRef = React.useRef<HTMLFormElement | null>(null);
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [emailsend, setEmailsend] = React.useState(false);
  const message = UsestateMessage((state) => state.message);
  const setMessage = UsestateMessage((state) => state.setMessage);

  React.useEffect(() => {
    if (setRemoveLocalstorage({ key: "emailsend" })) {
      setSubmitted(true);
      setLoading(true);
      setEmailsend(true);
      return;
    }
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (setRemoveLocalstorage({ key: "emailsend" })) {
      setSubmitted(true);
      setLoading(true);
      setEmailsend(true);
      console.log("esekusi");
      return;
    }
    setLoading(true);
    const form = formRef.current;
    if (!form) return;

    const formData = new FormData(form);
    const name = (formData.get("name") || "").toString();
    const email = (formData.get("email") || "").toString();
    const message = (formData.get("message") || "").toString();

    try {
      const responses = await fetch(`${import.meta.env.VITE_API}/send/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name, message }),
      });
      if (!responses.ok) {
        throw new Error("Failed to send email: " + responses.statusText);
      }
      setSubmitted(true);
      setLoading(false);
      setExpiredLocalstorage({ key: "emailsend", value: "true" });
      setMessage("");
      form.reset();
    } catch (error) {
      console.error("Unexpected Error: ", error);
      setLoading(false);
      setSubmitted(false);
      return;
    }
  }

  return (
    <>
      <Reveal
        y={40}
        blur={15}
        duration={1.2}
        delay={0.1}
        width="100%"
      >
        <section className="min-h-[70vh] flex items-center justify-center">
          <div className="w-full max-w-xl rounded-2xl bg-white px-6 py-8 sm:px-8 sm:py-10">
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Have a project in mind?
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Tell me what you're building, and I’ll see how I can help.
              </p>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  readOnly={loading || submitted}
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  readOnly={loading || submitted}
                  id="email"
                  name="email"
                  type="email"
                  value={message !== "" || message.length > 0 ? message : ""}
                  onChange={(e) => setMessage(e.currentTarget.value)}
                  required
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Your Message For Me?
                </label>
                <textarea
                  readOnly={loading || submitted}
                  id="message"
                  name="message"
                  required
                  rows={4}
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none resize-none"
                  placeholder="Tell me about your idea, project, or question..."
                />
              </div>

              <button
                type="submit"
                disabled={loading || submitted}
                className={`mt-2 w-full rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed transition-colors ${(loading && "cursor-wait") || (submitted && "cursor-wait")}`}
              >
                {submitted || emailsend
                  ? "Thanks For Submit"
                  : loading
                    ? "Sending..."
                    : "Send Message"}
              </button>
              <p className="text-sm text-gray-600">
                I usually reply within 24–48 hours.
              </p>
            </form>
          </div>
        </section>
      </Reveal>
    </>
  );
}
