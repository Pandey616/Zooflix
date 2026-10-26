import { describe, expect, it } from "vitest";

import {
  animalSchema,
  conservationAssessmentSchema,
  imageAttributionSchema,
  referenceSchema,
} from "./schema";

const reference = {
  title: "Species account",
  url: "https://example.org/species",
  publisher: "Example publisher",
  accessedAt: "2026-10-17",
  sourceType: "species-account" as const,
  supports: ["habitat", "diet"] as const,
};

describe("provenance schemas", () => {
  it("validates references with associated claim fields", () => {
    expect(referenceSchema.safeParse(reference).success).toBe(true);
    expect(referenceSchema.safeParse({ ...reference, url: "not-a-url" }).success).toBe(false);
    expect(referenceSchema.safeParse({ ...reference, accessedAt: "17-10-2026" }).success).toBe(false);
  });

  it("preserves multiple references on one animal record", () => {
    const result = animalSchema.safeParse({
      id: "test-animal",
      slug: "test-animal",
      commonName: "Test animal",
      category: "Mammal",
      habitat: "Forest",
      diet: "Omnivore",
      shortDescription: "A test record.",
      description: "A test record with separate supporting sources.",
      facts: ["A fact."],
      imageAlt: "A test animal",
      references: [reference, { ...reference, title: "Second source", url: "https://example.org/second" }],
      provenance: {
        primarySource: reference,
        verifiedAt: "2026-10-17",
        claimReviews: {
          habitat: {
            status: "verified",
            referenceUrls: [reference.url],
            reviewedAt: "2026-10-17",
          },
        },
      },
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.references).toHaveLength(2);
      expect(result.data.references?.[0]?.supports).toEqual(["habitat", "diet"]);
      expect(result.data.provenance?.claimReviews?.habitat.status).toBe("verified");
    }
  });

  it("validates image and conservation metadata without requiring unknown optional facts", () => {
    expect(
      imageAttributionSchema.safeParse({
        creator: "Photographer",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Example.jpg",
        license: "CC BY 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
        verifiedAt: "2026-10-17",
        licenseNotes: ["Attribution is required."],
      }).success,
    ).toBe(true);
    expect(
      conservationAssessmentSchema.safeParse({
        status: "Endangered",
        assessedYear: 2021,
        source: { ...reference, sourceType: "conservation-assessment" },
      }).success,
    ).toBe(true);
    expect(
      conservationAssessmentSchema.safeParse({
        status: "Endangered",
        source: { ...reference, sourceType: "conservation-assessment" },
      }).success,
    ).toBe(false);
  });
});
