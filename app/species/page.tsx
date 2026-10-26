import type { Metadata } from "next";

import { SectionHeading } from "@/components/section-heading";
import { SpeciesBrowser } from "@/components/species-browser";
import { getCatalogState } from "@/lib/animals/catalog";
import { getAnimals } from "@/lib/animals/repository";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Explore species",
  description: "Browse the Zooflix field guide by species and habitat.",
  ...(siteConfig.isPublicUrlConfigured ? { alternates: { canonical: "/species" } } : {}),
};

type SpeciesSearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function SpeciesIndexPage({
  searchParams,
}: {
  searchParams: SpeciesSearchParams;
}) {
  const state = getCatalogState(getAnimals(), await searchParams);

  return (
    <main id="main-content" className="shell page-section">
      <SectionHeading
        eyebrow="The field guide"
        title="Meet the species"
        description="A growing collection of animal stories, shaped for slow reading and easy discovery."
      />
      <SpeciesBrowser {...state} />
    </main>
  );
}
