export type Product = {
  id: number;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  image: string;
  unit: string;
  today: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
};

export type ProductMarket = {
  market: string;
  division: string;
  min: number;
  max: number;
};

export type ProductDetails = Product & {
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  markets: ProductMarket[];
};

function isProductMarket(value: unknown): value is ProductMarket {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return (
    "market" in value &&
    typeof value.market === "string" &&
    "division" in value &&
    typeof value.division === "string" &&
    "min" in value &&
    typeof value.min === "number" &&
    "max" in value &&
    typeof value.max === "number"
  );
}

function isProduct(value: unknown): value is Product {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  if (
    !("id" in value) ||
    typeof value.id !== "number" ||
    !("nameBn" in value) ||
    typeof value.nameBn !== "string" ||
    !("category" in value) ||
    typeof value.category !== "string" ||
    !("categoryNameBn" in value) ||
    typeof value.categoryNameBn !== "string" ||
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

function isProductDetails(value: unknown): value is ProductDetails {
  return (
    isProduct(value) &&
    "yesterday" in value &&
    typeof value.yesterday === "number" &&
    "lastWeek" in value &&
    typeof value.lastWeek === "number" &&
    "lastMonth" in value &&
    typeof value.lastMonth === "number" &&
    "markets" in value &&
    Array.isArray(value.markets) &&
    value.markets.every(isProductMarket)
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

export async function getProductById(id: number): Promise<ProductDetails | null> {
  const response = await fetch(
    `https://api.api-store.workers.dev/api/bazardor/products/${id}`,
    { next: { revalidate: 3600 } },
  );

  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Failed to load product ${id}: ${response.status}`);
  }

  const payload: unknown = await response.json();
  if (!isProductDetails(payload) || payload.id !== id) {
    throw new Error("The product details API returned an invalid response.");
  }

  return payload;
}
