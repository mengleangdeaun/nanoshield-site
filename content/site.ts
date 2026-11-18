// Language-independent business facts. Single source for pages, JSON-LD, sitemap and llms.txt.
export const SITE_URL = "https://nanoshield-cambodia.com";

export const site = {
  name: "Nanoshield Cambodia",
  phone: "+855762222188",
  phoneDisplay: "076 2222 188",
  telegram: "https://t.me/NanoshieldCeramic",
  maps: "https://maps.app.goo.gl/nEmM1kXBukdYmPY46",
  facebook: "https://www.facebook.com/nanoshieldcambodia/",
  youtube: "https://www.youtube.com/@NanoshieldCambodia",
  address: {
    streetAddress: "#02A, Street 217, Sangkat Dangkor",
    addressLocality: "Phnom Penh",
    addressRegion: "Khan Dangkor",
    addressCountry: "KH",
  },
} as const;

export const locales = ["en", "km"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const serviceSlugs = ["bacteria-cleaning", "steam-wash", "leather-coating", "glass-coating"] as const;
export type ServiceSlug = (typeof serviceSlugs)[number];

/** Every path (without locale) the site serves. Used by sitemap + tests. */
export const paths = ["", "/packages", "/faq", ...serviceSlugs.map((s) => `/services/${s}`)];
