import type { Metadata, Viewport } from "next";
import { Kantumruy_Pro, Oswald } from "next/font/google";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/content";
import { SITE_URL, locales, site } from "@/content/site";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { businessSchema } from "@/lib/seo";
import "../globals.css";

// Latin faces: self-hosted by next/font at build time (no Google request at runtime), preloaded on every page.
// Khmer faces live in public/fonts and are preloaded per locale below (see globals.css).
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald", display: "optional" });
const kantumruy = Kantumruy_Pro({ subsets: ["latin"], variable: "--font-kantumruy", display: "optional" });

// Build fails if any route stops being fully static.
export const ensureStatic = "navigation";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
};

// Runs synchronously before first paint, so a remembered light choice never flashes dark first.
// With no stored choice it does nothing and the page stays dark, whatever the device prefers.
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const d = getDictionary(lang);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: d.meta.title, template: `%s | ${site.name}` },
    description: d.meta.description,
    applicationName: site.name,
    // Served from public/ so URLs stay unhashed: Google needs a stable favicon URL across deploys.
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "48x48" },
        { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      ],
      apple: "/apple-icon.png",
    },
    formatDetection: { telephone: false },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = getDictionary(lang);

  return (
    // suppressHydrationWarning: themeScript sets data-theme on <html> before React hydrates.
    <html lang={lang} className={`${oswald.variable} ${kantumruy.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/* Noto Sans Khmer (variable 400-700) is above the fold on every page (hero Khmer line); Kantumruy Khmer
            (57KB) is the body font only on /km, so English pages don't pay for it. */}
        <link rel="preload" href="/fonts/noto-sans-khmer-v1.woff2" as="font" type="font/woff2" crossOrigin="" />
        {lang === "km" && (
          <link rel="preload" href="/fonts/kantumruy-pro-khmer-v1.woff2" as="font" type="font/woff2" crossOrigin="" />
        )}
      </head>
      <body>
        <a
          href="#main"
          className="sr-only z-20 bg-orange px-4 py-3 font-bold text-[#0a0a0b] focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
        >
          {d.nav.skip}
        </a>
        {children}
        <SiteFooter d={d} />
        <JsonLd data={businessSchema(lang, d)} />
      </body>
    </html>
  );
}
