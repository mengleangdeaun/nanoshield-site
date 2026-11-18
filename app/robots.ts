import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/site";

// Everything is public marketing content: search engines and AI answer engines are all welcome.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
