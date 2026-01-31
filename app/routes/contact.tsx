import React from "react";
import type { Route } from "./+types/contact";
import AnimatedContent from "~/components/AnimatedContent";
export function meta({}: Route.MetaArgs) {
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

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = formRef.current;
    if (!form) return;

    const formData = new FormData(form);
    const name = (formData.get("name") || "").toString();
    const email = (formData.get("email") || "").toString();
    const message = (formData.get("message") || "").toString();

    const subject = encodeURIComponent(`New message from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    setSubmitted(true);

    window.location.href = `mailto:adyfasoffice@gmail.com?subject=${subject}&body=${body}`;
  }

  return (
    <>
      <AnimatedContent
        distance={50}
        direction="vertical"
        reverse={false}
        duration={1.2}
        ease="power3.out"
        initialOpacity={0}
        animateOpacity
        threshold={0.2}
        delay={0.2}
      >
        <section className="min-h-[70vh] flex items-center justify-center">
          <div className="w-full max-w-xl rounded-2xl bg-white px-6 py-8 sm:px-8 sm:py-10 shadow-lg border border-gray-200">
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Contact Me!
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                The start of something magical. Tell me what you&apos;re building.
              </p>
              {submitted && (
                <p className="mt-2 text-xs text-green-600">
                  Thanks for submitting your message. Please confirm and send it from your email app.
                </p>
              )}
            </div>

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
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
                  id="email"
                  name="email"
                  type="email"
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
                className="mt-2 w-full rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
              >
                {submitted ? "Thanks For Submit" : "Send Message"}
              </button>
            </form>
          </div>
        </section>
      </AnimatedContent>
        </>
  );
}
