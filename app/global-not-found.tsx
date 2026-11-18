import type { Metadata } from "next";
import { Oswald } from "next/font/google";
import Link from "next/link";
import { SITE_URL } from "@/content/site";
import "./globals.css";

// The root layout lives under app/[lang], so unknown locales/paths need their own 404 document.
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "404 — Page not found | Nanoshield Cambodia",
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={oswald.variable}>
      <body>
        <main className="wrap section-y flex min-h-dvh flex-col justify-center gap-6">
          <p className="eyebrow">404</p>
          <h1 className="h2">
            Page not found · <span lang="km">រកមិនឃើញទំព័រ</span>
          </h1>
          <div className="flex flex-wrap gap-4">
            <Link href="/en" className="btn">
              Home
            </Link>
            <Link href="/km" lang="km" className="btn-ghost">
              ទំព័រដើម
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
