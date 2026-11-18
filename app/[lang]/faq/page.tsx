import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/content";
import { JsonLd } from "@/components/JsonLd";
import { SiteHeader } from "@/components/SiteHeader";
import * as S from "@/components/sections";
import { breadcrumbSchema, faqSchema, pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/faq">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const d = getDictionary(lang);
  return pageMeta(lang, d, "/faq", d.pages.faq.title, d.pages.faq.description);
}

export default async function FaqPage({ params }: PageProps<"/[lang]/faq">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = getDictionary(lang);
  const p = { d, lang };

  return (
    <>
      <SiteHeader lang={lang} d={d} path="/faq" />
      <main id="main">
        <S.Faq {...p} as="h1" />
        <S.Aftercare {...p} />
        <S.Visit {...p} />
      </main>
      <JsonLd data={faqSchema(d)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: d.nav.home, path: `/${lang}` },
          { name: d.nav.faq, path: `/${lang}/faq` },
        ])}
      />
    </>
  );
}
