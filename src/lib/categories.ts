export type Category = {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
};

function isCategory(value: unknown): value is Category {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return (
    "id" in value &&
    typeof value.id === "string" &&
    "slug" in value &&
    typeof value.slug === "string" &&
    "nameBn" in value &&
    typeof value.nameBn === "string" &&
    "icon" in value &&
    typeof value.icon === "string"
  );
}

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(
    "https://api.api-store.workers.dev/api/bazardor/categories",
    { next: { revalidate: 3600 } },
  );

  if (!response.ok) {
    throw new Error(`Failed to load categories: ${response.status}`);
  }

  const payload: unknown = await response.json();
  if (!Array.isArray(payload) || !payload.every(isCategory)) {
    throw new Error("The categories API returned an invalid response.");
  }

  return payload;
}
