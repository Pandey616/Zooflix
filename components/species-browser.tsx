import Link from "next/link";

import { AnimalCard } from "@/components/animal-card";
import { buildCatalogHref } from "@/lib/animals/catalog";
import type {
  AnimalFilterOptions,
  AnimalSearchResult,
  CatalogFilters,
} from "@/lib/animals/search";

type SpeciesBrowserProps = Readonly<{
  filters: CatalogFilters;
  options: AnimalFilterOptions;
  result: AnimalSearchResult;
}>;

export function SpeciesBrowser({ filters, options, result }: SpeciesBrowserProps) {
  return (
    <>
      <form className="catalog-controls" method="get" action="/species">
        <div className="search-field">
          <label htmlFor="species-search">Search species</label>
          <input
            id="species-search"
            name="query"
            type="search"
            defaultValue={filters.query}
            placeholder="Common or scientific name"
            aria-describedby="search-help"
          />
          <p id="search-help">Search by common name or scientific name.</p>
        </div>

        <div className="filter-fields">
          <FilterSelect id="category" label="Class" value={filters.category} options={options.categories} />
          <FilterSelect id="habitat" label="Habitat" value={filters.habitat} options={options.habitats} />
          <FilterSelect id="diet" label="Diet" value={filters.diet} options={options.diets} />
          {options.regions.length > 0 ? (
            <FilterSelect id="region" label="Region" value={filters.region} options={options.regions} />
          ) : null}
          {options.conservationStatuses.length > 0 ? (
            <FilterSelect
              id="conservationStatus"
              label="Conservation status"
              value={filters.conservationStatus}
              options={options.conservationStatuses}
            />
          ) : null}
          <label className="filter-control" htmlFor="sort">
            Sort
            <select id="sort" name="sort" defaultValue={filters.sort}>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
            </select>
          </label>
        </div>

        <div className="catalog-actions">
          <button className="button button-primary" type="submit">
            Apply filters
          </button>
          <Link className="reset-link" href="/species">
            Reset
          </Link>
        </div>
      </form>

      <div className="results-header" aria-live="polite" aria-atomic="true">
        <p>
          {result.totalItems === 0
            ? "No species found"
            : `${result.totalItems} species found`}
        </p>
        {result.totalPages > 1 ? (
          <p>
            Page {result.page} of {result.totalPages}
          </p>
        ) : null}
      </div>

      {result.items.length > 0 ? (
        <div className="animal-grid animal-grid-wide">
          {result.items.map((animal) => (
            <AnimalCard key={animal.id} animal={animal} />
          ))}
        </div>
      ) : (
        <div className="catalog-empty" role="status">
          <h2>No species match those filters.</h2>
          <p>Try a broader search or remove one of the filters.</p>
          <Link className="button button-primary" href="/species">
            Show all species
          </Link>
        </div>
      )}

      {result.totalPages > 1 ? (
        <nav className="pagination" aria-label="Species pages">
          {result.page > 1 ? (
            <Link href={buildCatalogHref(filters, result.page - 1)}>Previous</Link>
          ) : (
            <span aria-disabled="true">Previous</span>
          )}
          <span aria-current="page">
            {result.page} / {result.totalPages}
          </span>
          {result.page < result.totalPages ? (
            <Link href={buildCatalogHref(filters, result.page + 1)}>Next</Link>
          ) : (
            <span aria-disabled="true">Next</span>
          )}
        </nav>
      ) : null}
    </>
  );
}

type FilterSelectProps = Readonly<{
  id: string;
  label: string;
  value?: string;
  options: readonly string[];
}>;

function FilterSelect({ id, label, value, options }: FilterSelectProps) {
  return (
    <label className="filter-control" htmlFor={id}>
      {label}
      <select id={id} name={id} defaultValue={value ?? ""}>
        <option value="">All</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
