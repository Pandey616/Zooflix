import Link from "next/link";

import { AnimalCard } from "@/components/animal-card";
import { SectionHeading } from "@/components/section-heading";
import { getFeaturedAnimals } from "@/lib/animals/repository";

export default function HomePage() {
  const featuredAnimals = getFeaturedAnimals();

  return (
    <main id="main-content">
      <section className="hero shell" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">A living field guide</p>
          <h1 id="hero-title">Get a little closer to the wild.</h1>
          <p className="hero-description">
            Thoughtful stories, useful facts and a quieter way to explore the
            animals that make our planet extraordinary.
          </p>
          <Link className="button button-primary" href="/species">
            Explore species <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
        <div className="hero-note" aria-label="Zooflix principle">
          <span className="hero-note-number">01</span>
          <p>Look closely. Leave gently.</p>
        </div>
      </section>

      <section className="shell section" aria-label="Featured species">
        <SectionHeading
          eyebrow="Start here"
          title="A few remarkable neighbors"
          description="Begin with a small selection, then follow your curiosity wherever it leads."
        />
        <div className="animal-grid">
          {featuredAnimals.map((animal, index) => (
            <AnimalCard key={animal.slug} animal={animal} preload={index === 0} />
          ))}
        </div>
      </section>

      <section className="shell section" aria-label="Explore collections">
        <SectionHeading
          eyebrow="Keep exploring"
          title="Find a new path into the field guide"
          description="Browse the current collection by animal category or by the habitat labels in each record."
        />
        <div className="exploration-grid exploration-grid-home">
          <Link className="exploration-card" href="/categories">
            <span className="exploration-card-label">Animal categories</span>
            <span className="exploration-card-count">Six supported groups</span>
            <span className="exploration-card-arrow" aria-hidden="true">→</span>
          </Link>
          <Link className="exploration-card" href="/habitats">
            <span className="exploration-card-label">Habitats</span>
            <span className="exploration-card-count">Collections from the dataset</span>
            <span className="exploration-card-arrow" aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section
        className="shell principle-section"
        id="about"
        aria-labelledby="principle-title"
      >
        <div>
          <p className="eyebrow">Our approach</p>
          <h2 id="principle-title">Knowledge can be a form of care.</h2>
        </div>
        <p>
          Zooflix is being rebuilt around clear information, humane design and
          respect for every species. This foundation keeps content structured,
          discoverable and ready to grow.
        </p>
      </section>
    </main>
  );
}
