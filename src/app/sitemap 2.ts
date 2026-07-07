import type { MetadataRoute } from "next";

const BASE_URL = process.env.URL ?? "https://finu.netlify.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
