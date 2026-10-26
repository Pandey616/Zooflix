import Image from "next/image";
import Link from "next/link";

import type { Animal } from "@/lib/animals/types";

type AnimalCardProps = {
  animal: Animal;
  preload?: boolean;
};

export function AnimalCard({ animal, preload = false }: AnimalCardProps) {
  return (
    <article className="animal-card">
      <Link
        className="animal-card-link"
        href={`/species/${animal.slug}`}
        aria-label={`Read about ${animal.commonName}`}
      >
        <div className="animal-card-image">
          {animal.imageSrc ? (
            <Image
              src={animal.imageSrc}
              alt={animal.imageAlt}
              fill
              preload={preload}
              sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
            />
          ) : (
            <p className="image-placeholder">Verified image unavailable</p>
          )}
        </div>
        <div className="animal-card-content">
          <div className="animal-card-meta">
            <span>{animal.category}</span>
            <span aria-hidden="true">&#8599;</span>
          </div>
          <h3>{animal.commonName}</h3>
          <p>{animal.shortDescription}</p>
        </div>
      </Link>
    </article>
  );
}
