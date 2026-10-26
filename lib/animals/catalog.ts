import {
  getAnimalFilterOptions,
  searchAnimals,
  type AnimalFilterOptions,
  type AnimalSearchResult,
  type CatalogFilters,
} from "./search";
import type { Animal } from "./types";

export type CatalogSearchParams = Readonly<
  Record<string, string | string[] | undefined>
>;

export type CatalogState = Readonly<{
  filters: CatalogFilters;
  options: AnimalFilterOptions;
  result: AnimalSearchResult;
}>;

export function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function matchingOption<T extends string>(
  value: string | undefined,
  options: readonly T[],
): T | undefined {
  return value && options.includes(value as T) ? (value as T) : undefined;
}

export function getCatalogState(
  animals: readonly Animal[],
  params: CatalogSearchParams = {},
): CatalogState {
  const options = getAnimalFilterOptions(animals);
  const rawSort = firstParam(params.sort);
  const filters = {
    query: firstParam(params.query) ?? "",
    category: matchingOption(firstParam(params.category), options.categories),
    habitat: matchingOption(firstParam(params.habitat), options.habitats),
    diet: matchingOption(firstParam(params.diet), options.diets),
    region: matchingOption(firstParam(params.region), options.regions),
    conservationStatus: matchingOption(
      firstParam(params.conservationStatus),
      options.conservationStatuses,
    ),
    sort: rawSort === "name-desc" ? "name-desc" : "name-asc",
  } satisfies CatalogFilters;
  const rawPage = Number.parseInt(firstParam(params.page) ?? "1", 10);
  const page = Number.isFinite(rawPage) ? rawPage : 1;

  return {
    filters,
    options,
    result: searchAnimals(animals, { ...filters, page }),
  };
}

export function buildCatalogHref(filters: CatalogFilters, page: number): string {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });

  if (page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();
  return query ? `/species?${query}` : "/species";
}
