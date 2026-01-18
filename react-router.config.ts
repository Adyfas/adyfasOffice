import type { Config } from "@react-router/dev/config";
import { vercelPreset } from "@vercel/react-router/vite";

// Untuk Firebase Hosting, kita perlu disable SSR karena Firebase Hosting hanya support static files
const isFirebaseBuild = process.env.FIREBASE_BUILD === "true";

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  // Disable SSR untuk Firebase Hosting (static hosting)
  ssr: !isFirebaseBuild,
  // Vercel preset untuk deployment (hanya aktif jika bukan Firebase build)
  presets: isFirebaseBuild ? [] : [vercelPreset()],
} satisfies Config;
