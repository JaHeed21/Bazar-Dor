export type Product = {
  id: number;
  nameBn: string;
  categoryIcon: string;
  image: string;
  unit: string;
  today: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
};

function isProduct(value: unknown): value is Product {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  if (
    !("id" in value) ||
    typeof value.id !== "number" ||
    !("nameBn" in value) ||
    typeof value.nameBn !== "string" ||
    !("categoryIcon" in value) ||
    typeof value.categoryIcon !== "string" ||
    !("unit" in value) ||
    typeof value.unit !== "string" ||
    !("today" in value) ||
    typeof value.today !== "number" ||
    !("change" in value) ||
    typeof value.change !== "object" ||
    value.change === null
  ) {
    return false;
  }

  return (
    "dir" in value.change &&
    (value.change.dir === "up" ||
      value.change.dir === "down" ||
      value.change.dir === "flat") &&
    "pct" in value.change &&
    typeof value.change.pct === "number"
  );
}

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(
    "https://api.api-store.workers.dev/api/bazardor/products",
    { next: { revalidate: 3600 } },
  );

  if (!response.ok) {
    throw new Error(`Failed to load products: ${response.status}`);
  }

  const payload: unknown = await response.json();
  if (!Array.isArray(payload) || !payload.every(isProduct)) {
    throw new Error("The products API returned an invalid response.");
  }

  return payload;
}
