"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Category } from "../lib/categories";

export default function CategoryNavLink({ category }: { category: Category }) {
  const pathname = usePathname();
  const href = `/category/${category.slug}`;
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#078f4b] ${
        isActive
          ? "border-[#c6e8d2] bg-[#69e79e] font-semibold text-[#222423]"
          : "border-transparent text-[#26312b] hover:bg-[#f0f5f1] hover:text-[#078f4b]"
      }`}
    >
      <span aria-hidden="true">{category.icon}</span>
      <span>{category.nameBn}</span>
    </Link>
  );
}
