import type { Metadata } from "next";

import { ExplorationCard } from "@/components/exploration-card";
import { SectionHeading } from "@/components/section-heading";
import { getCategoryEntries } from "@/lib/animals/exploration";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Animal categories",
  description: "Browse the Zooflix field guide by animal category.",
  ...(siteConfig.isPublicUrlConfigured ? { alternates: { canonical: "/categories" } } : {}),
};

export default function CategoriesPage() {
  const categories = getCategoryEntries();

  return (
    <main id="main-content" className="shell page-section">
      <SectionHeading
        eyebrow="Browse by category"
        title="Animal categories"
        description="Start with a broad group, then follow a species into its full field-guide entry."
      />
      <div className="exploration-grid">
        {categories.map((category) => (
          <ExplorationCard key={category.slug} entry={category} href={`/categories/${category.slug}`} />
        ))}
      </div>
    </main>
  );
}
