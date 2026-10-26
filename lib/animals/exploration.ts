import { getAnimals } from "./repository";
import type { Animal, AnimalCategory } from "./types";

export type ExplorationEntry = Readonly<{
  slug: string;
  label: string;
  count: number;
  animals: readonly Animal[];
}>;

export type CategoryEntry = ExplorationEntry & Readonly<{
  category: AnimalCategory;
  description: string;
}>;

const categoryDefinitions: readonly Readonly<{
  category: AnimalCategory;
  slug: string;
  label: string;
  description: string;
}>[] = [
  { category: "Mammal", slug: "mammals", label: "Mammals", description: "Explore the mammals currently included in the Zooflix field guide." },
  { category: "Bird", slug: "birds", label: "Birds", description: "Explore the birds currently included in the Zooflix field guide." },
  { category: "Reptile", slug: "reptiles", label: "Reptiles", description: "Explore the reptiles currently included in the Zooflix field guide." },
  { category: "Amphibian", slug: "amphibians", label: "Amphibians", description: "Explore the amphibians currently included in the Zooflix field guide." },
  { category: "Fish", slug: "fish", label: "Fish", description: "Explore the fish currently included in the Zooflix field guide." },
  { category: "Invertebrate", slug: "invertebrates", label: "Invertebrates", description: "Explore the invertebrates currently included in the Zooflix field guide." },
];

export function toExplorationSlug(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getCategoryEntries(animals: readonly Animal[] = getAnimals()): readonly CategoryEntry[] {
  return categoryDefinitions.map((definition) => {
    const matchingAnimals = animals.filter((animal) => animal.category === definition.category);

    return {
      ...definition,
      count: matchingAnimals.length,
      animals: matchingAnimals,
    };
  });
}

export function getCategoryBySlug(
  slug: string,
  animals: readonly Animal[] = getAnimals(),
): CategoryEntry | undefined {
  return getCategoryEntries(animals).find((entry) => entry.slug === toExplorationSlug(slug));
}

export function getHabitatEntries(animals: readonly Animal[] = getAnimals()): readonly ExplorationEntry[] {
  const habitatLabels = [...new Set(animals.map((animal) => animal.habitat))].sort((a, b) => a.localeCompare(b));

  return habitatLabels.map((label) => {
    const matchingAnimals = animals.filter((animal) => animal.habitat === label);

    return {
      slug: toExplorationSlug(label),
      label,
      count: matchingAnimals.length,
      animals: matchingAnimals,
    };
  });
}

export function getHabitatBySlug(
  slug: string,
  animals: readonly Animal[] = getAnimals(),
): ExplorationEntry | undefined {
  return getHabitatEntries(animals).find((entry) => entry.slug === toExplorationSlug(slug));
}
