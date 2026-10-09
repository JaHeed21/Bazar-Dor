import Link from "next/link";
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
            <Link
              href={`/category/${category.slug}`}
              className="flex items-center gap-1.5 transition-colors hover:text-[#078f4b] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#078f4b]"
            >
              <span aria-hidden="true">{category.icon}</span>
              <span>{category.nameBn}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
