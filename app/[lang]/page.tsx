import type { Metadata } from "next";
import { getDictionary, hasLocale } from "@/content";
import { JsonLd } from "@/components/JsonLd";
import { SiteHeader } from "@/components/SiteHeader";
import * as S from "@/components/sections";
import { faqSchema, pageMeta } from "@/lib/seo";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const d = getDictionary(lang);
  const meta = pageMeta(lang, d, "", d.meta.title, d.meta.description);
  return { ...meta, title: { absolute: d.meta.title } };
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = getDictionary(lang);
  const p = { d, lang };

  return (
    <>
      <SiteHeader lang={lang} d={d} path="" />
      <main id="main">
        <S.Hero {...p} />
        <S.Coating {...p} />
        <S.Benefits {...p} />
        <S.Why {...p} />
        <S.Technology {...p} />
        <S.Packages {...p} />
        <S.Services {...p} />
        <S.Application {...p} />
        <S.Faq {...p} />
        <S.Aftercare {...p} />
        <S.Visit {...p} />
      </main>
      <JsonLd data={faqSchema(d)} />
    </>
  );
}
