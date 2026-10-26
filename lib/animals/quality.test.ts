import { describe, expect, it } from "vitest";

import { animals } from "./data";
import { inspectAnimalQuality } from "./quality";

describe("animal content quality report", () => {
  it("accepts the curated dataset and finds no structural quality errors", () => {
    const report = inspectAnimalQuality(animals);

    expect(report.validStructure).toBe(true);
    expect(report.issues.filter((issue) => issue.severity === "error")).toEqual([]);
    expect(report.issues.filter((issue) => issue.code === "missing-reference")).toEqual([]);
    expect(report.issues.filter((issue) => issue.code === "missing-image-attribution")).toEqual([]);
    expect(report.issues.filter((issue) => issue.code === "incomplete-reference-provenance")).toEqual([]);
    expect(report.issues.filter((issue) => issue.code === "incomplete-image-provenance")).toEqual([]);
    expect(report.issues.filter((issue) => issue.severity === "error")).toEqual([]);
    expect(report.issues.filter((issue) => issue.code === "partially-supported-claim").length).toBeGreaterThan(0);
    expect(report.issues.filter((issue) => issue.code === "unable-to-verify-claim").length).toBe(19);
  });

  it("reports malformed records without claiming scientific verification", () => {
    const report = inspectAnimalQuality([{ id: "duplicate", slug: "bad slug" }]);

    expect(report.validStructure).toBe(false);
    expect(report.issues.some((issue) => issue.code === "schema-validation")).toBe(true);
  });

  it("reports incomplete optional provenance metadata", () => {
    const report = inspectAnimalQuality([
      {
        id: "partial-animal",
        slug: "partial-animal",
        commonName: "Partial animal",
        category: "Mammal",
        habitat: "Forest",
        diet: "Omnivore",
        shortDescription: "A partial record.",
        description: "A partial record.",
        facts: ["A fact."],
        imageSrc: "https://example.org/image.jpg",
        imageAlt: "A partial animal",
        imageAttribution: {
          creator: "Unknown",
          sourceUrl: "https://example.org/image-page",
        },
        references: [{ title: "Unclassified source", url: "https://example.org/source" }],
        provenance: {
          primarySource: { title: "Other source", url: "https://example.org/other" },
          verifiedAt: "2026-10-17",
        },
      },
    ]);

    expect(report.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining([
        "incomplete-reference-provenance",
        "primary-source-not-listed",
        "unknown-image-license",
        "incomplete-image-provenance",
        "missing-claim-review",
      ]),
    );
  });
});
