/** @vitest-environment jsdom */

import type { ReactNode } from "react";

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SpeciesBrowser } from "@/components/species-browser";
import {
  buildCatalogHref,
  getCatalogState,
} from "@/lib/animals/catalog";
import { getAnimals } from "@/lib/animals/repository";
import type { Animal } from "@/lib/animals/types";

afterEach(() => {
  cleanup();
});

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: ReactNode;
    className?: string;
    "aria-label"?: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // The integration test replaces Next Image with a native DOM image.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

function renderCatalog(
  params: Record<string, string | string[] | undefined> = {},
) {
  const state = getCatalogState(getAnimals(), params);
  render(<SpeciesBrowser {...state} />);
  return state;
}

function createPaginatedCatalog(): readonly Animal[] {
  return Array.from({ length: 12 }, (_, index) => {
    const source = getAnimals()[index % getAnimals().length];
    return {
      ...source,
      id: `${source.id}-${index}`,
      slug: `${source.slug}-${index}`,
      commonName: `${source.commonName} ${index}`,
    };
  });
}

describe("species catalog integration", () => {
  it("renders the initial catalog with accessible controls and results", () => {
    const state = renderCatalog();

    expect(state.result.totalItems).toBe(getAnimals().length);
    expect(screen.getByRole("searchbox", { name: "Search species" })).toBeTruthy();
    expect(screen.getByRole("combobox", { name: "Class" })).toBeTruthy();
    expect(screen.getByRole("combobox", { name: "Habitat" })).toBeTruthy();
    expect(screen.getByRole("combobox", { name: "Diet" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Apply filters" })).toBeTruthy();
    expect(screen.getAllByRole("link", { name: /Read about/ })).toHaveLength(state.result.items.length);
  });

  it("connects common/scientific search state to rendered results", () => {
    const state = renderCatalog({ query: "  CANIS   LUPUS " });

    expect(state.result.items.map((animal) => animal.slug)).toEqual(["gray-wolf"]);
    expect(screen.getByRole("link", { name: "Read about Gray wolf" })).toBeTruthy();
    expect(screen.queryByRole("link", { name: "Read about Bald eagle" })).toBeNull();
  });

  it("applies supported combined filters and exposes sourced dimensions", () => {
    const state = renderCatalog({
      category: "Mammal",
      habitat: "Forests, tundra, grasslands and deserts",
      diet: "Carnivore",
    });

    expect(state.result.items.map((animal) => animal.slug)).toEqual(["gray-wolf"]);
    expect(state.options.regions.length).toBeGreaterThan(0);
    expect(state.options.conservationStatuses).toEqual(["Endangered"]);
    expect(screen.getByRole("combobox", { name: "Region" })).toBeTruthy();
    expect(screen.getByRole("combobox", { name: "Conservation status" })).toBeTruthy();
  });

  it("filters by the sourced conservation assessment", () => {
    const state = renderCatalog({ conservationStatus: "Endangered" });

    expect(state.result.items.map((animal) => animal.slug)).toEqual(["african-elephant"]);
    expect(screen.getByRole("link", { name: "Read about African elephant" })).toBeTruthy();
  });

  it("keeps URL state shareable and exposes pagination links", () => {
    const state = getCatalogState(createPaginatedCatalog(), {
      sort: "name-desc",
    });
    const nextHref = buildCatalogHref(state.filters, 2);

    expect(nextHref).toContain("sort=name-desc");
    expect(nextHref).toContain("page=2");

    render(<SpeciesBrowser {...state} />);
    expect(screen.getByRole("link", { name: "Next" }).getAttribute("href")).toBe(nextHref);
  });

  it("corrects invalid, repeated and out-of-range parameters", () => {
    const state = getCatalogState(getAnimals(), {
      query: ["wolf", "elephant"],
      category: "not-a-category",
      sort: "not-a-sort",
      page: "999",
    });

    expect(state.filters.query).toBe("wolf");
    expect(state.filters.category).toBeUndefined();
    expect(state.filters.sort).toBe("name-asc");
    expect(state.result.page).toBe(1);
    expect(state.result.items.map((animal) => animal.slug)).toEqual(["gray-wolf"]);
  });

  it("supports keyboard-friendly native GET controls and reset navigation", async () => {
    const user = userEvent.setup();
    renderCatalog();

    const searchbox = screen.getByRole("searchbox", { name: "Search species" });
    const category = screen.getByRole("combobox", { name: "Class" });
    const form = searchbox.closest("form");

    expect(form).toBeTruthy();
    expect(form?.getAttribute("method")).toBe("get");
    expect(form?.getAttribute("action")).toBe("/species");

    await user.type(searchbox, "wolf");
    await user.selectOptions(category, "Mammal");

    expect((searchbox as HTMLInputElement).value).toBe("wolf");
    expect((category as HTMLSelectElement).value).toBe("Mammal");
    expect(screen.getByRole("link", { name: "Reset" }).getAttribute("href")).toBe("/species");
  });

  it("renders a useful empty-result state", () => {
    const state = renderCatalog({ query: "no-such-species" });

    expect(state.result.items).toHaveLength(0);
    expect(screen.getByRole("status").textContent).toContain("No species match those filters.");
    expect(screen.getByRole("link", { name: "Show all species" }).getAttribute("href")).toBe(
      "/species",
    );
  });
});
