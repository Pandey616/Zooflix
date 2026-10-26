import type { Metadata } from "next";

import { ExplorationCard } from "@/components/exploration-card";
import { SectionHeading } from "@/components/section-heading";
import { getHabitatEntries } from "@/lib/animals/exploration";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Habitats",
  description: "Browse the Zooflix field guide by the habitat labels in the dataset.",
  ...(siteConfig.isPublicUrlConfigured ? { alternates: { canonical: "/habitats" } } : {}),
};

export default function HabitatsPage() {
  const habitats = getHabitatEntries();

  return (
    <main id="main-content" className="shell page-section">
      <SectionHeading
        eyebrow="Browse by habitat"
        title="Habitats"
        description="Explore collections derived from the habitat information recorded for each species."
      />
      <div className="exploration-grid">
        {habitats.map((habitat) => (
          <ExplorationCard key={habitat.slug} entry={habitat} href={`/habitats/${habitat.slug}`} />
        ))}
      </div>
    </main>
  );
}
