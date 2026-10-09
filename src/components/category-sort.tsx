"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function CategorySort() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") ?? "default";

  function handleSortChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "default") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <label className="flex items-center gap-2 text-xs text-[#68716b]">
      <span>সাজান</span>
      <select
        aria-label="পণ্য সাজান"
        value={sort}
        onChange={(event) => handleSortChange(event.target.value)}
        className="rounded-lg border border-[#d5ded8] bg-[#fbfdfb] px-2.5 py-1.5 text-xs text-[#26312b] outline-none focus-visible:ring-2 focus-visible:ring-[#078f4b]"
      >
        <option value="default">ডিফল্ট</option>
        <option value="price-asc">দাম: কম থেকে বেশি</option>
        <option value="price-desc">দাম: বেশি থেকে কম</option>
        <option value="change-desc">দাম বৃদ্ধি: বেশি আগে</option>
        <option value="change-asc">দাম হ্রাস: বেশি আগে</option>
      </select>
    </label>
  );
}
