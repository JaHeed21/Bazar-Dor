type Category = {
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

async function getCategories(): Promise<Category[]> {
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

export default async function CategoryNavbar() {
  const categories = await getCategories();

  return (
    <nav
      id="categories"
      aria-label="পণ্যের ক্যাটাগরি"
      className="w-full overflow-x-auto border-b border-[#edf0ee] bg-[#fafcfb]"
    >
      <ul className="mx-auto flex w-full max-w-7xl items-center justify-start gap-7 px-4 py-3 text-sm text-[#26312b] sm:gap-8">
        {categories.map((category) => (
          <li
            key={category.id}
            className="flex shrink-0 items-center gap-1.5 whitespace-nowrap"
          >
            <span aria-hidden="true">{category.icon}</span>
            <span>{category.nameBn}</span>
          </li>
        ))}
      </ul>
    </nav>
  );
}
