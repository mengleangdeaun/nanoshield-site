import Image from "next/image";
import type { Dictionary } from "@/content";
import { site } from "@/content/site";
import circleLogo from "@/app/assets/nanoshield-logo-512.webp";

const linkCls = "inline-flex min-h-11 items-center";

export function SiteFooter({ d }: { d: Dictionary }) {
  const social = [
    { href: site.facebook, label: "Facebook" },
    { href: site.youtube, label: "YouTube" },
    { href: site.telegram, label: "Telegram" },
  ];
  return (
    <footer className="border-t border-line bg-sunken">
      <div className="wrap flex flex-wrap items-center justify-between gap-6 py-12">
        <div className="flex items-center gap-4">
          {/* Rings and centre are opaque white, so it reads on both themes. alt="": the tagline names the brand. */}
          <Image src={circleLogo} alt="" height={64} className="size-16 shrink-0" />
          <div className="flex flex-col gap-2">
            <span className="font-display text-sm tracking-[0.2em] text-muted">{d.footer.tagline}</span>
            <span className="text-[13px] leading-[22px] text-muted">{d.footer.rights}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2 font-display text-[15px] tracking-[0.1em] uppercase">
          <a href={`tel:${site.phone}`} className={linkCls}>
            {d.visit.call} {site.phoneDisplay}
          </a>
          <ul className="m-0 flex list-none gap-6 p-0">
            {social.map((s) => (
              <li key={s.label}>
                <a href={s.href} rel="noopener" className={linkCls}>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
