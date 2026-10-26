export type AnimalCategory =
  | "Mammal"
  | "Bird"
  | "Reptile"
  | "Amphibian"
  | "Fish"
  | "Invertebrate";

export type ConservationStatus =
  | "Least concern"
  | "Near threatened"
  | "Vulnerable"
  | "Endangered"
  | "Critically endangered"
  | "Data deficient";

export type AnimalSourceType =
  | "species-account"
  | "conservation-assessment"
  | "image-page"
  | "government"
  | "other";

export type ClaimVerificationStatus =
  | "verified"
  | "partially-supported"
  | "unsupported"
  | "unable-to-verify";

export type AnimalClaimReview = Readonly<{
  status: ClaimVerificationStatus;
  referenceUrls?: readonly string[];
  reviewedAt: string;
  note?: string;
}>;

export type AnimalTaxonomy = Readonly<{
  kingdom?: string;
  phylum?: string;
  className?: string;
  order?: string;
  family?: string;
  genus?: string;
}>;

export type AnimalReference = Readonly<{
  title: string;
  url: string;
  author?: string;
  publisher?: string;
  publishedAt?: string;
  publishedYear?: number;
  accessedAt?: string;
  sourceType?: AnimalSourceType;
  supports?: readonly string[];
}>;

export type ImageAttribution = Readonly<{
  creator: string;
  sourceUrl: string;
  license?: string;
  licenseUrl?: string;
  attributionText?: string;
  verifiedAt?: string;
  licenseNotes?: readonly string[];
}>;

export type AnimalProvenance = Readonly<{
  primarySource: AnimalReference;
  verifiedAt: string;
  claimReviews?: Readonly<Record<string, AnimalClaimReview>>;
  uncertainFields?: readonly string[];
}>;

export type ConservationAssessment = Readonly<{
  status: ConservationStatus;
  assessedAt?: string;
  assessedYear?: number;
  assessmentId?: string;
  source: AnimalReference;
  scope?: string;
}>;

export type Animal = Readonly<{
  id: string;
  slug: string;
  commonName: string;
  scientificName?: string;
  category: AnimalCategory;
  taxonomy?: AnimalTaxonomy;
  habitat: string;
  diet: string;
  region?: string;
  conservationAssessment?: ConservationAssessment;
  physicalCharacteristics?: readonly string[];
  behavior?: readonly string[];
  distribution?: string;
  lifespan?: string;
  reproduction?: string;
  ecologicalRole?: string;
  threats?: readonly string[];
  shortDescription: string;
  description: string;
  facts: readonly string[];
  imageSrc?: string;
  imageAlt: string;
  imageAttribution?: ImageAttribution;
  references?: readonly AnimalReference[];
  provenance?: AnimalProvenance;
  featured?: boolean;
}>;
