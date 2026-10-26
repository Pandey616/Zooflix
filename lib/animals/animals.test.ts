import { describe, expect, it } from "vitest";

import { getAnimalBySlug, getAnimals } from "./repository";
import { animalsSchema, animalSchema, parseAnimals } from "./schema";
import {
  filterAnimals,
  paginateAnimals,
  searchAnimals,
  sortAnimals,
} from "./search";
import type { Animal } from "./types";

function makeAnimal(overrides: Partial<Animal> = {}): Animal {
  return {
    id: "mammal-gray-wolf",
    slug: "gray-wolf",
    commonName: "Gray wolf",
    scientificName: "Canis lupus",
    category: "Mammal",
    habitat: "Forest",
    diet: "Carnivore",
    shortDescription: "A social canid.",
    description: "A typed test animal.",
    facts: ["A test fact."],
    imageSrc: "/animals/wolf.jpg",
    imageAlt: "A gray wolf",
    ...overrides,
  };
}

const catalog: readonly Animal[] = [
  makeAnimal(),
  makeAnimal({
    id: "bird-bald-eagle",
    slug: "bald-eagle",
    commonName: "Bald eagle",
    scientificName: "Haliaeetus leucocephalus",
    category: "Bird",
    habitat: "Wetland",
    diet: "Carnivore",
  }),
  makeAnimal({
    id: "marine-humpback-whale",
    slug: "humpback-whale",
    commonName: "Humpback whale",
    scientificName: "Megaptera novaeangliae",
    category: "Mammal",
    habitat: "Ocean",
    diet: "Filter feeder",
  }),
];

describe("animal schema", () => {
  it("accepts valid records and optional scientific information", () => {
    const record = makeAnimal({ scientificName: undefined });

    expect(animalSchema.safeParse(record).success).toBe(true);
    expect(parseAnimals([record])).toHaveLength(1);
  });

  it("rejects malformed records", () => {
    const invalidRecord = { ...makeAnimal(), slug: "Not a valid slug" };

    expect(animalSchema.safeParse(invalidRecord).success).toBe(false);
  });

  it("rejects duplicate IDs and slugs at the collection boundary", () => {
    const duplicateId = makeAnimal({ slug: "another-wolf" });
    const duplicateSlug = makeAnimal({ id: "another-wolf" });

    expect(animalsSchema.safeParse([makeAnimal(), duplicateId]).success).toBe(false);
    expect(animalsSchema.safeParse([makeAnimal(), duplicateSlug]).success).toBe(false);
  });
});

describe("animal search", () => {
  it("searches common and scientific names case-insensitively", () => {
    expect(filterAnimals(catalog, { query: "  CANIS   LUPUS " })).toHaveLength(1);
    expect(filterAnimals(catalog, { query: "bald EAGLE" })[0]?.slug).toBe("bald-eagle");
  });

  it("applies combined filters", () => {
    const result = filterAnimals(catalog, {
      category: "Mammal",
      habitat: "Forest",
      diet: "Carnivore",
    });

    expect(result.map((animal) => animal.slug)).toEqual(["gray-wolf"]);
  });

  it("sorts deterministically in both directions", () => {
    expect(sortAnimals(catalog).map((animal) => animal.commonName)).toEqual([
      "Bald eagle",
      "Gray wolf",
      "Humpback whale",
    ]);
    expect(sortAnimals(catalog, "name-desc").map((animal) => animal.commonName)).toEqual([
      "Humpback whale",
      "Gray wolf",
      "Bald eagle",
    ]);
  });

  it("clamps pagination and preserves an empty result state", () => {
    const lastPage = paginateAnimals(catalog, 100, 2);
    const firstPage = paginateAnimals(catalog, 0, 2);
    const emptyPage = paginateAnimals([], 1, 2);

    expect(lastPage.page).toBe(2);
    expect(lastPage.items).toHaveLength(1);
    expect(firstPage.page).toBe(1);
    expect(emptyPage.totalPages).toBe(1);
    expect(emptyPage.items).toHaveLength(0);
  });

  it("combines query, sorting and pagination", () => {
    const result = searchAnimals(catalog, { query: "a", sort: "name-desc", page: 1, pageSize: 2 });

    expect(result.totalItems).toBe(3);
    expect(result.items.map((animal) => animal.commonName)).toEqual([
      "Humpback whale",
      "Gray wolf",
    ]);
  });
});

describe("animal lookup", () => {
  it("returns valid records and rejects unknown slugs", () => {
    expect(getAnimalBySlug(" GRAY-WOLF ")?.commonName).toBe("Gray wolf");
    expect(getAnimalBySlug("does-not-exist")).toBeUndefined();
  });
});

describe("curated animal dataset", () => {
  it("keeps all curated records unique and discoverable", () => {
    const animals = getAnimals();

    expect(animals).toHaveLength(20);
    expect(new Set(animals.map((animal) => animal.id)).size).toBe(animals.length);
    expect(new Set(animals.map((animal) => animal.slug)).size).toBe(animals.length);
    expect(filterAnimals(animals, { query: "  BUBO   SCANDIACUS " })).toHaveLength(1);
    expect(
      filterAnimals(animals, {
        category: "Reptile",
        habitat: "Tropical and subtropical coastal waters, reefs and nesting beaches",
        diet: "Algae and seagrass as adults; more varied foods when young",
      }).map((animal) => animal.slug),
    ).toEqual(["green-sea-turtle"]);
  });
});
