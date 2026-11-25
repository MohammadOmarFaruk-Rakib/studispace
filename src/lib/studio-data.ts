import type { StudioRecord } from "@/lib/types";

export const STUDIO_API_URL = (
  process.env.NEXT_PUBLIC_APP_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const ONLINE_STUDIO_GALLERY = [
  "photo-1598488035139-bdbb2231ce04",
  "photo-1492684223066-81342ee5ff30",
  "photo-1513364776144-60967b0f800f",
  "photo-1497366811353-6870744d04b2",
  "photo-1497366216548-37526070297c",
  "photo-1497366412874-3415097a27e7",
  "photo-1519389950473-47ba0277781c",
  "photo-1524758631624-e2822e304c36",
  "photo-1517248135467-4c7edcad34c4",
  "photo-1505236858219-8359eb29e329",
  "photo-1517502884422-41eaead166d4",
  "photo-1497366858526-0766cadbe8fa",
].map(
  (photoId) =>
    `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=1400&q=85`,
);

function getImageIdentity(image: string): string {
  try {
    return new URL(image).pathname;
  } catch {
    return image;
  }
}

export function getStudioGalleryImages(studio: StudioRecord): string[] {
  const primaryImage = studio.image.trim();
  const images = [primaryImage, ...(studio.gallery || [])]
    .map((image) => image.trim())
    .filter(Boolean);
  const identities = new Set(images.map(getImageIdentity));
  const listingKey = `${studio._id || studio.slug}:${studio.category}`;
  const offset = Array.from(listingKey).reduce(
    (hash, character) => (hash * 31 + character.charCodeAt(0)) >>> 0,
    0,
  );

  for (let index = 0; images.length < 5 && index < ONLINE_STUDIO_GALLERY.length; index += 1) {
    const candidate =
      ONLINE_STUDIO_GALLERY[(offset + index) % ONLINE_STUDIO_GALLERY.length];
    const identity = getImageIdentity(candidate);
    if (identities.has(identity)) continue;
    images.push(candidate);
    identities.add(identity);
  }

  return images;
}

export function getStudioRecords(response: unknown): unknown[] | null {
  if (Array.isArray(response)) {
    return response;
  }

  if (typeof response !== "object" || response === null) {
    return null;
  }

  const result = response as Record<string, unknown>;
  if (Array.isArray(result.data)) {
    return result.data;
  }

  if (Array.isArray(result.studios)) {
    return result.studios;
  }

  return null;
}

export function isStudioRecord(value: unknown): value is StudioRecord {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const studio = value as Record<string, unknown>;
  const location = studio.location;

  return (
    (studio._id === undefined || typeof studio._id === "string") &&
    typeof studio.title === "string" &&
    typeof studio.slug === "string" &&
    typeof studio.description === "string" &&
    typeof studio.category === "string" &&
    (studio.categoryName === undefined ||
      typeof studio.categoryName === "string") &&
    typeof studio.image === "string" &&
    (studio.gallery === undefined ||
      (Array.isArray(studio.gallery) &&
        studio.gallery.every((image) => typeof image === "string"))) &&
    typeof studio.hourlyRate === "number" &&
    (studio.securityDeposit === undefined ||
      typeof studio.securityDeposit === "number") &&
    typeof studio.rating === "number" &&
    typeof studio.totalReviews === "number" &&
    typeof location === "object" &&
    location !== null &&
    "city" in location &&
    typeof location.city === "string" &&
    "area" in location &&
    typeof location.area === "string" &&
    "country" in location &&
    typeof location.country === "string" &&
    typeof studio.capacity === "number" &&
    typeof studio.isAvailable === "boolean" &&
    (studio.amenities === undefined ||
      (Array.isArray(studio.amenities) &&
        studio.amenities.every((amenity) => typeof amenity === "string"))) &&
    (studio.host === undefined ||
      (typeof studio.host === "object" &&
        studio.host !== null &&
        (!("name" in studio.host) ||
          typeof studio.host.name === "string") &&
        (!("email" in studio.host) ||
          typeof studio.host.email === "string" ||
          studio.host.email === null))) &&
    (studio.reviews === undefined ||
      (Array.isArray(studio.reviews) &&
        studio.reviews.every(
          (review) =>
            typeof review === "object" &&
            review !== null &&
            "name" in review &&
            typeof review.name === "string" &&
            "date" in review &&
            typeof review.date === "string" &&
            "rating" in review &&
            typeof review.rating === "number" &&
            "comment" in review &&
            typeof review.comment === "string",
        ))) &&
    (studio.isFeatured === undefined ||
      typeof studio.isFeatured === "boolean") &&
    (studio.ownerEmail === undefined ||
      typeof studio.ownerEmail === "string" ||
      studio.ownerEmail === null) &&
    (studio.ownerId === undefined || typeof studio.ownerId === "string")
  );
}

const STUDIO_CATEGORY_ALIASES: Record<string, string[]> = {
  soundstage: ["filmstage"],
  podcastroom: ["podcastlounge"],
  musicsuite: ["recordingstudio"],
  artworkshop: ["workshop", "creativeworkspace"],
};

function normalizeCategory(category: string): string {
  return category.toLowerCase().replace(/[^a-z0-9]/g, "").replace(/s$/, "");
}

export function studioMatchesCategory(
  studio: Pick<StudioRecord, "category" | "categoryName">,
  category: string,
): boolean {
  const selected = normalizeCategory(category);
  const aliases = STUDIO_CATEGORY_ALIASES[selected] ?? [];
  const studioCategories = [studio.category, studio.categoryName]
    .filter((value): value is string => typeof value === "string")
    .map(normalizeCategory);

  return studioCategories.some(
    (studioCategory) =>
      studioCategory === selected ||
      aliases.some((alias) => normalizeCategory(alias) === studioCategory),
  );
}
