export const DEFAULT_GALLERY_CATEGORIES = [
  {
    id: "blonding",
    label: "Blonding",
    summary: "Soft blondes, dimensional highlights, creamy ribbons, and bright lived-in finishes.",
    imageIds: [4, 5, 7, 8, 9, 21, 28, 29, 34, 40, 48, 49, 50, 51, 54, 56, 58, 59, 62, 64, 73, 74, 75],
  },
  {
    id: "brunette",
    label: "Brunette Dimension",
    summary: "Warm brunette movement, caramel pieces, soft curls, and dimensional finish work.",
    imageIds: [15, 31, 32, 33, 39, 52, 57, 65],
  },
  {
    id: "short",
    label: "Short Cuts",
    summary: "Pixies, bobs, textured crops, and shorter shapes with polished detail.",
    imageIds: [6, 10, 11, 43, 46, 47, 60, 61, 66, 67, 72],
  },
  {
    id: "event",
    label: "Event Styling",
    summary: "Formal curls, half-up styles, soft pinned shapes, and special-occasion finishes.",
    imageIds: [13, 14, 17, 30, 41, 42],
  },
  {
    id: "color",
    label: "Colour Accents",
    summary: "Rose, copper, violet, and soft fashion-colour accents with salon-friendly placement.",
    imageIds: [16, 38, 53, 63, 70, 71],
  },
];

const styleImage = (id, category, index) => ({
  id: `static-${String(id).padStart(3, "0")}`,
  src: `/images/style-gallery/style-${String(id).padStart(3, "0")}.jpg`,
  alt: `${category} hairstyle example ${index + 1}`,
  source: "static",
});

export const defaultGallery = DEFAULT_GALLERY_CATEGORIES.map((category) => ({
  ...category,
  items: category.imageIds.map((id, index) => styleImage(id, category.label, index)),
}));

export function slugifyCategory(value) {
  const slug = String(value || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || `category-${Date.now()}`;
}

export function normalizeGallery(input) {
  const source = Array.isArray(input) ? input : defaultGallery;

  return source
    .map((category) => {
      const id = slugifyCategory(category.id || category.label);
      const label = String(category.label || id).trim() || id;
      const summary = String(category.summary || "").trim();
      const items = Array.isArray(category.items) ? category.items : [];

      return {
        id,
        label,
        summary,
        items: items
          .filter((item) => item && item.src)
          .map((item, index) => ({
            id: String(item.id || `${id}-${index + 1}`),
            src: String(item.src),
            alt: String(item.alt || `${label} hairstyle example ${index + 1}`),
            source: item.source === "blob" ? "blob" : "static",
          })),
      };
    })
    .filter((category) => category.label);
}

export function normalizeServices(input) {
  const source = Array.isArray(input) ? input : [];

  return source
    .map((service, index) => ({
      id: String(service?.id || `service-${Date.now()}-${index}`),
      name: String(service?.name || "").trim(),
      description: String(service?.description || "").trim(),
      price: String(service?.price || "").trim(),
    }))
    .filter((service) => service.name || service.description || service.price);
}
