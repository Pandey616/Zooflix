import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getAnimalBySlug, getAnimals } from "@/lib/animals/repository";
import { siteConfig } from "@/lib/site";

type SpeciesPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAnimals().map((animal) => ({ slug: animal.slug }));
}

export async function generateMetadata({ params }: SpeciesPageProps): Promise<Metadata> {
  const { slug } = await params;
  const animal = getAnimalBySlug(slug);

  if (!animal) {
    return { title: "Species not found", robots: { index: false, follow: false } };
  }

  return {
    title: animal.commonName,
    description: animal.shortDescription,
    ...(siteConfig.isPublicUrlConfigured
      ? { alternates: { canonical: `/species/${animal.slug}` } }
      : {}),
    openGraph: {
      title: `${animal.commonName} | Zooflix`,
      description: animal.shortDescription,
      ...(siteConfig.isPublicUrlConfigured ? { url: `/species/${animal.slug}` } : {}),
      ...(animal.imageSrc
        ? { images: [{ url: animal.imageSrc, alt: animal.imageAlt }] }
        : {}),
    },
  };
}

export default async function SpeciesPage({ params }: SpeciesPageProps) {
  const { slug } = await params;
  const animal = getAnimalBySlug(slug);

  if (!animal) {
    notFound();
  }

  return (
    <main id="main-content" className="shell detail-page">
      <Link className="back-link" href="/species">
        <span aria-hidden="true">&larr;</span> Back to species
      </Link>
      <div className="detail-layout">
        <div className="detail-image">
          {animal.imageSrc ? (
            <Image
              src={animal.imageSrc}
              alt={animal.imageAlt}
              fill
              preload
              sizes="(max-width: 800px) 100vw, 55vw"
            />
          ) : (
            <p className="image-placeholder">Verified image unavailable</p>
          )}
        </div>
        <article className="detail-content">
          <p className="eyebrow">{animal.category}</p>
          <h1>{animal.commonName}</h1>
          {animal.scientificName ? (
            <p className="scientific-name">{animal.scientificName}</p>
          ) : null}
          <p className="detail-description">{animal.description}</p>

          <dl className="fact-list">
            <DetailFact label="Habitat" value={animal.habitat} />
            <DetailFact label="Diet" value={animal.diet} />
            {animal.region ? <DetailFact label="Region" value={animal.region} /> : null}
            {animal.conservationAssessment ? (
              <>
                <DetailFact
                  label="Conservation status"
                  value={`${animal.conservationAssessment.status} (${animal.conservationAssessment.assessedAt ?? animal.conservationAssessment.assessedYear})`}
                />
                {animal.conservationAssessment.assessmentId ? (
                  <DetailFact label="Assessment ID" value={animal.conservationAssessment.assessmentId} />
                ) : null}
              </>
            ) : null}
          </dl>

          {animal.distribution ? (
            <DetailSection title="Distribution">
              <p>{animal.distribution}</p>
            </DetailSection>
          ) : null}
          {animal.physicalCharacteristics ? (
            <DetailSection title="Physical characteristics">
              <FactList items={animal.physicalCharacteristics} />
            </DetailSection>
          ) : null}
          {animal.behavior ? (
            <DetailSection title="Behavior">
              <FactList items={animal.behavior} />
            </DetailSection>
          ) : null}
          {animal.taxonomy ? (
            <DetailSection title="Taxonomy">
              <FactList
                items={Object.entries(animal.taxonomy).map(([rank, value]) => `${rank}: ${value}`)}
              />
            </DetailSection>
          ) : null}
          {animal.lifespan || animal.reproduction ? (
            <DetailSection title="Life history">
              <FactList items={[animal.lifespan, animal.reproduction].filter(Boolean) as string[]} />
            </DetailSection>
          ) : null}
          {animal.ecologicalRole ? (
            <DetailSection title="Ecological role">
              <p>{animal.ecologicalRole}</p>
            </DetailSection>
          ) : null}
          {animal.threats ? (
            <DetailSection title="Documented pressures">
              <FactList items={animal.threats} />
            </DetailSection>
          ) : null}

          <DetailSection title="Good to know">
            <FactList items={animal.facts} />
          </DetailSection>

          {animal.references?.length ? (
            <DetailSection title="References">
              <ul className="reference-list">
                {animal.references.map((reference) => (
                  <li key={reference.url}>
                    <a href={reference.url} target="_blank" rel="noreferrer">
                      {reference.title}
                    </a>
                    {reference.publisher ? ` — ${reference.publisher}` : null}
                    {reference.supports?.length ? (
                      <small className="reference-support">
                        Supports: {reference.supports.join(", ")}
                      </small>
                    ) : null}
                  </li>
                ))}
              </ul>
            </DetailSection>
          ) : null}

          {animal.imageAttribution ? (
            <p className="image-attribution">
              {animal.imageAttribution.attributionText ?? `Image by ${animal.imageAttribution.creator}`} ({" "}
              <a href={animal.imageAttribution.sourceUrl} target="_blank" rel="noreferrer">
                source
              </a>
              {animal.imageAttribution.license ? (
                <>
                  {", "}
                  {animal.imageAttribution.licenseUrl ? (
                    <a href={animal.imageAttribution.licenseUrl} target="_blank" rel="noreferrer">
                      {animal.imageAttribution.license}
                    </a>
                  ) : (
                    animal.imageAttribution.license
                  )}
                </>
              ) : null}
              )
              {animal.imageAttribution.licenseNotes?.length ? (
                <small className="image-license-notes">
                  {animal.imageAttribution.licenseNotes.join(" ")}
                </small>
              ) : null}
            </p>
          ) : null}
        </article>
      </div>
    </main>
  );
}

function DetailFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="detail-facts" aria-labelledby={`${title.toLowerCase().replaceAll(" ", "-")}-title`}>
      <h2 id={`${title.toLowerCase().replaceAll(" ", "-")}-title`}>{title}</h2>
      {children}
    </section>
  );
}

function FactList({ items }: { items: readonly string[] }) {
  return (
    <ul>
      {items.map((fact) => (
        <li key={fact}>{fact}</li>
      ))}
    </ul>
  );
}
