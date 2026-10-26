import type { MetadataRoute } from "next";

import { getCategoryEntries, getHabitatEntries } from "@/lib/animals/exploration";
import { getAnimals } from "@/lib/animals/repository";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteConfig.isPublicUrlConfigured) {
    return [];
  }

  const baseUrl = siteConfig.url;

  return [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/species`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/categories`, changeFrequency: "weekly", priority: 0.8 },
    ...getCategoryEntries().map((category) => ({
      url: `${baseUrl}/categories/${category.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    { url: `${baseUrl}/habitats`, changeFrequency: "weekly", priority: 0.8 },
    ...getHabitatEntries().map((habitat) => ({
      url: `${baseUrl}/habitats/${habitat.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...getAnimals().map((animal) => ({
      url: `${baseUrl}/species/${animal.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
