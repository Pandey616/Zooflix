import { animalsSchema } from "./schema";
import type { Animal } from "./types";

export type AnimalQualityIssue = Readonly<{
  severity: "error" | "warning";
  code: string;
  animalId?: string;
  message: string;
}>;

export type AnimalQualityReport = Readonly<{
  validStructure: boolean;
  issues: readonly AnimalQualityIssue[];
}>;

const expectedClasses: Readonly<Record<Animal["category"], readonly string[]>> = {
  Mammal: ["Mammalia"],
  Bird: ["Aves"],
  Reptile: ["Reptilia"],
  Amphibian: ["Amphibia"],
  Fish: ["Actinopterygii", "Chondrichthyes"],
  Invertebrate: ["Insecta", "Cephalopoda"],
};

export function inspectAnimalQuality(input: unknown): AnimalQualityReport {
  const parsed = animalsSchema.safeParse(input);

  if (!parsed.success) {
    return {
      validStructure: false,
      issues: parsed.error.issues.map((issue) => ({
        severity: "error",
        code: "schema-validation",
        message: `${issue.path.join(".") || "records"}: ${issue.message}`,
      })),
    };
  }

  const issues: AnimalQualityIssue[] = [];

  parsed.data.forEach((animal) => {
    const references = animal.references ?? [];

    if (!references.length) {
      issues.push({
        severity: "warning",
        code: "missing-reference",
        animalId: animal.id,
        message: `${animal.commonName} has no supporting references.`,
      });
    }

    references.forEach((reference) => {
      if (!reference.sourceType || !reference.supports?.length) {
        issues.push({
          severity: "warning",
          code: "incomplete-reference-provenance",
          animalId: animal.id,
          message: `${animal.commonName} has a reference without source type and supported claim fields.`,
        });
      }
    });

    if (
      animal.provenance &&
      !references.some((reference) => reference.url === animal.provenance?.primarySource.url)
    ) {
      issues.push({
        severity: "warning",
        code: "primary-source-not-listed",
        animalId: animal.id,
        message: `${animal.commonName}'s primary provenance source is not listed in its references.`,
      });
    }

    if (!animal.provenance) {
      issues.push({
        severity: "warning",
        code: "missing-provenance",
        animalId: animal.id,
        message: `${animal.commonName} has no provenance record or uncertainty declaration.`,
      });
    }

    const claimReviews = animal.provenance?.claimReviews;
    if (!claimReviews) {
      issues.push({
        severity: "warning",
        code: "missing-claim-review",
        animalId: animal.id,
        message: `${animal.commonName} has no claim-level verification review.`,
      });
    } else {
      Object.entries(claimReviews).forEach(([field, review]) => {
        if (review.status !== "verified") {
          issues.push({
            severity: "warning",
            code: `${review.status}-claim`,
            animalId: animal.id,
            message: `${animal.commonName}.${field} is ${review.status}.`,
          });
        }

        if (
          review.referenceUrls?.some(
            (referenceUrl) => !references.some((reference) => reference.url === referenceUrl),
          )
        ) {
          issues.push({
            severity: "warning",
            code: "claim-reference-not-listed",
            animalId: animal.id,
            message: `${animal.commonName}.${field} cites a reference that is not listed on the record.`,
          });
        }

        if (review.status !== "unable-to-verify") {
          review.referenceUrls?.forEach((referenceUrl) => {
            const reference = references.find((candidate) => candidate.url === referenceUrl);
            if (reference && reference.supports?.length && !reference.supports.includes(field)) {
              issues.push({
                severity: "warning",
                code: "claim-not-supported-by-reference",
                animalId: animal.id,
                message: `${animal.commonName}.${field} is not listed among the fields supported by its cited reference.`,
              });
            }
          });
        }
      });
    }

    if (animal.imageSrc && !animal.imageAttribution) {
      issues.push({
        severity: "warning",
        code: "missing-image-attribution",
        animalId: animal.id,
        message: `${animal.commonName} has an image URL without attribution metadata.`,
      });
    }

    if (animal.imageAttribution) {
      if (!animal.imageAttribution.license || !animal.imageAttribution.licenseUrl) {
        issues.push({
          severity: "warning",
          code: "unknown-image-license",
          animalId: animal.id,
          message: `${animal.commonName}'s image does not have complete licence metadata.`,
        });
      }

      if (!animal.imageAttribution.verifiedAt || !animal.imageAttribution.licenseNotes?.length) {
        issues.push({
          severity: "warning",
          code: "incomplete-image-provenance",
          animalId: animal.id,
          message: `${animal.commonName}'s image licence verification metadata is incomplete.`,
        });
      }
    }

    if (
      animal.conservationAssessment &&
      !animal.conservationAssessment.assessedAt &&
      !animal.conservationAssessment.assessedYear
    ) {
      issues.push({
        severity: "error",
        code: "missing-assessment-date",
        animalId: animal.id,
        message: `${animal.commonName} has a conservation status without an assessment date or year.`,
      });
    }

    if (
      animal.conservationAssessment &&
      animal.conservationAssessment.source.sourceType !== "conservation-assessment"
    ) {
      issues.push({
        severity: "warning",
        code: "incorrect-conservation-source-type",
        animalId: animal.id,
        message: `${animal.commonName}'s conservation source is not classified as an assessment.`,
      });
    }

    const className = animal.taxonomy?.className;
    if (className && !expectedClasses[animal.category].includes(className)) {
      issues.push({
        severity: "warning",
        code: "taxonomy-category-mismatch",
        animalId: animal.id,
        message: `${animal.commonName} is categorized as ${animal.category} but has class ${className}.`,
      });
    }
  });

  return { validStructure: true, issues };
}
