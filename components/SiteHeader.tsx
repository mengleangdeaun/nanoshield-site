import Image from "next/image";
import Link from "next/link";
import logoLight from "@/app/assets/src-22.webp"; // black "Shield": light theme
import logoDark from "@/app/assets/src-23.webp"; // white "Shield": dark theme
import type { Dictionary, Locale } from "@/content";
import { site } from "@/content/site";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "./ThemeToggle";

/** `path` = current page without locale, so the language switch keeps you on the same page. */
export function SiteHeader({ lang, d, path }: { lang: Locale; d: Dictionary; path: string }) {
  const other: Locale = lang === "en" ? "km" : "en";
  const links = [
    { href: `/${lang}#coating`, label: d.nav.coating },
    { href: `/${lang}#why`, label: d.nav.why },
    { href: `/${lang}/packages`, label: d.nav.packages },
    { href: `/${lang}#services`, label: d.nav.services },
    { href: `/${lang}/faq`, label: d.nav.faq },
    { href: `/${lang}#visit`, label: d.nav.visit },
  ];
  const linkCls = "inline-flex min-h-11 items-center text-fg no-underline hover:text-orange";

  return (
    <header className="sticky top-0 z-10 border-b border-line bg-surface">
      <nav aria-label="Main" className="wrap flex items-center justify-between gap-4 py-4">
        {/* Lazy + display:none means only the current theme's logo downloads. */}
        <Link href={`/${lang}`} aria-label={d.nav.homeLabel} className="flex h-14 shrink-0 items-center">
          <Image src={logoDark} alt="" height={48} className="h-7 w-auto min-[360px]:h-9 sm:h-12 light:hidden" />
          <Image src={logoLight} alt="" height={48} className="hidden h-7 w-auto min-[360px]:h-9 sm:h-12 light:block" />
        </Link>

        <ul className="m-0 hidden list-none flex-wrap gap-7 p-0 font-display text-[15px] tracking-[0.12em] uppercase min-[861px]:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={linkCls}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Tight gaps on phones: logo + language + theme + menu must fit 375px. */}
        <div className="flex items-center gap-1 sm:gap-3">
          <Link
            href={`/${other}${path}`}
            hrefLang={other}
            lang={other}
            aria-label={d.nav.switchLangLabel}
            className="inline-flex min-h-11 min-w-11 items-center justify-center px-2 font-display text-[15px] tracking-[0.12em] text-muted no-underline hover:text-orange"
          >
            {d.nav.switchLang}
          </Link>
          <ThemeToggle toLight={d.nav.themeLight} toDark={d.nav.themeDark} />
          <a href={`tel:${site.phone}`} className="btn hidden min-h-11 px-5.5 sm:inline-flex">
            {d.nav.book}
          </a>
          <MobileMenu label={d.nav.menu}>
            <ul className="m-0 flex list-none flex-col gap-1 p-0 font-display text-lg tracking-[0.12em] uppercase">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkCls}>
                    {l.label}
                  </Link>
                </li>
              ))}
              <li className="pt-3">
                <a href={`tel:${site.phone}`} className="btn w-full">
                  {d.nav.book}
                </a>
              </li>
            </ul>
          </MobileMenu>
        </div>
      </nav>
    </header>
  );
}
