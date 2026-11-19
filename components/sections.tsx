import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import bacteriaCleaning from "@/public/images/bacteria-cleaning.webp";
import beforeAfter01 from "@/public/images/before-after-01.webp";
import beforeAfter02 from "@/public/images/before-after-02.webp";
import beforeAfter03 from "@/public/images/before-after-03.webp";
import beforeAfter04 from "@/public/images/before-after-04.webp";
import glassCoating from "@/public/images/glass-coating.webp";
import leatherCoating from "@/public/images/leather-coating.webp";
import pencilTest from "@/public/images/PENCIL-HARDNESS-TEST.webp";
import sgsCert from "@/public/images/SGS-CERTIFICATE.webp";
import showroom from "@/public/images/showroom.webp";
import steamWash from "@/public/images/steam-wash.webp";
import type { Dictionary, Locale } from "@/content";
import { site, type ServiceSlug } from "@/content/site";
import { CoatingStructures } from "./CoatingStructures";
import { PaintDiagram } from "./PaintDiagram";

type P = { d: Dictionary; lang: Locale };

/** Keyed by ServiceSlug, so adding a service without a photo fails the type check. */
export const servicePhotos: Record<ServiceSlug, StaticImageData> = {
  "bacteria-cleaning": bacteriaCleaning,
  "steam-wash": steamWash,
  "leather-coating": leatherCoating,
  "glass-coating": glassCoating,
};
type H = "h1" | "h2";
const pad = (i: number) => String(i + 1).padStart(2, "0");

/** Eyebrow + heading. Sub-pages pass `as="h1"` so the page's main section owns the single h1. */
function Head({ eyebrow, title, as: Tag = "h2" }: { eyebrow: string; title: string; as?: H }) {
  return (
    <div className="flex max-w-[760px] flex-col gap-4">
      <p className="eyebrow">{eyebrow}</p>
      <Tag className="h2">{title}</Tag>
    </div>
  );
}

export function Hero({ d, lang }: P) {
  const h = d.hero;
  return (
    // force-dark: the photo is dark, so the hero stays a dark stage in light mode too.
    <section id="top" className="force-dark relative isolate overflow-hidden border-b border-line bg-surface text-fg">
      <div className="wrap relative z-10 flex min-h-0 items-center pt-12 pb-10 md:min-h-[680px] md:pt-24 md:pb-[104px]">
        <div className="flex min-w-0 flex-col gap-6 md:max-w-[56%]">
          <p className="eyebrow text-muted">{h.eyebrow}</p>
          <h1 className="m-0 font-display text-[clamp(56px,8vw,112px)] leading-[0.98] font-bold uppercase">
            {h.title1}
            <br />
            <span className="text-orange">{h.title2}</span>
          </h1>
          <p lang={h.accentLang} className="m-0 font-display text-[clamp(32px,4vw,56px)] leading-[1.4]">
            {h.accent}
          </p>
          <p className="m-0 max-w-[520px] text-xl leading-[34px] text-muted">{h.lead}</p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link href={`/${lang}/packages`} className="btn">
              {h.ctaPackages}
            </Link>
            <a href={site.telegram} rel="noopener" className="btn-ghost">
              {h.ctaTelegram}
            </a>
          </div>
        </div>
      </div>
      {/* Photo: a 4:3 banner under the text on phones (keeps the headline as the mobile LCP); from md up it fills the right of the hero, fading into the text side. */}
      <div className="relative aspect-[4/3] md:absolute md:inset-y-0 md:right-0 md:aspect-auto md:w-[58%]">
        <Image
          src={steamWash}
          alt={h.photoAlt}
          fill
          loading="eager"
          fetchPriority="high"
          placeholder="blur"
          sizes="(min-width: 768px) 58vw, 100vw"
          className="object-cover object-[50%_62%] md:object-[50%_70%]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-b from-surface to-transparent to-35% md:bg-linear-to-r md:to-45%"
        />
      </div>
    </section>
  );
}

export function Coating({ d }: P) {
  const c = d.coating;
  return (
    <section id="coating" className="border-b border-line">
      <div className="wrap section-y flex flex-wrap items-center gap-14">
        <div className="flex min-w-0 flex-[1_1_480px] flex-col gap-5">
          <Head eyebrow={c.eyebrow} title={c.title} />
          <p className="m-0 text-xl leading-[34px]">{c.p1}</p>
          <p className="m-0 text-muted">{c.p2}</p>
        </div>
        <figure className="m-0 flex min-w-0 flex-[1_1_420px] flex-col gap-3">
          <PaintDiagram labels={c.diagram} />
          <figcaption className="text-[13px] leading-[22px] text-muted">{c.caption}</figcaption>
        </figure>
      </div>
    </section>
  );
}

export function Benefits({ d }: P) {
  const b = d.benefits;
  return (
    <section id="benefits" className="border-b border-line bg-raised">
      <div className="wrap section-y flex flex-col gap-12">
        <Head eyebrow={b.eyebrow} title={b.title} />
        {/* Explicit columns (not auto-fit) so 7 cards + the decoration always fill whole rows: 2×4 or 4×2. */}
        <ul className="m-0 grid list-none grid-cols-1 gap-px border border-line bg-line p-0 sm:grid-cols-2 lg:grid-cols-4">
          {b.items.map((it, i) => (
            <li key={it.title} className="flex min-h-[200px] flex-col gap-3 bg-surface p-8">
              <span className="font-display text-sm tracking-[0.2em] text-accent">{pad(i)}</span>
              <h3 className="m-0 font-display text-[28px] leading-[1.1] font-bold uppercase">{it.title}</h3>
              <p className="m-0 text-muted">{it.text}</p>
            </li>
          ))}
          {/* 8th block: top half of the logo's two rings, rising from the bottom edge. Ring sizes measured
              from public/icon-512.png (centre 256, r 217 & 133, width 40); hidden on 1-column phones. */}
          <li aria-hidden="true" className="hidden items-end justify-center overflow-hidden bg-surface px-8 pt-8 sm:flex">
            <svg viewBox="16 16 480 240" className="block w-full max-w-[280px]" fill="none" stroke="#ec5b25" strokeWidth="40">
              <circle cx="256" cy="256" r="217" />
              <circle cx="256" cy="256" r="133" />
            </svg>
          </li>
        </ul>
      </div>
    </section>
  );
}

export function Why({ d }: P) {
  const w = d.why;
  return (
    <section id="why" className="border-b border-line">
      <div className="wrap section-y flex flex-col gap-12">
        <Head eyebrow={w.eyebrow} title={w.title} />
        <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6 p-0">
          {w.items.map((it, i) => (
            <li
              key={it.title}
              className={`flex flex-col gap-2 ${i === 0 ? "border-t-[3px] border-orange pt-5" : "border-t border-line pt-[22px]"}`}
            >
              <h3 className="m-0 font-display text-2xl font-bold uppercase">{it.title}</h3>
              <p className="m-0 text-muted">{it.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Technology({ d }: P) {
  const t = d.tech;
  return (
    <section id="technology" className="border-b border-line bg-raised">
      <div className="wrap section-y flex flex-wrap gap-14">
        <div className="flex max-w-[760px] min-w-0 flex-[1_1_100%] flex-col gap-4">
          <Head eyebrow={t.eyebrow} title={t.title} />
          <p className="m-0 text-muted">{t.text}</p>
          <a href="#certificate" className="font-display tracking-[0.1em] uppercase">
            {t.certLink}
          </a>
        </div>
        <CoatingStructures levels={t.levels} />
        <div id="certificate" className="flex flex-[1_1_100%] flex-wrap gap-6">
          {/* White card in both themes: the scans themselves have white backgrounds. */}
          <div className="flex max-h-[420px] flex-[1_1_300px] items-center justify-center border border-line bg-white p-4">
            <Image src={sgsCert} alt={t.certImg} className="max-h-[386px] w-auto max-w-full object-contain" />
          </div>
          <div className="flex max-h-[420px] flex-[1_1_300px] items-center justify-center border border-line bg-white p-4">
            <Image src={pencilTest} alt={t.pencilImg} className="h-auto w-full object-contain" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function Packages({ d, as }: P & { as?: H }) {
  const p = d.packages;
  const Sub = as === "h1" ? "h2" : "h3"; // keep heading levels sequential on the packages page
  return (
    <section id="packages" className="border-b border-line">
      <div className="wrap section-y flex flex-col gap-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Head eyebrow={p.eyebrow} title={p.title} as={as} />
          <p className="m-0 text-muted">{p.priceNote}</p>
        </div>
        <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 p-0">
          {p.items.map((it) => {
            const top = it.code === "N72";
            return (
              <li
                key={it.code}
                className={`flex flex-col gap-4 border px-7 py-8 ${top ? "border-orange bg-raised" : "border-line bg-surface"}`}
              >
                <span className="font-display text-sm tracking-[0.2em] text-muted">{it.code}</span>
                <Sub className="m-0 font-display text-[34px] leading-[1.05] font-bold uppercase">
                  PPS
                  <br />
                  <span className="text-orange">{it.tier}</span>
                </Sub>
                <p className="m-0 grow text-muted">{it.text}</p>
                <p className="m-0 font-display text-xl">{p.price}</p>
                <a href={site.telegram} rel="noopener" className="btn-ghost min-h-11 px-4 text-[15px] tracking-[0.1em]">
                  {p.ask} {it.tier}
                </a>
              </li>
            );
          })}
        </ul>
        <div className="flex flex-wrap items-center gap-x-12 gap-y-6 border border-line bg-raised p-8">
          <div className="flex flex-none flex-col">
            <span className="font-display text-sm tracking-[0.2em] text-muted">{p.skinx.code}</span>
            <Sub className="m-0 font-display text-[34px] font-bold uppercase">
              Skin<span className="text-orange">X</span>
            </Sub>
          </div>
          <p className="m-0 flex-[1_1_360px] text-muted">{p.skinx.text}</p>
          <p className="m-0 font-display text-xl">{p.price}</p>
        </div>
      </div>
    </section>
  );
}

/** `exclude` hides the current service on its own detail page. */
export function Services({ d, lang, exclude }: P & { exclude?: string }) {
  const s = d.services;
  return (
    <section id="services" className="border-b border-line bg-raised">
      <div className="wrap section-y flex flex-col gap-12">
        <Head eyebrow={s.eyebrow} title={s.title} />
        <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4 p-0">
          {s.items
            .filter((it) => it.slug !== exclude)
            .map((it) => (
              <li key={it.slug} className="relative flex flex-col border border-line bg-surface hover:border-orange">
                <Image
                  src={servicePhotos[it.slug as ServiceSlug]}
                  alt={it.photo}
                  sizes="(min-width: 1280px) 300px, (min-width: 560px) 50vw, 100vw"
                  className="aspect-[4/3] w-full border-b border-line object-cover"
                />
                <div className="flex flex-col gap-2 p-6">
                  <h3 className="m-0 font-display text-2xl font-bold uppercase">
                    <Link
                      href={`/${lang}/services/${it.slug}`}
                      className="text-fg no-underline after:absolute after:inset-0 hover:text-orange"
                    >
                      {it.title}
                    </Link>
                  </h3>
                  <p className="m-0 text-muted">{it.text}</p>
                </div>
              </li>
            ))}
        </ul>
        <p className="m-0 text-muted">{s.priceNote}</p>
      </div>
    </section>
  );
}

export function Application({ d }: P) {
  const s = d.steps;
  return (
    <section id="application" className="border-b border-line">
      <div className="wrap section-y flex flex-col gap-12">
        <Head eyebrow={s.eyebrow} title={s.title} />
        <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6 p-0">
          {s.items.map((it, i) => (
            <li key={it.title} className="flex flex-col gap-2 border-t border-line pt-5">
              <span className="font-display text-[40px] leading-none font-bold text-orange">{pad(i)}</span>
              <h3 className="m-0 font-display text-[22px] font-bold uppercase">{it.title}</h3>
              <p className="m-0 text-muted">{it.text}</p>
            </li>
          ))}
        </ol>
        {/* Each photo is already a before/after composite. 4:3 is the crop that keeps every photo's labels (they're 1:1, 4:5 and 3:2). */}
        <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(420px,100%),1fr))] gap-4 p-0">
          {[beforeAfter01, beforeAfter02, beforeAfter03, beforeAfter04].map((src, i) => (
            <li key={src.src}>
              <Image
                src={src}
                alt={s.photos[i]}
                sizes="(min-width: 1280px) 600px, (min-width: 900px) 50vw, 100vw"
                className="aspect-[4/3] w-full border border-line object-cover"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Faq({ d, as }: P & { as?: H }) {
  const f = d.faq;
  return (
    <section id="faq" className="border-b border-line bg-raised">
      <div className="wrap section-y flex flex-wrap gap-14">
        <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-4">
          <Head eyebrow={f.eyebrow} title={f.title} as={as} />
          <p className="m-0 text-muted">{f.lead}</p>
        </div>
        {/* Native <details>: zero JS, and every answer stays in the HTML for search and answer engines. */}
        <div className="flex min-w-0 flex-[999_1_560px] flex-col border-t border-line">
          {f.items.map((it, i) => (
            <details key={it.q} name="faq" open={i === 0} className="group border-b border-line">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 text-lg leading-7 font-semibold hover:text-orange [&::-webkit-details-marker]:hidden">
                <span>{it.q}</span>
                <span aria-hidden="true" className="flex-none font-display text-[28px] text-orange">
                  <span className="group-open:hidden">+</span>
                  <span className="hidden group-open:inline">−</span>
                </span>
              </summary>
              <p className="m-0 pr-12 pb-6 text-muted">{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Aftercare({ d }: P) {
  const a = d.aftercare;
  return (
    <section id="aftercare" className="border-b border-line">
      <div className="wrap section-y flex flex-wrap gap-14">
        <div className="flex min-w-0 flex-[1_1_320px] flex-col">
          <Head eyebrow={a.eyebrow} title={a.title} />
        </div>
        <ul className="m-0 grid min-w-0 flex-[999_1_560px] list-none grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6 p-0">
          {a.items.map((it) => (
            <li key={it.title} className="flex flex-col gap-2 border border-line p-6">
              <strong className="font-display text-xl font-normal uppercase">{it.title}</strong>
              <span className="text-muted">{it.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Visit({ d }: P) {
  const v = d.visit;
  return (
    <section id="visit">
      <div className="wrap section-y flex flex-wrap gap-14">
        <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-6">
          <Head eyebrow={v.eyebrow} title={v.title} />
          <p lang="km" className="m-0 font-display text-4xl leading-[1.4]">
            ចែងចាំងដូចគ្រាប់ពេជ្រ
          </p>
          <div className="flex flex-col gap-1">
            <span className="font-display text-sm tracking-[0.2em] text-muted">{v.branch}</span>
            <address className="text-lg leading-[30px] not-italic">
              {v.address[0]}
              <br />
              {v.address[1]}
            </address>
            <span className="text-muted">{v.hours}</span>
          </div>
          <div className="flex flex-wrap gap-4">
            <a href={`tel:${site.phone}`} className="btn tracking-[0.06em]">
              {v.call} {site.phoneDisplay}
            </a>
            <a href={site.telegram} rel="noopener" className="btn-ghost">
              {v.telegram}
            </a>
            <a href={site.maps} rel="noopener" className="btn-ghost">
              {v.directions}
            </a>
          </div>
        </div>
        {/* Stretches to the text column's height on desktop; min-h keeps roughly the photo's 7:5 on phones. */}
        <a
          href={site.maps}
          rel="noopener"
          className="group relative min-h-[260px] flex-[1_1_420px] overflow-hidden border border-line no-underline"
        >
          <Image
            src={showroom}
            alt={v.showroomAlt}
            fill
            sizes="(min-width: 1280px) 600px, (min-width: 900px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none"
          />
          {/* Fixed colours: the bar sits on the photo, not the page theme. */}
          <span className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-black/75 px-5 py-3 font-display text-[15px] tracking-[0.1em] text-white uppercase group-hover:text-[#ec5b25]">
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ec5b25" strokeWidth="1.8">
              <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
              <circle cx="12" cy="9.5" r="2.5" />
            </svg>
            {v.mapLink}
          </span>
        </a>
      </div>
    </section>
  );
}
