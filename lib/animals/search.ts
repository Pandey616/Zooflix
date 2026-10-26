import type { Animal, AnimalCategory, ConservationStatus } from "./types";

export type AnimalSort = "name-asc" | "name-desc";

export type AnimalSearchParams = Readonly<{
  query?: string;
  category?: AnimalCategory;
  habitat?: string;
  diet?: string;
  region?: string;
  conservationStatus?: ConservationStatus;
  sort?: AnimalSort;
  page?: number;
  pageSize?: number;
}>;

export type CatalogFilters = Readonly<{
  query: string;
  category?: AnimalCategory;
  habitat?: string;
  diet?: string;
  region?: string;
  conservationStatus?: ConservationStatus;
  sort: AnimalSort;
}>;

export type AnimalFilterOptions = Readonly<{
  categories: readonly AnimalCategory[];
  habitats: readonly string[];
  diets: readonly string[];
  regions: readonly string[];
  conservationStatuses: readonly ConservationStatus[];
}>;

export type AnimalSearchResult = Readonly<{
  items: readonly Animal[];
  totalItems: number;
  totalPages: number;
  page: number;
  pageSize: number;
}>;

const normalize = (value: string | undefined): string =>
  value?.trim().replace(/\s+/g, " ").toLocaleLowerCase() ?? "";

const uniqueSorted = <T extends string>(values: readonly (T | undefined)[]): readonly T[] =>
  [...new Set(values.filter((value): value is T => Boolean(value)))].sort((a, b) =>
    a.localeCompare(b),
  );

export function getAnimalFilterOptions(animals: readonly Animal[]): AnimalFilterOptions {
  return {
    categories: uniqueSorted(animals.map((animal) => animal.category)),
    habitats: uniqueSorted(animals.map((animal) => animal.habitat)),
    diets: uniqueSorted(animals.map((animal) => animal.diet)),
    regions: uniqueSorted(animals.map((animal) => animal.region)),
    conservationStatuses: uniqueSorted(
      animals.map((animal) => animal.conservationAssessment?.status),
    ),
  };
}

export function filterAnimals(
  animals: readonly Animal[],
  params: Pick<AnimalSearchParams, "query" | "category" | "habitat" | "diet" | "region" | "conservationStatus">,
): readonly Animal[] {
  const query = normalize(params.query);

  return animals.filter((animal) => {
    const searchableText = normalize(
      [animal.commonName, animal.scientificName].filter(Boolean).join(" "),
    );

    return (
      (!query || searchableText.includes(query)) &&
      (!params.category || animal.category === params.category) &&
      (!params.habitat || animal.habitat === params.habitat) &&
      (!params.diet || animal.diet === params.diet) &&
      (!params.region || animal.region === params.region) &&
      (!params.conservationStatus ||
        animal.conservationAssessment?.status === params.conservationStatus)
    );
  });
}

export function sortAnimals(
  animals: readonly Animal[],
  sort: AnimalSort = "name-asc",
): readonly Animal[] {
  return [...animals].sort((a, b) => {
    const nameComparison = a.commonName.localeCompare(b.commonName);
    const comparison = sort === "name-desc" ? -nameComparison : nameComparison;
    return comparison || a.slug.localeCompare(b.slug);
  });
}

export function paginateAnimals(
  animals: readonly Animal[],
  page = 1,
  pageSize = 9,
): AnimalSearchResult {
  const safePageSize = Number.isInteger(pageSize) && pageSize > 0 ? pageSize : 9;
  const totalPages = Math.max(1, Math.ceil(animals.length / safePageSize));
  const safePage = Number.isInteger(page) ? Math.min(Math.max(page, 1), totalPages) : 1;
  const start = (safePage - 1) * safePageSize;

  return {
    items: animals.slice(start, start + safePageSize),
    totalItems: animals.length,
    totalPages,
    page: safePage,
    pageSize: safePageSize,
  };
}

export function searchAnimals(
  animals: readonly Animal[],
  params: AnimalSearchParams = {},
): AnimalSearchResult {
  const filtered = filterAnimals(animals, params);
  const sorted = sortAnimals(filtered, params.sort);
  return paginateAnimals(sorted, params.page, params.pageSize);
}
