import { SocialMedia } from "~/data/SocialMedia";
import * as icons from "lucide-react";

export default function Footer() {
  return (
    <footer className="mb-24 border-t border-gray-200 py-12">
      <div className="mb-6 flex justify-center gap-4">
        {[
          { label: "Instagram", href: "#" },
          { label: "LinkedIn", href: "#" },
          { label: "GitHub", href: "#" },
        //   { label: "YouTube", href: "#" },
        ].map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:border-gray-900 hover:text-gray-900"
          >
            {item.label}
          </a>
        ))}
      </div>


      <div className="text-center">
        <p className="text-base font-medium text-gray-900">
          Thanks for visiting.
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Explore around. Until next time.
        </p>
      </div>


      <p className="mt-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Adyfas — Web Developer
      </p>
    </footer>
  );
}
