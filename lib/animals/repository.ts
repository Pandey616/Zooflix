import { animals } from "./data";
import { parseAnimals } from "./schema";
import type { Animal } from "./types";

const validatedAnimals = parseAnimals(animals);

export function getAnimals(): readonly Animal[] {
  return validatedAnimals;
}

export function getFeaturedAnimals(): readonly Animal[] {
  return validatedAnimals.filter((animal) => animal.featured);
}

export function getAnimalBySlug(slug: string): Animal | undefined {
  return validatedAnimals.find((animal) => animal.slug === slug.trim().toLowerCase());
}
