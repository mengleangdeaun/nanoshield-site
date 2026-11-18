import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/content";
import { JsonLd } from "@/components/JsonLd";
import { SiteHeader } from "@/components/SiteHeader";
import * as S from "@/components/sections";
import { breadcrumbSchema, packagesSchema, pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/packages">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const d = getDictionary(lang);
  return pageMeta(lang, d, "/packages", d.pages.packages.title, d.pages.packages.description);
}

export default async function PackagesPage({ params }: PageProps<"/[lang]/packages">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = getDictionary(lang);
  const p = { d, lang };

  return (
    <>
      <SiteHeader lang={lang} d={d} path="/packages" />
      <main id="main">
        <S.Packages {...p} as="h1" />
        <S.Technology {...p} />
        <S.Application {...p} />
        <S.Aftercare {...p} />
        <S.Visit {...p} />
      </main>
      <JsonLd data={packagesSchema(lang, d)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: d.nav.home, path: `/${lang}` },
          { name: d.nav.packages, path: `/${lang}/packages` },
        ])}
      />
    </>
  );
}
