import { Suspense } from "react";
import CategoryNavLink from "./category-nav-link";
import { getCategories } from "../lib/categories";

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
          <li key={category.id} className="shrink-0 whitespace-nowrap">
            <Suspense
              fallback={
                <span className="flex items-center gap-1.5 px-3 py-1.5">
                  <span aria-hidden="true">{category.icon}</span>
                  <span>{category.nameBn}</span>
                </span>
              }
            >
              <CategoryNavLink category={category} />
            </Suspense>
          </li>
        ))}
      </ul>
    </nav>
  );
}
