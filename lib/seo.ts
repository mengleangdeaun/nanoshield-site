import type { Metadata } from "next";
import type { Dictionary, Locale } from "@/content";
import { SITE_URL, site, locales } from "@/content/site";

/** Canonical + hreflang + Open Graph for one page. `path` has no locale prefix ("" for home). */
// app/opengraph-image.tsx sits outside the [lang] root layout, so it isn't auto-attached; link it explicitly.
const ogImage = { url: "/opengraph-image", width: 1200, height: 630, alt: "Nanoshield Cambodia — Shine like a diamond." };

export function pageMeta(lang: Locale, d: Dictionary, path: string, title: string, description: string): Metadata {
  const url = `/${lang}${path}`;
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: url,
      languages: { ...Object.fromEntries(locales.map((l) => [l, `/${l}${path}`])), "x-default": `/en${path}` },
    },
    openGraph: {
      type: "website",
      url,
      siteName: site.name,
      title,
      description,
      locale: d.meta.ogLocale,
      images: [ogImage],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}

const BUSINESS_ID = `${SITE_URL}/#business`;

export function businessSchema(lang: Locale, d: Dictionary) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["AutoRepair", "AutomotiveBusiness"],
        "@id": BUSINESS_ID,
        name: site.name,
        description: d.meta.description,
        url: `${SITE_URL}/${lang}`,
        telephone: site.phone,
        image: `${SITE_URL}/opengraph-image`,
        address: { "@type": "PostalAddress", ...site.address },
        geo: {
          "@type": "GeoCoordinates",
          latitude: site.geo.latitude,
          longitude: site.geo.longitude,
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            opens: "08:00",
            closes: "17:30",
          },
        ],
        priceRange: site.priceRange,
        currenciesAccepted: "USD, KHR",
        paymentAccepted: "Cash, ABA, ACLEDA, Wing, Credit Card",
        keywords: "Ceramic Coating, Glass Coating, Coating in Phnom Penh, Best Coating in Cambodia, Auto Detailing, ថ្នាំការពារសេរ៉ាមិច, ចែងចាំងដូចគ្រាប់ពេជ្រ",
        areaServed: [
          { "@type": "City", name: "Phnom Penh" },
          { "@type": "Country", name: "Cambodia" },
        ],
        hasMap: site.maps,
        sameAs: [site.facebook, site.youtube, site.telegram],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: site.name,
        alternateName: "Nanoshield",
        inLanguage: locales,
        publisher: { "@id": BUSINESS_ID },
      },
    ],
  };
}

export function faqSchema(d: Dictionary) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: d.faq.items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function packagesSchema(lang: Locale, d: Dictionary) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: d.packages.title,
    serviceType: "Ceramic coating",
    provider: { "@id": BUSINESS_ID },
    areaServed: { "@type": "City", name: "Phnom Penh" },
    url: `${SITE_URL}/${lang}/packages`,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: d.packages.title,
      // No price: prices are "ask for our current pricelist" until supplied.
      itemListElement: [
        ...d.packages.items.map((p) => ({ name: `PPS ${p.tier} (${p.code})`, description: p.text })),
        { name: `SkinX (${d.packages.skinx.code})`, description: d.packages.skinx.text },
      ].map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", ...s } })),
    },
  };
}

export function serviceSchema(lang: Locale, s: Dictionary["services"]["items"][number]) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.title,
    description: s.intro,
    provider: { "@id": BUSINESS_ID },
    areaServed: { "@type": "City", name: "Phnom Penh" },
    url: `${SITE_URL}/${lang}/services/${s.slug}`,
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}
