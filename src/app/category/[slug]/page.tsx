import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import CategoryNavbar from "../../../components/category-navbar";
import CategorySort from "../../../components/category-sort";
import Footer from "../../../components/footer";
import Header from "../../../components/header";
import { ProductCard } from "../../../components/sections/price-change-sections";
import { getCategories } from "../../../lib/categories";
import { getProducts, type Product } from "../../../lib/products";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string | string[] }>;
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((item) => item.slug === slug);

  return {
    title: category ? `${category.nameBn} | বাজার দর` : "ক্যাটাগরি পাওয়া যায়নি | বাজার দর",
  };
}

function sortProducts(products: Product[], sort: string | string[] | undefined) {
  const sorted = [...products];

  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.today - b.today);
    case "price-desc":
      return sorted.sort((a, b) => b.today - a.today);
    case "change-desc":
      return sorted.sort((a, b) => b.change.pct - a.change.pct);
    case "change-asc":
      return sorted.sort((a, b) => a.change.pct - b.change.pct);
    default:
      return sorted;
  }
}

export default function CategoryPage(props: CategoryPageProps) {
  return (
    <Suspense fallback={<CategoryPageFallback />}>
      <CategoryPageContent {...props} />
    </Suspense>
  );
}

function CategoryPageFallback() {
  return (
    <>
      <main className="flex-1 bg-[#f0f5f1]">
        <Header />
        <div className="mx-auto max-w-7xl animate-pulse space-y-5 px-4 py-5 sm:px-6 sm:py-8">
          <div className="h-[76px] rounded-2xl border border-[#dfe7e1] bg-[#fbfdfb]" />
          <div className="h-14 rounded-2xl border border-[#dfe7e1] bg-[#fbfdfb]" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }, (_, index) => (
              <div
                key={index}
                className="h-28 rounded-2xl border border-[#dfe7e1] bg-[#fbfdfb]"
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

async function CategoryPageContent({
  params,
  searchParams,
}: CategoryPageProps) {
  const [{ slug }, query, categories, products] = await Promise.all([
    params,
    searchParams,
    getCategories(),
    getProducts(),
  ]);
  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    notFound();
  }

  const categoryProducts = sortProducts(
    products.filter((product) => product.category === category.slug),
    query.sort,
  );
  const productCount = new Intl.NumberFormat("bn-BD").format(
    categoryProducts.length,
  );

  return (
    <>
      <main className="flex-1 bg-[#f0f5f1]">
        <Header />
        <CategoryNavbar />
        <section className="px-4 py-5 sm:px-6 sm:py-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center gap-3 rounded-2xl border border-[#dfe7e1] bg-[#fbfdfb] px-4 py-3.5 sm:px-5">
              <span aria-hidden="true" className="text-3xl">
                {category.icon}
              </span>
              <div>
                <h1 className="text-xl font-bold text-[#1c2923]">
                  {category.nameBn}
                </h1>
                <p className="text-xs text-[#68716b]">
                  {productCount}টি পণ্যের আজকের দাম ও পরিবর্তন
                </p>
              </div>
            </div>

            <div className="mt-5 flex min-h-14 items-center justify-end rounded-2xl border border-[#dfe7e1] bg-[#fbfdfb] px-4 py-2 sm:px-5">
              <CategorySort />
            </div>

            <p className="my-3 text-xs text-[#68716b]">
              মোট {productCount}টি পণ্য দেখানো হচ্ছে
            </p>

            {categoryProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categoryProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <p className="rounded-2xl border border-[#dfe7e1] bg-[#fbfdfb] p-5 text-sm text-[#68716b]">
                এই ক্যাটাগরিতে এখনো কোনো পণ্যের তথ্য নেই।
              </p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
