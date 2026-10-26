const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

function getPublicOrigin(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  const parsedUrl = new URL(value);

  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    throw new Error("NEXT_PUBLIC_SITE_URL must use http:// or https://.");
  }

  return parsedUrl.origin;
}

const publicOrigin = getPublicOrigin(configuredSiteUrl);
const siteUrl = publicOrigin ?? "http://localhost:3000";

export const siteConfig = {
  name: "Zooflix",
  title: "Zooflix — A kinder way to meet the wild",
  description:
    "A calm, accessible field guide to the animals that share our planet.",
  url: siteUrl,
  isPublicUrlConfigured: Boolean(publicOrigin),
  navigation: [
    { href: "/", label: "Home" },
    { href: "/species", label: "Explore species" },
    { href: "/categories", label: "Categories" },
    { href: "/habitats", label: "Habitats" },
  ],
} as const;
