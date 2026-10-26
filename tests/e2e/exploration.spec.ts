import { expect, test } from "@playwright/test";

test("homepage navigation reaches the species catalog", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("navigation", { name: "Primary navigation" })
    .getByRole("link", { name: "Explore species" })
    .click();

  await expect(page).toHaveURL(/\/species$/);
  await expect(page.getByRole("heading", { name: "Meet the species" })).toBeVisible();
});

test("catalog search matches common and scientific names", async ({ page }) => {
  await page.goto("/species");
  const search = page.getByRole("searchbox", { name: "Search species" });

  await search.fill("Canis lupus");
  await page.getByRole("button", { name: "Apply filters" }).click();

  await expect(page).toHaveURL(/query=Canis(?:%20|\+)lupus/i);
  await expect(page.getByRole("link", { name: /Gray wolf/ })).toBeVisible();
  await expect(page.getByText("No species match those filters.")).toHaveCount(0);
});

test("a catalog filter opens a matching species detail page", async ({ page }) => {
  await page.goto("/species");
  await page.getByLabel("Class").selectOption("Reptile");
  await page.getByRole("button", { name: "Apply filters" }).click();

  await expect(page).toHaveURL(/category=Reptile/);
  await page.getByRole("link", { name: /Komodo dragon/ }).click();
  await expect(page).toHaveURL(/\/species\/komodo-dragon$/);
  await expect(page.getByRole("heading", { name: "Komodo dragon" })).toBeVisible();
});

test("direct species navigation survives a refresh", async ({ page }) => {
  await page.goto("/species/gray-wolf");
  await page.reload();

  await expect(page.getByRole("heading", { name: "Gray wolf" })).toBeVisible();
});

test("catalog URL states support browser back and forward", async ({ page }) => {
  await page.goto("/species?query=wolf");
  await expect(page.getByRole("searchbox", { name: "Search species" })).toHaveValue("wolf");

  await page.goto("/species?query=elephant");
  await expect(page.getByRole("searchbox", { name: "Search species" })).toHaveValue("elephant");

  await page.goBack();
  await expect(page.getByRole("searchbox", { name: "Search species" })).toHaveValue("wolf");
  await page.goForward();
  await expect(page.getByRole("searchbox", { name: "Search species" })).toHaveValue("elephant");
});

test("category page links to a species detail page", async ({ page }) => {
  await page.goto("/categories/mammals");
  await expect(page.getByRole("heading", { name: "Mammals" })).toBeVisible();
  await page.getByRole("link", { name: /Gray wolf/ }).click();

  await expect(page).toHaveURL(/\/species\/gray-wolf$/);
  await expect(page.getByRole("heading", { name: "Gray wolf" })).toBeVisible();
});

test("habitat page links to a species detail page", async ({ page }) => {
  await page.goto("/habitats");
  await page.locator("a.exploration-card").first().click();
  await expect(page.getByRole("heading").nth(1)).toBeVisible();

  await page.getByRole("link", { name: /Read about/ }).first().click();
  await expect(page).toHaveURL(/\/species\/[a-z0-9-]+$/);
});

test("unknown species, category and habitat routes show not found", async ({ page }) => {
  for (const path of ["/species/not-a-real-animal", "/categories/not-a-real-category", "/habitats/not-a-real-habitat"]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { name: "That species wandered off." })).toBeVisible();
  }
});

test("primary navigation is keyboard accessible", async ({ page }) => {
  await page.goto("/");
  const categoriesLink = page
    .getByRole("navigation", { name: "Primary navigation" })
    .getByRole("link", { name: "Categories" });

  await categoriesLink.focus();
  await expect(categoriesLink).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/categories$/);
});

test("catalog controls expose accessible labels", async ({ page }) => {
  await page.goto("/species");

  await expect(page.getByRole("searchbox", { name: "Search species" })).toBeVisible();
  await expect(page.getByLabel("Class")).toBeVisible();
  await expect(page.getByLabel("Habitat")).toBeVisible();
  await expect(page.getByRole("button", { name: "Apply filters" })).toBeVisible();
});

test("indexable pages expose canonical and Open Graph metadata", async ({ page }) => {
  await page.goto("/species/gray-wolf");

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "http://127.0.0.1:3100/species/gray-wolf",
  );
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    "http://127.0.0.1:3100/species/gray-wolf",
  );

  await page.goto("/categories/mammals");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "http://127.0.0.1:3100/categories/mammals",
  );
});

test("invalid species routes are marked noindex", async ({ page }) => {
  const response = await page.goto("/species/not-a-real-animal");

  expect(response?.status()).toBe(404);
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", /noindex/);
});

test("mobile viewport can navigate from categories to a species", async ({ page }) => {
  await page.goto("/categories");
  await expect(page.getByRole("heading", { name: "Animal categories" })).toBeVisible();
  await page.getByRole("link", { name: /Mammals/ }).click();
  await expect(page.getByRole("heading", { name: "Mammals" })).toBeVisible();
  await page.getByRole("link", { name: /Gray wolf/ }).click();
  await expect(page.getByRole("heading", { name: "Gray wolf" })).toBeVisible();
});
