import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AnimalCard } from "@/components/animal-card";
import { SectionHeading } from "@/components/section-heading";
import { getCategoryBySlug, getCategoryEntries } from "@/lib/animals/exploration";
import { siteConfig } from "@/lib/site";

type CategoryParams = Promise<{ category: string }>;

export function generateStaticParams() {
  return getCategoryEntries().map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: { params: CategoryParams }): Promise<Metadata> {
  const category = getCategoryBySlug((await params).category);
  if (!category) {
    return { title: "Category not found", robots: { index: false, follow: false } };
  }

  return {
    title: category.label,
    description: category.description,
    ...(siteConfig.isPublicUrlConfigured
      ? { alternates: { canonical: `/categories/${category.slug}` } }
      : {}),
    openGraph: {
      title: `${category.label} | Zooflix`,
      description: category.description,
      ...(siteConfig.isPublicUrlConfigured ? { url: `/categories/${category.slug}` } : {}),
    },
  };
}

export default async function CategoryPage({ params }: { params: CategoryParams }) {
  const category = getCategoryBySlug((await params).category);
  if (!category) notFound();

  return (
    <main id="main-content" className="shell page-section">
      <Link className="back-link" href="/categories"><span aria-hidden="true">←</span> All categories</Link>
      <SectionHeading eyebrow="Explore by category" title={category.label} description={category.description} />
      <p className="collection-count" aria-live="polite">{category.count} species in this collection</p>
      {category.animals.length > 0 ? (
        <div className="animal-grid animal-grid-wide">
          {category.animals.map((animal) => <AnimalCard key={animal.id} animal={animal} />)}
        </div>
      ) : (
        <div className="catalog-empty" role="status">
          <h2>No species in this collection yet.</h2>
          <p>The category is supported, but the current dataset has no records for it.</p>
        </div>
      )}
    </main>
  );
}
