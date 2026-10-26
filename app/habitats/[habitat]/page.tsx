import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AnimalCard } from "@/components/animal-card";
import { SectionHeading } from "@/components/section-heading";
import { getHabitatBySlug, getHabitatEntries } from "@/lib/animals/exploration";
import { siteConfig } from "@/lib/site";

type HabitatParams = Promise<{ habitat: string }>;

export function generateStaticParams() {
  return getHabitatEntries().map((habitat) => ({ habitat: habitat.slug }));
}

export async function generateMetadata({ params }: { params: HabitatParams }): Promise<Metadata> {
  const habitat = getHabitatBySlug((await params).habitat);
  if (!habitat) {
    return { title: "Habitat not found", robots: { index: false, follow: false } };
  }

  const description = `Species whose records include the habitat label ${habitat.label}.`;
  return {
    title: habitat.label,
    description,
    ...(siteConfig.isPublicUrlConfigured
      ? { alternates: { canonical: `/habitats/${habitat.slug}` } }
      : {}),
    openGraph: {
      title: `${habitat.label} | Zooflix`,
      description,
      ...(siteConfig.isPublicUrlConfigured ? { url: `/habitats/${habitat.slug}` } : {}),
    },
  };
}

export default async function HabitatPage({ params }: { params: HabitatParams }) {
  const habitat = getHabitatBySlug((await params).habitat);
  if (!habitat) notFound();

  return (
    <main id="main-content" className="shell page-section">
      <Link className="back-link" href="/habitats"><span aria-hidden="true">←</span> All habitats</Link>
      <SectionHeading
        eyebrow="Explore by habitat"
        title={habitat.label}
        description="This collection is derived from the habitat value recorded in the validated dataset."
      />
      <p className="collection-count" aria-live="polite">{habitat.count} species in this collection</p>
      <p className="collection-note">A species record may describe more than one setting within its habitat field.</p>
      {habitat.animals.length > 0 ? (
        <div className="animal-grid animal-grid-wide">
          {habitat.animals.map((animal) => <AnimalCard key={animal.id} animal={animal} />)}
        </div>
      ) : (
        <div className="catalog-empty" role="status">
          <h2>No species in this collection yet.</h2>
          <p>The habitat link is valid, but the current dataset has no matching records.</p>
        </div>
      )}
    </main>
  );
}
