import type { Metadata, Viewport } from "next";
import { Kantumruy_Pro, Koulen, Oswald } from "next/font/google";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/content";
import { SITE_URL, locales, site } from "@/content/site";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { businessSchema } from "@/lib/seo";
import "../globals.css";

// Self-hosted at build time (no Google request at runtime). `subsets` = what gets preloaded;
// the Khmer faces are still declared and load on demand via unicode-range.
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald", display: "optional" });
const kantumruy = Kantumruy_Pro({ subsets: ["latin"], variable: "--font-kantumruy", display: "optional" });
const koulen = Koulen({ weight: "400", subsets: ["latin"], variable: "--font-koulen", preload: false, display: "optional" });

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
    formatDetection: { telephone: false },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = getDictionary(lang);

  return (
    // suppressHydrationWarning: themeScript sets data-theme on <html> before React hydrates.
    <html lang={lang} className={`${oswald.variable} ${kantumruy.variable} ${koulen.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
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
