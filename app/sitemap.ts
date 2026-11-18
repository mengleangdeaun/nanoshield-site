import type { MetadataRoute } from "next";
import { SITE_URL, locales, paths } from "@/content/site";

// Fixed date: `new Date()` would make the route request-time under Cache Components. Bump on content changes.
const lastModified = "2026-11-18";

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.flatMap((path) =>
    locales.map((lang) => ({
      url: `${SITE_URL}/${lang}${path}`,
      lastModified,
      alternates: {
        languages: {
          ...Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}${path}`])),
          "x-default": `${SITE_URL}/en${path}`,
        },
      },
    })),
  );
}
