import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale, type Locale } from "@/content";
import { serviceSlugs, site, type ServiceSlug } from "@/content/site";
import { JsonLd } from "@/components/JsonLd";
import { SiteHeader } from "@/components/SiteHeader";
import * as S from "@/components/sections";
import { breadcrumbSchema, pageMeta, serviceSchema } from "@/lib/seo";

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

function load(lang: string, slug: string) {
  if (!hasLocale(lang)) return null;
  const d = getDictionary(lang);
  const service = d.services.items.find((s) => s.slug === slug);
  return service ? { lang: lang as Locale, d, service } : null;
}

export async function generateMetadata({ params }: PageProps<"/[lang]/services/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const r = load(lang, slug);
  if (!r) return {};
  return pageMeta(r.lang, r.d, `/services/${slug}`, `${r.service.title} ${r.d.pages.service}`, r.service.intro);
}

export default async function ServicePage({ params }: PageProps<"/[lang]/services/[slug]">) {
  const { lang, slug } = await params;
  const r = load(lang, slug);
  if (!r) notFound();
  const { d, service } = r;
  const path = `/services/${slug}`;

  return (
    <>
      <SiteHeader lang={r.lang} d={d} path={path} />
      <main id="main">
        <section className="border-b border-line">
          <div className="wrap section-y flex flex-wrap items-center gap-14">
            <div className="flex min-w-0 flex-[1_1_480px] flex-col gap-6">
              <nav aria-label="Breadcrumb">
                <ol className="eyebrow m-0 flex list-none flex-wrap gap-2 p-0 text-muted">
                  <li>
                    <Link href={`/${lang}`} className="text-muted hover:text-orange">
                      {d.nav.home}
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li>
                    <Link href={`/${lang}#services`} className="text-muted hover:text-orange">
                      {d.nav.services}
                    </Link>
                  </li>
                </ol>
              </nav>
              <h1 className="h2">
                {service.title} <span className="text-orange">{d.pages.service}</span>
              </h1>
              <p className="m-0 text-xl leading-[34px]">{service.intro}</p>
              <p className="m-0 text-muted">{d.services.priceNote}</p>
              <div className="flex flex-wrap gap-4">
                <a href={`tel:${site.phone}`} className="btn">
                  {d.visit.call} {site.phoneDisplay}
                </a>
                <a href={site.telegram} rel="noopener" className="btn-ghost">
                  {d.visit.telegram}
                </a>
              </div>
            </div>
            <Image
              src={S.servicePhotos[service.slug as ServiceSlug]}
              alt={service.photo}
              preload
              sizes="(min-width: 900px) 50vw, 100vw"
              className="aspect-[4/3] min-w-0 flex-[1_1_420px] object-cover"
            />
          </div>
        </section>
        <S.Services d={d} lang={r.lang} exclude={slug} />
        <S.Visit d={d} lang={r.lang} />
      </main>
      <JsonLd data={serviceSchema(r.lang, service)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: d.nav.home, path: `/${lang}` },
          { name: d.nav.services, path: `/${lang}#services` },
          { name: service.title, path: `/${lang}${path}` },
        ])}
      />
    </>
  );
}
