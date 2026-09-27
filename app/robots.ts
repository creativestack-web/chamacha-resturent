import type { MetadataRoute } from "next";
import { site } from "@/data/site";

// Served at /robots.txt — update site.url in data/site.ts before launch.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
