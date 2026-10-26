import { z } from "zod";

import type { Animal, AnimalClaimReview, AnimalProvenance, AnimalReference } from "./types";

const animalCategorySchema = z.enum([
  "Mammal",
  "Bird",
  "Reptile",
  "Amphibian",
  "Fish",
  "Invertebrate",
]);
const conservationStatusSchema = z.enum([
  "Least concern",
  "Near threatened",
  "Vulnerable",
  "Endangered",
  "Critically endangered",
  "Data deficient",
]);

export const referenceSchema = z.object({
  title: z.string().trim().min(1),
  url: z.string().url(),
  author: z.string().trim().min(1).optional(),
  publisher: z.string().trim().min(1).optional(),
  publishedAt: z.string().date().optional(),
  publishedYear: z.number().int().min(1900).max(2100).optional(),
  accessedAt: z.string().date().optional(),
  sourceType: z.enum([
    "species-account",
    "conservation-assessment",
    "image-page",
    "government",
    "other",
  ]).optional(),
  supports: z.array(z.string().trim().min(1)).readonly().optional(),
}) satisfies z.ZodType<AnimalReference>;

export const conservationAssessmentSchema = z.object({
  status: conservationStatusSchema,
  assessedAt: z.string().date().optional(),
  assessedYear: z.number().int().min(1900).max(2100).optional(),
  assessmentId: z.string().trim().min(1).optional(),
  source: referenceSchema,
  scope: z.string().trim().min(1).optional(),
}).refine((assessment) => assessment.assessedAt || assessment.assessedYear, {
  message: "A conservation assessment requires a date or year",
  path: ["assessedAt"],
});

export const imageAttributionSchema = z.object({
  creator: z.string().trim().min(1),
  sourceUrl: z.string().url(),
  license: z.string().trim().min(1).optional(),
  licenseUrl: z.string().url().optional(),
  attributionText: z.string().trim().min(1).optional(),
  verifiedAt: z.string().date().optional(),
  licenseNotes: z.array(z.string().trim().min(1)).readonly().optional(),
});

const taxonomySchema = z.object({
  kingdom: z.string().trim().min(1).optional(),
  phylum: z.string().trim().min(1).optional(),
  className: z.string().trim().min(1).optional(),
  order: z.string().trim().min(1).optional(),
  family: z.string().trim().min(1).optional(),
  genus: z.string().trim().min(1).optional(),
});

const claimReviewSchema = z.object({
  status: z.enum(["verified", "partially-supported", "unsupported", "unable-to-verify"]),
  referenceUrls: z.array(z.string().url()).readonly().optional(),
  reviewedAt: z.string().date(),
  note: z.string().trim().min(1).optional(),
}) satisfies z.ZodType<AnimalClaimReview>;

const provenanceSchema = z.object({
  primarySource: referenceSchema,
  verifiedAt: z.string().date(),
  claimReviews: z.record(z.string().min(1), claimReviewSchema).optional(),
  uncertainFields: z.array(z.string().trim().min(1)).readonly().optional(),
}) satisfies z.ZodType<AnimalProvenance>;

export const animalSchema = z.object({
  id: z.string().trim().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  commonName: z.string().trim().min(1),
  scientificName: z.string().trim().min(1).optional(),
  category: animalCategorySchema,
  taxonomy: taxonomySchema.optional(),
  habitat: z.string().trim().min(1),
  diet: z.string().trim().min(1),
  region: z.string().trim().min(1).optional(),
  conservationAssessment: conservationAssessmentSchema.optional(),
  physicalCharacteristics: z.array(z.string().trim().min(1)).readonly().optional(),
  behavior: z.array(z.string().trim().min(1)).readonly().optional(),
  distribution: z.string().trim().min(1).optional(),
  lifespan: z.string().trim().min(1).optional(),
  reproduction: z.string().trim().min(1).optional(),
  ecologicalRole: z.string().trim().min(1).optional(),
  threats: z.array(z.string().trim().min(1)).readonly().optional(),
  shortDescription: z.string().trim().min(1),
  description: z.string().trim().min(1),
  facts: z.array(z.string().trim().min(1)).min(1).readonly(),
  imageSrc: z.union([z.string().startsWith("/"), z.string().url()]).optional(),
  imageAlt: z.string().trim().min(1),
  imageAttribution: imageAttributionSchema.optional(),
  references: z.array(referenceSchema).readonly().optional(),
  provenance: provenanceSchema.optional(),
  featured: z.boolean().optional(),
}) satisfies z.ZodType<Animal>;

export const animalsSchema = z.array(animalSchema).superRefine((records, context) => {
  const ids = new Set<string>();
  const slugs = new Set<string>();

  records.forEach((record, index) => {
    if (ids.has(record.id)) {
      context.addIssue({
        code: "custom",
        path: [index, "id"],
        message: `Duplicate animal id: ${record.id}`,
      });
    }

    if (slugs.has(record.slug)) {
      context.addIssue({
        code: "custom",
        path: [index, "slug"],
        message: `Duplicate animal slug: ${record.slug}`,
      });
    }

    ids.add(record.id);
    slugs.add(record.slug);
  });
});

export function parseAnimals(input: unknown): readonly Animal[] {
  return animalsSchema.parse(input);
}
