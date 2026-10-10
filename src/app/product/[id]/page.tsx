import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import CategoryNavbar from "../../../components/category-navbar";
import Footer from "../../../components/footer";
import Header from "../../../components/header";
import ProductMarquee from "../../../components/marquee";
import { getAuth } from "../../../lib/auth";
import { getProductById } from "../../../lib/products";

export const metadata: Metadata = {
  title: "পণ্যের বিস্তারিত | বাজার দর",
};

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

const priceFormatter = new Intl.NumberFormat("bn-BD", {
  maximumFractionDigits: 2,
});

function formatPrice(price: number) {
  return `${priceFormatter.format(price)} টাকা`;
}

function getUnitLabel(unit: string) {
  switch (unit) {
    case "kg":
      return "কেজি";
    case "liter":
    case "litre":
      return "লিটার";
    case "piece":
      return "পিস";
    case "dozen":
      return "ডজন";
    default:
      return unit;
  }
}

export default function ProductPage(props: ProductPageProps) {
  return (
    <Suspense fallback={<ProductPageFallback />}>
      <ProductPageContent {...props} />
    </Suspense>
  );
}

function ProductPageFallback() {
  return (
    <>
      <Header />
      <CategoryNavbar />
      <main className="flex-1 animate-pulse space-y-5 bg-[#f0f5f1] px-4 py-8 sm:px-6">
        <div className="mx-auto h-32 max-w-7xl rounded-2xl border border-[#dfe7e1] bg-[#fbfdfb]" />
        <div className="mx-auto h-80 max-w-7xl rounded-2xl border border-[#dfe7e1] bg-[#fbfdfb]" />
      </main>
      <Footer />
    </>
  );
}

async function ProductPageContent({ params }: ProductPageProps) {
  await connection();
  const { id: rawId } = await params;
  const id = Number(rawId);

  if (!Number.isSafeInteger(id) || id < 1) {
    notFound();
  }

  const auth = await getAuth();
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect(`/signin?callbackURL=${encodeURIComponent(`/product/${id}`)}`);
  }

  const product = await getProductById(id);
  if (!product) {
    notFound();
  }

  const marketPrices = product.markets.map((market) => ({
    ...market,
    average: (market.min + market.max) / 2,
  }));
  const lowestPrice = marketPrices.reduce(
    (lowest, market) => Math.min(lowest, market.min),
    Number.POSITIVE_INFINITY,
  );
  const highestPrice = marketPrices.reduce(
    (highest, market) => Math.max(highest, market.max),
    Number.NEGATIVE_INFINITY,
  );
  const averagePrice =
    marketPrices.length > 0
      ? marketPrices.reduce((total, market) => total + market.average, 0) /
        marketPrices.length
      : product.today;
  const priceChangeColor =
    product.change.dir === "up"
      ? "text-[#dc3838]"
      : product.change.dir === "down"
        ? "text-[#078f4b]"
        : "text-[#68716b]";
  const priceChangeIcon =
    product.change.dir === "up"
      ? "▲"
      : product.change.dir === "down"
        ? "▼"
        : "—";

  return (
    <>
      <Header />
      <CategoryNavbar />
      <ProductMarquee />
      <main className="flex-1 bg-[#f0f5f1] px-4 py-5 sm:px-6 sm:py-8">
        <div className="mx-auto max-w-7xl">
          <nav
            aria-label="ব্রেডক্রাম্ব"
            className="mb-4 flex flex-wrap items-center gap-2 text-xs text-[#68716b]"
          >
            <Link href="/" className="hover:text-[#078f4b]">
              হোম
            </Link>
            <span aria-hidden="true">›</span>
            <Link
              href={`/category/${product.category}`}
              className="hover:text-[#078f4b]"
            >
              {product.categoryNameBn}
            </Link>
            <span aria-hidden="true">›</span>
            <span aria-current="page" className="text-[#26312b]">
              {product.nameBn}
            </span>
          </nav>

          <section className="flex flex-col justify-between gap-5 rounded-2xl border border-[#dfe7e1] bg-[#fbfdfb] p-4 sm:flex-row sm:items-center sm:p-6">
            <div className="flex min-w-0 items-center gap-4">
              <span
                aria-hidden="true"
                className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-[#f0f5f1] text-3xl"
              >
                {product.image}
              </span>
              <div className="min-w-0">
                <h1 className="text-xl font-bold text-[#1c2923] sm:text-2xl">
                  {product.nameBn}
                </h1>
                <p className="mt-1 text-sm text-[#68716b]">
                  প্রতি {getUnitLabel(product.unit)} · {product.categoryNameBn}
                </p>
                <p className="mt-1 text-xs text-[#68716b]">
                  গত মাসের তুলনায় আজকের দাম{" "}
                  {formatPrice(product.lastMonth)} থেকে{" "}
                  {formatPrice(product.today)}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center justify-between gap-5 rounded-xl bg-[#f0f5f1] px-4 py-3 sm:flex-col sm:items-center sm:gap-1">
              <p className="text-xs text-[#68716b]">আজকের দাম</p>
              <p className="text-2xl font-bold text-[#1c2923]">
                {priceFormatter.format(product.today)}
              </p>
              <p className="text-xs text-[#68716b]">
                টাকা / {getUnitLabel(product.unit)}
              </p>
              <p className={`text-xs font-semibold ${priceChangeColor}`}>
                {priceChangeIcon}{" "}
                {priceFormatter.format(Math.abs(product.change.pct))}%
              </p>
            </div>
          </section>

          <section
            aria-labelledby="price-summary-heading"
            className="mt-5 rounded-2xl border border-[#dfe7e1] bg-[#fbfdfb] p-4 sm:p-5"
          >
            <h2
              id="price-summary-heading"
              className="mb-4 font-bold text-[#1c2923]"
            >
              দামের সারসংক্ষেপ
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <PriceSummaryCard
                label="সর্বনিম্ন দাম"
                price={marketPrices.length ? lowestPrice : product.today}
                tone="green"
                caption="সর্বনিম্ন বাজারদর"
              />
              <PriceSummaryCard
                label="সর্বোচ্চ দাম"
                price={marketPrices.length ? highestPrice : product.today}
                tone="red"
                caption="সর্বোচ্চ বাজারদর"
              />
              <PriceSummaryCard
                label="গড় দাম"
                price={averagePrice}
                tone="green"
                caption={`প্রতি ${getUnitLabel(product.unit)}-এর গড়`}
              />
            </div>

            <h2 className="mb-3 mt-6 font-bold text-[#1c2923]">
              বাজারভিত্তিক আজকের দাম
            </h2>
            {marketPrices.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-[#dfe7e1]">
                <table className="w-full min-w-[600px] border-collapse text-left text-sm">
                  <thead className="bg-[#f7faf8] text-xs text-[#68716b]">
                    <tr>
                      <th scope="col" className="px-3 py-3 font-medium sm:px-4">
                        বাজার
                      </th>
                      <th scope="col" className="px-3 py-3 font-medium sm:px-4">
                        বিভাগ
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3 text-right font-medium sm:px-4"
                      >
                        সর্বনিম্ন
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3 text-right font-medium sm:px-4"
                      >
                        সর্বোচ্চ
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3 text-right font-medium sm:px-4"
                      >
                        গড়
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e7ede9]">
                    {marketPrices.map((market) => (
                      <tr
                        key={`${market.division}-${market.market}`}
                        className="even:bg-[#f7faf8]"
                      >
                        <th
                          scope="row"
                          className="px-3 py-3 font-medium text-[#26312b] sm:px-4"
                        >
                          {market.market}
                        </th>
                        <td className="px-3 py-3 text-[#68716b] sm:px-4">
                          {market.division}
                        </td>
                        <td className="px-3 py-3 text-right text-[#078f4b] sm:px-4">
                          {formatPrice(market.min)}
                        </td>
                        <td className="px-3 py-3 text-right text-[#dc3838] sm:px-4">
                          {formatPrice(market.max)}
                        </td>
                        <td className="px-3 py-3 text-right font-medium text-[#26312b] sm:px-4">
                          {formatPrice(market.average)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="rounded-xl border border-[#dfe7e1] bg-[#f7faf8] p-4 text-sm text-[#68716b]">
                এই পণ্যের বাজারভিত্তিক দামের তথ্য পাওয়া যায়নি।
              </p>
            )}
          </section>

          <section
            aria-label="দামের ইতিহাস"
            className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3"
          >
            <PriceHistoryCard label="গতকালের দাম" price={product.yesterday} />
            <PriceHistoryCard label="গত সপ্তাহের দাম" price={product.lastWeek} />
            <PriceHistoryCard label="গত মাসের দাম" price={product.lastMonth} />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

function PriceSummaryCard({
  label,
  price,
  tone,
  caption,
}: {
  label: string;
  price: number;
  tone: "green" | "red";
  caption: string;
}) {
  return (
    <article className="rounded-xl border border-[#e5ebe7] bg-[#fbfdfb] p-4">
      <p className="text-xs text-[#68716b]">{label}</p>
      <p
        className={`mt-1 text-lg font-bold ${
          tone === "green" ? "text-[#078f4b]" : "text-[#dc3838]"
        }`}
      >
        {formatPrice(price)}
      </p>
      <p className="mt-1 text-xs text-[#68716b]">{caption}</p>
    </article>
  );
}

function PriceHistoryCard({ label, price }: { label: string; price: number }) {
  return (
    <article className="rounded-xl border border-[#dfe7e1] bg-[#fbfdfb] p-4">
      <p className="text-xs text-[#68716b]">{label}</p>
      <p className="mt-1 font-bold text-[#1c2923]">{formatPrice(price)}</p>
    </article>
  );
}
