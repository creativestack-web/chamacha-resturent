import type { MetadataRoute } from "next";
import { site } from "@/data/site";

// Served at /sitemap.xml — add future routes (e.g. /menu, /order, /branches/[id]) here.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: site.url, lastModified: new Date(), changeFrequency: "weekly", priority: 1 }];
}
