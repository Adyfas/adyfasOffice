import { SocialMedia } from "~/data/SocialMedia";
import * as icons from "lucide-react";

export default function Footer() {
  return (
    <footer className="mb-24 border-t border-gray-200 dark:border-white/5 py-12">
      <div className="mb-6 flex justify-center gap-4">
        {[
          { label: "Instagram", href: "https://www.instagram.com/adyfas.ver/" },
          { label: "LinkedIn", href: "https://www.linkedin.com/in/ferdi-iskandar-1a0a95385/" },
          { label: "GitHub", href: "https://github.com/Adyfas" },
        ].map((item) => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            className="rounded-full border border-gray-300 dark:border-white/10 px-4 py-2 text-sm text-gray-700 dark:text-slate-300 transition hover:border-gray-900 hover:text-gray-900 dark:hover:border-white/50 dark:hover:text-white"
          >
            {item.label}
          </a>
        ))}
      </div>


      <div className="text-center">
        <p className="text-base font-medium text-gray-900 dark:text-slate-100">
          Thanks for visiting.
        </p>
        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
          Explore around. Until next time.
        </p>
      </div>


      <p className="mt-6 text-center text-xs text-gray-400 dark:text-slate-500">
        © {new Date().getFullYear()} Adyfas — Web Developer
      </p>
    </footer>
  );
}
